require("dotenv").config();
const express =require("express");
const cors =require("cors");
const authRoutes=require("./routes/auth");
const ordersRoutes=require("./routes/orders");
const vendorRoutes=require("./routes/vendors");
const app =express();

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/",(req,res) =>{
  res.json({message:"Maji API is running"});
});

app.use("/api/orders", ordersRoutes);
app.use("/api/vendors",vendorRoutes);
const PORT = process.env.PORT||3001;
app.listen(PORT,() =>{
    console.log(`Server running on http://localhost:${PORT}`);
});
