---
term: ALPN
definition: TLS 握手阶段，客户端和服务器协商接下来用哪种应用层协议（比如 HTTP/1.1 还是 HTTP/2）通信的一个扩展机制，全称 Application-Layer Protocol Negotiation。
extendedExplanation: ALPN 本身是正常网络协议的一部分，但因为它在握手阶段传输的一些特征值比较固定，也常被拿来作为协议伪装/识别时需要考虑的一个细节。
relatedTerms: ["sni", "fallback"]
updatedAt: 2026-09-25
---

对普通用户来说，ALPN 基本不需要你手动干预，客户端会自动处理。之所以会出现在机场相关的讨论里，是因为一些伪装类协议（比如借助正常 HTTPS 流量特征做伪装）需要在 ALPN 这类细节上也尽量贴近真实网站的表现，才能更好地避免被识别出"这不是普通网页流量"。
