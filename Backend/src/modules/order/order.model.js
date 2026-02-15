const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
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

    date: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      enum: ["lunch", "dinner"],
      required: true,
    },

    items: [
  {
    type: {
      name: { type: String, required: true },
      itemType: { type: String, default: "" },  // Renamed!
      price: { type: Number, default: 0 },
    },
    _id: false,
  },
],

    totalPrice: {
      type: Number,
      required: true,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["confirmed", "preparing", "ready", "completed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
