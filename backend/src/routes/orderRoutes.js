const express = require("express");
const {
  placeOrder,
  getOrdersByShop,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", placeOrder);

router.get("/:shopId", getOrdersByShop);

router.put("/:orderId/status", updateOrderStatus);

router.put("/:orderId", updateOrder);

router.delete("/:orderId", deleteOrder);

module.exports = router;
