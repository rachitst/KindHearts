const express = require("express");
const router = express.Router();
const { getDonorHistory } = require("../controllers/donorController");

router.get("/:id/history", getDonorHistory);

module.exports = router;
