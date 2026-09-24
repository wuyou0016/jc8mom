# 竞品调研笔记：jichangcha.co / itizi.mom

调研时间：2026-09-25。对应 [CLAUDE.md](../CLAUDE.md) 第 26 节"竞品对标与关键词研究"规则。本文件只记录**结构性事实**（URL、栏目、标签、页面类型），不摘抄对方文章正文——正文表达必须独立原创，禁止照抄或洗稿。

---

## 1. jichangcha.co（"机场查"）—— 架构与关键词对标

### 1.1 栏目结构（比本站现有结构多出的部分用 ⭐ 标出）

| 栏目 | URL 模式 | 说明 |
|---|---|---|
| 首页 | `/` | 直接给结论：32家收录、12项评测维度、180+长尾问题、每周更新 |
| 机场排行榜 | `/category/ranking/` | 综合排序 + 主推/次推标签 |
| 深度评测 | `/category/review/`、品牌页内嵌 | 测速图/解锁实测/线路拓扑/编辑结论 |
| 横向对比 | `/category/compare/`、`/compare/` | 单一综合对比页，非逐个 slug 生成 |
| 新手教程 | `/category/tutorial/` | Clash/小火箭/v2rayN 订阅导入 |
| 品牌库 | `/brands/`、`/brands/{slug}/` | **33 个品牌页**（本站目前 0 个，需要建立） |
| FAQ 库 | `/faq/`、`/category/faq/` | 单一 FAQ 汇总页，号称 180+ 长尾问题 |
| 专题聚合 | `/topics/`、`/topics/{slug}/` | 6 个专题：新手入门、客户端教程、进阶选购、AI工具、省钱优惠、新手科学上网 |
| ⭐ 机场状态/跑路预警 | `/airport-status/` | **本站没有的栏目**。追踪机场"跑路"情况，首页强调"跑路预警 99 条收录"，是很强的信任背书内容类型 |
| ⭐ 每日免费节点 | `/free-node/` | 引流用的免费节点页 |
| ⭐ 共享 Apple ID | `/share-id/` | 引流用：美区 Apple ID 下载小火箭 |
| 标签系统 | `/tag/{tag}/` | 见下方 1.2，是它关键词覆盖的核心机制 |

**本站（jc8.mom）相对优势**：目前 Schema 已经有独立的 `glossary`（术语表）collection，jichangcha.co **没有**术语表/glossary 栏目——这是可以保留并做大的差异化优势，不需要因为对标就放弃。

**明显值得抄的架构**：
1. **品牌库（Brand Directory）**——jichangcha.co 有 33 个品牌页，本站 `providers` collection 目前是空的，这块差距最大，应优先建设。
2. **`/airport-status/` 跑路预警页**——本站 schema 里 `provider.status` 已经有 `discontinued` / `watch` 状态字段，具备做同类页面的数据基础，只是还没有单独的列表页把它们呈现出来。
3. **`/free-node/`、`/share-id/` 引流页**——低成本、高搜索量的入口页，可以评估是否适合本站定位后再决定是否跟进。

### 1.2 标签（关键词）清单——原样收录，供关键词库规划用

按用途分类整理自 `/sitemap-0.xml` 的 `/tag/` 路径：

**客户端 × 机场推荐组合词**（每个客户端一篇独立文章）：
`Clash机场推荐`、`Shadowrocket机场推荐`、`v2rayN机场推荐`、`ChatGPT机场推荐`

**人群/场景细分词**：
`学生党机场推荐`、`高性价比机场推荐`、`稳定机场推荐`、`专线机场推荐`、`便宜机场推荐`、`免费试用机场`、`一元试用机场`、`机场试用`

**基础/泛词**：
`机场推荐`、`机场评测`、`机场排行榜`、`2026机场推荐`、`梯子推荐`、`2026梯子推荐`、`科学上网`、`科学上网工具`、`对比分析`、`新手教程`

**协议/技术词**：
`IEPL`、`IPLC`、`VLESS`、`原生IP`

**优惠相关**：
`机场优惠活动`、`机场优惠码`、`机场折扣码`

**客户端软件词**：
`小火箭`、`小火箭下载`、`Clash订阅`、`ClashBox`

**⭐ 生态外围词（本站目前完全没有覆盖，是最大的关键词缺口）**：
- Apple 生态：`共享Apple ID`、`美区Apple ID`
- Google 服务：`谷歌三件套`、`Google Play安装`、`安卓安装谷歌商店`、`华为安装谷歌商店`、`GSpace`
- 华为/鸿蒙：`华为VPN`、`鸿蒙OS`、`HarmonyOS`、`HarmonyOS NEXT`、`鸿蒙安装Google Play`
- Telegram：`电报注册`、`Telegram注册`、`TG教程`
- AI 工具（不只是"用机场访问AI"，而是把 AI 工具教程本身当独立引流内容）：`AI工具`、`Anthropic`、`Claude`、`Claude AI`、`Claude桌面版`
- 平台：`iOS`、`Windows`

