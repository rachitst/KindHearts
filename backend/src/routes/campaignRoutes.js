const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");

// @route   GET /api/campaigns
// @desc    Get all campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json({ success: true, campaigns });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   POST /api/campaigns
// @desc    Create a campaign
router.post("/", async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    res.status(201).json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   PUT /api/campaigns/:id
// @desc    Update a campaign
router.put("/:id", async (req, res) => {
  try {
    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Campaign not found" });
    res.json({ success: true, campaign: updated });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   DELETE /api/campaigns/:id
// @desc    Delete a campaign
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Campaign not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
