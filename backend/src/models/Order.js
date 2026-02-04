const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryAddress: { type: String },
    contactPerson: { type: String },
    contactNumber: { type: String },
    paymentStatus: { type: String, enum: ["pending", "completed"], default: "pending" },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "packaging", "ready", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
