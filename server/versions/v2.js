// v2: the new shape. Same data, different response.
// Only the endpoints that changed live here. Everything else falls through to v1
// (see router.use(v1) at the bottom), so a partner on v2 can call every endpoint.
const express = require("express");
const db = require("../db");
const v1 = require("../apis");

const router = express.Router();

// Same key check and rate limit as v1 (shared, so v1 + v2 together count as one allowance).
const partnerOnly = v1.partnerOnly;

// One place that turns a stored row into the v2 response shape.
const toV2 = (row) => ({
  estate: row.estate,
});

// GET /api/v2/orders/active/estates
// v1 returned a bare list:   [ { "estate": "Kasarani" } ]
// v2 wraps it:               { "data": [ { "estate": "Kasarani" } ], "count": 1 }
router.get("/orders/active/estates", partnerOnly, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT estate
      FROM orders
      WHERE status IN ('pending', 'accepted', 'on the way')
        AND estate IS NOT NULL
    `);

    res.status(200).json({ data: rows.map(toV2), count: rows.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch active estates" });
  }
});

// Endpoints that did not change: v2 serves the same answer as v1 (and no deprecation headers
// are added, because only the estates route in v1 is deprecated).
router.use(v1);

module.exports = router;