# Versioning notes: Maji API

## 1. The change
`GET /api/orders/active/estates` now has a v2 at `/api/v2/orders/active/estates`
that returns `{ "data": [ ... ], "count": N }` instead of a bare list.

## 2. Why it is worth a break
v1 returns a bare list, so there is nowhere to put anything except the items
themselves. Adding anything about the list as a whole (count, paging,
totals) can't be done without changing its shape. Wrapping the
list as `{ data, count }` now means we can add those later as non-breaking
fields, so SkillBridge only has to migrate once.

## 3. Prediction
The line in SkillBridge's code that will fail is: [FILL IN: file and line where
SkillBridge reads the response from `/api/orders/active/estates` and loops over
it, for example `response.json().map(...)` or `for (const e of body)`]. With v2
the body is an object, so that line gets `{ data, count }` instead of a list.
SkillBridge must read the list from `body.data`.

## 4. Who still uses v1
From our /stats on [date, time]: `GET /api/orders/active/estates` (old URL): [N] calls from [caller labels];
`GET /api/v1/orders/active/estates`: [N]; `GET /api/v2/orders/active/estates`: [N].
[SkillBridge is / is not still on v1.] [We could / could not switch v1 off today without breaking anyone, because ...]

## 5. Receiving the SafeMeds notice (Part E)
SafeMeds' notice was dated 12 Nov and said v1 of `/reviews` would stop on 13 Nov, which gave us only one day.
It was clear about what changes (the list is wrapped in `{ data, count }`), what stays the same, and why, and the
real before-and-after example let me test `/v2/reviews` by hand and compare it before touching any code. What was
missing in the copy we received was a set of migration steps, a timeline beyond the sunset date, and a contact for questions.

