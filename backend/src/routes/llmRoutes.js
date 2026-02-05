const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { getInstituteRecommendations } = require("../utils/llmMatcher");
const { getInstituteNeeds } = require("../utils/llmInstitute");
const { fetchDonorHistory, searchRequests } = require("../utils/agentTools");
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
    const { contents, donorId } = req.body;
    
    if (!contents || !Array.isArray(contents)) {
        return res.status(400).json({ error: { message: "Invalid contents format" } });
    }

    // Fetch history
    let historyText = "No past donations.";
    if (donorId) {
        try {
            const history = await fetchDonorHistory(donorId);
            if (history && history.length > 0) {
                 historyText = `User's past donations: ${history.map(d => `${d.donationItem || d.type} (${d.amount})`).join(", ")}`;
            }
        } catch (e) { console.error("History fetch error", e); }
    }

    // Convert Gemini format to Groq/OpenAI format
    const messages = contents.map(msg => ({
        role: msg.role === "model" ? "assistant" : "user",
        content: msg.parts[0].text
    }));

    // Add system prompt if needed
    messages.unshift({ 
        role: "system", 
        content: `You are Sahayak, the KindHearts Donor Assistant. 
        
        CRITICAL RULES:
        1. You CANNOT process payments, collect money, or finalize donations. You are a chat guide only.
        2. If a user wants to donate, you MUST tell them: "Please visit the Browse & Donate page to complete your donation securely." or "You can click the Donate button on the specific institute's card."
        3. Do NOT make up currency conversion rates (like "100 bags = $1000") or confirm transactions.
        4. Use the user's history to make personal suggestions, but always direct them to the UI for action.
        
        User History: ${historyText}
        
        If they ask for suggestions, call the search tool for "Critical" urgency requests.` 
    });

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const tools = [
        {
            type: "function",
            function: {
                name: "searchRequests",
                description: "Search for donation requests based on urgency or keywords",
                parameters: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "Search query, e.g. 'Critical', 'Food', 'Education'" }
                    },
                    required: ["query"]
                }
            }
        }
    ];

    let completion = await groq.chat.completions.create({
        messages: messages,
        model: process.env.GROQ_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct", 
        tools: tools,
        tool_choice: "auto"
    });

    let responseMessage = completion.choices[0]?.message;

    // Handle tool calls
    if (responseMessage?.tool_calls) {
        messages.push(responseMessage);
        
        for (const toolCall of responseMessage.tool_calls) {
            if (toolCall.function.name === "searchRequests") {
                const args = JSON.parse(toolCall.function.arguments);
                const results = await searchRequests(args.query);
                
                messages.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(results)
                });
            }
        }
        
        // Second call
        completion = await groq.chat.completions.create({
            messages: messages,
            model: process.env.GROQ_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct", 
        });
        responseMessage = completion.choices[0]?.message;
    }

    const text = responseMessage?.content || "";
    
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
