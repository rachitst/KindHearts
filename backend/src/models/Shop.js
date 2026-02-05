const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: { type: String, required: true, trim: true },
    owner: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, trim: true },
    
    metrics: {
      rating: { type: Number, default: 5 },
      ordersCompleted: { type: Number, default: 0 },
      lastAssigned: { type: Date },
    },
  },
  { timestamps: true }
);

shopSchema.index({ location: "2dsphere" });

const Shop = mongoose.models.Shop || mongoose.model("Shop", shopSchema);

module.exports = Shop;
