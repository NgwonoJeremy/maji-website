require("dotenv").config();
const express =require("express");
const cors =require("cors");
const authRoutes=require("./routes/auth");

const app =express();
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.get("/",(req,res) =>{
  res.json({message:"Maji API is running"});
});

const PORT = process.env.PORT||3001;
app.listen(PORT,() =>{
    console.log(`Server running on http://localhost:${PORT}`);
});
