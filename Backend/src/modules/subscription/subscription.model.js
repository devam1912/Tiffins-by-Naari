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
      enum: ["pending","active", "paused", "cancelled", "completed"],
      default: "pending",
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
    lastServedDate: Date,

    totalPrice: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },

    platformFee: {
      type: Number,
      default: 0,
    },

    providerEarning: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
    type: String,
    enum: ["pending", "partial", "paid"],
    default: "pending",
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,

  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
