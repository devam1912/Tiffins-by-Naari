const Subscription = require("./subscription.model");
const Provider = require("../tiffin/provider.model");
const Menu = require("../tiffin/menu.model");
const { deductCredit, addCredit } = require("../user/wallet.service");
const { creditProviderAfterPayment } = require("../payout/payout.service");
const crypto = require("crypto");
const razorpay = require("../../utils/razorpay");
const { sendEmail } = require("../../utils/notification.service");
const Order = require("../order/order.model");
const mongoose = require("mongoose");

// ================= CREATE SUBSCRIPTION =================
const createSubscription = async (req, res) => {
  try {
    const { providerId, planType, timeSlot } = req.body;

    // ✅ Validate planType
    const validPlans = ["weekly", "monthly", "yearly"];
    if (!validPlans.includes(planType)) {
      return res.status(400).json({ message: "Invalid plan type" });
    }

    // ✅ Validate timeSlot
    if (!["lunch", "dinner"].includes(timeSlot)) {
      return res.status(400).json({ message: "Invalid time slot" });
    }

    // ✅ Check provider
    const provider = await Provider.findById(providerId);
    if (!provider || !provider.isApproved) {
      return res.status(400).json({ message: "Provider not available" });
    }

    // ✅ Prevent duplicate subscription
    const existing = await Subscription.findOne({
      user: req.user._id,
      provider: providerId,
      status: "active",
      endDate: { $gt: new Date() },
    });

    if (existing) {
      return res.status(400).json({
        message: "Active subscription already exists",
      });
    }

    // ✅ Fetch menu
    const menu = await Menu.findOne({
      provider: providerId,
      isPublished: true,
    });

    if (!menu || !menu.weekMenu || menu.weekMenu.length === 0) {
      return res.status(400).json({
        message: "Menu not configured properly",
      });
    }

    const firstDay = menu.weekMenu[0];

    if (!firstDay[timeSlot]) {
      return res.status(400).json({
        message: "Time slot not available in menu",
      });
    }

    const meal = firstDay[timeSlot];

    if (!meal.price || typeof meal.price !== "number") {
      return res.status(400).json({
        message: "Meal price not configured",
      });
    }

    const basePrice = meal.price;

    const startDate = new Date();
    let endDate = new Date();
    let totalDays = 0;

    if (planType === "weekly") {
      totalDays = 7;
    } else if (planType === "monthly") {
      totalDays = 30;
    } else if (planType === "yearly") {
      totalDays = 365;
    }

    if (!totalDays || !basePrice) {
      return res.status(400).json({
        message: "Subscription calculation error",
      });
    }

    endDate.setDate(startDate.getDate() + totalDays);

    const totalPrice = basePrice * totalDays;

   
   // 💰 Wallet deduction
const walletResult = await deductCredit(req.user._id, totalPrice);

const walletUsed = walletResult.deducted;
const remainingToPay = walletResult.remainingToPay;

// 🟢 FULL WALLET PAYMENT
if (remainingToPay === 0) {
  // 5% platform fee, 95% to provider
  const { platformFee, providerEarning } = await creditProviderAfterPayment(
    providerId,
    totalPrice,
    `Subscription (wallet) ${planType} plan - ${timeSlot}`
  );

  const subscription = await Subscription.create({
    user: req.user._id,
    provider: providerId,
    planType,
    timeSlot,
    startDate,
    endDate,
    totalPrice,
    remainingMeals: totalDays,
    amountPaid: totalPrice,
    platformFee,
    providerEarning,
    paymentStatus: "paid",
    status: "active",
  });

  return res.status(201).json({
    message: "Subscription activated using wallet",
    subscription,
  });
}

// 🟡 PARTIAL / FULL RAZORPAY
const razorpayOrder = await razorpay.orders.create({
  amount: remainingToPay * 100,
  currency: "INR",
  receipt: `sub_${Date.now()}`,
});

const subscription = await Subscription.create({
  user: req.user._id,
  provider: providerId,
  planType,
  timeSlot,
  startDate,
  endDate,
  totalPrice,
  remainingMeals: totalDays,
  amountPaid: walletUsed,
  paymentStatus: walletUsed > 0 ? "partial" : "pending",
  razorpayOrderId: razorpayOrder.id,
  status: "pending",
});

res.status(201).json({
  message: "Razorpay payment required",
  subscription,
  razorpayOrderId: razorpayOrder.id,
  amountToPay: remainingToPay,
  key: process.env.RAZORPAY_KEY_ID,
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


const verifySubscriptionPayment = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { razorpay_payment_id, razorpay_signature } = req.body;

    const subscription = await Subscription.findById(subscriptionId)
    .populate("user", "name email")
    .populate("provider", "businessName");

    //  TEST MODE BYPASS (Thunder testing)
    if (process.env.NODE_ENV === "test") {
      subscription.razorpayPaymentId = razorpay_payment_id;
      subscription.paymentStatus = "paid";
      subscription.amountPaid = subscription.totalPrice;
      subscription.status = "active";

      // 5% platform fee, 95% to provider
      const { platformFee, providerEarning } = await creditProviderAfterPayment(
        subscription.provider._id || subscription.provider,
        subscription.totalPrice,
        `Subscription (test mode) ${subscription.planType} - ${subscription.timeSlot}`
      );
      subscription.platformFee = platformFee;
      subscription.providerEarning = providerEarning;

      await subscription.save();

      await sendSubscriptionEmail(subscription);

      return res.status(200).json({
        message: "Subscription Activated (test Mode)",
        subscription,
      });
    }

    //real signature verification
    const body =
      subscription.razorpayOrderId + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    subscription.razorpayPaymentId = razorpay_payment_id;
    subscription.paymentStatus = "paid";
    subscription.amountPaid = subscription.totalPrice;
    subscription.status = "active";

    // 5% platform fee, 95% to provider
    const { platformFee, providerEarning } = await creditProviderAfterPayment(
      subscription.provider._id || subscription.provider,
      subscription.totalPrice,
      `Subscription (Razorpay) ${subscription.planType} plan - ${subscription.timeSlot}`
    );
    subscription.platformFee = platformFee;
    subscription.providerEarning = providerEarning;

    await subscription.save();

    await sendSubscriptionEmail(subscription);

    res.status(200).json({
      message: "Subscription activated",
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= CANCEL SUBSCRIPTION =================
const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (subscription.status !== "active") {
      return res.status(400).json({
        message: "Subscription not active",
      });
    }

    const today = new Date();

    const remainingDays = Math.max(
      0,
      Math.ceil(
        (subscription.endDate - today) / (1000 * 60 * 60 * 24)
      )
    );

    const perDayCost =
      subscription.remainingMeals > 0
        ? subscription.totalPrice / subscription.remainingMeals
        : 0;

    const refundAmount = Math.round(perDayCost * remainingDays);

    if (refundAmount > 0) {
      await addCredit(req.user._id, refundAmount);
    }

    subscription.status = "cancelled";
    await subscription.save();

    res.status(200).json({
      message: "Subscription cancelled successfully",
      refundAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= PAUSE SUBSCRIPTION =================
const pauseSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { pauseStart, pauseEnd } = req.body;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (subscription.status !== "active") {
      return res.status(400).json({
        message: "Only active subscriptions can be paused",
      });
    }

    const start = new Date(pauseStart);
    const end = new Date(pauseEnd);

    if (isNaN(start) || isNaN(end) || end <= start) {
      return res.status(400).json({
        message: "Invalid pause date range",
      });
    }

    const pauseDuration = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    subscription.endDate.setDate(
      subscription.endDate.getDate() + pauseDuration
    );

    subscription.pauseStart = start;
    subscription.pauseEnd = end;
    subscription.status = "paused";

    await subscription.save();

    res.status(200).json({
      message: "Subscription paused successfully",
      extendedByDays: pauseDuration,
      subscription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= RESUME SUBSCRIPTION =================
const resumeSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (subscription.status !== "paused") {
      return res.status(400).json({
        message: "Subscription is not paused",
      });
    }

    subscription.status = "active";
    subscription.pauseStart = null;
    subscription.pauseEnd = null;

    await subscription.save();

    res.status(200).json({
      message: "Subscription resumed successfully",
      subscription,
    });
  } catch (error) {
    console.error(error);
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

const sendSubscriptionEmail = async (subscription) => {
  if (!subscription.user?.email) return;

  const subId = `SUB-${subscription._id.toString().slice(-6)}`;

  await sendEmail(
    subscription.user.email,
    "Subscription Activated Successfully",
    `
Hello ${subscription.user.name},

Your subscription has been successfully activated 🎉

Subscription ID: ${subId}
Provider: ${subscription.provider.businessName}
Plan: ${subscription.planType}
Time Slot: ${subscription.timeSlot}

Start Date: ${subscription.startDate.toDateString()}
End Date: ${subscription.endDate.toDateString()}

Amount Paid: ₹${subscription.amountPaid}
Payment Status: ${subscription.paymentStatus}

Enjoy your daily tiffins 🍱
Thank you for choosing us ❤️
    `
  );
};

const markMealReady = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findById(subscriptionId)
      .populate("user", "name email")
      .populate("provider", "businessName isActive");

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await handleVacationResume(subscription);

    // Get provider of logged-in user
    const provider = await Provider.findOne({ user: req.user._id });

    if (!provider) {
      return res.status(403).json({ message: "Provider not found" });
    }

    // Ensure this provider owns the subscription
    if (subscription.provider._id.toString() !== provider._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Provider must be active
    if (!subscription.provider.isActive) {
      return res.status(400).json({ message: "Provider is inactive" });
    }

    // Subscription must be active
    if (subscription.status !== "active") {
      return res.status(400).json({ message: "Subscription not active" });
    }

    // Pause check
    if (subscription.status === "paused") {
      return res.status(400).json({ message: "Subscription is paused" });
    }

    // Expiry check
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (today > subscription.endDate) {
      return res.status(400).json({ message: "Subscription has expired" });
    }

    // Prevent double serving on same day
    if (
      subscription.lastServedDate &&
      new Date(subscription.lastServedDate).toDateString() ===
        today.toDateString()
    ) {
      return res.status(400).json({
        message: "Meal already marked as ready for today",
      });
    }

    //  No meals left
    if (subscription.remainingMeals <= 0) {
      return res.status(400).json({ message: "No meals remaining" });
    }

    // Deduct meal
    subscription.remainingMeals -= 1;
    subscription.lastServedDate = today;

    //  Auto complete
    if (subscription.remainingMeals === 0) {
      subscription.status = "completed";
    }

    await subscription.save();

    //  Notify user
    if (subscription.user?.email) {
      await sendEmail(
        subscription.user.email,
        "Your Tiffin is Ready for Pickup 🍱",
        `
Hello ${subscription.user.name},

Your ${subscription.timeSlot} meal from ${subscription.provider.businessName} is ready for pickup.

Please collect it on time.

Enjoy your meal 😋
        `
      );
    }

    res.status(200).json({
      message: "Meal marked as ready and user notified",
      remainingMeals: subscription.remainingMeals,
      status: subscription.status,
    });
  } catch (error) {
    console.error("Mark Meal Ready Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const setVacationMode = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { pauseEnd } = req.body;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    //  ownership check
    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (subscription.status !== "active") {
      return res.status(400).json({
        message: "Only active subscriptions can set vacation",
      });
    }

    if (!pauseEnd) {
      return res.status(400).json({ message: "pauseEnd is required" });
    }

    // calculate pauseStart = next service day
    let pauseStart;

    if (subscription.lastServedDate) {
      pauseStart = new Date(subscription.lastServedDate);
      pauseStart.setDate(pauseStart.getDate() + 1);
    } else {
      pauseStart = new Date(); // no meals served yet
    }

    const end = new Date(pauseEnd);

    if (isNaN(end) || end < pauseStart) {
      return res.status(400).json({
        message: "Invalid pauseEnd date",
      });
    }

    subscription.pauseStart = pauseStart;
    subscription.pauseEnd = end;

    await subscription.save();

    res.status(200).json({
      message: "Vacation scheduled successfully",
      pauseStart,
      pauseEnd: end,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleVacationResume = async (subscription) => {
  const today = new Date();

  if (
    subscription.status === "paused" &&
    subscription.pauseEnd &&
    today > subscription.pauseEnd
  ) {
    const pauseDuration = Math.ceil(
      (subscription.pauseEnd - subscription.pauseStart) /
        (1000 * 60 * 60 * 24)
    );

    subscription.endDate.setDate(
      subscription.endDate.getDate() + pauseDuration
    );

    subscription.status = "active";
    subscription.pauseStart = null;
    subscription.pauseEnd = null;

    await subscription.save();
  }
};

const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id })
      .populate("provider", "businessName ownerName email phone address cuisineType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    console.error("Get My Subscriptions Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProviderSubscriptions = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const subscriptions = await Subscription.find({ provider: provider._id })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    console.error("Get Provider Subscriptions Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProviderDashboard = async (req, res) => {
  try {
    const providerDoc = await Provider.findOne({ user: req.user._id });

    if (!providerDoc) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const providerId = providerDoc._id;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);

    const activeSubscribers = await Subscription.countDocuments({
      provider: providerId,
      status: "active",
    });

    const lunchCount = await Subscription.countDocuments({
      provider: providerId,
      status: "active",
      timeSlot: "lunch",
      startDate: { $lte: todayEnd },
      endDate: { $gte: todayStart },
    });

    const dinnerCount = await Subscription.countDocuments({
      provider: providerId,
      status: "active",
      timeSlot: "dinner",
      startDate: { $lte: todayEnd },
      endDate: { $gte: todayStart },
    });

    const todaysMeals = lunchCount + dinnerCount;

    const monthlyRevenueAgg = await Subscription.aggregate([
      {
        $match: {
          provider: providerId,
          paymentStatus: "paid",
          createdAt: { $gte: monthStart },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amountPaid" },
        },
      },
    ]);

    const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;

    const recentActivity = await Subscription.find({ provider: providerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");

    res.json({
      success: true,
      data: {
        todaysMeals,
        lunchCount,
        dinnerCount,
        activeSubscribers,
        monthlyRevenue,
        recentActivity,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};

module.exports = {
  createSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
  verifySubscriptionPayment,
  getOrderReceipt,
  markMealReady,
  setVacationMode,
  getProviderDashboard,
  getMySubscriptions,
  getProviderSubscriptions,
};
