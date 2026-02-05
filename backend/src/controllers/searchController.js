const Institute = require("../models/Institute");
const Groq = require("groq-sdk");

exports.semanticSearch = async (req, res) => {
  try {
    const { query } = req.body; // Expecting { query: "urgent food for kids" }

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    let searchKeywords = [];
    let urgencyLevel = null;

    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a keyword extraction assistant. Extract relevant search tags (like 'food', 'education', 'clothes') and urgency (Low, Medium, High, Critical) from the user's query. Return JSON format: { tags: [], urgency: string | null }."
                },
                {
                    role: "user",
                    content: query
                }
            ],
            model: process.env.GROQ_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct",
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
        searchKeywords = result.tags || [];
        urgencyLevel = result.urgency;
        
        console.log("LLM Extracted:", { searchKeywords, urgencyLevel });

    } catch (llmError) {
        console.error("LLM Extraction failed, falling back to basic split:", llmError);
        searchKeywords = query.toLowerCase().split(" ");
    }

    // Combine extracted keywords with original query terms for fallback
    const basicTerms = query.toLowerCase().split(" ");
    const allTerms = [...new Set([...searchKeywords, ...basicTerms])];
    
    const regexQuery = allTerms.map(term => new RegExp(term, 'i'));

    const dbQuery = {
      $or: [
        { tags: { $in: regexQuery } },
        { itemName: { $in: regexQuery } },
        { category: { $in: regexQuery } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    if (urgencyLevel) {
        // Boost urgency matches or filter? Let's treat it as an OR condition with high priority if we were scoring,
        // but for simple find, we can add it to OR or make it strict if user explicitly asked.
        // For now, let's add it to the OR criteria to include matching urgency.
        dbQuery.$or.push({ urgency: urgencyLevel });
    }

    const results = await Institute.find(dbQuery).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: results.length, results });
  } catch (error) {
    console.error("Error in semantic search:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
