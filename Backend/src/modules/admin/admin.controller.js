const User = require("../user/user.model");
const Provider = require("../tiffin/provider.model");
const Order = require("../order/order.model");
const Subscription = require("../subscription/subscription.model");

// GET all users
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// GET all providers
const getAllProviders = async (req, res) => {
  const providers = await Provider.find().populate("user", "name email");
  res.json(providers);
};

// GET all orders
const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name")
    .populate("provider", "businessName");
  res.json(orders);
};

// GET dashboard stats
const getAdminStats = async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "customer" });
  const totalProviders = await Provider.countDocuments();
  const totalOrders = await Order.countDocuments();

  const revenueData = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$amountPaid" } } },
  ]);

  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  res.json({
    totalUsers,
    totalProviders,
    totalOrders,
    totalRevenue,
  });
};


const getPendingProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ isApproved: false });

    res.status(200).json({
      count: providers.length,
      providers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all subscriptions (admin)
const getAllSubscriptions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.providerId) filter.provider = req.query.providerId;

    const subscriptions = await Subscription.find(filter)
      .populate("user", "name email phone")
      .populate("provider", "businessName ownerName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    console.error("Get All Subscriptions Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllProviders,
  getAllOrders,
  getAdminStats,
  getPendingProviders,
  getAllSubscriptions,
};
