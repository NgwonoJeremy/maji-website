const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const ordersRoutes = require("./routes/orders");
const vendorRoutes = require("./routes/vendors");
const apiRoutes = require("./apis");
const healthRoutes = require("./routes/health");
const v2Routes = require("./versions/v2");

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
app.use("/api/health", healthRoutes);
app.use("/api/v2", v2Routes);
app.use("/api/v1", apiRoutes);
app.use("/api", apiRoutes);

module.exports = app;
