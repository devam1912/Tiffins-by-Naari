const MealSelection = require("./mealSelection.model");
const Subscription = require("./subscription.model");

const selectMealForDay = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { date, selectedItems } = req.body;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (subscription.status !== "active") {
      return res.status(400).json({
        message: "Subscription is not active",
      });
    }

    if (subscription.remainingMeals <= 0) {
      return res.status(400).json({
        message: "No remaining meals available",
      });
    }

    const selectedDate = new Date(date);

    if (
      selectedDate < subscription.startDate ||
      selectedDate > subscription.endDate
    ) {
      return res.status(400).json({
        message: "Date outside subscription period",
      });
    }

    // Prevent duplicate selection (unique index also protects)
    const existingSelection = await MealSelection.findOne({
      subscription: subscriptionId,
      date: selectedDate,
    });

    if (existingSelection) {
      return res.status(400).json({
        message: "Meal already selected for this date",
      });
    }

    const mealSelection = await MealSelection.create({
      subscription: subscriptionId,
      user: req.user._id,
      date: selectedDate,
      selectedItems,
    });

    subscription.remainingMeals -= 1;
    await subscription.save();

    res.status(201).json({
      message: "Meal selected successfully",
      remainingMeals: subscription.remainingMeals,
      mealSelection,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { selectMealForDay };
