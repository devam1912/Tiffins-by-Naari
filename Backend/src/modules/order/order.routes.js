const express = require("express");
const { createOrder, getMyOrders, getOrderById, getTSPOrders, updateOrderStatus, verifyOrderPayment, getOrderReceipt } = require("./order.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post("/", protect, createOrder);



router.get("/my", protect, authorize("customer"), getMyOrders);
router.get("/tsp", protect, authorize("provider"), getTSPOrders);
router.patch("/tsp/:id/status", protect, authorize("provider"), updateOrderStatus);
router.post("/verify-payment/:orderId", protect, authorize("customer"), verifyOrderPayment);
router.get("/:id/receipt", protect, authorize("customer"), getOrderReceipt); 
router.get("/:id", protect, authorize("customer"), getOrderById); 
module.exports = router;
