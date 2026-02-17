const User = require("../user/user.model");
const generateToken = require("../../utils/jwt");

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!password || (!email && !phone)) {
      return res.status(400).json({
        message: "Email or phone and password are required",
      });
    }

    // Build query safely (avoid undefined values)
    let query = [];
    if (email) query.push({ email });
    if (phone) query.push({ phone });

    const existingUser = await User.findOne({
      $or: query,
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      isVerified: true, // OTP will be added later
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

  if (!user.isVerified) {
  return res.status(403).json({ message: "Please verify OTP first" });
  }


    if (!password || (!email && !phone)) {
      return res.status(400).json({
        message: "Email or phone and password are required",
      });
    }

    // Safe dynamic query
    let loginQuery = [];
    if (email) loginQuery.push({ email });
    if (phone) loginQuery.push({ phone });

    const user = await User.findOne({
      $or: loginQuery,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const generateOTP = () => Math.floor(100000 + Math.random()*900000).toString();

const sendOTP = async (req, res) => {
  try{
    const {email , phone }= req.body;
    if(!email && !phone){
      return res.status(400).json({message: "Email or Phone required"});
    }
    const user = await User.findOne({
      $or: [{email},{phone}],
    });
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    const otp=generateOTP();
    user.otp=otp;
    user.otpExpiry = Date.now()+5*60*1000;
    await User.save();

    console.log("OTP (demo) : ",otp);
    res.status(200).json({message: "OTP sent (demo Mode)"});
  }
  catch(error){
    res.status(500).json({message: error.message});
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
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
