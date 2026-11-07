# Monitoring Notes (Week 12)

**Traffic:** two runs of my `traffic.js` (60 requests each), one with the `skillbridge` key and one with the `maji-team` key, plus 2 manual requests, so `/stats` shows 122 requests in total. Partner traffic: none. Server uptime when I read `/stats`: 529 s.

## 1. Predictions (written before any traffic)

1. **Slowest endpoint:** I expect `GET /api/vendors/top-rated` to be the slowest. It joins the vendors and customers tables and runs a subquery to find the highest rating in each estate, while the other routes read one table.
2. **Most errors:** I expect most errors to be 4xx, from requests with no key or a wrong key (401) and paths that don't exist (404). I expect few or no 5xx errors, because the routes only read from a local database.

## 2. What the data showed

| Route | count | avgMs | maxMs | clientErrors | serverErrors |
|---|---|---|---|---|---|
| GET /api/vendors/locations | 42 | 4.7 | 100.1 | 14 | 0 |
| GET /api/vendors/top-rated | 32 | 4.3 | 24 | 13 | 0 |
| GET /api/orders/active/schedules | 11 | 3.5 | 14.8 | 0 | 0 |
| GET /api/orders/active/estates | 6 | 2.6 | 3.8 | 0 | 0 |
| GET (no route) | 31 | 1.0 | 4.2 | 31 | 0 |

**Overall:** total 122, clientErrors 58, serverErrors 0, errorRatePercent 0, avgMs 3.5.

- **The 429s and 404s sit in `(no route)`.** Its 31 requests are 20 rate-limit rejections (429) and 11 requests to a path that doesn't exist (404). The limiter runs before routing, so it rejects requests before any route is matched.
- **The 401s sit under their routes** (14 on locations, 13 on top-rated), because the API key check runs inside each route.

## 3. Prediction vs data

- **Slowest:** in the table, `locations` has the highest average (4.7 ms), but that comes from one call: the first request after the restart took 100.1 ms. Without it, `locations` averages about 2.4 ms. Leaving that call out, `top-rated` is the slowest, as I predicted: average 4.3 ms against 3.5 (schedules), 2.6 (estates) and 2.4 (locations), and a worst case of 24 ms. The gap is small in absolute terms, because every average is under 5 ms.
- **Errors:** I predicted mostly 4xx and few or no 5xx, and that was right: 58 client errors and 0 server errors (0%). I was wrong about which 4xx would dominate. Of the 58, 27 were 401, 20 were 429 and 11 were 404. The 429s were the second biggest group because I deliberately sent more requests than the limit allows.
- **Are the 401s mistakes or probing?** All 27 have `caller: "none"` and fall inside my two traffic runs and one manual test without a key, so there is no sign of requests from anyone else.
- **Is the error rate healthy?** 0 server errors out of 122 requests. The 58 client errors all came from my own test traffic.

## 4. One real pattern, with numbers

Slow calls cluster in time across different routes. Between 07:56:40.39 and 07:56:40.61 (0.22 s), `top-rated` took 9 ms and 21.8 ms and `locations` took 15.7 ms, while a typical call took 2 to 4 ms. A run I did earlier, before restarting the server, showed the same thing: `top-rated` took 51.8 ms and 22.3 ms, and the slowest calls of two other routes fell inside the same 0.2 s. An average hides this: `top-rated` averaged 4.3 ms, but its slowest call was 24 ms.

## 5. Why I think it happens, and what I would check next

My hypothesis is a brief stall that hits the whole server for a moment, not a slow query, because routes that run different queries were slow at the same time, and it happened in two separate runs. The cause could be the laptop or the MySQL database being briefly busy. To find out, I would run `traffic.js` several more times and see whether the spike keeps appearing, add the database query time to the log line to see whether the time is spent in MySQL or in Node, and watch CPU and memory in Task Manager during a run. First-request warm-up is a separate cause of slow outliers: the first request after the restart took 100.1 ms, and the first two calls of the first run (after about two minutes idle) took 14.8 ms and 24 ms, against 2 to 4 ms later.

## 6. One alert I would want in production

**Alert:** `errorRatePercent` above 5% for 5 minutes.
**What should happen:** someone on the team is notified and checks the log for the failing route. Today it was 0%, so it would not have fired.
**Meanwhile:** the Health Journal already keeps working for users. When SafeMeds fails, the server returns the saved copy and the page shows a "Showing saved data" banner, so users see the last known data instead of an error while a person fixes the cause.

## 7. Caller labels and the rate limit

The `caller` field now shows who sent each request: `skillbridge` in the first run and `maji-team` in the second. Requests with no key or a wrong key (401, 404) and every rate-limit rejection (429) show `none`, because no consumer has been identified at that point. At first every line said `none`, because the monitoring code read `req.apiKey` while the key check stores the consumer's name on `req.consumer`. I changed it to log `req.consumer`.

The log also shows that the rate limit is shared between consumers. `skillbridge` sent 60 requests, then `maji-team` was accepted for its first 40 requests and got 429 for the last 20: 60 + 40 = 100, one allowance for both. The limiter falls back to the IP address, because it runs before the key check and doesn't yet know the consumer, so each consumer does not get its own 100 requests per minute, and requests with no key use up the same allowance. I would run the limiter after the key check.

## Sample log lines

```
{"time":"2026-11-07T07:56:38.669Z","method":"GET","path":"/api/vendors/top-rated","status":401,"ms":1.6,"caller":"none"}
{"time":"2026-11-07T07:56:38.753Z","method":"GET","path":"/api/vendors/top-rated","status":200,"ms":24,"caller":"skillbridge"}
{"time":"2026-11-07T07:57:16.286Z","method":"GET","path":"/api/vendors/top-rated","status":200,"ms":3.1,"caller":"maji-team"}
{"time":"2026-11-07T07:57:18.713Z","method":"GET","path":"/api/vendors/top-rated","status":429,"ms":1.1,"caller":"none"}
```