const express = require("express");
const {
  getNearbyTiffins,
  createProviderRequest,
  approveProvider,
  rejectProvider,
} = require("./tiffin.controller");
const { createOrUpdateMenu, submitForApproval, approveMenu, rejectMenu, getAllMenus } = require("./menu.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");
const { uploadImage } = require("./upload.controller");
const router = express.Router();

router.post("/register", protect, upload.single("fssaiCertificate"), createProviderRequest);
router.post("/menu", protect, authorize("provider"), createOrUpdateMenu);

router.get("/menu",protect,authorize("admin"),getAllMenus);
router.patch("/menu/submit", protect, authorize("provider"), submitForApproval);
router.patch("/menu/:menuId/approve",protect,authorize("admin"),approveMenu);
router.patch("/menu/:menuId/reject",protect,authorize("admin"),rejectMenu);


router.patch("/approve/:providerId", protect, authorize("admin"), approveProvider);
router.patch("/reject/:providerId", protect, authorize("admin"), rejectProvider);
router.get("/nearby", getNearbyTiffins);

router.post("/upload-image", protect, authorize("provider"), upload.single("image"), uploadImage);
module.exports = router;
