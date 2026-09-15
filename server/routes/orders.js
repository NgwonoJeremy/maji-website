const express = require("express");
const db      = require("../db");
const router  = express.Router();


router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        orders.id,
        orders.estate,
        orders.volume,
        orders.delivery_time,
        orders.total_amount,
        orders.payment_method,
        orders.status,
        orders.created_at,
        customers.name  AS customer_name,
        customers.phone AS customer_phone
      FROM orders
      JOIN customers ON orders.customer_id = customers.id
      ORDER BY orders.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Get one order error:", err);
    res.status(500).json({ message: "Failed to get order" });
  }
});


router.post("/", async (req, res) => {
  const {
    customerId,
    vendorId,
    estate,
    volume,
    deliveryTime,
    totalAmount,
    paymentMethod
  } = req.body;

  if (!customerId || !estate || !volume || !deliveryTime || !paymentMethod) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (volume <= 0) {
    return res.status(400).json({ message: "Volume must be greater than 0" });
  }

  const validPayments = ["mpesa", "cash"];
  if (!validPayments.includes(paymentMethod.toLowerCase())) {
    return res.status(400).json({ message: "Payment method must be mpesa or cash" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO orders
        (customer_id, vendor_id, estate, volume,
         delivery_time, total_amount, payment_method, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [customerId, vendorId, estate, volume,
       deliveryTime, totalAmount, paymentMethod]
    );

    const [rows] = await db.query(
      "SELECT * FROM orders WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "Order placed successfully",
      order:   rows[0],
    });

  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
});


router.patch("/:id/status", async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "accepted",
    "on the way",
    "delivered",
    "cancelled"
  ];

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({
      message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
    });
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM orders WHERE id = ?",
      [orderId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    await db.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status.toLowerCase(), orderId]
    );

    const [rows] = await db.query(
      "SELECT * FROM orders WHERE id = ?",
      [orderId]
    );

    res.json({
      message: "Order status updated",
      order:   rows[0],
    });

  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});


module.exports = router;