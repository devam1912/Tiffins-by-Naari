const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../../middlewares/auth.middleware");

const {
  getAllPayoutBalances,
  processPayout,
  creditProviderWallet,
  getProviderPayoutHistory,
  getMyPayoutHistory
} = require("./payout.controller");


router.get("/balances", protect, authorize("admin"), getAllPayoutBalances);
router.post("/debit/:providerId", protect, authorize("admin"), processPayout);
router.post("/credit/:providerId", protect, authorize("admin"), creditProviderWallet);
router.get("/history/:providerId", protect, authorize("admin"), getProviderPayoutHistory);


router.get("/my-history", protect, authorize("provider"), getMyPayoutHistory);

module.exports = router;
