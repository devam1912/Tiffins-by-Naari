const mongoose = require("mongoose");

const tiffinSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
    },

    pricePerMeal: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Geo index for nearby search
tiffinSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Tiffin", tiffinSchema);
