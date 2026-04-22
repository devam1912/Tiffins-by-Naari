const nodemailer = require("nodemailer");

// ── Twilio (optional — only init if real credentials are provided) ──
let twilioClient = null;
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;

if (
  TWILIO_SID &&
  TWILIO_TOKEN &&
  !TWILIO_SID.startsWith("AC_placeholder") &&
  TWILIO_SID !== "placeholder"
) {
  try {
    const twilio = require("twilio");
    twilioClient = twilio(TWILIO_SID, TWILIO_TOKEN);
    console.log("Twilio initialized.");
  } catch (e) {
    console.warn("Twilio init failed:", e.message);
  }
} else {
  console.warn("Twilio: placeholder credentials detected — SMS disabled.");
}

const sendSMS = async (to, message) => {
  if (!twilioClient || !to) {
    console.log("[SMS skipped] Message:", message);
    return;
  }
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to,
    });
    console.log("SMS sent to", to);
  } catch (err) {
    console.warn("SMS failed:", err.message);
  }
};

// ── Nodemailer (optional — only send if real credentials are provided) ──
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const emailEnabled =
  EMAIL_USER &&
  EMAIL_PASS &&
  EMAIL_USER !== "user@gmail.com" &&
  EMAIL_PASS !== "password";

let transporter = null;
if (emailEnabled) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
  console.log("Email (nodemailer) initialized.");
} else {
  console.warn("Email: placeholder credentials detected — email disabled.");
}

const sendEmail = async (to, subject, text) => {
  if (!transporter) {
    console.log(`[Email skipped] To: ${to} | Subject: ${subject}`);
    return; // Silently skip — do NOT throw
  }
  try {
    await transporter.sendMail({
      from: `"Tiffins by Naari" <${EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("Email sent to:", to);
  } catch (error) {
    // Log but never throw — email failure should not crash order creation
    console.error("Email error (non-fatal):", error.message);
  }
};

module.exports = { sendSMS, sendEmail };