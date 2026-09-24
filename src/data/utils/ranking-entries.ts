import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { isDemoEntry } from './demo-filter';
import { getPublishableProviders } from './provider-publish-gate';
import {
  computeBeginnerBaseScore,
  computeBestValueBaseScore,
  computeFinalRanking,
  computeOverallBaseScore,
  computeStabilityBaseScore,
  type BaseScoreCalculator,
  type RankingComputation,
  type RankingComputationInput,
} from './ranking-scoring';

export interface RankingPageData {
  ranking: CollectionEntry<'rankings'> | undefined;
  entries: RankingComputation[];
}

// 每个榜单 slug 对应唯一的 Base Score 计算方法，不允许混用。
const BASE_SCORE_CALCULATORS: Record<string, BaseScoreCalculator> = {
  'best-value': computeBestValueBaseScore,
  'most-stable': computeStabilityBaseScore,
  'for-beginners': computeBeginnerBaseScore,
  overall: computeOverallBaseScore,
};

// 供三个子榜单页面共用：按 slug 查找真实（非 demo）Ranking 记录，
// 对每个引用的 Provider 先过 Publish Gate，再计算 Base Score，最后套用
// Editorial Adjustment / Rank Override 得出 Final Score 与 Final Rank。
export async function getRankingPageData(slug: string): Promise<RankingPageData> {
  const [rankings, publishableProviders, tests] = await Promise.all([
    getCollection('rankings', ({ id }) => !isDemoEntry(id)),
    getPublishableProviders(),
    getCollection('tests', ({ id }) => !isDemoEntry(id)),
  ]);

  const ranking = rankings.find((entry) => entry.data.slug === slug);
  if (!ranking) {
    return { ranking: undefined, entries: [] };
  }

  const calculator = BASE_SCORE_CALCULATORS[slug];
  if (!calculator) {
    throw new Error(`[ranking-entries] 未知的榜单 slug "${slug}"，没有对应的 Base Score 计算方法。`);
  }

  const inputs: RankingComputationInput[] = ranking.data.entries
    .map((entry): RankingComputationInput | null => {
      const provider = publishableProviders.find((p) => p.id === entry.providerId.id);
      if (!provider) return null; // 未通过 Provider Publish Gate

      const metric = calculator(provider, tests);
      const editorialAdjustment = entry.editorialAdjustment ?? 0;

      if (!metric) {
        // 没有 Base Score。只有编辑显式指定了 rankOverride，才允许该条目
        // 以 "editorial-override" 模式出现——且此时绝不允许再叠加
        // editorialAdjustment，因为那等于让 Editorial Adjustment 在没有
        // Base Score 的情况下凭空制造出一个分数。
        if (entry.rankOverride === undefined) {
          return null; // Minimum Evidence 未满足，且没有编辑指定排名，不参与本榜单
        }
        if (editorialAdjustment !== 0) {
          throw new Error(
            `[ranking-integrity] Ranking "${slug}" 中 Provider "${provider.id}" 没有 Base Score，` +
              `不能同时设置非零 editorialAdjustment——Editorial Adjustment 不能在没有 Base Score 的情况下制造评分。`,
          );
        }
        return {
          providerId: provider.id,
          providerName: provider.data.name,
          providerSlug: provider.data.slug,
          baseScore: null,
          metricSummary: null,
          evidenceCount: 0,
          editorialAdjustment: 0,
          editorialAdjustmentReason: entry.editorialAdjustmentReason,
          rankOverride: entry.rankOverride,
          rankOverrideReason: entry.rankOverrideReason,
          reason: entry.reason,
          trackedSince: provider.data.createdAt.toISOString(),
        };
      }

      return {
        providerId: provider.id,
        providerName: provider.data.name,
        providerSlug: provider.data.slug,
        baseScore: metric.baseScore,
        metricSummary: metric.metricSummary,
        evidenceCount: metric.evidenceCount,
        editorialAdjustment,
        editorialAdjustmentReason: entry.editorialAdjustmentReason,
        rankOverride: entry.rankOverride,
        rankOverrideReason: entry.rankOverrideReason,
        reason: entry.reason,
        trackedSince: provider.data.createdAt.toISOString(),
      };
    })
    .filter((input): input is RankingComputationInput => input !== null);

  const entries = computeFinalRanking(inputs, slug);

  return { ranking, entries };
}
