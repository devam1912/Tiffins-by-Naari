const express = require("express");
const cors = require("cors");
const tiffinRoutes = require("./modules/tiffin/tiffin.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running" });
});
app.use("/api/tiffins", tiffinRoutes);
module.exports = app;
