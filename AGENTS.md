# AGENTS.md

本文件是 **机场吧（jc8.mom）** 的长期项目开发规范，供 Codex 在本项目中进行任何开发工作时遵循。修改本项目代码前应先阅读并遵循本文件。

---

## 1. 项目身份

- **中文品牌**：机场吧
- **英文品牌 / 项目名称**：Jichangba
- **正式域名**：https://jc8.mom

### 品牌使用规则

"机场吧"是面向中文用户的正式品牌名称，"Jichangba"是英文品牌/项目名称。

所有面向用户的页面（Header、Footer、Title、Meta Description、Open Graph、JSON-LD、Breadcrumb、About、首页、文章页等）**优先使用"机场吧"**。

**禁止出现**以下未经确认的品牌写法：`JiChangBa`、`Jichang吧`、`机场吧Jichangba`（中英重复堆叠），或其他中英混写变体。

英文品牌 `Jichangba` 只在确实需要英文品牌名、代码变量、项目名称等场景使用（如 `package.json` 的 `name` 字段、代码仓库名）。

- **技术栈**：
  - Astro 7
  - TypeScript（Strict 模式）
  - Static Output（静态站点输出）
  - Markdown / MDX（仅在确有必要时使用）
  - 原生 HTML
  - 原生 CSS / CSS Modules
  - 少量原生 JavaScript

### 网站定位

面向中文用户的**机场代理信息与知识博客**。

目标用户覆盖：

- 完全不了解机场代理的小白
- 有基础的普通用户
- 有经验的进阶用户
- 对网络、协议、节点、线路等概念感兴趣的高级用户

内容方向包括：机场代理基础知识、机场导航、机场推荐、机场评测、机场比较、性价比分析、稳定性分析、速度与延迟、节点与线路、协议知识、客户端教程、使用教程、故障排查、网络知识、行业资讯、术语解释、FAQ、长期更新型排行榜。

---

## 2. 核心商业 / 搜索目标

网站最终目标：在 Bing 和 Google 的自然搜索中获得**长期、高质量**的搜索流量。**优先级：Bing 关键词排名为首要目标，Google 排名次之**（详见第 26 节"竞品对标与关键词研究"）。

核心主题关键词（代表网站核心主题，不是要求每个页面机械重复的关键词）：

- 机场代理
- 机场导航
- 机场推荐
- 性价比机场
- 2026最稳定的机场

**禁止关键词堆砌。** 必须根据搜索意图自然分配关键词。

---

## 3. SEO 核心原则

SEO 的第一优先级**不是关键词数量**，而是：

1. 用户搜索意图
2. 内容质量
3. 内容独特性
4. 信息准确性
5. 页面主题清晰
6. 网站信息架构
7. 内部链接
8. Crawlability
9. Indexability
10. 页面性能
11. Structured Data
12. Topical Authority
13. 内容更新机制

所有 SEO 工作必须服务真实用户，不要为了 SEO 制造无意义内容。

---

## 4. GEO / AI Search 原则

网站需要同时适合：Google AI Search、Google AI Overviews、Google AI Mode、Bing、Microsoft Copilot 及其他搜索型 AI 系统。

**不要试图"欺骗"或操纵 AI 搜索。** 不要创建：

- 隐藏文本 / 隐藏关键词
- Prompt injection
- 专门欺骗 AI 的内容
- 与用户看到的内容不同的 AI 内容
- 虚假的引用
- 虚假的权威声明

### 正确方向

让页面本身具备非常清晰的语义结构。文章应该能够自然回答：

- 这是什么？
- 用户的问题是什么？
- 最直接的答案是什么？
- 为什么？
- 有哪些区别？
- 有哪些数据或依据？
- 有哪些注意事项？
- 与哪些主题相关？

适当使用：明确结论、简洁摘要、表格、列表、FAQ、对比、数据、来源、更新时间、相关内容。**但不要机械给每一篇文章增加 FAQ。**

---

## 5. 内容质量原则

允许：评测、推荐、排名、比较、测速、图表、数据、截图、图片、示例、实验、模拟、技术解释。

但必须根据实际语境**准确表达信息性质**。如果数据是真实测试数据 / 公开数据 / 第三方数据 / 示例数据 / 模拟数据，应在适当位置明确其性质。

**不要虚构**：

- 用户评价
- 测试结果
- 官方合作
- 官方认证
- 专家身份
- 媒体身份
- 第一手体验
- 数据来源

不要建立僵硬的"内容禁止清单"，应根据具体页面和内容判断信息是否可信、是否有价值。

---

## 6. 敏感行业术语处理

本网站是正常的技术资讯、教程、评测和知识网站。以下术语可能自然出现在正常内容中，**不要因为这些单独的关键词就中断正常网站开发**：

