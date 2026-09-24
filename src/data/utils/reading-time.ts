// 中文正文按字符数估算阅读速度，供未来 Article 渲染阶段调用，
// 不作为 frontmatter 字段人工维护。
const CJK_CHARS_PER_MINUTE = 400;

export function estimateReadingTimeMinutes(body: string): number {
  const charCount = body.replace(/\s/g, '').length;
  return Math.max(1, Math.round(charCount / CJK_CHARS_PER_MINUTE));
}
