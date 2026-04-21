const express = require("express");
const { registerUser, loginUser, sendOTP, verifyOTP, updateProfile, getProfile } = require("./auth.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.patch("/update", protect, updateProfile);
router.get("/me", protect, getProfile);

module.exports = router;
