const Menu = require("./menu.model");
const Provider = require("./provider.model");
const Subscription = require("../subscription/subscription.model");
const User = require("../user/user.model");
const { addCredit } = require("../user/wallet.service");
const { sendEmail } = require("../../utils/notification.service");


const createOrUpdateMenu = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });

    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    if (!provider.isApproved) {
      return res.status(403).json({
        message: "Provider not approved by admin",
      });
    }

    const { weekMenu } = req.body;

    let menu = await Menu.findOne({ provider: provider._id });

    if (menu) {
      menu.weekMenu = weekMenu;
      await menu.save();

      return res.status(200).json({
        message: "Menu updated successfully",
        menu,
      });
    }

    menu = await Menu.create({
      provider: provider._id,
      weekMenu,
    });

    res.status(201).json({
      message: "Menu created successfully",
      menu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitForApproval = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });

    if (!provider || !provider.isApproved) {
      return res.status(403).json({
        message: "Provider not eligible to publish menu",
      });
    }

    //enforcing menu completion
    if (!provider.profileCompleted) {
      return res.status(403).json({
        message: "Complete profile before publishing menu",
      });
    }


    const menu = await Menu.findOne({ provider: provider._id });

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    menu.isApproved = false;
    menu.isPublished = false;
    menu.submittedForApproval = true;
    await menu.save();

    res.status(200).json({
      message: "Menu submitted for approval successfully",
      menu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveMenu = async (req, res) => {
  const { menuId } = req.params;

  const menu = await Menu.findById(menuId);
  if (!menu) return res.status(404).json({ message: "Menu not found" });

  menu.isApproved = true;
  menu.isPublished = true;
  menu.rejectionRemark = undefined;

  await menu.save();

  res.json({ message: "Menu approved & published" });
};

const rejectMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { remark } = req.body;

    const menu = await Menu.findById(menuId).populate("provider");

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Unpublish menu
    menu.isPublished = false;
    menu.isApproved = false;
    menu.rejectionRemark = remark || "Rejected by admin";
    await menu.save();

    // 🔁 Find active subscriptions + populate user for email
    const subs = await Subscription.find({
      provider: menu.provider._id,
      status: "active",
    }).populate("user");

    const today = new Date();

    for (const sub of subs) {
      const totalDays =
        sub.planType === "weekly"
          ? 7
          : sub.planType === "monthly"
            ? 30
            : 365;

      const pricePerDay = sub.totalPrice / totalDays;

      const remainingDays = Math.max(
        0,
        Math.ceil((sub.endDate - today) / (1000 * 60 * 60 * 24))
      );

      const refund = Math.round(pricePerDay * remainingDays);

      // 💳 Add refund to wallet
      if (refund > 0) {
        await addCredit(sub.user._id, refund);
      }

      // ❌ cancel subscription
      sub.status = "cancelled";
      await sub.save();

      // 📧 Notify subscriber
      if (sub.user?.email) {
        await sendEmail(
          sub.user.email,
          "Subscription Cancelled & Refund Issued",
          `Your subscription has been cancelled because the provider's menu was rejected by admin.

Refund Amount: ₹${refund}
The amount has been credited to your wallet.

We apologize for the inconvenience.`
        );
      }
    }

    // 📧 Notify provider
    if (menu.provider.email) {
      await sendEmail(
        menu.provider.email,
        "Menu Rejected",
        `Your menu was removed by admin. Reason: ${menu.rejectionRemark}`
      );
    }

    res.json({
      message:
        "Menu rejected, subscriptions cancelled, refunds processed, and emails sent",
      affectedSubscriptions: subs.length,
    });
  } catch (error) {
    console.error("Reject Menu Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find()
      .populate({
        path: "provider",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: menus.length,
      menus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMenuByProviderId = async (req, res) => {
  try {
    const { providerId } = req.params;
    const menu = await Menu.findOne({ provider: providerId, isPublished: true });

    if (!menu) {
      return res.status(404).json({ message: "Menu not found or not published" });
    }

    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = { createOrUpdateMenu, submitForApproval, approveMenu, rejectMenu, getAllMenus, getMenuByProviderId };
