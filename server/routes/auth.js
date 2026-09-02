const express =require("express");
const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken");
const db=require("../db");
const router=express.Router();

//regsiter page
router.post("/register",async(req,res)=> {
    const{
      name,
      email,
      phone,
      password,
      role,
      businessName,
      dailyCapacity,
      estatesServed,
    }=req.body;
    if (!name || !email || !password || !role) {
     return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const[existing]=await db.query(
        "SELECT id FROM customers WHERE email=?",
        [email]
    );
    if(existing.length>0) {
        return res.status(400).json({message:"Email already registered"});
    }

    const hashedpassword = await bcrypt.hash(password,10);
    const [result] = await db.query(
        `INSERT INTO customers (name,email,password,phone,role)
        VALUES (?,?,?,?,?)`,
        [name,email,hashedpassword,phone,role]
    );

    const newId = result.insertId;
    if (role === "vendor") {
        await db.query(
            `INSERT INTO vendors
            (user_id, business_name, daily_capacity,estates_served)
            VALUES (?,?,?,?,?)`,
            [
                newId,
                businessName || null,
                dailyCapacity || null,
                estatesServed || null,
            ]
        );
    }
    const token=jwt.sign(
        {id:newId,role:role},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );

    res.status(201).json({
        token,
        user: {
            id:newId,
            name: name,
            email:email,
            role:role,
        }
    });
  } catch(err) {
    console.error ("Register error:",err);
    res.status(500).json({message:"Registration failed"});
  }
});

//login page
router.post("/login",async(req,res) => {
    const {email, password}=req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  try {
    const [rows] = await db.query(
      "SELECT * FROM customers WHERE email = ?",
      [email]
    );
  if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  const customers =rows[0];

  const passwordMatch =await bcrypt.compare(password, customers.password);
  if(!passwordMatch) {
    return res.status(401).json({message: "Invalid email or password"});
  }
  const token=jwt.sign(
    {id:customers.id, role:customers.role },
    process.env.JWT_SECRET,
    { expiresIn:"7d"}
  );

  res.json({
    token,
    user:{
        id:customers.id,
        name:customers.name,
        email:customers.email,
        role: customers.role,
    }
  });
 } catch(err) {
    console.error("Login error:",err);
    res.status(500).json({message:"Login failed"});
 }
});

module.exports = router;