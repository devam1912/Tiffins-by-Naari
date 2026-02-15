const User = require("./user.model");

// Add credit (refund)
const addCredit = async (userId, amount) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  user.walletBalance += amount;
  await user.save();

  return user.walletBalance;
};

// Deduct credit (during payment)
const deductCredit = async (userId, amount) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  if (user.walletBalance < amount) {
    return {
      deducted: user.walletBalance,
      remainingToPay: amount - user.walletBalance,
    };
  }

  user.walletBalance -= amount;
  await user.save();

  return {
    deducted: amount,
    remainingToPay: 0,
  };
};

module.exports = { addCredit, deductCredit };
