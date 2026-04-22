const express = require("express");
<<<<<<< HEAD
const { registerUser, loginUser, sendOTP, verifyOTP, updateProfile, getMe } = require("./auth.controller");
=======
const { registerUser, loginUser, sendOTP, verifyOTP, updateProfile, getProfile } = require("./auth.controller");
>>>>>>> e64a4d2cf07645efe503643237541708e9a4380d
const { protect, authorize } = require("../../middlewares/auth.middleware");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.patch("/update", protect, updateProfile);
<<<<<<< HEAD
router.get("/me", protect, getMe);
=======
router.get("/me", protect, getProfile);
>>>>>>> e64a4d2cf07645efe503643237541708e9a4380d

module.exports = router;
