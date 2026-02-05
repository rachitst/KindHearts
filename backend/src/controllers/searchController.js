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
                    content: `You are a strict category classifier for a donation platform. 
                    Analyze the user's search query and extract:
                    1. A Category from this EXACT list: ['Food', 'Medical', 'Books', 'Disaster Relief']. If no clear match, use 'Other'.
                    2. Search Tags (keywords).
                    3. Urgency (Low, Medium, High, Critical).
                    
                    Return ONLY a JSON object: { "category": "String", "tags": ["String"], "urgency": "String" }`
                },
                {
                    role: "user",
                    content: query
                }
            ],
            model: process.env.GROQ_MODEL || "meta-llama/llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
        const extractedCategory = result.category;
        searchKeywords = result.tags || [];
        urgencyLevel = result.urgency;
        
        console.log("LLM Extracted:", { extractedCategory, searchKeywords, urgencyLevel });

        // Build Query with Scoring
        // We will fetch more results and filter/sort in memory for the custom scoring logic
        // because MongoDB simple find doesn't support custom weighted scoring easily without aggregation pipelines.
        
        // 1. Strict Filtering for Food/Hunger
        const isFoodRelated = extractedCategory === 'Food' || 
                              query.toLowerCase().includes('food') || 
                              query.toLowerCase().includes('hungry') || 
                              query.toLowerCase().includes('hunger');

        let dbQuery = {};
        
        if (isFoodRelated) {
             dbQuery = {
                 $or: [
                     { category: 'Food' },
                     { tags: { $in: [/food/i, /hunger/i, /meal/i, /ration/i] } },
                     { itemName: { $regex: /food|rice|wheat|meal/i } }
                 ]
             };
        } else {
             // General Search
             // We'll fetch a broad set of matches and then score them
             const regexQuery = [...searchKeywords, ...query.toLowerCase().split(" ")]
                .filter(t => t.length > 2)
                .map(term => new RegExp(term, 'i'));

             if (regexQuery.length > 0) {
                 dbQuery = {
                    $or: [
                        { category: { $in: regexQuery } }, // Category regex match
                        { tags: { $in: regexQuery } },
                        { itemName: { $in: regexQuery } },
                        { description: { $in: regexQuery } } // Broad regex on description
                    ]
                 };
                 
                 // If LLM found a category, prioritize it but don't restrict strictly unless it's Food (as per requirements)
                 // Actually, let's include the category in the OR for broader recall
                 if (extractedCategory && extractedCategory !== 'Other') {
                     dbQuery.$or.push({ category: extractedCategory });
                 }
             }
        }

        const potentialMatches = await Institute.find(dbQuery).lean();

        // Scoring System
        // Match in category = 10 points
        // Match in tags = 5 points
        // Match in description = 2 points
        // Urgency Bonus: Critical = 5, High = 3
        
        const scoredResults = potentialMatches.map(doc => {
            let score = 0;
            
            // Category Match
            if (doc.category === extractedCategory) score += 10;
            if (isFoodRelated && (doc.category === 'Food' || doc.category === 'Food & Nutrition')) score += 10;

            // Tags Match
            if (doc.tags && doc.tags.some(tag => searchKeywords.some(k => tag.toLowerCase().includes(k.toLowerCase())))) {
                score += 5;
            }

            // Description Match
            if (doc.description && searchKeywords.some(k => doc.description.toLowerCase().includes(k.toLowerCase()))) {
                score += 2;
            }
            
            // Urgency Bonus
            if (doc.urgency === 'Critical') score += 5;
            if (doc.urgency === 'High') score += 3;

            return { ...doc, score };
        });

        // Sort by Score (Desc) then Urgency (Critical first)
        scoredResults.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            // Secondary sort by urgency
            const urgencyWeight = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
            return (urgencyWeight[b.urgency] || 0) - (urgencyWeight[a.urgency] || 0);
        });

        // Return top 20
        const finalResults = scoredResults.slice(0, 20);

        return res.status(200).json({ success: true, count: finalResults.length, results: finalResults });

    } catch (llmError) {
        console.error("LLM Extraction/Search failed:", llmError);
        // Fallback to basic regex search if LLM fails
        // ... (Keep existing fallback or simplified one)
        const regex = new RegExp(query, 'i');
        const results = await Institute.find({
            $or: [{ itemName: regex }, { description: regex }, { category: regex }]
        }).limit(20);
        return res.status(200).json({ success: true, count: results.length, results });
    }

  } catch (error) {
    console.error("Error in semantic search:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
