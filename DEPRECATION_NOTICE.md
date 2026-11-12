# Deprecation notice: Maji API, active estates (v1)
To: SkillBridge          From: Marie Mumbu (Maji, Team 4)        Date: 12 November 2026

## Summary
v1 of `GET /api/orders/active/estates` is deprecated. v2 is live now. v1 will
stop working on **13 November 2026**. Please move before then.

## What is changing
- The list is wrapped: `[ ... ]` becomes `{ "data": [ ... ], "count": N }`
- Nothing else changes: the field name `estate`, your API key, the rate limit,
  and every other Maji endpoint (schedules, vendors) keep working exactly as now.

## Why
Wrapping the list lets us add paging and totals later without another breaking
change for you.

## Before and after
v1   `GET /api/orders/active/estates`

    [ { "estate": "Kasarani" }, { "estate": "Roysambu" } ]

v2   `GET /api/v2/orders/active/estates`

    { "data": [ { "estate": "Kasarani" }, { "estate": "Roysambu" } ],
      "count": 2 }

## How to migrate
1. Call `/api/v2/orders/active/estates` instead of `/api/orders/active/estates`.
   Same key (`X-API-Key`), same rate limit.
2. Read the list from `body.data` instead of from the body itself.
3. Test it, then tell me, so I can see your calls to the v2 URL in our logs.

## Timeline
- Today (12 Nov 2026): v2 is live. v1 still works and now sends `Deprecation`,
  `Sunset` and `Link` headers on every response.
- 13 Nov 2026: v1 of this endpoint stops working.

## Questions
Message me any time. I will reply within [FILL IN: for example 1 hour].