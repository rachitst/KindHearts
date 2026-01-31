const express = require("express");
const router = express.Router();
const Institute = require("../models/Institute");
const Donation = require("../models/Donation");

// @route   POST /api/batch
// @desc    Batch insert institutes and donations
router.post("/", async (req, res) => {
  try {
    const { institutes, donations } = req.body;

    if (!institutes || !donations) {
      return res.status(400).json({ error: "Missing required data" });
    }

    const createdInstitutes = await Institute.insertMany(institutes);
    const createdDonations = await Donation.insertMany(donations);

    res.status(201).json({
      success: true,
      message: "Batch data inserted successfully",
      institutes: createdInstitutes,
      donations: createdDonations,
    });
  } catch (error) {
    console.error("Batch Insert Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
