---
term: SNI
definition: TLS 握手过程中，客户端主动告诉服务器"我要访问哪个域名"的一个字段，全称 Server Name Indication。
extendedExplanation: 因为 SNI 在早期 TLS 版本里是明文传输的，审查设备可以直接读取这个字段来判断你在访问什么网站，这也是为什么它长期是网络审查和反审查技术博弈的一个焦点。
relatedTerms: ["ech", "domain-fronting", "fallback"]
updatedAt: 2026-09-25
---

为什么一个服务器要靠 SNI 才知道你想访问哪个域名？因为很多服务器同时托管了很多个不同的网站（同一个 IP 上跑好几个域名），服务器得先知道你要哪个域名，才能拿出对应的证书完成握手。SNI 明文可见这个问题，后来被 ECH（加密客户端问候）这类技术尝试解决——具体是怎么解决的，可以看 [ECH](/glossary/ech/) 这个词条。
