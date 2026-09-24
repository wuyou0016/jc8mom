// 首页 Recommendation / TOP6 展示用的评分、价格、标签内容。
// 这些字段（分数、星级、价格、标签）当前的 ranking-scoring 计算逻辑不产出
// （overall 榜单的 computeOverallBaseScore 恒定返回 null），也不在 Provider Schema
// 里。展示这些内容是产品决策，由站长本人拍板保留，不在这里做真实性/来源判断——
// 排名顺序、服务商名称、跳转链接仍然全部来自真实的 getRankingPageData('overall')。
export interface HomepageHighlight {
  score: number;
  stars: number;
  tags: [string, string];
  price: string;
}

export const HOMEPAGE_HIGHLIGHTS: Record<string, HomepageHighlight> = {};
