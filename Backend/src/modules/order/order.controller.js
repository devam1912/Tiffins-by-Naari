const Order = require("./order.model");
const User = require("../user/user.model");
const Provider = require("../tiffin/provider.model");
const Cart = require("../cart/cart.model");
const { deductCredit } = require("../user/wallet.service");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { sendEmail } = require("../../utils/notification.service");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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
    // order completion notification through mail
    if (order.status === "completed") {
      const user = await User.findById(order.user);

      if (user.email) {
        await sendEmail(
          user.email,
          "Order Status Update",
          `Your order for ${order.timeSlot} on ${order.date.toDateString()} is now ${order.status}.`
        );
      }
    }

    res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// create order from cart — cart must be populated before calling this
const createOrder = async (req, res) => {
  try {
    const { providerId, date, timeSlot } = req.body;

    // ===== BASIC VALIDATION =====
    if (!providerId) {
      return res.status(400).json({ message: "Provider ID required" });
    }

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    if (!["lunch", "dinner"].includes(timeSlot)) {
      return res.status(400).json({ message: "Invalid time slot" });
    }

    const orderDate = new Date(date);
    if (isNaN(orderDate)) {
      return res.status(400).json({ message: "Invalid date" });
    }

    // ===== CHECK PROVIDER =====
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    if (!provider.isApproved || !provider.isActive) {
      return res.status(400).json({ message: "Provider currently unavailable" });
    }

    // ===== TIME VALIDATION FOR ORDERING =====
    const now = new Date();
    const currentHours = now.getHours() + now.getMinutes() / 60;
    const isToday = new Date().toDateString() === orderDate.toDateString();

    if (isToday) {
      if (timeSlot === "lunch" && currentHours >= 15) {
        return res.status(400).json({ message: "Lunch orders can only be placed before 3:00 PM today." });
      }

      if (timeSlot === "dinner" && (currentHours < 19 || currentHours >= 22.5)) {
        return res.status(400).json({ message: "Dinner orders can only be placed between 7:00 PM and 10:30 PM today." });
      }
    }

    // ===== FETCH CART — PRIMARY SOURCE OF ITEMS =====
    const cart = await Cart.findOne({ user: req.user._id, provider: providerId, timeSlot });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty. Please add items before placing an order." });
    }

    // Build order items directly from cart
    const orderItems = cart.items.map((cartItem) => ({
      name: cartItem.name,
      itemType: cartItem.type || "",
      price: cartItem.price || 0,
      quantity: cartItem.quantity || 1,
    }));

    const totalPrice = cart.totalPrice;

    // ===== WALLET =====
    const walletResult = await deductCredit(req.user._id, totalPrice);
    const walletUsed = walletResult.deducted;
    const remainingToPay = walletResult.remainingToPay;

    // 🟢 CASE 1 — FULL WALLET PAYMENT
    if (remainingToPay === 0) {
      const order = await Order.create({
        user: req.user._id,
        provider: providerId,
        date: orderDate,
        timeSlot,
        items: orderItems,
        totalPrice,
        amountPaid: totalPrice,
        paymentStatus: "paid",
        status: "confirmed",
      });

      // Clear cart after successful order
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();

      return res.status(201).json({
        message: "Order placed using wallet",
        order,
      });
    }

    // 🟡 CASE 2 — PARTIAL / FULL RAZORPAY NEEDED
    const razorpayOrder = await razorpay.orders.create({
      amount: remainingToPay * 100, // ₹ → paise
      currency: "INR",
      receipt: `ord_${Date.now()}`,
    });

    const order = await Order.create({
      user: req.user._id,
      provider: providerId,
      date: orderDate,
      timeSlot,
      items: orderItems,
      totalPrice,
      amountPaid: walletUsed,
      paymentStatus: walletUsed > 0 ? "partial" : "pending",
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
    });

    // Clear cart — items are now captured in the pending order
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(201).json({
      message: "Razorpay payment required",
      order,
      razorpayOrderId: razorpayOrder.id,
      amountToPay: remainingToPay,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// razorpay payment confirmationn
const verifyOrderPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { razorpay_payment_id, razorpay_signature } = req.body;

    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("provider", "businessName");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // TEST MODE BYPASS (Thunder testing)
    if (process.env.NODE_ENV === "test") {
      order.razorpayPaymentId = razorpay_payment_id;
      order.paymentStatus = "paid";
      order.amountPaid = order.totalPrice;
      order.status = "confirmed";

      await order.save();

      await sendReceiptEmail(order);

      return res.status(200).json({
        message: "Order payment successful (test mode)",
        order,
      });
    }

    // 🔐 REAL SIGNATURE VERIFICATION BELOW
    const body = order.razorpayOrderId + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentStatus = "paid";
    order.amountPaid = order.totalPrice;
    order.status = "confirmed";

    await order.save();

    await sendReceiptEmail(order);

    res.status(200).json({
      message: "Order payment successful",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getOrderReceipt = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("user", "name email")
      .populate("provider", "businessName");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const receipt = {
      receiptId: `ORD-${order._id.toString().slice(-6)}`,
      customer: order.user.name,
      provider: order.provider.businessName,
      date: order.date,
      timeSlot: order.timeSlot,
      total: order.totalPrice,
      paid: order.amountPaid,
      status: order.status,
    };

    res.json(receipt);
  } catch (error) {
    console.error("Receipt Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const sendReceiptEmail = async (order) => {
  if (!order.user?.email) return;

  const receiptId = `ORD-${order._id.toString().slice(-6)}`;

  await sendEmail(
    order.user.email,
    "Your Order Receipt",
    `
Hello ${order.user.name},

Thank you for your order!

Here are your receipt details:

Receipt ID: ${receiptId}
Provider: ${order.provider.businessName}
Date: ${order.date}
Time Slot: ${order.timeSlot}

Amount Paid: ₹${order.amountPaid}
Payment Status: ${order.paymentStatus}
Order Status: ${order.status}

Your delicious tiffin will be delivered on time 🍱

Thank you for choosing us ❤️
    `
  );
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getTSPOrders,
  updateOrderStatus,
  verifyOrderPayment,
  getOrderReceipt,
};
