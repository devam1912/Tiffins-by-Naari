const Provider = require("./provider.model");
const User = require("../user/user.model");

const Subscription = require("../subscription/subscription.model");
const { sendEmail } = require("../../utils/notification.service");
const cloudinary = require("../../config/cloudinary");

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
      address,
      fssaiNumber,
      location,
    } = req.body;

  const email = req.user.email;
  const phone = req.user.phone;

    
    const existing = await Provider.findOne({ user: req.user._id });

    if (existing) {
      return res.status(400).json({
        message: "Provider profile already exists",
      });
    }

    
    let certificateUrl = null;

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

      certificateUrl = uploadResult.secure_url;
    }

    
    const provider = await Provider.create({
      user: req.user._id,
      businessName,
      ownerName,
      email,
      phone,
      address,
      fssaiNumber,
      location,
      fssaiCertificate: certificateUrl,
    });

    if (email) {
        await sendEmail(
          email,
          "Application Submitted",
          `Thank you for applying to list your kitchen on our platform.
            Your application will be reviewed shortly.`
        );
      }

    res.status(201).json({
      message: "Provider registration request submitted",
      provider,
    });

  } catch (error) {
    console.error("PROVIDER REGISTER ERROR:", error);
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

  if (provider.email) {
        await sendEmail(
          provider.email,
          "Application Accepted",
          `Congratualations you now eligible to reach your customers through our Platform!`
        );
      }

    res.status(200).json({
      message: "Provider approved successfully",
      provider,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectProvider = async (req, res) => {
try {
const { providerId } = req.params;
const { reason } = req.body;


const provider = await Provider.findById(providerId).populate("user");

if (!provider) {
  return res.status(404).json({ message: "Provider request not found" });
}

provider.isApproved = false;
provider.isActive = false;
provider.rejectionReason = reason || "Application did not meet our requirements.";

await provider.save();

if (provider.email) {
  await sendEmail(
    provider.email,
    "Provider Application Rejected",
    `We regret to inform you that your application to list your kitchen "${provider.businessName}" on our platform has been rejected.

Reason: ${provider.rejectionReason}

You may reapply after correcting the mentioned issues.`
);
}


res.status(200).json({
  message: "Provider application rejected successfully",
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
  rejectProvider
};


