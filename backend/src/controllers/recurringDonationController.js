const RecurringDonation = require("../models/RecurringDonation");

exports.createRecurringDonation = async (req, res) => {
  try {
    const { donorEmail, instituteId, instituteName, amount, frequency, startDate } = req.body;
    if (!donorEmail || !instituteId || !instituteName || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const nextDate = startDate
      ? new Date(startDate)
      : new Date();
    const donation = new RecurringDonation({
      donorEmail,
      instituteId,
      instituteName,
      amount,
      frequency: frequency || "Monthly",
      startDate: startDate ? new Date(startDate) : new Date(),
      nextDate,
      status: "active",
    });
    await donation.save();
    res.status(201).json({ success: true, donation });
  } catch (error) {
    console.error("Error creating recurring donation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getRecurringDonations = async (req, res) => {
  try {
    const { donorEmail } = req.query;
    const filter = donorEmail ? { donorEmail } : {};
    const donations = await RecurringDonation.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, donations });
  } catch (error) {
    console.error("Error fetching recurring donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateRecurringStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["active", "paused", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const donation = await RecurringDonation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    res.status(200).json({ success: true, donation });
  } catch (error) {
    console.error("Error updating recurring donation status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
