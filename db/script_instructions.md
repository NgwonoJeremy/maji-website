# Database setup — read this before pasting anything

Four files, always in this order: `01_schema.sql`, `02_customers.sql`,
`03_vendors.sql`, `04_orders.sql`. Paste each one into phpMyAdmin's **SQL**
tab, on your own database, and click Go.

Before you paste anything, work out which of the two groups below you're in.

---

## Group A — You don't have these tables yet

This is you if `SHOW TABLES;` doesn't show `customers`, `vendors`, and
`orders`, or if you're not sure your columns match the project's schema.

1. Open phpMyAdmin, select your database from the left sidebar. Confirm the
   name in the top-left matches what's in your `.env` file's `DB_NAME` —
   pasting into the wrong database won't error, it'll just silently put the
   data somewhere your app never looks.
2. Click the **SQL** tab.
3. Paste the full contents of `01_schema.sql`. Click Go. You should see
   "3 queries executed successfully" or similar, and `customers`, `vendors`,
   `orders` now appear under Tables.
4. Paste `02_customers.sql`. Click Go.
5. Paste `03_vendors.sql`. Click Go.
6. Paste `04_orders.sql`. Click Go.
7. Verify: run this in the SQL tab —
   ```sql
   SELECT COUNT(*) FROM customers;
   SELECT COUNT(*) FROM vendors;
   SELECT COUNT(*) FROM orders;
   ```
   Expect `100` customers (50 real customers + 50 vendor accounts, since
   vendors are stored in the same table), `50` vendors, `50` orders.

You're done. Skip Group B.

---

## Group B — You already have the tables set up

This is you if you've run this project before, or a teammate already walked
you through Group A on a previous day, and you're just pulling in new or
updated data.

**Step 1 — confirm your schema actually matches.**
Don't assume it does just because the table names are right. Run:
```sql
SHOW COLUMNS FROM customers;
SHOW COLUMNS FROM vendors;
SHOW COLUMNS FROM orders;
```
Compare what comes back against `01_schema.sql` in this folder, column by
column. If everything matches, move to Step 2.

If something's missing — say a column was added since you last set up —
paste `01_schema.sql` again anyway. It only creates tables that don't exist
yet (`CREATE TABLE IF NOT EXISTS`), so it won't touch or break tables you
already have. It just won't add a missing *column* to an existing table —
if that's the situation, ask whoever added the column for the one-line
`ALTER TABLE` statement that goes with it, rather than guessing.

**Step 2 — check whether you already have the seed data.**
```sql
SELECT COUNT(*) FROM vendors;
SELECT COUNT(*) FROM orders;
```

- **Both show `0`** → you have empty tables. Paste `02_customers.sql`,
  `03_vendors.sql`, `04_orders.sql`, in that order. Same as Group A steps
  4–7.
- **Both already show `50`** → you already have the seed data. Don't paste
  `03_vendors.sql` or `04_orders.sql` again — see the warning below for why.
  You can safely re-paste `02_customers.sql` if you want to double check
  it's current; it won't create duplicates.
- **Some other number, or one is `50` and the other is `0`** → something's
  partially done, possibly from an earlier interrupted paste. Post in the
  team channel with these two numbers before pasting anything else, rather
  than guessing which files still need to run.

---

## The one rule that matters most

**`03_vendors.sql` and `04_orders.sql` are only safe to paste once, ever,
per database.**

`01_schema.sql` and `02_customers.sql` are safe to paste as many times as
you want — nothing bad happens on a repeat. `03` and `04` are different:
pasting either one a second time creates duplicate rows, silently, with no
error to warn you. If you're ever unsure whether you already ran them, use
the row-count check in Step 2 above — don't just paste again "to be safe."