这一批"生态外围词"是 jichangcha.co 最值钱的打法：用户搜"Telegram怎么注册"、"华为怎么装Google Play"、"Claude AI怎么用"这类**跟机场本身无关但同一批用户会搜**的高流量问题引流，再在文章内部导流到机场推荐。本站现有 70 篇文章几乎全部是"机场是什么/怎么选"内部视角的词，完全没有这类外围引流词，是可以直接超越的方向。

### 1.3 URL 命名方式差异

jichangcha.co 用**拼音缩写**做 slug（如 `2026-jichang-paihangbang`、`pianyi-jichang-tuijian`、`hongmeng-clashbox-jiaocheng`），本站（沿用 rocketjichang 架构）用**英文语义化** slug（如 `what-is-airport-proxy`、`airport-vs-vpn`）。两种方式各有 SEO 论证空间，不必照搬，保持本站现有的英文语义化 slug 风格即可（更符合本站 CLAUDE.md 第 11 节 URL 原则）。

---

## 2. itizi.mom（"梯子工厂"）—— 品牌推荐数据参考

### 2.1 重要发现：网络关系

itizi.mom 页脚"友情链接"直接列出了 **rocketjichang.com**（本项目的前身/姊妹站），以及 jichangbao.com、jichangtj.net、itz.mom、itz.lat、ifq.lol、ifq.homes、efq.homes、itizi.xyz 共 9 个站点。itizi.mom 首页"本站首选推荐"品牌是**无忧链接**，这与 rocketjichang.com 历史 git 记录里反复出现的"无忧链接保持第1"完全一致。

**这强烈提示 itizi.mom 及其友情链接列表中的站点是同一站群/联盟体系**，而不是纯粹的陌生竞品。如果情况确实如此，建议你确认：jc8.mom 是否也要接入这个站群（互相友情链接、统一以无忧链接为主推），这会影响下面数据要不要直接当"自有口径"用，还是仍按 CLAUDE.md 第 26 节当"第三方资料"标注来源。**这一点需要你确认，我没有替你决定。**

### 2.2 itizi.mom 当前的机场推荐顺序（综合榜）

| 排名 | 品牌 | 定位 | 参考价格 |
|---|---|---|---|
| 1（首选） | 无忧链接 | 套餐透明，MINI/舒心/省心三档 | ¥79/年起（MINI），¥19/月起（舒心） |
| 2 | 微风网络 | 入门级专线，IEPL（标注"第三方资料"） | 约¥11/月起·100GB |
| 3 | 飞猫云 | IPLC专线，协议多样（标注"第三方资料"） | 约¥7/月起·50GB |
| 4 | 宇宙云 | 企业级内网专线，70+节点 | 以官网结算页为准 |
| 5 | 光速云 | 老牌综合型，2020年开业 | 年付约¥7.5/月·59GB |
| 6 | Firefly | IPLC专线，入门定位（标注"第三方资料"） | 约¥8/月起·60GB |

注意 itizi.mom 自己对非无忧链接的品牌都标注了"（第三方资料）"字样，且页脚有完整的联盟营销披露声明。这个做法正好符合本项目 CLAUDE.md 第 5 节的数据诚信要求，可以直接参考这种标注方式。

### 2.3 itizi.mom 的信息架构要点

- 按"选择指南"分组：梯子怎么选 / VPN怎么选 / 机场怎么选 / 节点怎么选 / 新手怎么选择 / 机场套餐怎么看——是"决策路径"导向而非"百科词条"导向。
- 按"场景"二次分类同一个榜单：综合推荐 / 性价比 / 稳定性优先 / AI工具使用 / 流媒体解锁 / 新手友好——同一份数据从 6 个用户意图入口分别呈现，而不是做 6 个独立页面。
- 有姊妹站分流："如果你要找免费VPN相关内容，可以前往姊妹站 itizi.xyz"——用免责声明的方式做人群过滤，减少不匹配流量占用主站权重。

---

## 3. 建议的下一步（未执行，等你确认）

1. 是否现在就用 itizi.mom 的 6 品牌 + 排序顺序，作为 `providers.json` / `rankings.json` 的起始数据（并按 CLAUDE.md 第 26 节标注来源）？
2. 是否需要新增 `airport-status`（跑路预警）作为新的 content collection？目前 schema 的 `provider.status` 已经支持 `discontinued`/`watch`，只差页面。
3. 是否要在文章选题里加入"生态外围词"方向（Telegram 注册、Google Play 安装、Claude AI 教程等），作为区别于旧站、覆盖 jichangcha.co 词库缺口的重点？
4. 确认 jc8.mom 与 itizi.mom / rocketjichang.com 等站点的关系（同一站群 or 独立站点），决定数据引用方式。
