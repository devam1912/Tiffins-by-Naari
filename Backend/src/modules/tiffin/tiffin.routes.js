const express = require("express");
const {
  getNearbyTiffins,
  createProviderRequest,
  approveProvider,
} = require("./tiffin.controller");
const { createOrUpdateMenu, publishMenu } = require("./menu.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");
const { uploadImage } = require("./upload.controller");
const router = express.Router();

router.post("/register", protect, authorize("provider"), createProviderRequest);
router.post("/menu", protect, authorize("provider"), createOrUpdateMenu);

router.patch("/menu/publish", protect, authorize("provider"), publishMenu);

router.patch("/approve/:providerId", protect, authorize("admin"), approveProvider);
router.get("/nearby", getNearbyTiffins);
router.post("/upload-image", protect, authorize("provider"), upload.single("image"), uploadImage);
router.patch("/:providerId/publish", protect, publishMenu);
module.exports = router;
