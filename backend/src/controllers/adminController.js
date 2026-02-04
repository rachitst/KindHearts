const User = require("../models/User");
const Institute = require("../models/Institute");
const Donation = require("../models/Donation");

const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Donations Amount
    const donations = await Donation.find();
    const totalDonations = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);

    // 2. Pending & Completed Requests
    const pendingRequests = await Institute.countDocuments({ status: "Pending" });
    const completedRequests = await Institute.countDocuments({ status: "Completed" });
    
    // 3. Total Users Breakdown
    // Note: User model has role 'user' or 'admin'. Ideally we should have detailed roles.
    // For now, we'll try to guess or just return counts if we update User model to have institute/donor roles.
    // Assuming User model might have been updated or we just count all 'user' as generic.
    // To match mock data, we might need to rely on 'role' field being more granular or infer from other collections.
    // For now, let's just count by role if it exists.
    const institutesCount = await User.countDocuments({ role: "institute" });
    const donorsCount = await User.countDocuments({ role: "donor" });
    const shopkeepersCount = await User.countDocuments({ role: "shopkeeper" });
    // If roles are only 'user' and 'admin', these will be 0. 
    // We can fallback to counting all users if granular roles are missing.
    
    const totalUsersStats = {
      institutes: institutesCount,
      donors: donorsCount,
      shopkeepers: shopkeepersCount
    };

    // 4. Flagged Requests (High Urgency)
    const flaggedRequests = await Institute.countDocuments({ urgency: "Critical" });

    // 5. Monthly Donations (Aggregation)
    // Simple aggregation for last 5 months
    const monthlyDonations = await Donation.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          amount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    
    // Map aggregation to friendly format (Jan, Feb, etc.)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthly = monthlyDonations.map(item => ({
      month: months[item._id - 1],
      amount: item.amount
    }));

    res.json({
      totalDonations,
      pendingRequests,
      completedRequests,
      totalUsers: totalUsersStats,
      flaggedRequests,
      monthlyDonations: formattedMonthly.length > 0 ? formattedMonthly : [
        { month: 'Jan', amount: 0 },
        { month: 'Feb', amount: 0 },
        { month: 'Mar', amount: 0 },
        { month: 'Apr', amount: 0 },
        { month: 'May', amount: 0 },
      ]
    });
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.role) user.role = req.body.role;
    if (req.body.status) user.status = req.body.status;
    
    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await Institute.find().sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching all requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Institute.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (status) request.status = status;
    await request.save();

    res.json({ success: true, request });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getDashboardStats,
  updateUserStatus,
  getAllRequests,
  updateRequestStatus
};
