import type { CollectionEntry } from 'astro:content';
import { isDemoEntry } from './demo-filter';
import {
  EDITORIAL_ADJUSTMENT_MAX,
  EDITORIAL_ADJUSTMENT_MIN,
  MIN_STABILITY_SPAN_DAYS,
  MIN_STABILITY_TEST_RECORDS,
} from './ranking-constants';

type ProviderEntry = CollectionEntry<'providers'>;
type TestRecordEntry = CollectionEntry<'tests'>;

// ---------------------------------------------------------------------------
// Evidence → Metric → Base Score
//
// 每个榜单的 Base Score 计算函数只使用当前 Schema 中真实存在的字段，
// 不虚构、不猜测、不解析自由文本。证据不足时返回 null，表示该 Provider
// 当前没有 Base Score（是否仍能以"编辑指定排名"模式出现，由调用方
// ranking-entries.ts 决定，本文件不处理 rankOverride/editorialAdjustment）。
// 这是 v1.0 计算方法，公式本身待人工审核，见 Ranking Methodology Design
// Audit v1.0。
// ---------------------------------------------------------------------------

export interface BaseScoreResult {
  baseScore: number;
  metricSummary: string;
  evidenceCount: number;
}

export type BaseScoreCalculator = (provider: ProviderEntry, tests: TestRecordEntry[]) => BaseScoreResult | null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * 稳定性榜 Base Score。
 * Evidence：TestRecord.results.packetLossPercent（原始测试观测值） /
 * stabilityScore（已加工指标，其计算方法当前未在 Schema 中定义）。
 * Metric：至少 MIN_STABILITY_TEST_RECORDS 条、时间跨度 ≥ MIN_STABILITY_SPAN_DAYS
 * 天的测试记录的平均值。
 * 优先使用 packetLossPercent——语义明确、无需额外定义，是真正的原始测试数据；
 * 只有完全没有 packetLossPercent 时才退回使用 stabilityScore，且必须在展示
 * 文案中明确标注它是"已加工指标"，不能宣称是原始测试数据。
 */
export function computeStabilityBaseScore(provider: ProviderEntry, tests: TestRecordEntry[]): BaseScoreResult | null {
  const relevantTests = tests.filter(
    (test) =>
      !isDemoEntry(test.id) &&
      test.data.providerId.id === provider.id &&
      (test.data.results?.stabilityScore !== undefined || test.data.results?.packetLossPercent !== undefined),
  );

  if (relevantTests.length < MIN_STABILITY_TEST_RECORDS) return null;

  const dates = relevantTests.map((test) => new Date(test.data.date).getTime()).sort((a, b) => a - b);
  const spanDays = (dates[dates.length - 1]! - dates[0]!) / (1000 * 60 * 60 * 24);
  if (spanDays < MIN_STABILITY_SPAN_DAYS) return null;

  const withPacketLoss = relevantTests.filter((test) => test.data.results?.packetLossPercent !== undefined);
  if (withPacketLoss.length > 0) {
    const avgLoss = average(withPacketLoss.map((test) => test.data.results!.packetLossPercent!));
    return {
      baseScore: clamp(100 - avgLoss, 0, 100),
      metricSummary: `基于 ${withPacketLoss.length} 次测试的平均丢包率（${avgLoss.toFixed(1)}%，原始测试观测值）换算`,
      evidenceCount: withPacketLoss.length,
    };
  }

  const withStabilityScore = relevantTests.filter((test) => test.data.results?.stabilityScore !== undefined);
  const avg = average(withStabilityScore.map((test) => test.data.results!.stabilityScore!));
  return {
    baseScore: clamp(avg, 0, 100),
    metricSummary: `基于 ${withStabilityScore.length} 次测试的平均稳定性评分（stabilityScore 为已加工指标，非原始测试观测值，其计算方法当前未在数据结构中定义）`,
    evidenceCount: withStabilityScore.length,
  };
}

