const Menu = require("./menu.model");
const Provider = require("./provider.model");

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

const publishMenu = async (req, res) => {
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

module.exports = { createOrUpdateMenu, publishMenu };
