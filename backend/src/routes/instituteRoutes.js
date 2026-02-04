const express = require("express");
const router = express.Router();
const Institute = require("../models/Institute");

router.post("/", async (req, res) => {
  try {
    // Create institute object only with fields that are provided in req.body
    const instituteData = {};

    // List of all possible fields
    const fields = [
      "name",
      "email",
      "phone",
      "address",
      "description",
      "category",
      "itemName",
      "quantity",
      "urgency",
      "specifications",
      "expectedDeliveryDate",
      "requesterName",
      "designation",
      "department",
      "contactNumber",
      "alternateContact",
      "institutionId",
      "deliveryAddress",
      "landmark",
      "city",
      "state",
      "pincode",
      "preferredDeliveryTime",
      "identityType",
      "identityNumber",
      "identityProof",
      "institutionLetter",
      "purpose",
      "beneficiaryCount",
      "previousDonations",
      "previousDonationDetails",
      "specialRequirements",
      "termsAccepted",
      "image",
      "type",
      "instituteType",
      "status"
    ];

    // Only add fields that are present in req.body
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        instituteData[field] = req.body[field];
      }
    });

    const institute = new Institute(instituteData);
    await institute.save();
    res.status(201).json({ success: true, institute });
  } catch (error) {
    console.error("Error registering institute request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email) {
      query.email = email;
    }
    const institutes = await Institute.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, institutes });
  } catch (error) {
    console.error("Error fetching institute requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update request status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const request = await Institute.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (status) request.status = status;
    await request.save();

    res.status(200).json({ success: true, request });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get stats for an institute
router.get("/stats", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const requests = await Institute.find({ email });
    
    const stats = {
      totalRequests: requests.length,
      pendingRequests: requests.filter(r => r.status === 'Pending' || r.status === 'Processing').length,
      completedRequests: requests.filter(r => r.status === 'Completed' || r.status === 'Delivered').length,
      urgentRequests: requests.filter(r => r.urgency === 'High' || r.urgency === 'Critical').length
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching institute stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get requests for a specific institute (My Requests)
router.get("/my-requests", async (req, res) => {
  try {
    const { email, status } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const query = { email };
    if (status && status !== 'All') {
      query.status = status;
    }

    const requests = await Institute.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching my requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single request by ID
router.get("/:id", async (req, res) => {
  try {
    const request = await Institute.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.status(200).json({ success: true, request });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
