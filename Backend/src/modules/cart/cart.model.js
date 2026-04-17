const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Provider",
        required: true,
    },
    name: { type: String, required: true },
    type: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        timeSlot: {
            type: String,
            enum: ["lunch", "dinner"],
            required: true,
        },
        items: [cartItemSchema],
        totalPrice: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);


cartSchema.methods.calculateTotal = function () {
    this.totalPrice = this.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
};

module.exports = mongoose.model("Cart", cartSchema);
