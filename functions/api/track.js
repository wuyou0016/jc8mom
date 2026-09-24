// Cloudflare Pages Function: POST /api/track
//
// 轻量级站内浏览量/点击量计数器，写入 Cloudflare KV。需要在 Cloudflare Pages
// 项目设置里绑定一个 KV Namespace，绑定变量名必须是 STATS_KV
// （Dashboard → 项目 → Settings → Functions → KV namespace bindings，
// Production 和 Preview 环境都要各自绑定一次，否则这个接口会直接返回 500）。
//
// 已知限制：KV 没有原生原子自增，这里是"读出旧值 + 1 再写回"，在同一 key
// 短时间内被大量并发请求命中时会有计数偏少的竞态风险（对内容站的正常流量
// 量级可以接受；如果未来流量变大到需要精确计数，应换成 Durable Objects）。
// 这个接口本身也没有防刷量保护（无鉴权/无限流），任何人都能调用，
// 属于已知取舍，不是遗漏——如果发现被恶意刷量，需要另外在 Cloudflare
// 加 WAF/限流规则，不在这个文件的职责范围内。

const MAX_KEY_PART_LENGTH = 120;

function sanitizeKeyPart(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[^a-zA-Z0-9\-_/.]/g, '').slice(0, MAX_KEY_PART_LENGTH);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD，用 UTC 日期分桶
}

async function incrementCounter(kv, key) {
  const current = await kv.get(key);
  const next = (current ? parseInt(current, 10) || 0 : 0) + 1;
  await kv.put(key, String(next));
}

export async function onRequestPost(context) {
  const { request, env, waitUntil } = context;

  if (!env.STATS_KV) {
    return new Response(JSON.stringify({ ok: false, error: 'STATS_KV not bound' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid json' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const day = todayKey();
  const kv = env.STATS_KV;
  const tasks = [];

  if (body && body.type === 'click') {
    const provider = sanitizeKeyPart(body.provider) || 'unknown';
    tasks.push(incrementCounter(kv, 'click:total:_site'));
    tasks.push(incrementCounter(kv, `click:total:${provider}`));
    tasks.push(incrementCounter(kv, `click:day:${day}:_site`));
  } else {
    const path = sanitizeKeyPart(body && body.path) || '/';
    tasks.push(incrementCounter(kv, 'pv:total:_site'));
    tasks.push(incrementCounter(kv, `pv:total:${path}`));
    tasks.push(incrementCounter(kv, `pv:day:${day}:_site`));
  }

  // sendBeacon 不等待响应体，这里用 waitUntil 让 KV 写入在响应之后
  // 继续跑完，不会因为提前返回 204 就被 Cloudflare 中断。
  const work = Promise.all(tasks);
  if (typeof waitUntil === 'function') {
    waitUntil(work);
  } else {
    await work;
  }

  return new Response(null, { status: 204 });
}

export function onRequestGet() {
  return new Response(JSON.stringify({ ok: false, error: 'use POST' }), {
    status: 405,
    headers: { 'content-type': 'application/json' },
  });
}
