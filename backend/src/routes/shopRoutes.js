const express = require("express");
const router = express.Router();
const { createShop, getShops, getShopStats } = require("../controllers/shopController");

router.post("/", createShop);
router.get("/", getShops);
router.get("/:id/stats", getShopStats);

module.exports = router;
