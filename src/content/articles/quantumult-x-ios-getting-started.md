---
type: tutorial
title: Quantumult X 是什么？iOS 上的进阶客户端入门
description: 比 Shadowrocket 更硬核、可玩性更高的 iOS 客户端，适合想深度自定义规则的进阶用户，讲清楚基本配置流程。
category: 客户端教程
difficulty: intermediate
publishedAt: 2026-09-25
updatedAt: 2026-09-25
relatedTopics: ["what-is-shadowrocket", "what-is-subscription-link"]
---

如果说 [Shadowrocket](/tutorials/what-is-shadowrocket/) 是 iOS 上"够用就好"的代表，那 Quantumult X 就是"硬核玩家向"的那一个——功能更全、可玩性更高，但相应地，学习曲线也更陡一些。这篇给新手一个基础入门路径，不深入讲高阶脚本功能。

## 适合什么样的用户

如果你是第一次接触代理客户端，建议先从 Shadowrocket 入手，用顺手了再考虑要不要折腾 Quantumult X。它更适合已经有一定使用经验、想要更精细的规则控制、或者对 MitM（中间人重写）这类高级功能有需求的进阶用户。

## 获取和基础设置

Quantumult X 同样是 App Store 付费应用，购买流程和注意事项和 Shadowrocket 类似（同样可能涉及地区商店限制的问题）。安装完成后，第一次打开会有一些初始权限设置，按提示允许即可。

## 导入订阅

在配置页面里找到"订阅"相关的入口（Quantumult X 的界面选项比较多，第一次打开可能会觉得有点复杂），添加你的机场订阅链接。导入成功后，节点会出现在服务器列表里。

订阅链接是什么，先看[这篇](/knowledge/what-is-subscription-link/)。

## 关于策略组和规则

Quantumult X 最大的特点是支持非常灵活的**策略组**和**规则**配置——你可以精细控制"什么类型的流量走哪个策略组、用什么节点"，这比 Shadowrocket 的规则功能更强大，但也意味着配置复杂度更高。

新手阶段，建议直接使用机场官方提供的配置文件（不少机场会针对 Quantumult X 提供专门优化过的配置模板），而不是自己从零手写规则——用现成的、经过验证的配置，比自己摸索效率高得多。

## 常见问题

**界面看起来很复杂，一定要全部搞懂吗？** 不需要。核心操作就是导入订阅、选节点、开启开关，这几步和其他客户端逻辑差不多。策略组、重写脚本这些进阶功能，可以等你熟悉基础操作之后再慢慢研究。

**为什么感觉比 Shadowrocket 更耗电？** Quantumult X 因为功能更全（比如实时流量监控、更复杂的规则匹配），资源消耗相对会高一些，这是功能丰富度和资源占用之间的正常取舍，不是软件故障。
