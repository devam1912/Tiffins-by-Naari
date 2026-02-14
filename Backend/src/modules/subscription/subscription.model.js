const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    planType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },

    timeSlot: {
      type: String,
      enum: ["lunch", "dinner"],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    isPaused: {
      type: Boolean,
      default: false,
    },

    pauseStart: Date,
    pauseEnd: Date,

    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
