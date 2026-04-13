const Payout = require("./payout.model");
const Provider = require("../tiffin/provider.model");

// Admin sees all payouts remaining (provider wallet balances) and total paid
const getAllPayoutBalances = async (req, res) => {
  try {
    const providers = await Provider.find().select("_id businessName ownerName email phone walletBalance");
    
    // Calculate total paid for each provider
    const payouts = await Payout.aggregate([
      { $match: { type: "debit", status: "completed" } },
      { $group: { _id: "$provider", totalPaid: { $sum: "$amount" } } }
    ]);

    const result = providers.map(provider => {
      const paidInfo = payouts.find(p => p._id.toString() === provider._id.toString());
      return {
        providerId: provider._id,
        businessName: provider.businessName,
        ownerName: provider.ownerName,
        walletBalance: provider.walletBalance || 0,
        totalPaid: paidInfo ? paidInfo.totalPaid : 0
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin deducts (payouts) from provider wallet
const processPayout = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { amount, description } = req.body;

    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    if (!provider.walletBalance || provider.walletBalance < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    provider.walletBalance -= amount;
    await provider.save();

    const payout = await Payout.create({
      provider: providerId,
      amount,
      type: "debit",
      description: description || "Payout by Admin",
      admin: req.user._id,
      status: "completed"
    });

    res.status(200).json({ message: "Payout successful", provider, payout });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Credit provider wallet (internal/webhook/admin use)
const creditProviderWallet = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { amount, description } = req.body;

    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    provider.walletBalance = (provider.walletBalance || 0) + amount;
    await provider.save();

    const payout = await Payout.create({
      provider: providerId,
      amount,
      type: "credit",
      description: description || "Order Credit"
    });

    res.status(200).json({ message: "Wallet credited successfully", provider, payout });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin sees specific provider's payout history
const getProviderPayoutHistory = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const payouts = await Payout.find({ provider: providerId }).sort({ createdAt: -1 });

    res.status(200).json(payouts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Provider sees their own history
const getMyPayoutHistory = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });

    const payouts = await Payout.find({ provider: provider._id }).sort({ createdAt: -1 });

    res.status(200).json({ walletBalance: provider.walletBalance, history: payouts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllPayoutBalances,
  processPayout,
  creditProviderWallet,
  getProviderPayoutHistory,
  getMyPayoutHistory
};
