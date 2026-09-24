// Cloudflare Pages Function: GET /api/stats-summary
//
// 读取 /api/track 写入的 KV 计数器，汇总成 /internal-stats 面板要展示的数据。
// 同样依赖 STATS_KV 绑定（见 functions/api/track.js 顶部说明）。
//
// 已知限制：KV list() 单次最多返回 1000 个 key，这里没有做分页累加——
// 页面数/品牌数远小于 1000 时没问题；如果未来页面/品牌数量级增长到接近
// 这个上限，需要在这里补充基于 cursor 的分页循环。
//
// 这是站内自建计数器，不做访问控制（谁都能请求）。如果不希望除你之外的人
// 看到这些数字，需要在 Cloudflare Zero Trust（Access）里给 /internal-stats
// 和 /api/stats-summary 这两个路径单独加一条只允许你自己邮箱访问的规则，
// 这一步要在 Cloudflare Dashboard 里配置，不是代码能替你做的。

async function listWithPrefix(kv, prefix) {
  const result = await kv.list({ prefix });
  return result.keys.map((k) => k.name);
}

async function sumEntries(kv, keys, stripPrefix) {
  const entries = await Promise.all(
    keys.map(async (key) => {
      const value = await kv.get(key);
      return { name: key.slice(stripPrefix.length), count: parseInt(value || '0', 10) || 0 };
    }),
  );
  return entries.sort((a, b) => b.count - a.count);
}

export async function onRequestGet(context) {
  const { env } = context;

  if (!env.STATS_KV) {
    return new Response(JSON.stringify({ ok: false, error: 'STATS_KV not bound' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const kv = env.STATS_KV;

  const [siteViewsRaw, siteClicksRaw, pvKeys, clickKeys] = await Promise.all([
    kv.get('pv:total:_site'),
    kv.get('click:total:_site'),
    listWithPrefix(kv, 'pv:total:'),
    listWithPrefix(kv, 'click:total:'),
  ]);

  const pvKeysWithoutSite = pvKeys.filter((k) => k !== 'pv:total:_site');
  const clickKeysWithoutSite = clickKeys.filter((k) => k !== 'click:total:_site');

  const [topPages, topProviders] = await Promise.all([
    sumEntries(kv, pvKeysWithoutSite, 'pv:total:'),
    sumEntries(kv, clickKeysWithoutSite, 'click:total:'),
  ]);

  const summary = {
    ok: true,
    generatedAt: new Date().toISOString(),
    totalPageviews: parseInt(siteViewsRaw || '0', 10) || 0,
    totalClicks: parseInt(siteClicksRaw || '0', 10) || 0,
    topPages: topPages.slice(0, 30),
    topProviders: topProviders.slice(0, 30),
  };

  return new Response(JSON.stringify(summary), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
