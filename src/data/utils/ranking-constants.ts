// 集中定义 Editorial Adjustment 的合法区间，Schema 校验（content.config.ts）
// 与评分计算（ranking-scoring.ts）共用同一份数值，不允许各自散落定义。
export const EDITORIAL_ADJUSTMENT_MIN = -20;
export const EDITORIAL_ADJUSTMENT_MAX = 20;

// 稳定性榜 Minimum Evidence（见 Ranking Methodology Design Audit v1.0 第 5 节建议）：
// 至少 2 条非 demo TestRecord，且时间跨度不少于 7 天，否则不构成"稳定"这一
// 跨时间属性的证据。
export const MIN_STABILITY_TEST_RECORDS = 2;
export const MIN_STABILITY_SPAN_DAYS = 7;
