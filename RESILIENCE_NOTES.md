# Week 11 – Resilience notes (Maji → SafeMeds)

Branch: `week11-lab`. Scope: the Health Journal calls to SafeMeds (`server/routes/health.js`).

## What was added
| Piece | File | Behaviour |
|---|---|---|
| Timeout | `server/resilientFetch.js` | Each attempt aborts after **1500 ms** (`AbortSignal.timeout`) |
| Retry | `server/resilientFetch.js` | GET only; retries on timeout, connection failure, 429, 500, 502, 503, 504; max **2 retries**, waits **200 ms then 400 ms**; honours `Retry-After` on 429 (capped at 5 s) |
| Never retried | same | 4xx (except 429) and every write (POST/PUT/PATCH/DELETE) |
| Fallback | `server/routes/health.js` | Last good answer is kept per section (max 100). If SafeMeds fails, Maji returns it as `{data, stale:true, asOf}`; with nothing saved it returns 502 `Partner data unavailable` |
| UI | `HealthJournal.jsx` | Amber banner: "Showing saved data from HH:MM. SafeMeds is not responding right now." |
| Orders | `health.js` POST /orders | Timeout returns 504 telling the customer we cannot confirm the order; **not retried**, so no duplicate orders |

Settings (env): `SAFEMEDS_TIMEOUT_MS=1500`, `SAFEMEDS_RETRIES=2`, `SAFEMEDS_RETRY_DELAY_MS=200`.

## Why these numbers
- 1500 ms: a healthy SafeMeds answers in well under 100 ms, so 1.5 s is generous but keeps a page from hanging.
- 2 retries: enough to ride out a blip; more only makes users wait.
- 200/400 ms back-off: short, doubles each time, so we don't hammer a struggling server.
- Worst case for one request: 3 × 1500 + 200 + 400 = **5100 ms**.

## Tests
`__tests__/resilientFetch.test.js` (15) and `__tests__/health.test.js` (21): success, timeout signal, retry on 503, stop after 2 retries, connection errors, no retry on 400/401/403/404, no retry on writes, Retry-After, stale fallback, 502 with nothing saved, order 504 and no retry. Result: 36 passed.

## Measured locally (stand-in partner on localhost, NOT the real SafeMeds)
| Partner mode | Before | After |
|---|---|---|
| ok | 200 in 0.03 s | 200 in 0.03 s |
| slow (10 s) | 200 after 10.01 s (page hangs) | no saved copy: 502 in 5.12 s; with saved copy: 200 `stale` in 5.11 s |
| flaky (fails twice, then ok) | 502 / 502 / 200 | 200 every time, ~0.61 s, 3 partner hits, 2 retry lines |
| error (500) | 502 | saved copy: 200 `stale`; none: 502 in 0.65 s, 3 hits |
| order POST, slow | hangs | 504 after one attempt, 1 partner hit |

## What users would see without this code
A slow SafeMeds would freeze the Health Journal for as long as SafeMeds took, because Maji waited forever. A single hiccup showed an error even though a second try would work. Pressing Order twice on a slow reply could create duplicate orders. Users with nothing on screen could not tell whether the problem was theirs or ours.

## Limits and honesty notes
- No circuit breaker: during a long outage every request still pays the full 5.1 s before falling back. A breaker would skip SafeMeds for ~30 s after repeated failures.
- Saved copies live in memory, so a Maji restart empties them.
- Render free tier cold starts (~1 min) can exceed the 1.5 s timeout, so the first request after idle will usually fall back or 502.
- A timed-out order may still have been created at SafeMeds; the 504 message tells the user to check before ordering again.

## Part E – real partner test (to fill in with SafeMeds)
- Date/time window agreed: ____
- They stopped the server: Maji showed ____ after ____ s
- They restarted it: Maji recovered after ____ s
- Screenshot of banner: `docs/screenshots/stale-banner.png`
