const Order = require("./order.model");
const Provider = require("../tiffin/provider.model");
const Menu = require("../tiffin/menu.model");
const { deductCredit } = require("../user/wallet.service");


// ================= CUSTOMER: GET MY ORDERS =================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("provider", "businessName phone")
      .sort({ date: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CUSTOMER: GET SINGLE ORDER =================
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("provider", "businessName phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= TSP: GET ORDERS =================
const getTSPOrders = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const orders = await Order.find({ provider: provider._id })
      .populate("user", "name phone")
      .sort({ date: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= TSP: UPDATE ORDER STATUS =================
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const provider = await Provider.findOne({ user: req.user._id });

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.provider.toString() !== provider._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const createOrder = async (req, res) => {
  try {
    const { providerId, date, timeSlot, selectedItems } = req.body;

    const p1 = await Provider.findById(providerId);


    // ===== BASIC VALIDATION =====
    if (!providerId) {
      return res.status(400).json({ message: "Provider ID required" });
    }

    //TSP cannot accept orders when inactive
    if (!p1.isActive) {
      throw new Error("Provider currently unavailable");
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

module.exports = { 
  createOrder,
  getMyOrders,
  getOrderById,
  getTSPOrders,
  updateOrderStatus,
};
