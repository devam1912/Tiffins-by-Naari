const express = require("express");
const { getNearbyRecommendations } = require("./recommendation.controller");
const router = express.Router();

router.get("/nearby", getNearbyRecommendations);

module.exports = router;
