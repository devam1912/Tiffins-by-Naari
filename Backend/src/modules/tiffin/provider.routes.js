const express = require("express");
const {
  updateProviderProfile,
  deactivateTSP,
  reactivateTSP,
} = require("./provider.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

const router = express.Router();

router.use(protect);
router.use(authorize("provider"));

router.patch("/profile", upload.single("fssaiCertificate"), updateProviderProfile);
router.patch("/deactivate", deactivateTSP);
router.patch("/reactivate", reactivateTSP);

module.exports = router;
