const Subscription = require("./subscription.model");
const Provider = require("../tiffin/provider.model");
const Menu = require("../tiffin/menu.model");

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

    if (!menu) {
      return res.status(400).json({
        message: "Provider menu not available",
      });
    }

    // ✅ Get price from menu (using first day as reference)
    const firstDay = menu.weekMenu[0];
    const meal = firstDay[timeSlot];

    if (!meal) {
      return res.status(400).json({
        message: "Selected time slot not available",
      });
    }

    const basePrice = meal.price;

    // ✅ Calculate duration & total price
    const startDate = new Date();
    let endDate = new Date();
    let totalPrice = 0;
    let remainingMeals = 0;

    if (planType === "weekly") {
      endDate.setDate(startDate.getDate() + 7);
      remainingMeals = 7;
      totalPrice = basePrice * 7;
    } else if (planType === "monthly") {
      endDate.setMonth(startDate.getMonth() + 1);
      remainingMeals = 30;
      totalPrice = basePrice * 30;
    } else if (planType === "yearly") {
      endDate.setFullYear(startDate.getFullYear() + 1);
      remainingMeals = 365;
      totalPrice = basePrice * 365;
    }

    const subscription = await Subscription.create({
      user: req.user._id,
      provider: providerId,
      planType,
      timeSlot,
      startDate,
      endDate,
      totalPrice,
      remainingMeals,
    });

    res.status(201).json({
      message: "Subscription created successfully",
      subscription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSubscription };
