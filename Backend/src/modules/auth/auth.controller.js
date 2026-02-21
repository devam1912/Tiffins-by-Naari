const User = require("../user/user.model");
const generateToken = require("../../utils/jwt");
const { sendEmail } = require("../../utils/notification.service");

// ================= REGISTER =================
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
// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
      return res.status(400).json({
        message: "Email or phone and password are required",
      });
    }

    // Build query
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
    if (!user.isVerified) {
     return res.status(403).json({ message: "Please verify OTP first" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


const generateOTP = () => Math.floor(100000 + Math.random()*900000).toString();

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
  user.otpExpiry < Date.now()
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


module.exports = { registerUser, loginUser, generateOTP, sendOTP, verifyOTP };
