const crypto = require("crypto");

const round = (n) => Math.round(n * 10) / 10;

const stats = {
  startedAt: new Date().toISOString(),
  total: 0,
  clientErrors: 0, // 4xx: usually the caller's mistake
  serverErrors: 0, // 5xx: our fault
  totalMs: 0,
  routes: {},
};

function newRoute() {
  return { count: 0, clientErrors: 0, serverErrors: 0, totalMs: 0, maxMs: 0 };
}

// A label for who called, without ever writing the key itself.
// requireApiKey sets req.apiKey only for a valid key, so wrong or missing keys are "none".
function who(req) {
  if (!req.apiKey) return "none";
  const hash = crypto.createHash("sha256").update(req.apiKey).digest("hex");
  return "key-" + hash.slice(0, 6);
}

function monitor(req, res, next) {
  const start = process.hrtime.bigint();
  // Read the path now: routers shorten req.url while they run, and a query string is never part of req.path.
  const path = req.baseUrl + req.path;

  res.on("finish", () => { // after the response is sent
    const ms = Number(process.hrtime.bigint() - start) / 1e6;

    console.log(JSON.stringify({
      time: new Date().toISOString(),
      method: req.method,
      path, // path only: no query string
      status: res.statusCode,
      ms: round(ms),
      caller: who(req),
    }));

    // Group by route pattern: /vendors/1 and /vendors/2 both become PUT /api/vendors/:id
    const route = req.route ? req.baseUrl + req.route.path : "(no route)";
    const label = `${req.method} ${route}`;
    const r = stats.routes[label] || newRoute();
    stats.routes[label] = r;

    stats.total += 1;
    stats.totalMs += ms;
    r.count += 1;
    r.totalMs += ms;
    r.maxMs = Math.max(r.maxMs, ms);
    if (res.statusCode >= 500) {
      stats.serverErrors += 1;
      r.serverErrors += 1;
    } else if (res.statusCode >= 400) {
      stats.clientErrors += 1;
      r.clientErrors += 1;
    }
  });

  next();
}

function statsHandler(req, res) {
  const routes = {};
  for (const [label, r] of Object.entries(stats.routes)) {
    routes[label] = {
      count: r.count,
      clientErrors: r.clientErrors,
      serverErrors: r.serverErrors,
      avgMs: round(r.totalMs / r.count),
      maxMs: round(r.maxMs),
    };
  }
  const rate = stats.total ? (stats.serverErrors / stats.total) * 100 : 0;
  const avg = stats.total ? stats.totalMs / stats.total : 0;

  res.json({
    startedAt: stats.startedAt,
    uptimeSeconds: Math.round(process.uptime()),
    total: stats.total,
    clientErrors: stats.clientErrors,
    serverErrors: stats.serverErrors,
    errorRatePercent: round(rate),
    avgMs: round(avg),
    routes,
  });
}

// For tests only: clears the counters.
function reset() {
  stats.total = stats.clientErrors = stats.serverErrors = stats.totalMs = 0;
  stats.routes = {};
}

module.exports = { monitor, statsHandler, reset };
