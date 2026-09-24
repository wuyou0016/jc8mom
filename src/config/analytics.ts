// 统一统计配置。两个平台都是"配置项开关"——留空就什么都不加载，不会产生半成品脚本，
// 也不会因为缺 ID 就报错。之后只需要把真实 ID/token 填进来，不用再改代码。
export const analyticsConfig = {
  // 用于区分多站点数据的站点标识，随每个自定义事件一起上报。
  siteId: 'jc8.mom',

  // Google Analytics 4 Measurement ID。
  // 需要在 GA4 后台为 jc8.mom 单独建立数据流后才能拿到，格式类似 G-XXXXXXXXXX。
  // 留空则不加载 GA4 脚本。
  ga4MeasurementId: '',

  // Cloudflare Web Analytics 的 beacon token。
  // 在 Cloudflare Dashboard → Analytics & Logs → Web Analytics → Add a site
  // 为 jc8.mom 单独添加站点后可以拿到，是一串 32 位十六进制字符串。
  cloudflareBeaconToken: '',

  // zztools.cc 站点访问统计的检测码（data-sid）。若要沿用与其他站点对比访问量的做法，
  // 需要在 zztools.cc 为 jc8.mom 单独添加站点后取得新的 site id，不能沿用旧站点的。
  zztoolsSiteId: '',
} as const;
