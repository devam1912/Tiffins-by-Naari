const User = require("./user.model");


const addCredit = async (userId, amount) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  user.walletBalance += amount;
  await user.save();

  return user.walletBalance;
};


const deductCredit = async (userId, amount) => {
  const user = await User.findById(userId);

  if (!user.walletBalance) {
    user.walletBalance = 0;
  }

  let deducted = 0;
  let remainingToPay = amount;

  if (user.walletBalance >= amount) {
    deducted = amount;
    remainingToPay = 0;
  } else {
    deducted = user.walletBalance;
    remainingToPay = amount - user.walletBalance;
  }

  user.walletBalance = user.walletBalance - deducted;
  await user.save();

  return { deducted, remainingToPay };
};


module.exports = { addCredit, deductCredit };
