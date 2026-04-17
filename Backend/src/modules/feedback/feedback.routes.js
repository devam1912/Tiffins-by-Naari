const express = require("express");
const router = express.Router();

const {
  addFeedback,
  getProviderFeedback,
  getAllFeedback,
} = require("./feedback.controller");

const { protect, authorize } = require("../../middlewares/auth.middleware");



router.get("/provider/:providerId", getProviderFeedback);


router.get("/", getAllFeedback);


router.post("/", protect, authorize("customer"), addFeedback);

module.exports = router;