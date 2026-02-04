const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    goal: { type: String, required: true }, // Keeping as string to match "₹50,000" format or can parse later
    current: { type: String, required: true },
    progress: { type: Number, required: true },
    donors: { type: Number, default: 0 },
    daysLeft: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", CampaignSchema);
