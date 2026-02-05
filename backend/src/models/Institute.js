const mongoose = require("mongoose");

const InstituteSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
    description: { type: String },
    image: { type: String },

    instituteType: { type: String }, // Added to store 'Private', 'Public', etc.
    category: { type: String },
    itemName: { type: String },
    type: { type: String, enum: ["monetary", "resource"], default: "resource" },
    quantity: { type: Number },
    amountNeeded: { type: Number }, // For monetary requests
    amountRaised: { type: Number, default: 0 },
    tags: [{ type: String }], // For semantic search categorization
    urgency: { type: String, enum: ["Low", "Medium", "High", "Critical"] },
    status: { 
      type: String, 
      enum: ["Pending", "Processing", "Delivered", "Completed", "Cancelled"], 
      default: "Pending" 
    },
    specifications: { type: String },
    expectedDeliveryDate: { type: Date },

    requesterName: { type: String },
    designation: { type: String },
    department: { type: String },
    contactNumber: { type: String },
    alternateContact: { type: String },
    institutionId: { type: String },

    deliveryAddress: { type: String },
    landmark: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    preferredDeliveryTime: { type: String },

    identityType: { type: String },
    identityNumber: { type: String },
    identityProof: { type: String },
    institutionLetter: { type: String },

    purpose: { type: String },
    beneficiaryCount: { type: Number },
    previousDonations: { type: Boolean, default: false },
    previousDonationDetails: { type: String },
    specialRequirements: { type: String },
    termsAccepted: { type: Boolean },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Institute", InstituteSchema);
