const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const ordersRoutes = require("./routes/orders");
const vendorRoutes = require("./routes/vendors");
<<<<<<< HEAD
const apiRoutes=require("./apis");
=======
const apisRoutes = require("./apis");
>>>>>>> 5af3c363e959f62f856e5840e1d3e42cbc533cc2

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Maji API is running" });
});

app.use("/api/orders", ordersRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api", apiRoutes);

module.exports = app;