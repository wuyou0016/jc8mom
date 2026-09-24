---
term: ECH
definition: Encrypted Client Hello 的缩写，一种把 TLS 握手中原本明文的 SNI 等信息也加密起来的技术。
extendedExplanation: 传统 TLS 握手里，SNI 字段是明文的，等于告诉了所有中间设备"我要访问哪个网站"；ECH 把这部分信息也加密，让第三方更难通过流量分析判断你的访问目标。
relatedTerms: ["sni", "alpn"]
updatedAt: 2026-09-25
---

ECH 目前还在逐步普及阶段，不是所有网站、所有客户端都已经默认支持。它更像是整个互联网基础设施在往"握手阶段也加密"这个方向演进的一部分，机场行业里提到 ECH，通常是在说某个协议或节点是否支持这项更新的加密特性，支持得越完整，理论上抗流量分析的能力就越强。
