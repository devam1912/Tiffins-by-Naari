const express = require("express");
const {
  getNearbyTiffins,
  createProviderRequest,
  approveProvider
} = require("./tiffin.controller");
const { createOrUpdateMenu, publishMenu } = require("./menu.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", protect, authorize("provider"), createProviderRequest);
router.post("/menu", protect, authorize("provider"), createOrUpdateMenu);

router.patch("/menu/publish", protect, authorize("provider"), publishMenu);

router.patch("/approve/:providerId", protect, authorize("admin"), approveProvider);
router.get("/nearby", getNearbyTiffins);

module.exports = router;
