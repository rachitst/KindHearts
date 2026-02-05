const Donation = require("../models/Donation");
const Groq = require("groq-sdk");

exports.getDonorHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Assuming donorId is stored in the donation record.
    // Since we just added donorId field, older records might not have it.
    // We might also need to query by donorName if donorId is not populated in old data,
    // but the requirement is to use donorId.
    
    const donations = await Donation.find({ donorId: id }).sort({ createdAt: -1 });
    
    if (!donations || donations.length === 0) {
        // Fallback or just return empty
        return res.status(200).json({ success: true, donations: [], message: "No history found for this donor" });
    }

    res.status(200).json({ success: true, donations });
  } catch (error) {
    console.error("Error fetching donor history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getImpactSummary = async (req, res) => {
    try {
        const { id } = req.params;
        const donations = await Donation.find({ donorId: id }).sort({ createdAt: -1 });

        if (!donations || donations.length === 0) {
            return res.status(200).json({ 
                success: true, 
                summary: "You haven't started your journey yet, but the world is waiting for your kindness!",
                stats: { livesImpacted: 0, primaryCause: "N/A", streak: 0, cities: 0 }
            });
        }

        // Calculate Stats
        // 1. Total Lives Impacted (Mock calculation if beneficiaryCount isn't on donation, else use amount logic)
        // Assuming 100 INR = 1 Life/Meal for simplicity if beneficiaryCount missing
        // Or fetch Institute details. For now, let's estimate: Amount / 50
        const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
        const livesImpacted = Math.floor(totalAmount / 50); 

        // 2. Primary Cause
        const causeCounts = {};
        donations.forEach(d => {
            // If donation has category field or derive from donationItem
            const cause = d.donationItem ? d.donationItem.split(' ')[0] : "General";
            causeCounts[cause] = (causeCounts[cause] || 0) + 1;
        });
        const primaryCause = Object.keys(causeCounts).reduce((a, b) => causeCounts[a] > causeCounts[b] ? a : b);

        // 3. Consistency Streak (Months in a row)
        // Simplified: Count distinct months in sorted donations
        const months = new Set(donations.map(d => new Date(d.createdAt).toISOString().slice(0, 7))); // YYYY-MM
        const streak = months.size;

        // 4. Geographic Reach (Mock if no city data on donation, or count unique institutes)
        const uniqueInstitutes = new Set(donations.map(d => d.instituteId)).size;
        
        const stats = {
            livesImpacted,
            primaryCause,
            streak,
            cities: uniqueInstitutes // Proxy for cities
        };

        // Generate AI Story
        try {
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
            
            // Format donations for LLM
            const donationList = donations.slice(0, 10).map(d => 
                `${new Date(d.createdAt).toDateString()}: ${d.amount} INR for ${d.donationItem}`
            ).join("\n");

            const prompt = `You are a master storyteller for KindHearts. Look at this list of donations and write a short, 3-sentence emotional "Impact Story" summary. Focus on the collective change—how many lives touched and the diversity of help provided (e.g., "From books to bread...").
            
            IMPORTANT: Return ONLY the story text. Do NOT include any introductory phrases like "Here is a story" or "Impact Story Summary". Start directly with the story.
            
            Donations:
            ${donationList}`;

            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: process.env.GROQ_MODEL || "meta-llama/llama-3.3-70b-versatile",
            });

            const story = completion.choices[0]?.message?.content || "Your kindness has touched many lives.";
            
            res.status(200).json({ success: true, summary: story, stats });

        } catch (llmError) {
            console.error("LLM Impact Story failed:", llmError);
            res.status(200).json({ 
                success: true, 
                summary: `You have made ${donations.length} donations totaling ₹${totalAmount}, impacting approximately ${livesImpacted} lives. Thank you!`,
                stats 
            });
        }

    } catch (error) {
        console.error("Error generating impact summary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
