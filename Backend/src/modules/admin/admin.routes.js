const express = require("express");
const {
  getAllUsers,
  getAllProviders,
  getAllOrders,
  getAdminStats,
} = require("./admin.controller");

const { protect, authorize } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/providers", protect, authorize("admin"), getAllProviders);
router.get("/orders", protect, authorize("admin"), getAllOrders);
router.get("/stats", protect, authorize("admin"), getAdminStats);

module.exports = router;
