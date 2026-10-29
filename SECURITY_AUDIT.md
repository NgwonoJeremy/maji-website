# Security Audit - Week 9

This audit respond to the questions: who is calling (API key authentication), how much one caller can do (rate limiting), and what our responses give away (data exposure).

## What we checked

We went through the lab's checklist against our own code (`server/apis.js`, `server/middleware/security.js`, the tests and the repo):

1. Sensitive fields in responses
2. Other people's data reachable by changing an ID
3. Error messages (stack traces, SQL, file paths)
4. Write endpoints (PUT, POST, DELETE) and extra fields they accept
5. Keys in the repo, logs or README
6. Old secrets in git history

## What we found

| Checklist item | What we found | Status |
|---|---|---|
| Sensitive fields | `/vendors/top-rated` and `/vendors/all` return each vendor's owner name and phone number. | Accepted on purpose (see below) |
| Other people's data | `GET /api/orders` returns every customer's orders to anyone. The Health Journal filters them in the browser only. | Known risk, not fixed this week |
| Write endpoints | `PUT /customers/:id`, `PUT /vendors/:id` and `DELETE /vendors/:id` have no authentication. | Known risk, not fixed this week |
| Extra fields accepted | The registration route accepts `role: "admin"`, so a caller can make themselves an admin. | Known risk, not fixed this week |
| Error messages | 500 responses return short generic text such as "Failed to fetch vendors", with no SQL, table name, file path or stack trace. | Nothing wrong |
| Keys in repo, logs, README | `.env` is not tracked (`git ls-files .env` prints nothing). The README and `openapi.yaml` use placeholders such as `YOUR_API_KEY`. The middleware never logs a key. | Nothing wrong |
| Old secrets in git history | Early JSON files with plaintext passwords are still in the git history. | Accepted for a school project; none are real accounts |

## What we fixed

- **API key authentication.** The five partner-facing routes now require a valid key in the `X-API-Key` header: `GET /api/orders/active/estates`, `/api/orders/active/schedules`, `/api/vendors/top-rated`, `/api/vendors/locations` and `/api/vendors/all`. A missing or wrong key returns 401 and the route handler never runs. If `API_KEYS` is empty, every request is refused (fail closed).
- **One key per consumer.** SkillsBridge and our own team each have a separate key, so we can tell callers apart and revoke one without breaking the other. Keys are stored in the `API_KEYS` environment variable (`.env` locally, the Render environment in production), never in the code. `.env.example` contains only an empty variable.
- **Rate limiting.** Each consumer is limited to 100 requests per minute across the five routes. Over the limit, the API returns 429 with a `Retry-After` header and a JSON body.
- **Documentation.** The README and `openapi.yaml` now describe the key header, the 401 and 429 responses and the rate limit, with no real key shown.
- **Tests.** New tests check that a request without a key gets 401, that a wrong key gets 401, and that a valid key gets 200. The existing GET tests were updated to send a key.

### Why only these five routes

Our own React pages (login, orders, admin, Health Journal) call routes that stay open. A key placed in React code is visible to anyone who opens the browser, so it would protect nothing. We checked that the React app does not call any of the five partner routes, so protecting them does not break our website.

### 401 or 403

We return 401 when the key is missing or unknown. 403 would mean we know who the caller is but they are not allowed to do something; we have only one level of access, so we have no such case yet.

## What we accepted and why

- **Phone numbers in `/vendors/top-rated` and `/vendors/all`.** SkillsBridge is a skills learning center that needs to call vendors and arrange sessions directly. The field is needed for their job, so we keep it. The risk is reduced because these routes are now behind a key and rate limited, so numbers cannot be read anonymously or scraped quickly.
- **Five failing tests on the PUT and DELETE routes.** These tests were already failing before Week 9. Those routes have no input validation, so bad input returns 500 instead of 400. All tests for the key check, the rate limit and the partner GET routes pass. The 5 failures are out of scope for this lab.
- **Old secrets in git history.** Early JSON files with plaintext passwords remain in the history. This is a school project and none of them are real accounts.
- **In-memory rate limiter.** The counter lives in the server's memory, so it resets when Render restarts the service and would not work across several server copies. That is fine for a single instance. A production system would use a shared store such as Redis.

## Why we chose 100 requests per minute per key

SkillsBridge told us they read our API once per user session (see `API_NEEDS.md`), so normal use is a few requests per minute. 100 per minute leaves plenty of room for a busy minute, while stopping a runaway loop from hammering our free-tier server and database. The limit is counted per key, so one noisy consumer cannot lock out the other. The value can be changed with the `RATE_LIMIT_MAX` environment variable, and we lowered it to 3 temporarily to demonstrate the 429 response (`200 200 200 429 429`).