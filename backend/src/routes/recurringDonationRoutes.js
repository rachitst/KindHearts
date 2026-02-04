const express = require("express");
const router = express.Router();
const {
  createRecurringDonation,
  getRecurringDonations,
  updateRecurringStatus,
} = require("../controllers/recurringDonationController");

router.post("/", createRecurringDonation);
router.get("/", getRecurringDonations);
router.put("/:id/status", updateRecurringStatus);

module.exports = router;
