const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// Routes
const authRoutes = require("./modules/auth/auth.routes");
const tiffinRoutes = require("./modules/tiffin/tiffin.routes");

app.use("/api/auth", authRoutes);
app.use("/api/tiffins", tiffinRoutes);

module.exports = app;
