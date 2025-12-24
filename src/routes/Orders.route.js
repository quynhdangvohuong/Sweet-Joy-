const express = require("express");
const router = express.Router();
const orderController = require("../controllers/Orders.controller");
const auth = require("../middlewares/auth.middleware");

// User
router.post("/", auth, orderController.createOrder);     // Checkout
router.get("/my-orders", auth, orderController.getOrdersByUser);

module.exports = router;
