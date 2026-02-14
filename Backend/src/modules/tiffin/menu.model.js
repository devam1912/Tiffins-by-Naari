const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  items: [String],
  price: {
    type: Number,
    required: true,
  },
});

const dailyMenuSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },

  lunch: mealSchema,
  dinner: mealSchema,
});

const menuSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    weekMenu: [dailyMenuSchema],

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);
