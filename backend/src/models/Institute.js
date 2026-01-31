const mongoose = require("mongoose");

const InstituteSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    description: { type: String },

    category: { type: String },
    itemName: { type: String },
    quantity: { type: Number },
    urgency: { type: String, enum: ["Low", "Medium", "High"] },
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