/**
 * 性价比榜 Base Score。
 * Evidence：vendor.pricing[].price / vendor.traffic 目前均为自由文本字符串，
 * 无法可靠解析为可比较数值；vendor.devices 是数值但只代表资源数量，不代表
 * "性价比"这一成本/资源比值。
 * 结论：在 Schema 提供结构化数值字段（如 priceValue/trafficGB）之前，
 * 本函数恒返回 null——不用现有字段编造性价比得分，也不用正则/猜测解析
 * 自由文本。
 */
export function computeBestValueBaseScore(): BaseScoreResult | null {
  return null;
}

/**
 * 综合推荐榜 Base Score。
 * "综合推荐"本质上是站长/编辑基于官方信息、测试数据（如果有）、编辑观点、
 * 用户适用场景等多个维度做出的整体人工判断，不是某一个可以量化计算的
 * 单一指标，因此不存在对应的 Evidence/Metric，恒定返回 null——该榜单的
 * 排名完全依赖 rankOverride（人工排名指定），不会用这个函数编造分数。
 */
export function computeOverallBaseScore(): BaseScoreResult | null {
  return null;
}

/**
 * 新手榜 Base Score。
 * Evidence：vendor.clientSupport、vendor.support 是否存在（结构化数组字段）。
 * Metric：这是"官方公开信息覆盖率"，衡量的是信息是否公开可得，
 * 不是"新手体验评分""配置难度评分"或"客服质量评分"——这三者当前
 * Schema 都没有对应字段，不能混淆。
 */
export function computeBeginnerBaseScore(provider: ProviderEntry): BaseScoreResult | null {
  const signals: string[] = [];
  if (provider.data.vendor.clientSupport && provider.data.vendor.clientSupport.length > 0) {
    signals.push('客户端支持信息');
  }
  if (provider.data.vendor.support && provider.data.vendor.support.length > 0) {
    signals.push('支持渠道信息');
  }

  if (signals.length === 0) return null;

  const totalPossibleSignals = 2;
  return {
    baseScore: (signals.length / totalPossibleSignals) * 100,
    metricSummary: `基于官方公开的${signals.join('、')}覆盖率，不代表实际使用体验`,
    evidenceCount: signals.length,
  };
}

// ---------------------------------------------------------------------------
// Base Score → Editorial Adjustment → Final Score → Calculated Rank
//                                    → Rank Override → Final Rank
// ---------------------------------------------------------------------------

// calculated：没有人工加减分、没有人工排名干预。
// editorial-adjusted：有人工加减分，但最终排名仍由计算结果（Final Score）产生。
// editorial-override：存在 Rank Override，人工直接指定最终排名
//   （即使同时存在 editorialAdjustment，也归为这一类，页面会把两者都展示出来）。
export type RankingMode = 'calculated' | 'editorial-adjusted' | 'editorial-override';

export interface RankingComputationInput {
  providerId: string;
  providerName: string;
  providerSlug: string;
  // null 表示当前没有足够 Evidence 计算 Base Score。这类条目只有在
  // 编辑显式指定了 rankOverride（且 editorialAdjustment 必须为 0）时
  // 才允许出现，由 ranking-entries.ts 负责这条业务规则的校验。
  baseScore: number | null;
  metricSummary: string | null;
  evidenceCount: number;
  editorialAdjustment: number;
  editorialAdjustmentReason?: string;
  rankOverride?: number;
  rankOverrideReason?: string;
  reason: string;
  // Provider 数据里的 createdAt（本站开始收录该服务商的日期），用于页面
  // 展示"本站已跟踪 X 天"，不是"该服务商已稳定运营 X 天"——两者含义不同，
  // 不能混淆表述。
  trackedSince: string;
}

export interface RankingComputation extends RankingComputationInput {
  // baseScore 为 null 时 finalScore 恒为 null——不能因为有 rankOverride
  // 就伪造出一个数字。
  finalScore: number | null;
  // 只有真正参与了"按 Final Score 排序"的条目才有 calculatedRank；
  // 纯 editorial-override（无 Base Score）条目没有参与排序，calculatedRank 为 null。
  calculatedRank: number | null;
  finalRank: number;
  rankingMode: RankingMode;
}

export function computeFinalScore(baseScore: number, editorialAdjustment: number): number {
  return clamp(baseScore + editorialAdjustment, 0, 100);
}

