# Week 12 – Monitoring notes (Maji API)

Branch: `week12-lab`. Scope: Maji's own API, which SkillsBridge calls.

## Part A – Predictions (written before looking at any numbers)
*Draft written for the team to edit. Change them to what your team really believed before you read `/stats`.*

1. **Slowest endpoint:** `GET /api/vendors/all` or `/api/vendors/top-rated`. They join several tables and sort or filter in MySQL, and the other routes read a single table.
2. **Most errors:** `GET /api/orders/active/estates` and the other partner routes from **401s**, because partners will still have wrong or missing keys while testing. I expect few 5xx unless the database is down.

## What was added
| Piece | File | Behaviour |
|---|---|---|
| Request logger | `server/middleware/monitoring.js` | One JSON line per finished request: `time`, `method`, `path`, `status`, `ms`, `caller` |
| Caller label | same, `who(req)` | `key-xxxxxx` (first 6 hex characters of the SHA-256 of a valid key) or `none` for a missing or wrong key |
| Stats | same, `GET /stats` (also `GET /api/stats`) | `startedAt`, `uptimeSeconds`, `total`, `clientErrors`, `serverErrors`, `errorRatePercent` (5xx only), `avgMs`, and per route: `count`, `clientErrors`, `serverErrors`, `avgMs`, `maxMs`. Needs an `X-API-Key` |
| Key label source | `server/middleware/security.js` | `requireApiKey` sets `req.apiKey` for a valid key only |
| Wiring | `server/app.js` | `monitor` is registered **first**, so 401, 429 and 404 are logged and counted |
| Traffic script | `scripts/traffic.js` | Sends good, wrong-key and unknown-route requests, then prints `/stats`. Key comes from the `API_KEY` environment variable |
| Tests | `__tests__/monitoring.test.js` | 7 tests, all pass |

## What is deliberately NOT logged
API keys (even partly: only a one-way 6-character fingerprint), passwords, request or response bodies, and query strings. Routes in `/stats` are patterns such as `PUT /api/vendors/:id`, so ids do not create a new row each.

## Example log lines
```
{"time":"2026-11-04T12:00:01.100Z","method":"GET","path":"/api/orders/active/estates","status":200,"ms":5.2,"caller":"key-dc87f9"}
{"time":"2026-11-04T12:00:01.300Z","method":"GET","path":"/api/orders/active/estates","status":401,"ms":1.1,"caller":"none"}
```
*(Replace these with two lines from your own run before submitting. Check with `grep -c "<your-real-key>" requests.log`, which must print 0.)*

## Part E – Real traffic and /stats (to fill in on your machine with MySQL running)
Run the server with `node server/index.js | tee requests.log` (`*.log` is already in `.gitignore`), then `API_KEY=<your key> node scripts/traffic.js`. Ask SkillsBridge to call your API too, and read `/stats` again.

| Route | count | 4xx | 5xx | avg ms | max ms |
|---|---|---|---|---|---|
| (fill in) | | | | | |

- **One real pattern, with numbers:** *(fill in, e.g. "`/vendors/all` averaged ___ ms but its max was ___ ms")*
- **Our hypothesis for why:** *(fill in)*
- **Prediction check:** was the slowest route and the most-error route what we predicted? *(fill in)*

A run without a database is not a real result: the data routes return 500 and only prove the counters work.

## Part E – One alert we would want in production
`errorRatePercent` above **2%** over five minutes, because 5xx errors are our fault and partners notice them first. (Edit if your team picks another number.)

## How to read it
- Rising `serverErrors` on one route means that route's query or code is failing.
- Rising `avgMs`/`maxMs` means it is slowing down before it fails. Read `maxMs`, because an average hides outliers.
- Many 4xx with `caller: "none"` are missing or wrong keys; use the log to see whether it is a mistake or probing.
- `(no route)` mixes 401s, 429s and 404s that never reached a route; the log lines tell them apart.

## Limits
- Counters live in memory, reset on restart, and are per server instance.
- No percentiles (p95); only average and max.
- `/stats` accepts any valid partner key; a separate admin key would be tighter.
- `/stats` does not count itself in its own reply, but appears in the next one.
- Logs go to stdout; on Render the platform keeps them, not Maji.
