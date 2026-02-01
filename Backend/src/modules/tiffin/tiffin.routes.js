const express = require("express");
const { getNearbyTiffins } = require("./tiffin.controller");

const router = express.Router();

router.get("/nearby", getNearbyTiffins);

module.exports = router;
