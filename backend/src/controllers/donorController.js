const Donation = require("../models/Donation");

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
