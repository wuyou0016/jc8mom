import type { CollectionEntry } from 'astro:content';

// Article 的 URL 前缀由 type 字段决定，全站（首页/Hub页/Provider页/Article页）
// 统一从这里取值，不再各自重复定义。
export const articleBasePathByType: Record<CollectionEntry<'articles'>['data']['type'], string> = {
  knowledge: '/knowledge/',
  tutorial: '/tutorials/',
  troubleshooting: '/troubleshooting/',
  news: '/news/',
};

export function getArticleHref(article: CollectionEntry<'articles'>): string {
  return `${articleBasePathByType[article.data.type]}${article.id}/`;
}
