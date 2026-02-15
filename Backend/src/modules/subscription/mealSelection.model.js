const mongoose = require("mongoose");

const mealSelectionSchema = new mongoose.Schema(
  {
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    selectedItems: [
      {
        name: String,
        type: String,
      },
    ],
  },
  { timestamps: true }
);

// Prevent duplicate selection for same date
mealSelectionSchema.index(
  { subscription: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("MealSelection", mealSelectionSchema);
