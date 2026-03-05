const Provider = require("./provider.model");
const User = require("../user/user.model");
const Subscription = require("../subscription/subscription.model");
const { sendEmail } = require("../../utils/notification.service");

const getNearbyTiffins = async (req, res) => {
  try {
    const { lat, lng, distance = 5 } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude required" });
    }

    const providers = await Provider.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: distance * 1000,
        },
      },
      isActive: true,
      isApproved: true,
    });

    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProviderRequest = async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      email,
      phone,
      fssaiNumber,
      location,
    } = req.body;

    const existing = await Provider.findOne({ user: req.user._id });

    if (existing) {
      return res.status(400).json({
        message: "Provider profile already exists",
      });
    }

    const provider = await Provider.create({
      user: req.user._id,
      businessName,
      ownerName,
      email,
      phone,
      fssaiNumber,
      location,
    });

    if (email) {
        await sendEmail(
          email,
          "Application Submitted",
          `Thankyouu for Apply to List Your kitchen in out Platform, Your application will be reviewed Shortly!`
        );
      }

    res.status(201).json({
      message: "Provider registration request submitted",
      provider,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const approveProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    provider.isApproved = true;
    await provider.save();

    await User.findByIdAndUpdate(provider.user, {
    role: "provider"
  });


    res.status(200).json({
      message: "Provider approved successfully",
      provider,
    });
  } catch (error) {
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

    // ⏸ Pause all active subscriptions
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

    res.status(200).json({
      message: "TSP deactivated and subscriptions paused",
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

    // 🔄 Get paused subscriptions
    const pausedSubs = await Subscription.find({
      provider: provider._id,
      status: "paused",
    });

    for (const sub of pausedSubs) {
      if (sub.pauseStart) {
        const pauseDuration = Math.ceil(
          (today - sub.pauseStart) / (1000 * 60 * 60 * 24)
        );

        // 📅 Extend endDate
        sub.endDate.setDate(sub.endDate.getDate() + pauseDuration);
      }

      sub.status = "active";
      sub.pauseStart = null;
      sub.pauseEnd = null;

      await sub.save();
    }

    res.status(200).json({
      message: "TSP reactivated and subscriptions resumed",
      resumedSubscriptions: pausedSubs.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const publishMenu = async (req, res) => {
  try {
    const { providerId } = req.params;

    const menu = await Menu.findOne({ provider: providerId });

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    menu.isPublished = true;
    await menu.save();

    res.status(200).json({
      message: "Menu published successfully",
      menu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getNearbyTiffins,
  createProviderRequest,
  approveProvider,
  publishMenu,
  deactivateTSP,
  reactivateTSP,
};


