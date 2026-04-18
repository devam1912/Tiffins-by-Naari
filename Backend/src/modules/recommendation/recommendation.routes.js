const express = require("express");
const { getNearbyRecommendations, getUserRecommendations } = require("./recommendation.controller");
const router = express.Router();

router.get("/nearby", getNearbyRecommendations);
router.get("/:userId", getUserRecommendations);

module.exports = router;
