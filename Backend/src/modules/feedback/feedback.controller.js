const Feedback = require("./feedback.model");
const Subscription = require("../subscription/subscription.model");
const Order = require("../order/order.model");
const Provider = require("../tiffin/provider.model");

const addFeedback = async (req, res) => {
  try {
    const { providerId, rating, comment } = req.body;

    if (!providerId || !rating) {
      return res.status(400).json({
        message: "providerId and rating are required",
      });
    }

    
    const hasSubscription = await Subscription.exists({
      user: req.user._id,
      provider: providerId,
      status: { $in: ["active", "completed", "paused"] },
    });

    
    const hasOrder = await Order.exists({
      user: req.user._id,
      provider: providerId,
      status: { $in: ["confirmed", "completed"] },
    });

    if (!hasSubscription && !hasOrder) {
      return res.status(403).json({
        message:
          "You can only give feedback to providers you have ordered from or subscribed to",
      });
    }

    
    const existing = await Feedback.findOne({
      user: req.user._id,
      provider: providerId,
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already given feedback to this provider",
      });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      provider: providerId,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProviderFeedback = async (req, res) => {
  try {
    const { providerId } = req.params;

    const feedbacks = await Feedback.find({
      provider: providerId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name")
      .populate("provider", "businessName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    getAllFeedback,
    getProviderFeedback,
    addFeedback,
};