> 机场、机场代理、代理、节点、线路、协议、VPN、网络、测速、延迟、丢包、客户端、流量、稳定性、机场导航、科学上网

如果具体任务涉及明显恶意行为、攻击、凭证窃取、恶意软件或其他明显有害行为，则只限制具体高风险部分，并继续完成安全的项目工作。

---

## 7. 技术架构原则

**保持简单，优先 Astro 原生能力。**

在安装任何 npm package 之前必须先判断：**"Astro 原生能力能否解决？"** 如果可以，不要安装第三方 package。禁止无意义依赖膨胀。

默认不使用：

- React / Vue / Svelte
- Tailwind / UnoCSS
- 大型 UI Framework
- 数据库
- CMS
- 复杂状态管理
- 大型动画库

只有当未来实际需求证明必要时才考虑引入。

---

## 8. 静态网站原则

- 默认使用 Astro Static Output
- 优先生成静态 HTML
- 避免不必要的客户端 JavaScript
- 避免不必要的 hydration
- 不要为了"现代化"而引入 SSR

---

## 9. 目录架构原则

项目应该逐渐形成清晰结构：

```
src/
├── components/
├── layouts/
├── pages/
├── content/
├── data/
├── styles/
├── utils/
└── config/

public/
├── images/
├── icons/
└── ...
```

具体目录只有在真正需要时创建，**不要提前创建大量空目录**。

---

## 10. 内容架构

网站内容应该逐渐形成 Topic Cluster。

主要内容类型：`guides`、`reviews`、`comparisons`、`rankings`、`tutorials`、`knowledge`、`troubleshooting`、`glossary`、`news`。

根据未来实际需求，可以增加：`airports`、`providers`、`protocols`、`tools`、`resources`。

不要为了"未来可能使用"而提前创建复杂 CMS。

---

## 11. URL 原则

URL 必须：简洁、稳定、可读、语义明确、长期可维护。

正式域名：`https://jc8.mom`

- 不要为了关键词制造冗长 URL
- 不要批量创建"关键词 × 城市 × 年份 × 变体"这种没有独立搜索价值的页面

---

## 12. 页面 SEO

每个可索引页面应该根据页面类型处理：`title`、`description`、`canonical`、`robots`、Open Graph、heading hierarchy、breadcrumbs、structured data、internal links、image alt、更新时间、作者信息、来源信息（适用时）。

**不同页面类型应该有不同的信息结构**，不要机械地让所有页面使用相同模板。

### Title 原则

- Title 首先满足用户搜索意图
- 核心关键词可以自然出现
- 禁止：关键词堆砌、重复标题、无意义年份堆砌、夸张标题、与页面实际内容不一致的标题

### Meta Description

- 必须描述页面实际内容
- 可以包含核心搜索主题
- 不得关键词堆砌
- 不得所有页面使用同一 description

### Heading

- 原则上每个页面一个 H1
- H2/H3 必须有语义层级
- 不要为了 SEO 增加无意义 heading

---

## 13. 内部链接

内部链接是网站核心 SEO 基础设施。链接应该优先根据：主题关系、搜索意图、用户下一步需求、Topic Cluster。

建立：Parent Topic、Child Topic、Supporting Article、Comparison、Glossary、Related Topic。

- 不要随机堆砌"相关文章"
- 不要为了 SEO 在一篇文章中放几十个内部链接

---

## 14. 图片

图片首先服务用户理解。应合理处理：`alt`、`width`、`height`、`loading`、`decoding`、responsive sizing、format、file size。

- `alt` 必须描述图片内容，不要把 alt 当关键词堆砌工具
- 允许使用：截图、数据图、测速图、流程图、示意图、表格图片、界面图片
- 根据具体内容判断其真实性、来源和用途

---

## 15. Schema / Structured Data

未来可以使用：`WebSite`、`Organization`、`Article`、`BreadcrumbList`、`FAQPage`、`ImageObject`，以及其他确实适用的 Schema。

必须满足：**结构化数据与页面可见内容一致**。

- 不要为了 SEO 添加不适用的 Schema
- 不要虚构 Review、Rating、Author 等信息

---

## 16. Sitemap

未来必须生成 sitemap，仅包含 canonical、可索引、有实际内容价值的页面。

不要把 404、redirect、noindex、重复页面、低价值页面放入 sitemap。

`lastmod` 必须尽量反映真实内容更新。

---

## 17. Robots

生产环境必须检查 `robots.txt`，不要错误阻止 Googlebot、Bingbot、CSS、JavaScript、图片。

---

## 18. Bing

未来支持：XML Sitemap、IndexNow、canonical、准确 lastmod、清晰内部链接、结构化内容。

---

