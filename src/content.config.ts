import { defineCollection, reference, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { withProviderRefCheck, withUniqueProviderPerEntry } from './data/utils/with-provider-ref-check.js';
import { EDITORIAL_ADJUSTMENT_MAX, EDITORIAL_ADJUSTMENT_MIN } from './data/utils/ranking-constants.js';

// ---------------------------------------------------------------------------
// 共享子 Schema
// ---------------------------------------------------------------------------

// 见 Content & Data Architecture v1.0 第 5 节：来源必须分组标注，
// 不允许把厂商信息 / 本站测试 / 第三方资料 / 编辑观点混成一个事实。
const sourceMetaSchema = z.object({
  type: z.enum(['vendor', 'in-house', 'third-party', 'editorial']),
  sourceUrl: z.url().optional(),
  retrievedAt: z.coerce.date(),
  publishedAt: z.coerce.date().optional(),
  verifiedAt: z.coerce.date().optional(),
  claim: z.string(),
  evidence: z.string().optional(),
});

const pricingPlanSchema = z.object({
  name: z.string(),
  price: z.string(),
  billingCycle: z.string().optional(),
  trafficQuota: z.string().optional(),
});

const thirdPartyNoteSchema = z.object({
  source: z.string(),
  sourceUrl: z.url().optional(),
  claim: z.string(),
  date: z.coerce.date(),
});

// ---------------------------------------------------------------------------
// providers（Data Collection）
// ---------------------------------------------------------------------------

const providerSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  aliases: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'discontinued', 'watch']),
  vendor: z.object({
    officialWebsite: z.url(),
    description: z.string(),
    pricing: z.array(pricingPlanSchema).optional(),
    traffic: z.string().optional(),
    devices: z.number().optional(),
    protocols: z.array(z.string()).optional(),
    routes: z.array(z.string()).optional(),
    regions: z.array(z.string()).optional(),
    clientSupport: z.array(z.string()).optional(),
    support: z.array(z.string()).optional(),
    source: sourceMetaSchema,
  }),
  thirdPartyNotes: z.array(thirdPartyNoteSchema).optional(),
  editorial: z.object({
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    suitableFor: z.array(z.string()),
    notSuitableFor: z.array(z.string()),
    summary: z.string(),
    source: sourceMetaSchema,
  }),
  lastVerified: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

const providers = defineCollection({
  loader: file('src/data/providers/providers.json'),
  schema: providerSchema,
});

// ---------------------------------------------------------------------------
// tests（Data Collection，TestRecord，独立于 Provider，通过 providerId 关联）
// ---------------------------------------------------------------------------

const testEnvironmentSchema = z.object({
  location: z.string(),
  network: z.string(),
  client: z.string(),
  protocol: z.string(),
});

const streamingResultSchema = z.object({
  platform: z.string(),
  unlocked: z.boolean(),
  notes: z.string().optional(),
});

const aiServiceResultSchema = z.object({
  service: z.string(),
  accessible: z.boolean(),
  notes: z.string().optional(),
});

const testRecordSchema = z.object({
  id: z.string(),
  providerId: reference('providers'),
  date: z.coerce.date(),
  methodology: z.string(),
  environment: testEnvironmentSchema,
  // results 全部 optional：不强制每次测试覆盖所有指标，不得为凑 Schema 造假数据。
  results: z
    .object({
      downloadMbps: z.number().optional(),
      uploadMbps: z.number().optional(),
      latencyMs: z.number().optional(),
      packetLossPercent: z.number().optional(),
      stabilityScore: z.number().optional(),
      streaming: z.array(streamingResultSchema).optional(),
      aiServicesAccess: z.array(aiServiceResultSchema).optional(),
    })
    .optional(),
  tester: z.string().optional(),
  notes: z.string().optional(),
});

const tests = defineCollection({
  loader: withProviderRefCheck(file('src/data/tests/tests.json'), (data) => [data.providerId]),
  schema: testRecordSchema,
});

// ---------------------------------------------------------------------------
// rankings（Data + Content：结构化排名 + 独立方法论文字）
// ---------------------------------------------------------------------------

const rankingCriterionSchema = z.object({
  key: z.string(),
  label: z.string(),
  weight: z.number(),
  description: z.string(),
});

