const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    owner: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);

const Shop = mongoose.models.Shop || mongoose.model("Shop", shopSchema);

module.exports = Shop;
