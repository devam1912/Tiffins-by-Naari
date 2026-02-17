const User = require("../user/user.model");
const Provider = require("../tiffin/provider.model");
const Order = require("../order/order.model");

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

module.exports = {
  getAllUsers,
  getAllProviders,
  getAllOrders,
  getAdminStats,
};
