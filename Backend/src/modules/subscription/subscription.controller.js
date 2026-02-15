const Subscription = require("./subscription.model");
const Provider = require("../tiffin/provider.model");
const Menu = require("../tiffin/menu.model");
const { deductCredit, addCredit } = require("../user/wallet.service");

// ================= CREATE SUBSCRIPTION =================
const createSubscription = async (req, res) => {
  try {
    const { providerId, planType, timeSlot } = req.body;

    // ✅ Validate planType
    const validPlans = ["weekly", "monthly", "yearly"];
    if (!validPlans.includes(planType)) {
      return res.status(400).json({
        message: "Invalid plan type",
      });
    }

    // ✅ Validate timeSlot
    if (!["lunch", "dinner"].includes(timeSlot)) {
      return res.status(400).json({
        message: "Invalid time slot",
      });
    }

    // ✅ Check provider exists and approved
    const provider = await Provider.findById(providerId);

    if (!provider || !provider.isApproved) {
      return res.status(400).json({
        message: "Provider not available",
      });
    }

    // ✅ Prevent duplicate active subscription
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

    // ✅ Get published menu
    const menu = await Menu.findOne({
      provider: providerId,
      isPublished: true,
    });

    if (!menu || menu.weekMenu.length === 0) {
      return res.status(400).json({
        message: "Provider menu not available",
      });
    }

    // Use first day's pricing as base reference
    const firstDay = menu.weekMenu[0];
    const meal = firstDay[timeSlot];

    if (!meal || !meal.price) {
      return res.status(400).json({
        message: "Selected time slot not available",
      });
    }

    const basePrice = meal.price;

    const startDate = new Date();
    let endDate = new Date();
    let totalDays = 0;

    if (planType === "weekly") {
      totalDays = 7;
      endDate.setDate(startDate.getDate() + totalDays);
    } else if (planType === "monthly") {
      totalDays = 30;
      endDate.setDate(startDate.getDate() + totalDays);
    } else if (planType === "yearly") {
      totalDays = 365;
      endDate.setDate(startDate.getDate() + totalDays);
    }

    const totalPrice = basePrice * totalDays;

    // ✅ Deduct wallet first
    const walletResult = await deductCredit(req.user._id, totalPrice);

    const amountPaid = totalPrice - walletResult.remainingToPay;

    const subscription = await Subscription.create({
      user: req.user._id,
      provider: providerId,
      planType,
      timeSlot,
      startDate,
      endDate,
      totalPrice,
      remainingMeals: totalDays,
      amountPaid,
    });

    res.status(201).json({
      message: "Subscription created successfully",
      walletUsed: walletResult.deducted,
      remainingToPay: walletResult.remainingToPay,
      subscription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= CANCEL SUBSCRIPTION (REFUND) =================
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
      return res.status(400).json({ message: "Subscription not active" });
    }

    const today = new Date();

    const remainingDays = Math.max(
      0,
      Math.ceil(
        (subscription.endDate - today) / (1000 * 60 * 60 * 24)
      )
    );

    const perDayCost = subscription.totalPrice / subscription.remainingMeals;
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

    if (end <= start) {
      return res.status(400).json({
        message: "Invalid pause date range",
      });
    }

    const pauseDuration = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    // Extend subscription end date
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


module.exports = {
  createSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
};

