const twilio = require("twilio");
const nodemailer = require("nodemailer");


const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to, message) => {
  try {
    if (!to) return;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to,
    });

    console.log("SMS sent to", to);
  } catch (err) {
    console.log("SMS failed (trial/mock):", message);
  }
};


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Tiffins by Naari" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Email error:", error.message);
    throw new Error("Email sending failed");
  }
};

module.exports = { sendSMS, sendEmail };