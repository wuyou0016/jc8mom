# 站内数据面板：浏览量 / 点击量统计

## 这是什么

一个不依赖 GA4 / Cloudflare Web Analytics 是否配置的站内自建计数器：
- `functions/api/track.js`：Cloudflare Pages Function，接收页面浏览与 CTA/外链点击上报，写入 Cloudflare KV。
- `functions/api/stats-summary.js`：Cloudflare Pages Function，读取 KV 汇总数据，供面板展示。
- `src/pages/internal-stats.astro`：面板页面（`/internal-stats`），独立设计的卡片+表格布局，展示累计浏览量、累计点击量、页面浏览排行、品牌点击排行。
- `src/components/Analytics.astro`：已经在原有的 `report()` 点击追踪逻辑（GA4 events）基础上，新增了对 `/api/track` 的 `sendBeacon` 上报——页面加载自动上报一次 pageview，每次点击带 `data-analytics-event` 的元素或站外链接时上报一次 click。这部分逻辑是本站架构原本就有的（追踪 CTA 点击、Provider 卡片曝光），这次只是多接了一个上报目的地。

## 为什么选 Cloudflare KV，而不是别的方案

本站 CLAUDE.md 第7节明确"默认不使用数据库"。这里做了一次有记录的例外：KV 是 Cloudflare Pages 原生能力（本站已经部署在 Cloudflare Pages），不需要额外账号或第三方服务，免费额度内够用，是满足"站内可查看统计"这个明确需求时最轻量的选择。

## 部署前必须做的事：绑定 KV Namespace

代码本身不会自动生效，你需要在 Cloudflare Dashboard 里做两步：

1. 创建 KV Namespace：Cloudflare Dashboard → Workers & Pages → KV → Create a namespace，名字随意（建议 `jc8mom-stats`）。
2. 绑定到 Pages 项目：进入 jc8.mom 对应的 Pages 项目 → Settings → Functions → KV namespace bindings → 新增一条，**变量名必须填 `STATS_KV`**（代码里硬编码了这个名字），选择刚创建的 namespace。**Production 和 Preview 环境要分别绑定一次**，只绑其中一个的话另一个环境会一直报 500。

绑定完成、重新部署后，`/internal-stats` 才能正常显示数据；在绑定完成之前访问会显示"加载失败：STATS_KV not bound"，这是预期行为，不是 bug。

## 已知限制（不是遗漏，是当前版本的明确取舍）

- **计数不是绝对精确**：KV 没有原生原子自增，这里是"读出旧值 +1 再写回"，短时间内大量并发请求命中同一个 key 时会有轻微计数偏少的竞态风险。对内容站正常流量量级可以接受；如果未来需要精确计数，应换成 Durable Objects。
- **没有防刷量保护**：`/api/track` 没有鉴权、没有限流，任何人理论上都能调用它刷数字。如果发现被恶意刷量，需要在 Cloudflare 侧另外加 WAF/限流规则，不是这几个文件能解决的。
- **`/internal-stats` 没有访问控制**：目前只是不加入导航、不被搜索引擎收录（`robots: noindex`，且从 sitemap 排除），但只要知道这个 URL，任何人都能打开看到统计数字。如果需要真正限制只有你自己能看，去 Cloudflare Zero Trust（Access）给 `/internal-stats` 和 `/api/stats-summary` 这两个路径单独加一条只允许你邮箱登录的访问规则——这一步要在 Cloudflare Dashboard 里配置，不是代码层面能完成的。
- **`stats-summary.js` 里 KV `list()` 单次最多读 1000 个 key**，没做分页累加。页面数/品牌数远小于 1000 时没问题，量级增长后需要补充基于 cursor 的分页循环。
- **本机（这次生成代码的环境）没有安装 Node.js**，这几个 Function 文件写好后没有经过 `wrangler pages dev` 或实际部署验证，语法本身是标准 Cloudflare Pages Functions 写法，但建议你本地跑一次 `npx wrangler pages dev` 或直接部署到预览环境确认无误。
