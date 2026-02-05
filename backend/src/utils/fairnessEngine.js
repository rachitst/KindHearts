const Shop = require("../models/Shop");

const assignBestShop = async (instituteLocation) => {
  try {
    // 1. Find shops within 5km
    const shops = await Shop.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: instituteLocation.coordinates
          },
          $maxDistance: 5000 // 5km
        }
      }
    });

    if (!shops || shops.length === 0) {
      return null;
    }

    // 2. Sort by fairness criteria:
    // Primary: Last assigned time (Ascending) - Give chance to those waiting longest
    // Secondary: Rating (Descending) - Prefer better rated shops
    
    shops.sort((a, b) => {
        const timeA = a.metrics?.lastAssigned ? new Date(a.metrics.lastAssigned).getTime() : 0;
        const timeB = b.metrics?.lastAssigned ? new Date(b.metrics.lastAssigned).getTime() : 0;
        
        // If time difference is significant (e.g. > 24 hours), prioritize time
        // Otherwise, prioritize rating
        
        if (timeA !== timeB) {
            return timeA - timeB; // Oldest assignment first
        }
        
        const ratingA = a.metrics?.rating || 0;
        const ratingB = b.metrics?.rating || 0;
        
        return ratingB - ratingA; // Higher rating first
    });

    return shops[0];
    
  } catch (error) {
    console.error("Error in Fairness Engine:", error);
    return null;
  }
};

module.exports = { assignBestShop };
