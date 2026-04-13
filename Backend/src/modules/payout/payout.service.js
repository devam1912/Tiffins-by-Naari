const Provider = require("../tiffin/provider.model");
const Payout = require("./payout.model");

const PLATFORM_FEE_PERCENT = 5;

/**
 * Credit provider wallet after a confirmed payment.
 * Deducts 5% platform fee, credits 95% to provider wallet.
 *
 * @param {ObjectId} providerId  - Provider._id (not user._id)
 * @param {Number}   totalAmount - Full amount paid by customer
 * @param {String}   description - Context label e.g. "Order #xyz"
 * @returns {{ platformFee, providerEarning }} for storing on the record
 */
const creditProviderAfterPayment = async (providerId, totalAmount, description = "Payment Credit") => {
  const platformFee = Math.round((PLATFORM_FEE_PERCENT / 100) * totalAmount);
  const providerEarning = totalAmount - platformFee;

  const provider = await Provider.findByIdAndUpdate(
    providerId,
    [
      {
        $set: {
          walletBalance: {
            $add: [{ $ifNull: ["$walletBalance", 0] }, providerEarning]
          }
        }
      }
    ],
    { new: true, updatePipeline: true }
  );
  if (!provider) throw new Error("Provider not found for wallet credit");

  await Payout.create({
    provider: providerId,
    amount: providerEarning,
    type: "credit",
    description: `${description} (Platform fee: ₹${platformFee})`,
    status: "completed",
  });

  return { platformFee, providerEarning };
};

module.exports = { creditProviderAfterPayment };
