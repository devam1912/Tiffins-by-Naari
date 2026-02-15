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
      enum: ["weekly", "monthly", "yearly"],
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
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "paused", "cancelled", "completed"],
      default: "active",
    },

    remainingMeals: {
      type: Number,
    },

    skippedDates: [
      {
        type: Date,
      },
    ],

    pauseStart: Date,
    pauseEnd: Date,

    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
