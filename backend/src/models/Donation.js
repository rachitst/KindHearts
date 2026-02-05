const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for now to support anonymous/existing data
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
      enum: ["donation", "withdrawal"],
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