/**
 * 把一批已经算好 Base Score（可能为 null）的条目，转换成含
 * calculatedRank / finalRank / rankingMode 的最终列表。
 *
 * 规则：
 * - Base Score 非 null 的条目才参与"按 Final Score 降序"的自然排序，
 *   得到 calculatedRank（并列按 Provider 名称排序，保证构建结果稳定）。
 * - Base Score 为 null 的条目必须已经带有 rankOverride（上游
 *   ranking-entries.ts 保证），否则这里视为数据完整性问题直接报错。
 * - rankOverride 直接指定 finalRank；没有 rankOverride 的条目按
 *   calculatedRank 顺序依次填入剩余名次。
 * - rankOverride 冲突、越界、或作用在"既无 Base Score 也无 Override"
 *   的条目上，一律 [ranking-integrity] 前缀报错中断构建，不做静默处理。
 */
export function computeFinalRanking(inputs: RankingComputationInput[], rankingSlug: string): RankingComputation[] {
  const withFinalScore = inputs.map((input) => ({
    ...input,
    finalScore: input.baseScore === null ? null : computeFinalScore(input.baseScore, input.editorialAdjustment),
  }));

  const scored = withFinalScore.filter(
    (entry): entry is (typeof withFinalScore)[number] & { finalScore: number } => entry.finalScore !== null,
  );
  const unscored = withFinalScore.filter((entry) => entry.finalScore === null);

  for (const entry of unscored) {
    if (entry.rankOverride === undefined) {
      throw new Error(
        `[ranking-integrity] Ranking "${rankingSlug}" 中 Provider "${entry.providerId}" 既没有 Base Score ` +
          `也没有 Rank Override，不应进入排名计算（这是上游过滤逻辑的 bug）。`,
      );
    }
  }

  const byScore = [...scored].sort(
    (a, b) => b.finalScore - a.finalScore || a.providerName.localeCompare(b.providerName),
  );
  const scoredWithRank = byScore.map((entry, index) => ({ ...entry, calculatedRank: index + 1 as number | null }));
  const unscoredWithRank = unscored.map((entry) => ({ ...entry, calculatedRank: null as number | null }));

  const allEntries = [...scoredWithRank, ...unscoredWithRank];
  const total = allEntries.length;

  const overrideMap = new Map<number, (typeof allEntries)[number]>();
  for (const entry of allEntries) {
    if (entry.rankOverride === undefined) continue;
    if (entry.rankOverride < 1 || entry.rankOverride > total) {
      throw new Error(
        `[ranking-integrity] Ranking "${rankingSlug}" 中 rankOverride (${entry.rankOverride}) 超出有效范围 ` +
          `1-${total}（Provider "${entry.providerId}"）。`,
      );
    }
    if (overrideMap.has(entry.rankOverride)) {
      const existing = overrideMap.get(entry.rankOverride)!;
      throw new Error(
        `[ranking-integrity] Ranking "${rankingSlug}" 中 rankOverride ${entry.rankOverride} 被 Provider ` +
          `"${existing.providerId}" 与 "${entry.providerId}" 同时占用，请检查 rankings.json。`,
      );
    }
    overrideMap.set(entry.rankOverride, entry);
  }

  const naturalFill = scoredWithRank.filter((entry) => entry.rankOverride === undefined);

  const result: RankingComputation[] = [];
  let naturalIndex = 0;
  for (let position = 1; position <= total; position += 1) {
    const overridden = overrideMap.get(position);
    if (overridden) {
      result.push({ ...overridden, finalRank: position, rankingMode: 'editorial-override' });
    } else {
      const entry = naturalFill[naturalIndex]!;
      naturalIndex += 1;
      const rankingMode: RankingMode = entry.editorialAdjustment !== 0 ? 'editorial-adjusted' : 'calculated';
      result.push({ ...entry, finalRank: position, rankingMode });
    }
  }

  return result.sort((a, b) => a.finalRank - b.finalRank);
}

export { EDITORIAL_ADJUSTMENT_MIN, EDITORIAL_ADJUSTMENT_MAX };
