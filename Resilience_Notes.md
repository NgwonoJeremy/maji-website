# Resilience Notes: Health Journal and SafeMeds (Week 11)



**What this covers:** the Health Journal page (`/customer/health`) in the Maji app. Its three partner sections (waterborne illness alerts, top-rated products, tablets in stock) get their data from the SafeMeds API through the Maji server (`server/routes/health.js`). Most tests below used a stand-in partner (`flaky-partner.js`, port 4000) that can be switched between normal, slow, flaky and error modes. Screenshots from those tests show the page footer "Live data from SafeMeds", but the data came from the stand-in.

## 1. Before the fix (Week 10 code)

| Failure | What the user saw | What the log said |
|---|---|---|
| Normal | Live data, response in 0.0037 s | none |
| Slow (partner answers after 10 s) | Each section waited about 10 s (`products` 10.05 s, `stock` 10.06 s) with no message. Reloading while it hung stacked the wait up to about 20 s. | none |
| Flaky (two failures, then success) | `<what you saw: sections showing errors even though a second try would have worked>` | `SafeMeds ... returned 503` |

## 2. After the fix: what I tested

| Failure | What the user saw | What the log said |
|---|---|---|
| Normal | Live data in all three sections, no banner | none |
| Flaky (each call fails twice, then works) | Live data in all three sections, no banner, no error message. The user never saw the failure. | Per section: `attempt 1 failed, retrying in 200 ms`, then `attempt 2 failed, retrying in 400 ms`, then success |
| Error (always 500), nothing saved | Each partner section showed "unavailable right now. Please try again later." The orders section (our own database) kept working. | Exactly 2 retries (200 ms, 400 ms), then `SafeMeds <section> failed: SafeMeds returned 500` |
| Slow (10 s), nothing saved (after a server restart) | The same "unavailable" messages in the three partner sections, no crash, no blank page | 2 retries, then `SafeMeds <section> failed: timeout` |
| Slow (10 s), with a saved copy | The same data as before, plus a banner under each partner heading: "Showing saved data from 1:42:10 PM. SafeMeds is not responding." | 2 retries, then `failed: timeout`. The server response for `/api/health/products` had `"stale":true` and the same `asOf` as the earlier live response. |
| Partner stopped (stand-in switched off) | `<run this test: stop the stand-in, reload, and write what the page showed>` | `<expected: ECONNREFUSED>` |
| Real SafeMeds drill (stopped, then restarted) | `<result, or "blocked: no working host and key from the producer team">` | `<log line>` |

Evidence kept: terminal screenshots of the retry lines (error, slow and flaky modes), page screenshots of the live, banner and unavailable states, and the `curl` output showing `stale:false` then `stale:true`.

## 3. My numbers, and why

| Setting | Value | Why |
|---|---|---|
| Normal response time | 0.0037 s (measured twice: 0.003737 s and 0.003563 s) | Measured against the stand-in on the same machine. The real SafeMeds on a hosted free tier will be much slower. |
| Timeout | 1500 ms per try | Far longer than the measured normal time, and well under the 10 s a user waited before. The handout suggests 1500 ms for a call that normally takes well under half a second. |
| Retries | 2 (3 tries in total) | The handout's cap. The log never shows an `attempt 3`. |
| Wait between tries | 200 ms, then 400 ms | Short, and growing, so a struggling partner is not hit in a tight loop. |
| Worst-case wait | 3 x 1500 + 200 + 400 = **5100 ms** | Every try timing out. A customer waits about 5 seconds, then sees saved data or the unavailable message. Measured in the browser: `<your number from the Network tab>`. |
| Order request timeout | 5000 ms, never retried | An order is a write. A retry could place it twice, and a 1.5 s cutoff could abandon an order SafeMeds had already accepted. |

Trade-off: the real SafeMeds runs on a free hosting tier that can take up to a minute to wake up after being idle. The first request after a quiet period can hit the 1500 ms timeout, so I wake the server before any demo.

## 4. What a real user would have experienced without this code

On the Health Journal screen, the three SafeMeds sections would have sat on "Loading..." for about 10 seconds when the partner was slow, with no message at all, as my measurements showed (10.05 s and 10.06 s). A customer who got impatient and reloaded made it worse, because the waiting requests stacked up and the next load took about 20 seconds. When SafeMeds was flaky, two out of three loads would have shown the "unavailable" message even though a second attempt a moment later would have worked, so the customer would have concluded the page was broken. They would probably have closed it and gone back to the dashboard, without ever finding out whether cholera alerts exist for their estate or whether chlorine tablets were in stock. With the fix, a failure is invisible when it is brief, and a longer outage shows the last known data with a clear banner saying when it was saved.

## 5. What I did not build

A circuit breaker is a switch that stops calling a partner that has been failing for a while and tests it only occasionally. Mine still tries every request three times, so during a long outage every page load keeps sending three calls per section to a partner that is already struggling.

## 6. Other things I noticed

- The saved copy lives in the Maji server's memory, so it is lost when the server restarts (shown by the "nothing saved" test above). That is acceptable for this course.
- The "Order" button stays active while saved data is shown. If a customer clicks it while SafeMeds is down, the order request fails with the friendly "SafeMeds could not take your order right now" message, and the saved stock number may be out of date.
- The retry logic only retries GET requests and the statuses listed in `resilientFetch.js` (429, 500, 502, 503, 504). A 400, 401, 403 or 404 comes straight back.