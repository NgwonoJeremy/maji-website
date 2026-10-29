# INTEGRATION_LOG.md

Week 10 — Integration. Maji consumes the **SafeMeds** API (upstream partner) and is consumed by **SkillsBridge** (downstream partner).

## Setup

| | |
|---|---|
| **Upstream partner** | SafeMeds (Group 3) |
| **Partner base URL** | `https://safemeds-iap-api.onrender.com/api` (stored in `.env` as `PARTNER_URL`) |
| **Partner contract** | [SafeMeds `openapi.yaml`](https://github.com/n4talii/SAFEMEDS_IAP/blob/main/SafeMeds.App/openapi.yaml) |
| **API key** | None needed. SafeMeds' README says no key is required, and our calls without one succeeded. `PARTNER_API_KEY` is left empty; the code sends an `X-API-Key` header only if it is set. |
| **Feature built** | Health Journal page for customers (`/customer/health`) |
| **Downstream partner** | SkillsBridge, calling our 4 endpoints at `https://maji-api-onrender-com.onrender.com/api` |

## First call, outside our app (Part B)

Made on 22 Oct 2026, before writing any integration code, directly against SafeMeds' live API.

| Request | Status | Response | Matches their contract? |
|---|---|---|---|
| `GET /products/water-purification?sort=rating` | 200 | `[{"productId":100102,"productName":"AquaClean Purification Drops","averageRating":4.8,"reviewCount":124}]` | Yes |
| `GET /inventory?product=chlorine-tablets&available=true` | 200 | `[{"productId":100102,"productName":"Chlorine Tablets 100mg","availableQuantity":450,"isAvailable":true}]` | Yes |
| `GET /health-signals/area-alerts?region=Kasarani&since=2026-09-22` | 200 | `[]` | Shape yes, but see bug 2 |
| `GET /health-signals/area-alerts?region=eastern-district&since=2026-09-22` | 200 | `[{"alertId":"alt-8812","region":"eastern-district","illnessType":"Cholera","severity":"high","detectedAt":"2026-08-13T10:00:00Z"}]` | No, see bug 1 |

## How the feature calls SafeMeds

```
Health Journal page  →  Maji server /api/health/...  →  SafeMeds API
```

The browser only calls Maji's server, so SafeMeds' address (and any future key) never reaches the browser.

| Maji route | Calls SafeMeds | Shown in section |
|---|---|---|
| `GET /api/health/alerts?estate=…` | `/health-signals/area-alerts?region=<estate>&since=<30 days ago>` | In your area |
| `GET /api/health/products` | `/products/water-purification?sort=rating` | Make it safe to drink |
| `GET /api/health/chlorine` | `/inventory?product=chlorine-tablets&available=true` | Where to find chlorine tablets |

Code: `server/routes/health.js` (server) and `src/Pages/customer/HealthJournal.jsx` (page).

## Bugs and surprises

| # | What broke (symptom) | Root cause | Fix | Whose code, and who fixed it |
|---|---|---|---|---|
| 1 | An alert from 13 Aug was returned when we asked for alerts since 22 Sep | SafeMeds ignores the `since` query parameter, although their contract says it filters by date | Maji's server now drops alerts older than `since` itself. Bug report to be sent to SafeMeds (below) | SafeMeds' code; worked around by Maji |
| 2 | Alerts for every Maji estate (e.g. `Kasarani`) come back empty | SafeMeds' regions are names like `eastern-district`; Maji uses estate names. Their contract doesn't say which region values are valid | Page wording changed from "No alerts" to "No alerts on record for Kasarani", so we don't claim an estate is safe. Region names to be agreed with SafeMeds | Contract ambiguity, both teams; wording fixed by Maji |
| 3 | Two different products share the same `productId` (100102): AquaClean drops and chlorine tablets | Data inconsistency in SafeMeds' demo data (their README says the hosted service uses demonstration records) | None needed on our side: we use `productId` only as a list key within one section. To report to SafeMeds | SafeMeds' data |
| 4 | Health Journal could never find the customer's estate | Maji's `GET /api/orders` did not return `customer_id`, so orders couldn't be matched to the logged-in customer. This also left Order History and Track Order empty for every customer | Added `orders.customer_id` to the query in `server/routes/orders.js` | Maji's code, fixed by Maji |
| 5 | Contract and README disagree on two paths: `openapi.yaml` lists `/vendors` and `/health-experts`, the README lists `/providers?type=…` | Documentation drift on SafeMeds' side | Not used by our feature, so no change. To mention to SafeMeds | SafeMeds' docs |

## Bug report for SafeMeds (bug 1)

> **What I did:** `GET /health-signals/area-alerts?region=eastern-district&since=2026-09-22` (no key needed)
> **What I expected:** 200 and only alerts detected on or after 2026-09-22 (your contract: `since`, format `date`)
> **What I got:** 200, including alert `alt-8812` with `detectedAt` `2026-08-13T10:00:00Z`
> **Evidence:** `[{"alertId":"alt-8812","region":"eastern-district","illnessType":"Cholera","severity":"high","detectedAt":"2026-08-13T10:00:00Z"}]`
> **When:** 22 Oct 2026, from our development machine

Status: [ ] sent to SafeMeds  [ ] SafeMeds replied: ___

## Failure handling (Part D)

If SafeMeds fails, Maji's server logs the reason and returns `502 {"message": "Partner data unavailable"}`. The page shows a message in that section only; the other sections and the rest of Maji keep working.

These were tested on purpose on 22 Oct 2026 during development. Because our build environment could not reach onrender.com, SafeMeds was replaced by a local stand-in returning the exact responses captured above.

| Test | What happened | Server log |
|---|---|---|
| Only SafeMeds' alerts endpoint returns 500 | "In your area" showed "Health alerts are unavailable right now"; products and chlorine sections still showed data | `SafeMeds alerts failed: SafeMeds returned 500` |
| SafeMeds completely down | All three sections showed their message; no crash or blank page. Maji's `/api/orders`, `/api/vendors` and `/api/vendors/locations` still returned 200 | `SafeMeds products failed: ECONNREFUSED` |
| SafeMeds back up | Data returned on a normal page reload; no restart or code change | none |
| `PARTNER_URL` pointed at a wrong hostname | Sections showed their message | `SafeMeds products failed: ENOTFOUND` |
| Maji's own server down | Every section showed a message, never a blank page | n/a |
| Customer with no orders yet | "Place an order so we can show health alerts for your estate" | none |

## Live demo in the lab

To fill in during the lab, against SafeMeds' real server:

- [ ] Page shows live SafeMeds data — time: ___
- [ ] SafeMeds stopped (or `PARTNER_URL` changed): fallback messages shown — time: ___
- [ ] SafeMeds restarted: data back without code changes — time: ___

## As a provider (downstream partner: SkillsBridge)

To fill in during the lab: anything SkillsBridge reported, what we found in our Render logs (401 / 404 / 429), and what we fixed.

| # | What they reported | Root cause | Fix | Whose code |
|---|---|---|---|---|
| | | | | |

Known before the lab:
- Our CORS only allows `http://localhost:5173`, so SkillsBridge should call us from their server, not their browser.

Update after Week 9:
- Our five partner endpoints (`/orders/active/estates`, `/orders/active/schedules`, `/vendors/top-rated`, `/vendors/locations`, `/vendors/all`) now require an API key sent in the `X-API-Key` header. A missing or wrong key returns 401.
- Each consumer has its own key. SkillsBridge's key was sent to them privately.
- Rate limit: 100 requests per minute per key. Above that, the API returns 429 with a `Retry-After` header.