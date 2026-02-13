const express = require("express");
const { getNearbyTiffins } = require("./tiffin.controller");
const { protect } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/nearby", protect, getNearbyTiffins);

module.exports = router;
