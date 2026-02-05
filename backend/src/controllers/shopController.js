const Shop = require("../models/Shop");
const Order = require("../models/Order");
const mongoose = require("mongoose");

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
    
    // Simplification: Require coordinates in body or default to [0,0]
    const coordinates = req.body.coordinates || [0, 0]; 
    
    shop = new Shop({ 
      name, 
      address: typeof location === 'string' ? location : "Unknown Address",
      location: { type: "Point", coordinates },
      owner, 
      email, 
      phone 
    });
    
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
    
    res.status(200).json({ success: true, shops });
  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getShopStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid shop id" });
    }
    const shopObjectId = new mongoose.Types.ObjectId(id);
    
    // 1. Total Orders
    const totalOrders = await Order.countDocuments({ shop: shopObjectId });

    // 2. Pending Orders (Ready or In Progress)
    // Mapping user's "Ready or In Progress" to enum: ["pending", "accepted", "packaging", "ready"]
    const pendingOrders = await Order.countDocuments({ 
      shop: shopObjectId, 
      status: { $in: ["pending", "accepted", "packaging", "ready"] } 
    });

    // 3. Total Earnings (Sum of price of 'Delivered' orders)
    // Status 'completed' corresponds to 'Delivered' in our schema enum check
    const earningsAgg = await Order.aggregate([
      { 
        $match: { 
          shop: shopObjectId, 
          status: { $in: ["completed", "delivered"] } 
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: "$totalAmount" } 
        } 
      }
    ]);
    const totalEarnings = earningsAgg[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        totalEarnings
      }
    });
  } catch (error) {
    console.error("Error fetching shop stats:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { createShop, getShops, getShopStats };