// Ranking Entry 的最终数据模型（见 Ranking Scoring & Editorial Control v1.1）：
// score / rank 不再作为人工直接填写的最终事实来源。
// Base Score 由 Evidence/Metric 计算得出（见 ranking-scoring.ts），
// 这里只保存"编辑对计算结果的调整"与"编辑对最终排名的强制指定"，
// 且两者都必须附带可读的理由，不能是不说明原因的静默调整。
const rankingEntrySchema = z
  .object({
    providerId: reference('providers'),
    reason: z.string(),
    editorialAdjustment: z.number().min(EDITORIAL_ADJUSTMENT_MIN).max(EDITORIAL_ADJUSTMENT_MAX).optional(),
    editorialAdjustmentReason: z.string().optional(),
    rankOverride: z.number().int().min(1).optional(),
    rankOverrideReason: z.string().optional(),
  })
  .refine((entry) => !entry.editorialAdjustment || Boolean(entry.editorialAdjustmentReason?.trim()), {
    message: 'editorialAdjustment 非零时必须填写 editorialAdjustmentReason',
    path: ['editorialAdjustmentReason'],
  })
  .refine((entry) => entry.rankOverride === undefined || Boolean(entry.rankOverrideReason?.trim()), {
    message: 'rankOverride 存在时必须填写 rankOverrideReason',
    path: ['rankOverrideReason'],
  });

const rankingSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  methodology: z.string(),
  criteria: z.array(rankingCriterionSchema),
  // 修正 2：记录快照时间与评分规则版本，回答"这个排名是何时、按什么规则产生的"。
  scoringVersion: z.string(),
  snapshotAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  entries: z.array(rankingEntrySchema),
});

const rankings = defineCollection({
  loader: withProviderRefCheck(file('src/data/rankings/rankings.json'), (data) => {
    const entries = (data.entries as Array<{ providerId: unknown }>) ?? [];
    return entries.map((entry) => entry.providerId);
  }),
  schema: rankingSchema,
});

// ---------------------------------------------------------------------------
// comparisons（数据快照 + 编辑对比分析）
// ---------------------------------------------------------------------------

const providerSnapshotFieldsSchema = z.object({
  name: z.string(),
  pricing: z.string().optional(),
  stability: z.string().optional(),
  speed: z.string().optional(),
  latency: z.string().optional(),
  protocols: z.array(z.string()).optional(),
  summary: z.string().optional(),
});

const comparisonSchema = z.object({
  slug: z.string(),
  providerA: reference('providers'),
  providerB: reference('providers'),
  comparisonCriteria: z.array(z.string()),
  // dataSnapshot 定格发布时引用的具体数值，不实时绑定 Provider 当前数据，
  // 避免 Provider 后续更新导致表格数字与已发布的编辑分析互相矛盾。
  dataSnapshot: z.object({
    capturedAt: z.coerce.date(),
    providerA: providerSnapshotFieldsSchema,
    providerB: providerSnapshotFieldsSchema,
  }),
  editorialAnalysis: z.string(),
  conclusion: z.string(),
  updatedAt: z.coerce.date(),
});

const comparisons = defineCollection({
  loader: withProviderRefCheck(file('src/data/comparisons/comparisons.json'), (data) => [
    data.providerA,
    data.providerB,
  ]),
  schema: comparisonSchema,
});

// ---------------------------------------------------------------------------
// articles（Content Collection：统一承载 knowledge / tutorial / troubleshooting / news）
// ---------------------------------------------------------------------------

const articleSchema = z.object({
  type: z.enum(['knowledge', 'tutorial', 'troubleshooting', 'news']),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  author: z.string().optional(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  coverImage: z.string().optional(),
  relatedTopics: z.array(z.string()).optional(),
  // troubleshooting 专用可选字段，不为此单独开 Schema。
  symptom: z.string().optional(),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: articleSchema,
});

// ---------------------------------------------------------------------------
// glossary（Content Collection）
// ---------------------------------------------------------------------------

const glossarySchema = z.object({
  term: z.string(),
  definition: z.string(),
  extendedExplanation: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  relatedTerms: z.array(z.string()).optional(),
  relatedArticles: z.array(z.string()).optional(),
  updatedAt: z.coerce.date(),
});

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/glossary' }),
  schema: glossarySchema,
});

// ---------------------------------------------------------------------------
// reviews（Content Collection：Provider 的编辑评测正文，1 Provider : 1 canonical Review）
// ---------------------------------------------------------------------------

const reviewSchema = z.object({
  providerId: reference('providers'),
  title: z.string(),
  summary: z.string(),
  verdict: z.string(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  relatedTopics: z.array(z.string()).optional(),
});

const reviews = defineCollection({
  loader: withUniqueProviderPerEntry(
    withProviderRefCheck(
      glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
      (data) => [data.providerId],
    ),
  ),
  schema: reviewSchema,
});

export const collections = {
  providers,
  tests,
  rankings,
  comparisons,
  articles,
  glossary,
  reviews,
};
