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
const subscriptionRoutes = require("./modules/subscription/subscription.routes");
const mealSelectionRoutes = require("./modules/subscription/mealSelection.routes");
const orderRoutes = require("./modules/order/order.routes");
const recommendationRoutes = require("./modules/recommendation/recommendation.routes");

app.use("/api/auth", authRoutes);
app.use("/api/tiffins", tiffinRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/meal-selection", mealSelectionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/recommendations", recommendationRoutes);
module.exports = app;
