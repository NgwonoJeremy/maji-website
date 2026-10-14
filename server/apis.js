const express = require("express");
const db = require("./db");

const router = express.Router();
//SkillBridge api
//api to get estates with active orders.
router.get("/active/estates", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT DISTINCT estate
            FROM orders
            WHERE status IN ('pending', 'accepted', 'on the way')
              AND estate IS NOT NULL
        `);

        const result = rows.map(row => ({
            estate: row.estate
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch active estates"
        });
    }
});

//api to get estates with their delivery hours
router.get("/active/schedules", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT DISTINCT
                estate,
                delivery_time AS deliveryTime
            FROM orders
            WHERE status IN ('pending', 'accepted', 'on the way')
              AND estate IS NOT NULL
              AND delivery_time IS NOT NULL
        `);

        const result = rows.map(row => ({
            estate: row.estate,
            deliveryTime: row.deliveryTime
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch active delivery schedules"
        });
    }
});

//api to get the top rated vendor per estate
router.get("/top-rated", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                v.id AS vendorId,
                v.business_name AS businessName,
                v.estate,
                v.rating,
                v.is_verified AS isVerified,
                v.is_online AS isOnline,
                c.name AS ownerName,
                c.phone
            FROM vendors v
            JOIN customers c
                ON v.user_id = c.id
            WHERE v.is_verified = 1
              AND v.rating = (
                  SELECT MAX(v2.rating)
                  FROM vendors v2
                  WHERE v2.estate = v.estate
                    AND v2.is_verified = 1
              )
            ORDER BY v.estate, v.rating DESC
        `);

        const result = rows.map(row => ({
            vendorId: row.vendorId,
            businessName: row.businessName,
            estate: row.estate,
            rating: Number(row.rating),
            isVerified: Boolean(row.isVerified),
            isOnline: Boolean(row.isOnline),
            ownerName: row.ownerName,
            phone: row.phone
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch top-rated vendors"
        });
    }
});

//api to get station/business name and primary estate
router.get("/locations", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                v.id AS vendorId,
                v.business_name AS businessName,
                v.estate
            FROM vendors v
        `);

        const result = rows.map(row => ({
            vendorId: row.vendorId,
            businessName: row.businessName,
            estate: row.estate
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch vendor locations"
        });
    }
});

//Maji APIS
//CREATE A NEW ORDER

router.post("/orders", async (req, res) => {

    try {

        const {
            customerId,
            vendorId,
            estate,
            volume,
            deliveryTime,
            paymentMethod
        } = req.body;

        if (!customerId || !estate || !volume || !deliveryTime) {

            return res.status(400).json({
                message: "Missing required fields"
            });

        }

        const [result] = await db.query(
            `INSERT INTO orders
            (customer_id, vendor_id, estate, volume, delivery_time,
             payment_method, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                customerId,
                vendorId || null,
                estate,
                volume,
                deliveryTime,
                paymentMethod || null,
                "pending"
            ]
        );

        const [rows] = await db.query(
            `SELECT
                id AS orderId,
                customer_id AS customerId,
                vendor_id AS vendorId,
                estate,
                volume,
                delivery_time AS deliveryTime,
                payment_method AS paymentMethod,
                status
             FROM orders
             WHERE id = ?`,
            [result.insertId]
        );

        res.status(201).json(rows[0]);

    } catch (error) {

        console.error("Create order error:", error);

        res.status(500).json({
            message: "Failed to create order"
        });

    }

});

//Updates customer information in the Maji platform.

router.put("/customers/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const { name, email, phone, estate } = req.body;

        if (!name || !email || !phone) {

            return res.status(400).json({
                message: "Name, email and phone are required"
            });

        }

        const [existing] = await db.query(
            "SELECT id FROM customers WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {

            return res.status(404).json({
                message: "Customer not found"
            });

        }

        await db.query(
            `UPDATE customers
             SET name = ?, email = ?, phone = ?, estate = ?
             WHERE id = ?`,
            [name, email, phone, estate || null, id]
        );

        const [rows] = await db.query(
            `SELECT id, name, email, phone, role, estate
             FROM customers
             WHERE id = ?`,
            [id]
        );

        res.status(200).json(rows[0]);

    } catch (error) {

        console.error("Update customer error:", error);

        res.status(500).json({
            message: "Failed to update customer"
        });

    }

});

//Updates vendor-specific information.
// Some Vendor infos are stored separately from customer/account information. They linked to the customer account through `user_id`.

router.put("/vendors/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            businessName,
            dailyCapacity,
            estatesServed,
            estate,
            isOnline
        } = req.body;

        if (!businessName || !estate) {

            return res.status(400).json({
                message: "Business name and estate are required"
            });

        }

        const [existing] = await db.query(
            "SELECT id FROM vendors WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {

            return res.status(404).json({
                message: "Vendor not found"
            });

        }

        await db.query(
            `UPDATE vendors
             SET business_name = ?,
                 daily_capacity = ?,
                 estates_served = ?,
                 estate = ?,
                 is_online = ?
             WHERE id = ?`,
            [
                businessName,
                dailyCapacity || null,
                estatesServed || null,
                estate,
                isOnline ?? false,
                id
            ]
        );

        const [rows] = await db.query(
            `SELECT
                id AS vendorId,
                business_name AS businessName,
                daily_capacity AS dailyCapacity,
                estates_served AS estatesServed,
                estate,
                is_online AS isOnline
             FROM vendors
             WHERE id = ?`,
            [id]
        );

        res.status(200).json(rows[0]);

    } catch (error) {

        console.error("Update vendor error:", error);

        res.status(500).json({
            message: "Failed to update vendor"
        });

    }

});

// Removes a vendor from the Maji.

router.delete("/vendors/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const [existing] = await db.query(
            "SELECT id FROM vendors WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {

            return res.status(404).json({
                message: "Vendor not found"
            });

        }

        await db.query(
            "DELETE FROM vendors WHERE id = ?",
            [id]
        );

        res.status(204).send();

    } catch (error) {

        console.error("Delete vendor error:", error);

        res.status(500).json({
            message: "Failed to delete vendor"
        });

    }

});

module.exports = router;