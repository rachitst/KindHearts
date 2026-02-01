const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { getInstituteRecommendations } = require("../utils/llmMatcher");
const { getInstituteNeeds } = require("../utils/llmInstitute");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: { error: "Too many requests, please try again later." },
  headers: true,
});

router.use(limiter);

router.get("/match-donor", async (req, res) => {
  try {
    const { donorName, donationItem } = req.query;

    if (!donorName || !donationItem) {
      return res
        .status(400)
        .json({ error: "Missing donorName or donationItem" });
    }

    const recommendation = await getInstituteRecommendations(
      donorName,
      donationItem
    );
    res.status(200).json({ success: true, recommendation });
  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/match-institute/:instituteId", async (req, res) => {
  try {
    const { instituteId } = req.params;
    const recommendation = await getInstituteNeeds(instituteId);
    res.status(200).json({ success: true, recommendation });
  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
