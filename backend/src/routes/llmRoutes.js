const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { getInstituteRecommendations } = require("../utils/llmMatcher");
const { getInstituteNeeds } = require("../utils/llmInstitute");
const Groq = require("groq-sdk");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20, // Increased for chat
  message: { error: "Too many requests, please try again later." },
  headers: true,
});

router.use(limiter);

router.post("/chat", async (req, res) => {
  try {
    const { contents } = req.body;
    
    if (!contents || !Array.isArray(contents)) {
        return res.status(400).json({ error: { message: "Invalid contents format" } });
    }

    // Convert Gemini format to Groq/OpenAI format
    const messages = contents.map(msg => ({
        role: msg.role === "model" ? "assistant" : "user",
        content: msg.parts[0].text
    }));

    // Add system prompt if needed
    messages.unshift({ role: "system", content: "You are Sahayak, a helpful donation assistant for KindHearts platform." });

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const completion = await groq.chat.completions.create({
        messages: messages,
        model: "llama3-8b-8192", 
    });

    const text = completion.choices[0]?.message?.content || "";
    
    // Return in Gemini format to minimize frontend changes
    res.json({
        candidates: [{
            content: {
                parts: [{ text: text }]
            }
        }]
    });

  } catch (error) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: { message: error.message || "Internal server error" } });
  }
});

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
