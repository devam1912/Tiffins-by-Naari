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
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);


mealSelectionSchema.index(
  { subscription: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("MealSelection", mealSelectionSchema);
