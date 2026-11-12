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

## 4. Who still uses v1 (fill in after the partner has migrated)
[Part F: from your /stats or logs, how many calls to the old URL and which caller
labels. Could v1 be switched off today without breaking anyone?]

## 5. Receiving the SafeMeds notice (Part E)
[Write 1 or 2 sentences about how it felt to receive SafeMeds' notice, what it
said clearly, and what was missing.]

## 6. Reflection (150 to 250 words, in your own words)
[Answer the four questions from the handout: what was it like to receive a
breaking change on short notice, what the partner's notice did well and what was
missing, what you would change in your own notice, and one thing you would do
differently as the API owner next time. Be specific.]