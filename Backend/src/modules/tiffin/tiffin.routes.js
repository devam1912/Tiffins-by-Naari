const express = require("express");
const {
  getNearbyTiffins,
  createProviderRequest,
  approveProvider,
  deactivateTSP,
  reactivateTSP,
} = require("./tiffin.controller");
const { createOrUpdateMenu, submitForApproval, approveMenu, rejectMenu } = require("./menu.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");
const { uploadImage } = require("./upload.controller");
const router = express.Router();

router.post("/register", protect, authorize("provider"), createProviderRequest);
router.post("/menu", protect, authorize("provider"), createOrUpdateMenu);


router.patch("/menu/submit", protect, authorize("provider"), submitForApproval);
router.patch("/menu/:menuId/approve",protect,authorize("admin"),approveMenu);
router.patch("/menu/:menuId/reject",protect,authorize("admin"),rejectMenu);


router.patch("/approve/:providerId", protect, authorize("admin"), approveProvider);
router.get("/nearby", getNearbyTiffins);
router.patch("/deactivate", protect, authorize("provider"), deactivateTSP);
router.patch("/reactivate", protect, authorize("provider"), reactivateTSP);

router.post("/upload-image", protect, authorize("provider"), upload.single("image"), uploadImage);
module.exports = router;
