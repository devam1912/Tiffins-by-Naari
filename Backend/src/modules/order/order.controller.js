const Order = require("./order.model");
const User = require("../user/user.model");
const Provider = require("../tiffin/provider.model");
const Cart = require("../cart/cart.model");
const { deductCredit } = require("../user/wallet.service");
const { creditProviderAfterPayment } = require("../payout/payout.service");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { sendEmail } = require("../../utils/notification.service");

let razorpay = null;
function getRazorpay() {
  if (!razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
}


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



const createOrder = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const orderDate = new Date(date);
    if (isNaN(orderDate)) {
      return res.status(400).json({ message: "Invalid date" });
    }

    
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty. Please add items before placing an order." });
    }

    
    const groupedOrders = {};
    let totalCartPrice = 0;

    const now = new Date();
    const currentHours = now.getHours() + now.getMinutes() / 60;
    const isToday = new Date().toDateString() === orderDate.toDateString();

    const sharedTimeSlot = cart.timeSlot;

    
    if (isToday) {
      if (sharedTimeSlot === "lunch" && currentHours >= 15) {
        return res.status(400).json({ message: "Lunch orders can only be placed before 3:00 PM today." });
      }

      if (sharedTimeSlot === "dinner" && (currentHours < 19 || currentHours >= 22.5)) {
        return res.status(400).json({ message: "Dinner orders can only be placed between 7:00 PM and 10:30 PM today." });
      }
    }

    for (const item of cart.items) {
      const pIdStr = item.provider.toString();

      if (!groupedOrders[pIdStr]) {
        const provider = await Provider.findById(item.provider);
        if (!provider || !provider.isApproved || !provider.isActive) {
          return res.status(400).json({ message: `Provider ${provider?.businessName || 'Unknown'} is currently unavailable` });
        }

        groupedOrders[pIdStr] = {
          providerId: item.provider,
          timeSlot: sharedTimeSlot,
          items: [],
          totalPrice: 0
        };
      }

      const itemPrice = item.price * item.quantity;
      groupedOrders[pIdStr].items.push({
        name: item.name,
        itemType: item.type || "",
        price: item.price || 0,
        quantity: item.quantity || 1,
      });
      groupedOrders[pIdStr].totalPrice += itemPrice;
      totalCartPrice += itemPrice;
    }

    // ===== WALLET =====
    const walletResult = await deductCredit(req.user._id, totalCartPrice);
    const walletUsed = walletResult.deducted;
    const remainingToPay = walletResult.remainingToPay;

    const createdOrders = [];

    // 🟢 CASE 1 — FULL WALLET PAYMENT
    if (remainingToPay === 0) {
      for (const key in groupedOrders) {
        const orderGroup = groupedOrders[key];
        const { platformFee, providerEarning } = await creditProviderAfterPayment(
          orderGroup.providerId,
          orderGroup.totalPrice,
          `Order (wallet) for ${orderGroup.timeSlot} on ${orderDate.toDateString()}`
        );

        const order = await Order.create({
          user: req.user._id,
          provider: orderGroup.providerId,
          date: orderDate,
          timeSlot: orderGroup.timeSlot,
          items: orderGroup.items,
          totalPrice: orderGroup.totalPrice,
          amountPaid: orderGroup.totalPrice, // Full wallet covered it
          platformFee,
          providerEarning,
          paymentStatus: "paid",
          status: "confirmed",
        });
        createdOrders.push(order);
      }

      
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();

      return res.status(201).json({
        message: "Orders placed using wallet",
        order: createdOrders[0], 
        orders: createdOrders 
      });
    }

    
    const razorpayOrder = await getRazorpay().orders.create({
      amount: remainingToPay * 100, 
      currency: "INR",
      receipt: `ord_${Date.now()}`,
    });

    let remainingWalletToDistribute = walletUsed;

    for (const key in groupedOrders) {
      const orderGroup = groupedOrders[key];

      
      let allocatedWallet = 0;
      if (remainingWalletToDistribute > 0) {
        allocatedWallet = Math.min(remainingWalletToDistribute, orderGroup.totalPrice);
        remainingWalletToDistribute -= allocatedWallet;
      }

      const order = await Order.create({
        user: req.user._id,
        provider: orderGroup.providerId,
        date: orderDate,
        timeSlot: orderGroup.timeSlot,
        items: orderGroup.items,
        totalPrice: orderGroup.totalPrice,
        amountPaid: allocatedWallet,
        paymentStatus: walletUsed > 0 ? "partial" : "pending",
        razorpayOrderId: razorpayOrder.id,
        status: "pending",
      });
      createdOrders.push(order);
    }

    
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(201).json({
      message: "Razorpay payment required",
      order: createdOrders[0], 
      orders: createdOrders,
      razorpayOrderId: razorpayOrder.id,
      amountToPay: remainingToPay,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};


const verifyOrderPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { razorpay_payment_id, razorpay_signature } = req.body;

    const initialOrder = await Order.findById(orderId)
      .populate("user", "name email");

    if (!initialOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    
    let ordersToFulfill = initialOrder.razorpayOrderId 
        ? await Order.find({ razorpayOrderId: initialOrder.razorpayOrderId }).populate("provider", "businessName")
        : [initialOrder];

    
    if (process.env.NODE_ENV === "test") {
      for (const order of ordersToFulfill) {
          order.razorpayPaymentId = razorpay_payment_id;
          order.paymentStatus = "paid";
          order.amountPaid = order.totalPrice; 
          order.status = "confirmed";

          const { platformFee, providerEarning } = await creditProviderAfterPayment(
            order.provider._id || order.provider,
            order.totalPrice,
            `Order (test mode) for ${order.timeSlot}`
          );
          order.platformFee = platformFee;
          order.providerEarning = providerEarning;

          await order.save();
          await sendReceiptEmail(order);
      }

      return res.status(200).json({
        message: "Order payment successful (test mode)",
        order: ordersToFulfill[0],
      });
    }

    
    const body = initialOrder.razorpayOrderId + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    for (const order of ordersToFulfill) {
      
      order.razorpayPaymentId = razorpay_payment_id;
      order.paymentStatus = "paid";
      
      order.amountPaid = order.totalPrice; 
      order.status = "confirmed";

      const { platformFee, providerEarning } = await creditProviderAfterPayment(
        order.provider._id || order.provider,
        order.totalPrice,
        `Order (Razorpay) for ${order.timeSlot} on ${order.date.toDateString()}`
      );
      order.platformFee = platformFee;
      order.providerEarning = providerEarning;

      await order.save();
      await sendReceiptEmail(order);
    }

    res.status(200).json({
      message: "Order payment successful",
      order: ordersToFulfill[0],
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
