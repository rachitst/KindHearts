const express = require("express");
const router = express.Router();
const { createShop, getShops } = require("../controllers/shopController");

router.post("/", createShop);
router.get("/", getShops);

module.exports = router;
