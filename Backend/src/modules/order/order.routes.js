const express = require("express");
const { createOrder, getMyOrders, getOrderById, getTSPOrders, updateOrderStatus } = require("./order.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post("/", protect, createOrder);


// CUSTOMER
router.get("/my", protect, authorize("customer"), getMyOrders);
router.get("/tsp", protect, authorize("provider"), getTSPOrders);
router.get("/:id", protect, authorize("customer"), getOrderById);
router.patch("/tsp/:id/status", protect, authorize("provider"), updateOrderStatus);
module.exports = router;
