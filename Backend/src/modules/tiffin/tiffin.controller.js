const Provider = require("./provider.model");

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

    res.status(200).json({
      message: "Provider approved successfully",
      provider,
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
};


