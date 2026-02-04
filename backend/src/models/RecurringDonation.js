const mongoose = require("mongoose");

const RecurringDonationSchema = new mongoose.Schema(
  {
    donorEmail: { type: String, required: true, trim: true },
    instituteId: { type: String, required: true, trim: true },
    instituteName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    frequency: { type: String, enum: ["Monthly", "Quarterly", "Yearly"], default: "Monthly" },
    startDate: { type: Date, default: Date.now },
    nextDate: { type: Date },
    status: { type: String, enum: ["active", "paused", "cancelled"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecurringDonation", RecurringDonationSchema);