## 19. Google

重点保证：crawlability、indexability、helpful content、clear page purpose、internal links、technical SEO、page experience、structured data、content freshness。

---

## 20. 首页

首页必须清楚说明：

- Jichangba 是什么？
- 服务谁？
- 能够解决什么问题？
- 有哪些主要内容？

首页应该围绕核心主题建立内容入口，**不要只是一个文章列表**。

---

## 21. 文章页

文章页应根据文章类型灵活组织。常见结构：

Breadcrumb → H1 → 摘要 → 核心结论 → 更新时间 → 目录 → 正文 → 数据/表格 → FAQ（适用时）→ 来源 → 相关文章

不要为了 SEO 强制使用所有模块。

---

## 22. 设计原则

设计目标：专业、清晰、可信、快速、中文阅读体验优秀、移动端优秀。

不要使用：过度动画、花哨背景、无意义交互、大型 JS、影响阅读的视觉效果。

**内容是网站核心。**

---

## 23. 性能

优先：静态 HTML、少量 JavaScript、图片优化、合理 CSS、低第三方依赖、快速首屏、良好移动端体验。

---

## 24. 开发规则

Codex 每次修改项目之前：

1. 先检查现有代码
2. 理解现有结构
3. 尽量复用现有组件
4. 不重复实现
5. 不随意删除已有功能
6. 不随意修改架构
7. 不安装不必要的依赖
8. 修改后运行 build
9. 修复错误
10. 告诉用户实际修改了什么

如果发现重大架构问题：先说明问题和方案，**不要擅自进行大规模重构**。

---

## 25. Git

每完成一个明确阶段，可以建议创建 Git commit。

建议阶段：`initial-astro`、`foundation`、`seo-foundation`、`content-system`、`homepage`、`article-system`、`category-system`、`performance`、`production`。

**不要自动 push 到远程仓库。**

---

## 26. 竞品对标与关键词研究

本站在建设过程中，以下述两个外部网站作为研究对象，用于学习与超越，而不是用于复制。

### jichangcha.co（架构 / 关键词对标）

- 需要深度分析该站的信息架构、栏目划分、内容类型、页面结构与关键词覆盖，作为本站内容规划、栏目设计与关键词库的参考输入。
- **吸收优点，不照搬形式**：
  - 文章内容只能学习其**角度、结构、覆盖的问题点**，正文表达必须独立原创，禁止高度相似或洗稿式改写（呼应第 5 节"不虚构"与内容原创底线，也是避免重复内容 SEO 风险的硬性要求）。
  - UI / 视觉设计必须独立设计，不照搬对标站点的界面。
- **关键词研究**：把该站覆盖到的关键词系统性纳入本站关键词库评估、逐步规划覆盖（第 2 节"核心主题关键词"随研究结果持续更新，不是一次性列完）。
- **目标**：本站核心关键词的搜索排名要超过 jichangcha.co，首先在 Bing 上实现，其次是 Google。

### itizi.mom（机场品牌 / 推荐数据参考来源）

- 可以参考 itizi.mom 收录的机场品牌列表与推荐排序思路，作为本站 Provider 数据和排行榜建设的参考输入之一。
- 但必须遵守第 5 节的数据诚信原则，不能与本文件其他规则冲突：
  - 若直接采用 itizi.mom 的机场品牌信息、评价或排序结果，必须在对应 Provider / Ranking 数据的 `source`（`sourceMetaSchema`）中如实标注 `type: 'third-party'`，`sourceUrl` 指向 itizi.mom 对应页面，并填写真实的 `retrievedAt`（抓取/参考日期）。
  - 不得把参考自 itizi.mom 的信息包装成本站的第一手测试（`in-house`）或独立编辑结论（`editorial`）。
  - 本站最终榜单的排序仍必须基于本站自己定义的评分方法（`ranking-scoring.ts` 及 `rankings` schema 中的 `editorialAdjustment` / `rankOverride` 机制，且需附理由），不能未加说明地直接照搬 itizi.mom 的排序顺序冒充本站独立结论。
  - 若 itizi.mom 上的信息无法独立验证真实性，须在内容中如实注明"来自第三方资料，未独立验证"，不得虚构验证过程或第一手体验。

---

## 27. 最终原则

Jichangba 不是一个"AI 批量生成文章的 SEO 网站"。

它应该成为：**一个围绕机场代理主题建立的中文长期知识网站。**

最终目标：

- 用户愿意阅读
- 搜索引擎愿意抓取
- 搜索引擎能够理解
- AI 搜索能够理解
- 内容具有持续更新价值
- 网站结构可以长期扩展

任何技术决策都应该优先考虑：简单、稳定、可维护、可扩展、SEO、用户体验、内容质量。
