const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    type: String, // URL of uploaded image
  },

  type: {
    type: String, // dal, sabzi, rice, bread, dessert
  },

  price: {
    type: Number,
    default: 0,
  },
});

const mealSchema = new mongoose.Schema({
  items: [menuItemSchema],

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
    isApproved: { 
      type: Boolean,
      default: false
    },
    submittedForApproval: {
      type: Boolean,
      default: false
    },
    rejectionRemark: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);
