const { GoogleGenerativeAI } = require("@google/generative-ai");
const natural = require("natural");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const Institute = require("../models/Institute");
const Donation = require("../models/Donation");

function cosineSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;

  const tokenizer = new natural.WordTokenizer();
  const tfidf = new natural.TfIdf();

  const tokens1 = tokenizer.tokenize(text1.toLowerCase());
  const tokens2 = tokenizer.tokenize(text2.toLowerCase());

  tfidf.addDocument(tokens1);
  tfidf.addDocument(tokens2);

  const vector1 = [];
  const vector2 = [];

  const vocabulary = Array.from(new Set([...tokens1, ...tokens2]));

  vocabulary.forEach((word) => {
    vector1.push(tfidf.tfidf(word, 0));
    vector2.push(tfidf.tfidf(word, 1));
  });

  const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
  const magnitude1 = Math.sqrt(
    vector1.reduce((sum, val) => sum + val * val, 0)
  );
  const magnitude2 = Math.sqrt(
    vector2.reduce((sum, val) => sum + val * val, 0)
  );

  return magnitude1 && magnitude2 ? dotProduct / (magnitude1 * magnitude2) : 0;
}

async function getInstituteNeeds(instituteId) {
  try {
    const institute = await Institute.findById(instituteId);

    if (!institute) {
      return { success: false, message: "Institute not found" };
    }

    console.log("\n🔹 Institute Request Data:");
    console.log({
      name: institute.name,
      category: institute.category,
      itemName: institute.itemName,
      specifications: institute.specifications,
    });

    const donations = await Donation.find();
    if (!donations.length) {
      console.log("⚠️ No donations found in the database.");
      return { success: false, message: "No available donations" };
    }

    console.log("\n🔹 Donations in Database:");
    donations.forEach((d) =>
      console.log(`- ${d.donorName} donated ${d.donationItem}`)
    );

    let rankedDonations = [];

    donations.forEach((donation) => {
      const scores = [];

      scores.push(cosineSimilarity(donation.donationItem, institute.itemName));
      scores.push(cosineSimilarity(donation.donationItem, institute.category));
      scores.push(
        cosineSimilarity(donation.donationItem, institute.specifications)
      );

      const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;

      console.log(
        `\n🔹 Matching: "${donation.donationItem}" vs "${institute.itemName}, ${institute.category}, ${institute.specifications}" `
      );
      console.log(`Similarity Score: ${avgScore.toFixed(3)}`);

      if (avgScore > 0.1) {
        rankedDonations.push({
          donorName: donation.donorName || "Unknown Donor",
          donationItem: donation.donationItem || "Unknown Item",
          score: avgScore.toFixed(3),
        });
      }
    });

    rankedDonations.sort((a, b) => b.score - a.score);

    if (!rankedDonations.length) {
      console.log("⚠️ No matching donations found.");
      return { success: false, message: "No matching donations found" };
    }

    const formattedDonations = rankedDonations
      .map(
        (d) =>
          `- **${d.donorName}** (Donated: ${d.donationItem}, Score: ${d.score})`
      )
      .join("\n");

    console.log("\n🔹 Ranked Donations:");
    console.log(formattedDonations);

    const prompt = `
      The institute **${institute.name}** requested **${institute.itemName}** under the **${institute.category}** category.
      Urgency level: **${institute.urgency}**.
      Specifications: **${institute.specifications}**.

      Here are the top-ranked available donations:

      ${formattedDonations}

      Suggest which donor should donate which item to best match the institute's needs.
      Format: **John Doe should donate Books, Alice should donate Food.**
    `;

    console.log("\n🔹 LLM Prompt Sent:");
    console.log(prompt);

    const result = await model.generateContent(prompt);

    if (!result || !result.response || !result.response.candidates) {
      console.log("⚠️ Invalid LLM response.");
      return { success: false, message: "Invalid LLM response" };
    }

    const reasoningText =
      result.response.candidates[0]?.content?.parts[0]?.text ||
      "No response from LLM";

    return {
      success: true,
      instituteNeeds: institute.itemName,
      rankedDonations,
      recommendation: reasoningText,
    };
  } catch (error) {
    console.error("LLM Error:", error);
    return { success: false, message: "Internal server error" };
  }
}

module.exports = { getInstituteNeeds };
