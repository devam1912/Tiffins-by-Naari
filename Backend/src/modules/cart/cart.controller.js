const Cart = require("./cart.model");
const cron = require("node-cron");


const getISTTime = () => {
    const now = new Date();
    const istStr = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const ist = new Date(istStr);
    return { hours: ist.getHours(), minutes: ist.getMinutes(), date: ist };
};

const isTimeValidForSlot = (timeSlot) => {
    const { hours, minutes } = getISTTime();
    const currentTime = hours + minutes / 60;

    if (timeSlot === "lunch") {
        // Lunch can be ordered until 5:00 PM (17:00)
        if (currentTime >= 17) return false;
        return true;
    }

    if (timeSlot === "dinner") {
        
        if (currentTime < 19 || currentTime >= 22.5) return false;
        return true;
    }

    return false;
};



cron.schedule("0 17 * * *", async () => {
    try {
        await Cart.updateMany({ timeSlot: "lunch" }, { $set: { items: [], totalPrice: 0 } });
        console.log("CRON: Cleared all lunch carts at 5:00 PM IST");
    } catch (err) {
        console.error("Cron Error (Lunch Carts):", err);
    }
}, { timezone: "Asia/Kolkata" });


cron.schedule("30 22 * * *", async () => {
    try {
        await Cart.updateMany({ timeSlot: "dinner" }, { $set: { items: [], totalPrice: 0 } });
        console.log("CRON: Cleared all dinner carts at 10:30 PM IST");
    } catch (err) {
        console.error("Cron Error (Dinner Carts):", err);
    }
}, { timezone: "Asia/Kolkata" });




const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate({ path: 'items.provider', select: 'businessName' });

        if (!cart) {
            return res.status(200).json({ items: [], totalPrice: 0 });
        }

        
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


const addItemToCart = async (req, res) => {
    try {
        const { providerId, timeSlot, item } = req.body;
        

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
                timeSlot: timeSlot,
                items: []
            });
        }

        
        
        if (cart.timeSlot !== timeSlot) {
            cart.timeSlot = timeSlot;
            cart.items = [];
        }

        
        const existingItemIndex = cart.items.findIndex(
            i => i.name === item.name && i.provider.toString() === providerId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += (item.quantity || 1);
        } else {
            cart.items.push({
                provider: providerId,
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


const removeItemFromCart = async (req, res) => {
    try {
        const { itemName, providerId } = req.body;

        if (!itemName) {
            return res.status(400).json({ message: "itemName is required" });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        
        if (cart.items.length > 0 && !isTimeValidForSlot(cart.timeSlot)) {
            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();
            return res.status(400).json({ message: `Cart cleared because ${cart.timeSlot} ordering time passed.` });
        }

        let itemIndex = -1;
        
        if (providerId) {
            itemIndex = cart.items.findIndex(i => i.name === itemName && i.provider.toString() === providerId);
        } else {
            itemIndex = cart.items.findIndex(i => i.name === itemName);
        }

        if (itemIndex > -1) {
            
            if (cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity -= 1;
            } else {
                cart.items.splice(itemIndex, 1);
            }

            cart.calculateTotal();
            await cart.save();
        } else {
            return res.status(404).json({ message: "Item not in cart or already expired" });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


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
