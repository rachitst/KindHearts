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

    // shop = new Shop({ name, location, owner, email, phone });
    // Assuming location comes as { lat, lng } or similar from frontend, 
    // but for now we might need to default it or parse it.
    // Since the frontend probably sends a string address, we need to geocode it.
    // For this task, we will just use a default or expect coordinates if provided.
    // If location is a string (address), we put it in address and mock coordinates or expect them.
    
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

module.exports = { createShop, getShops };
