const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    fssaiNumber: {
      type: String,
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    profileCompleted: {
      type: Boolean,
      default: true,
    },

    cuisineType: {
      type: String,
    },

    pricingModel: {
      type: String,
      enum: ["per_meal", "subscription"],
    },

    deliverySlots: {
      type: [String], // lunch, dinner
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    fssaiCertificate: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    rejectReason: String,
  },
  { timestamps: true }
);

providerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Provider", providerSchema);
