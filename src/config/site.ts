// 全站基础配置。只放品牌/域名/语言等站点级事实，
// 不放具体文章 SEO、Provider 数据、Ranking 数据——那些属于内容/数据层。

export const siteConfig = {
  siteName: '机场吧',
  brandName: '机场吧',
  brandNameEn: 'Jichangba',
  url: 'https://jc8.mom',
  locale: 'zh-CN',
  language: 'zh-CN',

  // 简洁、真实的站点描述，不为 SEO 堆砌关键词。
  description:
    '机场吧是一个面向中文用户的机场代理信息与知识网站，提供机场导航、机场推荐、机场评测与使用教程。',

  defaultTitle: '机场吧｜机场导航、机场推荐与评测',
  defaultDescription:
    '机场吧是一个面向中文用户的机场代理信息与知识网站，提供机场导航、机场推荐、机场评测与使用教程。',

  // 页面未提供 og:image 时的默认图路径。文件本身尚未创建，
  // 待未来真正需要时再制作，这里只先固定配置位置。
  defaultOgImage: '/images/og/default.png',

  // 编辑团队署名，不虚构个人专家/权威身份。
  author: {
    name: '机场吧编辑团队',
  },
} as const;
