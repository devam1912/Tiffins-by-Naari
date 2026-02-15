const Order = require("./order.model");
const Provider = require("../tiffin/provider.model");
const Menu = require("../tiffin/menu.model");
const { deductCredit } = require("../user/wallet.service");

const createOrder = async (req, res) => {
  try {
    const { providerId, date, timeSlot, selectedItems } = req.body;

    // ===== BASIC VALIDATION =====
    if (!providerId) {
      return res.status(400).json({ message: "Provider ID required" });
    }

    if (!["lunch", "dinner"].includes(timeSlot)) {
      return res.status(400).json({ message: "Invalid time slot" });
    }

    const orderDate = new Date(date);
    if (isNaN(orderDate)) {
      return res.status(400).json({ message: "Invalid date" });
    }

    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
      return res.status(400).json({ message: "No items selected" });
    }

    // ===== CHECK PROVIDER =====
    const provider = await Provider.findById(providerId);
    if (!provider || !provider.isApproved || !provider.isActive) {
      return res.status(400).json({ message: "Provider not available" });
    }

    // ===== GET MENU =====
    const menu = await Menu.findOne({
      provider: providerId,
      isPublished: true,
    });

    if (!menu || menu.weekMenu.length === 0) {
      return res.status(400).json({ message: "Menu not available" });
    }

    const firstDay = menu.weekMenu[0];
    const slot = firstDay[timeSlot];

    if (!slot || typeof slot.price !== "number") {
      return res.status(400).json({ message: "Meal price not configured" });
    }

    const baseMealPrice = slot.price;

    // ===== VALIDATE ITEMS AGAINST MENU =====
    const availableItems = slot.items.map(i => i.name);

    const validatedItems = [];

    for (const item of selectedItems) {
      if (!availableItems.includes(item.name)) {
        return res.status(400).json({
          message: `Item ${item.name} not available`,
        });
      }

      validatedItems.push({
        name: item.name,
        type: item.type || "",
        price: 0, // pricing controlled by slot
      });
    }

    const totalPrice = baseMealPrice;

    // ===== WALLET =====
    const walletResult = await deductCredit(req.user._id, totalPrice);
    const amountPaid = totalPrice - walletResult.remainingToPay;

    // ===== CREATE ORDER =====
    const order = await Order.create({
      user: req.user._id,
      provider: providerId,
      date: orderDate,
      timeSlot,
      items: validatedItems, // IMPORTANT: raw array, NOT string
      totalPrice,
      amountPaid,
    });

    return res.status(201).json({
      message: "Order placed successfully",
      walletUsed: walletResult.deducted,
      remainingToPay: walletResult.remainingToPay,
      order,
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder };
