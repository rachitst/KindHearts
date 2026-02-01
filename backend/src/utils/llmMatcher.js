const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const Institute = require("../models/Institute");
const Donation = require("../models/Donation");

async function getInstituteRecommendations(donorName, donationItem) {
  try {
    const allInstitutes = await Institute.find();
    const pastDonations = await Donation.find({ donorName });

    const interactionMap = {};
    pastDonations.forEach((d) => {
      interactionMap[d.institutionId] =
        (interactionMap[d.institutionId] || 0) + 1;
    });

    const formattedInstitutes = allInstitutes
      .map((inst) => {
        const relevantFields = [
          inst.category,
          inst.itemName,
          inst.specifications,
        ].filter(Boolean);
        const demandScore = relevantFields.some((field) =>
          field.toLowerCase().includes(donationItem.toLowerCase())
        )
          ? 1
          : 0;

        const pastInteraction = interactionMap[inst.institutionId] || 0;
        const distance = Math.random() * 10;

        return `${inst.name}: 
          Demand=${demandScore}, 
          Past_Interaction=${pastInteraction}, 
          Distance=${distance.toFixed(2)}`;
      })
      .join("\n");

    const prompt = `
      Given a donor **${donorName}** who wants to donate **${donationItem}**, rank institutes using:

      Score(i) = 0.5 * Demand(i) + 0.3 * Past_Interaction(i) - 0.2 * Distance(i)

      Institute data:
      ${formattedInstitutes}

      Compute scores and return the **top 3 matching institutes** in this format:
      **Selected Institutes:** Institute1(Score), Institute2(Score), Institute3(Score).
    `;

    console.log("\n🔹 LLM Prompt Sent:");
    console.log(prompt);

    const result = await model.generateContent(prompt);
    if (!result || !result.response || !result.response.candidates) {
      console.log("⚠️ Invalid LLM response.");
      return { success: false, message: "Invalid LLM response" };
    }

    const reasoningText =
      result.response.candidates[0]?.content?.parts[0]?.text.trim() ||
      "No response from LLM";
    console.log("\n🔹 LLM Response:");
    console.log(reasoningText);

    const selectedInstitutesMatch = reasoningText.match(
      /\*\*Selected Institutes:\*\* (.+)/
    );
    const selectedInstitutes = selectedInstitutesMatch
      ? selectedInstitutesMatch[1].split(",").map((entry) => {
          const [name, score] = entry.trim().split("(");
          return { name: name.trim(), score: parseFloat(score) || 0 };
        })
      : [];

    const matchedInstitutes = await Institute.find({
      name: { $in: selectedInstitutes.map((inst) => inst.name) },
    });

    return {
      success: true,
      recommendation: reasoningText,
      matchedInstitutes,
    };
  } catch (error) {
    console.error("LLM Error:", error);
    return { success: false, message: "Internal server error" };
  }
}

module.exports = { getInstituteRecommendations };
