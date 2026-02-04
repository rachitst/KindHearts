const mongoose = require("mongoose");

const InstituteProfileSchema = new mongoose.Schema(
  {
    // Institute Details
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    description: { type: String },
    image: { type: String },
    instituteType: { type: String }, // 'Private', 'Public', etc.
    institutionId: { type: String },

    // Representative Details
    requesterName: { type: String },
    designation: { type: String },
    department: { type: String },
    contactNumber: { type: String },
    alternateContact: { type: String },

    // Default Delivery Details
    deliveryAddress: { type: String },
    landmark: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    preferredDeliveryTime: { type: String },

    // Verification Documents
    identityType: { type: String },
    identityNumber: { type: String },
    identityProof: { type: String },
    institutionLetter: { type: String },

    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InstituteProfile", InstituteProfileSchema);
