const Donation = require("../models/Donation");
const Institute = require("../models/Institute");
const Shop = require("../models/Shop");

const fetchDonorHistory = async (donorId) => {
  if (!donorId) return [];
  try {
    return await Donation.find({ donorId }).sort({ createdAt: -1 }).limit(5);
  } catch (error) {
    console.error("Error fetching donor history:", error);
    return [];
  }
};

const searchRequests = async (query) => {
  if (!query) return [];
  try {
    const regex = new RegExp(query, 'i');
    return await Institute.find({
      $or: [
          { itemName: regex },
          { category: regex },
          { description: regex },
          { urgency: regex },
          { tags: regex }
      ]
    }).limit(5);
  } catch (error) {
    console.error("Error searching requests:", error);
    return [];
  }
};

const findNearbyShops = async (lat, lng) => {
  if (!lat || !lng) return [];
  try {
    return await Shop.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 5000 // 5km
        }
      }
    });
  } catch (error) {
    console.error("Error finding nearby shops:", error);
    return [];
  }
};

module.exports = { fetchDonorHistory, searchRequests, findNearbyShops };
