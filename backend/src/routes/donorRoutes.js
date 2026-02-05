const express = require("express");
const router = express.Router();
const { getDonorHistory, getImpactSummary } = require("../controllers/donorController");

router.get("/:id/history", getDonorHistory);
router.get("/:id/impact-summary", getImpactSummary);

module.exports = router;
