const Donation = require("../models/Donation");

exports.createDonation = async (req, res) => {
  try {
    const { donorName, amount, donationItem, message } = req.body;

    if (!donorName || !amount) {
      return res
        .status(400)
        .json({ error: "Donor name and amount are required" });
    }

    const donation = new Donation({ donorName, amount, donationItem, message });
    await donation.save();

    res.status(201).json({ success: true, donation });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.donor) {
      filter.donorName = req.query.donor;
    }

    const donations = await Donation.find(
      filter,
      "donorName amount donationItem message type status createdAt updatedAt"
    );
    res.status(200).json({ success: true, donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
