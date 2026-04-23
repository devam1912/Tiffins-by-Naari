const express = require("express");
const {
  getNearbyTiffins,
  createProviderRequest,
  approveProvider,
  rejectProvider,

} = require("./tiffin.controller");
const { createOrUpdateMenu, submitForApproval, approveMenu, rejectMenu, getAllMenus, getMenuByProviderId, deleteMenu, deleteMenuItem } = require("./menu.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");
const { uploadImage } = require("./upload.controller");
const router = express.Router();

router.post("/register", protect, upload.single("fssaiCertificate"), createProviderRequest);
router.post("/menu", protect, authorize("provider"), createOrUpdateMenu);

router.get("/menu", getAllMenus);
router.get("/menu/:providerId", getMenuByProviderId);
router.patch("/menu/submit", protect, authorize("provider"), submitForApproval);
router.patch("/menu/:menuId/approve", protect, authorize("admin"), approveMenu);
router.patch("/menu/:menuId/reject", protect, authorize("admin"), rejectMenu);

// Delete a single item from a day's meal — must be before /:menuId to avoid param conflict
// body: { day, meal, itemId }
router.delete("/menu/item", protect, authorize("provider"), deleteMenuItem);

// Delete entire menu — provider deletes own | admin deletes by menuId
router.delete("/menu", protect, authorize("provider"), deleteMenu);
router.delete("/menu/:menuId", protect, authorize("admin"), deleteMenu);


router.patch("/approve/:providerId", protect, authorize("admin"), approveProvider);
router.patch("/reject/:providerId", protect, authorize("admin"), rejectProvider);
router.get("/nearby", getNearbyTiffins);

router.post("/upload-image", protect, authorize("provider"), upload.single("image"), uploadImage);
module.exports = router;
