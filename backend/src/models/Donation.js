const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    donorId: {
      type: String, // Changed to String to support external auth IDs (e.g., Clerk)
      required: false,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    donationItem: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["donation", "withdrawal", "monetary", "resource"], // Added monetary and resource
      default: "donation",
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", DonationSchema);
