const Subscription = require("./subscription.model");
const Provider = require("../tiffin/provider.model");

const createSubscription = async (req, res) => {
  try {
    const { providerId, planType, timeSlot, price } = req.body;

    const provider = await Provider.findById(providerId);

    if (!provider || !provider.isApproved) {
      return res.status(400).json({
        message: "Provider not available for subscription",
      });
    }

    const startDate = new Date();
    let endDate = new Date();

    if (planType === "daily") {
      endDate.setDate(startDate.getDate() + 1);
    } else if (planType === "weekly") {
      endDate.setDate(startDate.getDate() + 7);
    } else if (planType === "monthly") {
      endDate.setMonth(startDate.getMonth() + 1);
    }

    const subscription = await Subscription.create({
      user: req.user._id,
      provider: providerId,
      planType,
      timeSlot,
      startDate,
      endDate,
      price,
    });

    res.status(201).json({
      message: "Subscription created successfully",
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSubscription };
