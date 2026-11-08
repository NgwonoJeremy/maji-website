# Monitoring Notes (Week 12)

**Traffic:** two runs of my `traffic.js` (40 requests each), one with each of two test API keys, plus 1 manual request before them, so `/stats` shows 81 requests in total. Partner traffic: none yet (no request from SkillBridge or SafeMeds reached this server). Server uptime when I read `/stats`: 46 s.

## 1. Predictions (written before any traffic)

1. **Slowest endpoint:** I expect `GET /api/vendors/top-rated` to be the slowest. It joins the vendors and customers tables and runs a subquery to find the highest rating in each estate, while the other routes read one table.
2. **Most errors:** I expect most errors to be 4xx, from requests with no key or a wrong key (401) and paths that don't exist (404). I expect few or no 5xx errors, because the routes only read from a local database.

## 2. What the data showed

| Route | count | avgMs | maxMs | clientErrors | serverErrors |
|---|---|---|---|---|---|
| GET /api/vendors/top-rated | 36 | 2.6 | 14.8 | 11 | 0 |
| GET /api/vendors/locations | 19 | 1.6 | 2.7 | 4 | 0 |
| GET /api/orders/active/schedules | 12 | 2.0 | 3.9 | 0 | 0 |
| GET /api/orders/active/estates | 9 | 2.0 | 3.0 | 0 | 0 |
| GET (no route) | 5 | 1.1 | 2.5 | 5 | 0 |

**Overall:** total 81, clientErrors 20, serverErrors 0, errorRatePercent 0, avgMs 2.1.

- **The 404s sit in `(no route)`.** Its 5 requests are all calls to a path that doesn't exist (`/api/not-a-route`), so no route matched.
- **The 401s sit under their routes** (11 on top-rated, 4 on locations), because the API key check runs inside each route.
- **Status codes:** 61 were 200, 15 were 401 and 5 were 404. No request was rate-limited (429), because each key sent only 40 requests, under the limit of 100 per minute.

## 3. Prediction vs data

- **Slowest:** I predicted `top-rated`, and it has the highest average (2.6 ms) and the highest worst case (14.8 ms). Most of that comes from one call: the 14.8 ms request was the first one after the restart (the manual request at 14:04:38). Without it, `top-rated` averages about 2.3 ms, still the highest, but only just ahead of `schedules` and `estates` (2.0 ms). The gap is small in absolute terms, because every average is under 3 ms.
- **Errors:** I predicted mostly 4xx and few or no 5xx, and that was right: 20 client errors and 0 server errors (0%). Of the 20, 15 were 401 and 5 were 404, so wrong or missing keys were the biggest group, as I expected.
- **Are the 401s mistakes or probing?** All 15 have `caller: "none"` and fall inside my two traffic runs, which deliberately send requests with no key or a wrong key. There is no sign of requests from anyone else.
- **Is the error rate healthy?** 0 server errors out of 81 requests. The 20 client errors all came from my own test traffic.

## 4. One real pattern, with numbers

The slowest request is always the first one after a restart. The first `top-rated` call took 14.8 ms, against 2 to 4 ms for every later call. The next slowest requests in the log were 3.9, 3.7 and 3.5 ms. An average hides this: `top-rated` averaged 2.6 ms, but its slowest call was 14.8 ms, about six times the average. In an earlier run on the same laptop the first request after a restart took 100.1 ms.

## 5. Why I think it happens, and what I would check next

My hypothesis is warm-up: the first request has to open the first connection to MySQL and run code for the first time, and later requests reuse the connection. To check, I would restart the server and send one request, wait, then send another, and see whether only the first is slow. I would also add the database query time to the log line, to see whether the time goes to MySQL or to Node.

## 6. One alert I would want in production

**Alert:** `errorRatePercent` above 5% for 5 minutes.
**What should happen:** someone on the team is notified and checks the log for the failing route. In this run it was 0%, so it would not have fired.
**Meanwhile:** the Health Journal already keeps working for users. When SafeMeds fails, the server returns the saved copy and the page shows a "Showing saved data" banner, so users see the last known data instead of an error while a person fixes the cause.

**What it looks like when it fires.** In an earlier run, my local MySQL was not running. `/stats` showed total 241, serverErrors 164 and errorRatePercent 68, and the log's error output showed `connect ECONNREFUSED 127.0.0.1:3306` for every one of the 164 failed requests. The alert would have fired within the first minutes, and the log pointed straight at the cause.

## 7. Caller labels and the rate limit

The `caller` field shows who sent each request as `key-` followed by the first 6 characters of the SHA-256 hash of the key, for example `key-c7a247` (first test key) and `key-5054ef` (second test key). Requests with no key or a wrong key (401) and requests to paths that don't exist (404) show `none`, because the key check never accepted a key for them. The monitor reads `req.apiKey`, which the key check sets only for a valid key, so a wrong key can never be hashed or labelled.

The key itself is never written to the log. I searched the whole log for both test keys after sending valid requests with each one:

```
Select-String -Path requests.log -Pattern $env:KEY_ONE -SimpleMatch | Measure-Object   ->  Count : 0
Select-String -Path requests.log -Pattern $env:KEY_TWO -SimpleMatch | Measure-Object   ->  Count : 0
```

The rate limit now runs after the key check, inside the partner routes, and counts each key separately. I removed the global limiter, which ran before the key check, counted by IP address, and so shared one allowance between all consumers and anonymous callers. I did not test a 429 in this run (40 requests per key is under the limit of 100 per minute), so this is checked from the code, not from the data.

## Sample log lines

```
{"time":"2026-11-08T14:04:38.942Z","method":"GET","path":"/api/vendors/top-rated","status":200,"ms":14.8,"caller":"key-c7a247"}
{"time":"2026-11-08T14:04:58.216Z","method":"GET","path":"/api/orders/active/schedules","status":200,"ms":2,"caller":"key-5054ef"}
{"time":"2026-11-08T14:04:55.638Z","method":"GET","path":"/api/vendors/top-rated","status":401,"ms":1,"caller":"none"}
{"time":"2026-11-08T14:04:55.514Z","method":"GET","path":"/api/not-a-route","status":404,"ms":2.5,"caller":"none"}
```