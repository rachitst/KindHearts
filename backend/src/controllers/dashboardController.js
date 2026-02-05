const Donation = require("../models/Donation");
const Institute = require("../models/Institute");

const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Donations (Sum of amount)
    const donationStats = await Donation.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);

    const totalDonations = donationStats[0]?.totalAmount || 0;
    const donationCount = donationStats[0]?.count || 0;

    // 2. Active Institutes (Count of all institutes)
    const activeInstitutes = await Institute.countDocuments();

    // 3. Impact Count (Sum of items delivered or requests fulfilled)
    // We can sum the 'quantity' of fulfilled Institute requests
    const impactStats = await Institute.aggregate([
      { $match: { status: { $in: ["Delivered", "Completed"] } } },
      { $group: { _id: null, totalItems: { $sum: "$quantity" }, count: { $sum: 1 } } }
    ]);
    
    // Impact count can be a combination of donations made + fulfilled requests
    const impactCount = donationCount + (impactStats[0]?.count || 0);

    res.json({
      success: true,
      stats: {
        totalDonations,
        activeInstitutes,
        impactCount
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getDashboardStats };
