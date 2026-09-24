const express =require("express");
const db=require("../db");
const router=express.Router();


router.get("/" ,async(req,res)=> {
    try{
        const [rows]= await db.query(
            `
            Select
              vendors.id,
              vendors.estate,
              vendors.is_verified,
              vendorS.business_name,  
              vendors.is_online,
              vendors.rating,
              vendors.created_at
            FROM vendors
            JOIN customers ON vendors.user_id =customers.id
            ORDER by vendors.created_at DESC
            `);
        res.json(rows);
    } catch(err) {
        console.error("Get all vendors error", err);
        res.json({message : "Failed to fetch orders"});
    }
});

router.patch("/:id/verify" ,async(req,res) =>{ 
    const vendorId=req.params.id;
    const {verify}=req.body;

    try {
        const[existing]= await db.query(
            "SELECT *FROM vendors WHERE id=?",
            [vendorId]
        );
        if (existing.length === 0) {
         return res.status(404).json({message:"Vendor not found"});
        } await db.query (
            "UPDATE vendors SET is_verified=? WHERE id=? ",
            [verify,vendorId]
        )
    } catch (err) {
        console.error("Update vendor statuses error : ",err);
        res.status(500).json({message : "Order failed to update"})
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

//station/business name and primary estate
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
module.exports=router;