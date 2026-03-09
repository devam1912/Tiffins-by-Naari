const Cart = require("./cart.model");
const cron = require("node-cron");

// --- UTILS --- //
const isTimeValidForSlot = (timeSlot) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes / 60;

    if (timeSlot === "lunch") {
        // Lunch available till 15:00 (3:00 PM)
        if (currentTime >= 15) return false;
        return true;
    }

    if (timeSlot === "dinner") {
        // Dinner available from 19:00 (7:00 PM) to 22:30 (10:30 PM)
        if (currentTime < 19 || currentTime >= 22.5) return false;
        return true;
    }

    return false;
};

// --- CRON JOBS --- //
// 1. At 3:00 PM (15:00), clear all lunch carts
cron.schedule("0 15 * * *", async () => {
    try {
        await Cart.updateMany({ timeSlot: "lunch" }, { $set: { items: [], totalPrice: 0 } });
        console.log("CRON: Cleared all lunch carts at 3:00 PM");
    } catch (err) {
        console.error("Cron Error (Lunch Carts):", err);
    }
});

// 2. At 10:30 PM (22:30), clear all dinner carts
cron.schedule("30 22 * * *", async () => {
    try {
        await Cart.updateMany({ timeSlot: "dinner" }, { $set: { items: [], totalPrice: 0 } });
        console.log("CRON: Cleared all dinner carts at 10:30 PM");
    } catch (err) {
        console.error("Cron Error (Dinner Carts):", err);
    }
});

// --- CONTROLLERS --- //

// 🟢 Get User's Cart
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate("provider", "businessName");

        if (!cart) {
            return res.status(200).json({ items: [], totalPrice: 0 });
        }

        // Dynamic clean up if someone fetches an expired cart before cron does, or if cron was down
        if (cart.items.length > 0 && !isTimeValidForSlot(cart.timeSlot)) {
            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();
            return res.status(200).json(cart);
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🟢 Add item to Cart
const addItemToCart = async (req, res) => {
    try {
        const { providerId, timeSlot, item } = req.body;
        // item should be { name, price, quantity(optional), type(optional) }

        if (!providerId || !timeSlot || !item) {
            return res.status(400).json({ message: "providerId, timeSlot, and item details are required" });
        }

        if (!isTimeValidForSlot(timeSlot)) {
            return res.status(400).json({ message: `${timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)} items are not available at this time.` });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                provider: providerId,
                timeSlot: timeSlot,
                items: []
            });
        }

        // If provider or timeslot changes, start a fresh cart
        if (cart.provider?.toString() !== providerId || cart.timeSlot !== timeSlot) {
            cart.provider = providerId;
            cart.timeSlot = timeSlot;
            cart.items = [];
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(i => i.name === item.name);
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += (item.quantity || 1);
        } else {
            cart.items.push({
                name: item.name,
                price: item.price,
                type: item.type,
                quantity: item.quantity || 1
            });
        }

        cart.calculateTotal();
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🟢 Remove item from Cart
const removeItemFromCart = async (req, res) => {
    try {
        const { itemName } = req.body;

        if (!itemName) {
            return res.status(400).json({ message: "itemName is required" });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Dynamic clear if it's expired
        if (cart.items.length > 0 && !isTimeValidForSlot(cart.timeSlot)) {
            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();
            return res.status(400).json({ message: `Cart cleared because ${cart.timeSlot} ordering time passed.` });
        }

        const itemIndex = cart.items.findIndex(i => i.name === itemName);
        if (itemIndex > -1) {
            // Decrease quantity or remove completely
            if (cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity -= 1;
            } else {
                cart.items.splice(itemIndex, 1);
            }

            cart.calculateTotal();
            await cart.save();
        } else {
            return res.status(404).json({ message: "Item not in cart" });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🟢 Clear Cart completely
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();
        }
        res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addItemToCart,
    removeItemFromCart,
    clearCart
};
