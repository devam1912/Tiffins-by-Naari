const express = require("express");
const { createSubscription } = require("./subscription.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const {cancelSubscription, pauseSubscription, getOrderReceipt, resumeSubscription, verifySubscriptionPayment, markMealReady, setVacationMode} = require("./subscription.controller");

const router = express.Router();


router.post("/", protect, authorize("customer"), createSubscription);
router.post("/verify-payment/:subscriptionId",protect,authorize("customer"),verifySubscriptionPayment);

router.get("/:id/receipt", protect,authorize("customer"),getOrderReceipt);

router.patch("/:subscriptionId/mark-meal-ready",protect,authorize("provider"),markMealReady);
router.patch("/:subscriptionId/cancel", protect, cancelSubscription);
router.patch("/:subscriptionId/pause", protect, pauseSubscription);
router.patch("/:subscriptionId/resume", protect, resumeSubscription);
router.patch("/:subscriptionId/vacation",protect,authorize("customer"),setVacationMode);

module.exports = router;
