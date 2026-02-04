const express = require("express");
const router = express.Router();
const ImpactStory = require("../models/ImpactStory");

// @route   GET /api/impact-stories
// @desc    Get all impact stories
router.get("/", async (req, res) => {
  try {
    const stories = await ImpactStory.find();
    res.json({ success: true, stories });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   POST /api/impact-stories
// @desc    Create an impact story
router.post("/", async (req, res) => {
  try {
    const story = await ImpactStory.create(req.body);
    res.status(201).json({ success: true, story });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
