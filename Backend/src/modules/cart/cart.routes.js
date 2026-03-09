const express = require("express");
const { protect } = require("../../middlewares/auth.middleware");
const {
    getCart,
    addItemToCart,
    removeItemFromCart,
    clearCart
} = require("./cart.controller");

const router = express.Router();

// All routes are protected and for authenticated users
router.use(protect);

router.get("/", getCart);
router.post("/add", addItemToCart);
router.post("/remove", removeItemFromCart);
router.delete("/clear", clearCart);

module.exports = router;
