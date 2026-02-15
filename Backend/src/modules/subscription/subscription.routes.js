const express = require("express");
const { createSubscription } = require("./subscription.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const { cancelSubscription } = require("./subscription.controller");

const router = express.Router();

router.post("/", protect, authorize("customer"), createSubscription);
router.patch("/:subscriptionId/cancel", protect, cancelSubscription);

module.exports = router;
