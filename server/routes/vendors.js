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
module.exports=router;