const Shop = require("../models/Shop");

const createShop = async (req, res) => {
  try {
    const { name, location, owner, email, phone } = req.body;

    if (!name || !location || !owner || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let shop = await Shop.findOne({ email });
    if (shop) {
        return res.status(200).json({ success: true, shop, message: "Shop already exists" });
    }

    shop = new Shop({ name, location, owner, email, phone });
    await shop.save();

    res.status(201).json({ success: true, shop });
  } catch (error) {
    console.error("Error creating shop:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getShops = async (req, res) => {
  try {
    const filter = {};
    if (req.query.owner) {
      filter.owner = req.query.owner;
    }
    if (req.query.email) {
      filter.email = req.query.email;
    }

    const shops = await Shop.find(filter).sort({ createdAt: -1 });
    
    // Inject mock stats for frontend compatibility
    const shopsWithStats = shops.map(shop => ({
      ...shop.toObject(),
      rating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1), // Random rating 3.5 - 5.0
      completedRequests: Math.floor(Math.random() * 50) + 10,
      activeRequests: Math.floor(Math.random() * 5),
      totalEarnings: Math.floor(Math.random() * 50000) + 10000,
      availability: Math.random() > 0.2 // 80% available
    }));

    res.status(200).json({ success: true, shops: shopsWithStats });
  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createShop, getShops };
