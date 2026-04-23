const Provider = require("./provider.model");
const User = require("../user/user.model");
const Subscription = require("../subscription/subscription.model");
const { sendEmail } = require("../../utils/notification.service");
const cloudinary = require("../../config/cloudinary");

const updateProviderProfile = async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      address,
      fssaiNumber,
      cuisineType,
      pricingModel,
      deliverySlots,
      location,
    } = req.body;

    const provider = await Provider.findOne({ user: req.user._id });

    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    
    const updateData = {
      businessName: businessName || provider.businessName,
      ownerName: ownerName || provider.ownerName,
      address: address || provider.address,
      fssaiNumber: fssaiNumber || provider.fssaiNumber,
      cuisineType: cuisineType || provider.cuisineType,
      pricingModel: pricingModel || provider.pricingModel,
      deliverySlots: deliverySlots || provider.deliverySlots,
      location: location || provider.location,
    };

    
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "tiffins/fssai" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      updateData.fssaiCertificate = uploadResult.secure_url;
    }

    
    const updatedProvider = await Provider.findOneAndUpdate(
      { user: req.user._id },
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      message: "Provider profile updated successfully",
      provider: updatedProvider,
    });
  } catch (error) {
    console.error("UPDATE PROVIDER PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const deactivateTSP = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });

    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    provider.isActive = false;
    await provider.save();

    const today = new Date();

    
    const activeSubs = await Subscription.find({
      provider: provider._id,
      status: "active",
    }).populate("user");

    
    await Subscription.updateMany(
      {
        provider: provider._id,
        status: "active",
      },
      {
        status: "paused",
        pauseStart: today,
      }
    );

    
    for (const sub of activeSubs) {
      if (sub.user?.email) {
        await sendEmail(
          sub.user.email,
          "Tiffin Service Temporarily Unavailable",
          `Your subscribed tiffin provider "${provider.businessName}" is temporarily unavailable. 
Your subscription has been paused and will resume once the provider is back.`
        );
      }
    }

    res.status(200).json({
      message: "TSP deactivated and subscriptions paused",
      notifiedUsers: activeSubs.length,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reactivateTSP = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });

    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    provider.isActive = true;
    await provider.save();

    const today = new Date();

    const pausedSubs = await Subscription.find({
      provider: provider._id,
      status: "paused",
    }).populate("user");

    for (const sub of pausedSubs) {

      if (sub.pauseStart) {
        const pauseDuration = Math.ceil(
          (today - sub.pauseStart) / (1000 * 60 * 60 * 24)
        );

        sub.endDate.setDate(sub.endDate.getDate() + pauseDuration);
      }

      sub.status = "active";
      sub.pauseStart = null;
      sub.pauseEnd = null;

      await sub.save();

      
      if (sub.user?.email) {
        await sendEmail(
          sub.user.email,
          "Tiffin Service Resumed",
          `Good news! Your tiffin provider "${provider.businessName}" is back.
Your subscription has resumed and pickups will continue as scheduled.`
        );
      }
    }

    res.status(200).json({
      message: "TSP reactivated and subscriptions resumed",
      resumedSubscriptions: pausedSubs.length,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateProviderProfile,
  deactivateTSP,
  reactivateTSP,
};
