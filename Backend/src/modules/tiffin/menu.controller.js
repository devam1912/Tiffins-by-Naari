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

    
    menu.isPublished = false;
    menu.isApproved = false;
    menu.rejectionRemark = remark || "Rejected by admin";
    await menu.save();

    
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

      
      if (refund > 0) {
        await addCredit(sub.user._id, refund);
      }

      
      sub.status = "cancelled";
      await sub.save();

      
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

// Provider: delete their own menu | Admin: delete any menu by menuId
// Cascade: cancels active subscriptions, issues pro-rata refunds, sends emails
const deleteMenu = async (req, res) => {
  try {
    let menu;
    let providerId;

    if (req.user.role === "admin") {
      const { menuId } = req.params;
      menu = await Menu.findById(menuId).populate("provider");
      if (!menu) {
        return res.status(404).json({ message: "Menu not found" });
      }
      providerId = menu.provider._id;
    } else {
      // provider — delete their own menu
      const provider = await Provider.findOne({ user: req.user._id });
      if (!provider) {
        return res.status(404).json({ message: "Provider profile not found" });
      }
      menu = await Menu.findOne({ provider: provider._id }).populate("provider");
      if (!menu) {
        return res.status(404).json({ message: "Menu not found" });
      }
      providerId = provider._id;
    }

    // --- Cascade: cancel active subscriptions & refund ---
    const subs = await Subscription.find({
      provider: providerId,
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

      if (refund > 0) {
        await addCredit(sub.user._id, refund);
      }

      sub.status = "cancelled";
      await sub.save();

      if (sub.user?.email) {
        await sendEmail(
          sub.user.email,
          "Subscription Cancelled & Refund Issued",
          `Your subscription has been cancelled because the provider's menu was deleted.

Refund Amount: ₹${refund}
The amount has been credited to your wallet.

We apologize for the inconvenience.`
        );
      }
    }

    // Notify provider (if email available on the populated provider)
    if (menu.provider?.email) {
      await sendEmail(
        menu.provider.email,
        "Menu Deleted",
        `Your menu has been deleted${req.user.role === "admin" ? " by admin" : ""}.${
          subs.length > 0
            ? ` ${subs.length} active subscription(s) have been cancelled and refunds have been processed.`
            : ""
        }`
      );
    }

    // Finally remove the menu document
    await Menu.findByIdAndDelete(menu._id);

    res.status(200).json({
      message: "Menu deleted successfully",
      affectedSubscriptions: subs.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Provider: remove a specific item from a day's meal (lunch/dinner)
// DELETE /menu/item  body: { day, meal, itemId }
const deleteMenuItem = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    const { day, meal, itemId } = req.body;

    if (!day || !meal || !itemId) {
      return res
        .status(400)
        .json({ message: "day, meal, and itemId are required" });
    }

    if (!["lunch", "dinner"].includes(meal)) {
      return res.status(400).json({ message: "meal must be 'lunch' or 'dinner'" });
    }

    const menu = await Menu.findOne({ provider: provider._id });
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const dayEntry = menu.weekMenu.find(
      (d) => d.day.toLowerCase() === day.toLowerCase()
    );

    if (!dayEntry) {
      return res.status(404).json({ message: `No menu entry found for ${day}` });
    }

    if (!dayEntry[meal]) {
      return res
        .status(404)
        .json({ message: `No ${meal} entry found for ${day}` });
    }

    const originalLength = dayEntry[meal].items.length;

    // grab the item name before removing it (for the notification email)
    const removedItem = dayEntry[meal].items.find(
      (item) => item._id.toString() === itemId
    );

    dayEntry[meal].items = dayEntry[meal].items.filter(
      (item) => item._id.toString() !== itemId
    );

    if (dayEntry[meal].items.length === originalLength) {
      return res.status(404).json({ message: "Item not found in that meal" });
    }

    // Menu stays published — no re-approval needed for item removal
    await menu.save();

    // Notify active subscribers whose timeSlot matches the affected meal
    const affectedSubs = await Subscription.find({
      provider: provider._id,
      status: "active",
      timeSlot: meal,
    }).populate("user");

    for (const sub of affectedSubs) {
      if (sub.user?.email) {
        await sendEmail(
          sub.user.email,
          "Menu Update Notice",
          `Hi ${sub.user.name || "there"},

We wanted to let you know that your provider has updated their menu.

The item "${removedItem?.name || "an item"}" has been removed from ${day}'s ${meal}.

Your subscription continues as usual — all other meals remain unchanged.

If you have any concerns, feel free to reach out or manage your subscription from your account.

Thank you for being a valued Tiffins by Naari customer!`
        );
      }
    }

    res.status(200).json({
      message: `Item removed from ${day} ${meal} successfully.`,
      notifiedSubscribers: affectedSubs.length,
      menu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrUpdateMenu,
  submitForApproval,
  approveMenu,
  rejectMenu,
  getAllMenus,
  getMenuByProviderId,
  deleteMenu,
  deleteMenuItem,
};
