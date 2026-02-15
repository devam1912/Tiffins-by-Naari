const express = require("express");
const { selectMealForDay } = require("./mealSelection.controller");
const { protect } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post("/:subscriptionId/select", protect, selectMealForDay);

module.exports = router;
