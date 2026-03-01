const express = require("express");
const router = express.Router();

const {
  addFeedback,
  getProviderFeedback,
  getAllFeedback,
} = require("./feedback.controller");

const { protect, authorize } = require("../../middlewares/auth.middleware");


// Public — anyone can see feedback of a provider
router.get("/provider/:providerId", getProviderFeedback);

// Public get all feedback 
router.get("/", getAllFeedback);

//logged-in users can add feedback
router.post("/", protect, authorize("customer"), addFeedback);

module.exports = router;