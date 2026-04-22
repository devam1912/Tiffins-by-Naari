const Razorpay = require("razorpay");

let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log("Razorpay initialized successfully");
} else {
  console.warn("WARNING: RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set. Payment features will be unavailable.");
}

module.exports = razorpay;