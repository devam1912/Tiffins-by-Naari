const User = require("../user/user.model");
const generateToken = require("../../utils/jwt");
const { sendEmail } = require("../../utils/notification.service");
const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  walletBalance: user.walletBalance || 0,
  address: user.address,
  isVerified: user.isVerified
});


const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!password || (!email && !phone)) {
      return res.status(400).json({
        message: "Email or phone and password are required",
      });
    }

    let query = [];
    if (email) query.push({ email });
    if (phone) query.push({ phone });

    const existingUser = await User.findOne({ $or: query });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      otp,
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
    });

    if (email) {
      await sendEmail(email, "OTP Verification", `Your OTP is ${otp}`);
    }

    res.status(201).json({
      message: "User registered. Please verify OTP.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
      return res.status(400).json({
        message: "Email or phone and password are required",
      });
    }


    let loginQuery = [];
    if (email) loginQuery.push({ email });
    if (phone) loginQuery.push({ phone });

    const user = await User.findOne({ $or: loginQuery });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.isVerified && user.role !== "admin") {
      return res.status(403).json({ message: "Please verify OTP first" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone required" });
    }

    let query = [];
    if (email) query.push({ email });
    if (phone) query.push({ phone });

    const user = await User.findOne({ $or: [{ email }, { phone }] });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    if (user.email) {
      await sendEmail(user.email, "OTP Verification", `Your OTP is ${otp}`);
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    if (!otp || (!email && !phone)) {
      return res.status(400).json({
        message: "Email/phone and OTP required",
      });
    }

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      !user.otp ||
      user.otp.toString() !== otp.toString() ||
      user.otpExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, address } = req.body;


    if (name !== undefined) user.name = name;
    if (address !== undefined) user.address = address;
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: formatUserResponse(user)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword; // pre-save hook will hash it
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sends OTP to user's email for password reset (no login required)
const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    const user = await User.findOne({ $or: [{ email }, { phone }] });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await user.save();

    if (user.email) {
      await sendEmail(
        user.email,
        "Password Reset OTP",
        `Hi ${user.name || "there"},

You requested to reset your password.

Your OTP is: ${otp}

This OTP is valid for 5 minutes. If you did not request this, please ignore this email.

Team Tiffins by Naari`
      );
    }

    res.status(200).json({ message: "Password reset OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verifies OTP and sets new password (no login required)
const resetPassword = async (req, res) => {
  try {
    const { email, phone, otp, newPassword } = req.body;

    if ((!email && !phone) || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email/phone, OTP, and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ $or: [{ email }, { phone }] });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      !user.otp ||
      user.otp.toString() !== otp.toString() ||
      user.otpExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword; // pre-save hook will hash it
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  generateOTP,
  sendOTP,
  verifyOTP,
  updateProfile,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
};
