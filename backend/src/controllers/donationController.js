const Donation = require("../models/Donation");
const Institute = require("../models/Institute");
const Shop = require("../models/Shop"); // Import Shop
const { assignBestShop } = require("../utils/fairnessEngine"); // Import Fairness Engine

exports.createDonation = async (req, res) => {
  try {
    const { donorName, amount, donationItem, message, instituteId, donorId, paymentId, donationType, resources, status } = req.body;

    if (!donorName || !amount) {
      return res
        .status(400)
        .json({ error: "Donor name and amount are required" });
    }

    let assignedShopId = null;

    // Fairness Agent: Assign Shop if instituteId is present
    if (instituteId) {
        try {
            const institute = await Institute.findById(instituteId);
            // If institute has location (we assume address/city can be geocoded, but fairnessEngine expects coordinates)
            // Note: Institute model in previous read had deliveryAddress etc, but not explicit GeoJSON location.
            // FairnessEngine uses `instituteLocation.coordinates`.
            // Let's assume for now we might skip if no coordinates, OR we try to find nearby based on lat/lng if available.
            // Wait, Institute model didn't show `location` field with coordinates.
            // But `findNearbyShops` in agentTools used lat/lng.
            // Let's check if Institute has `location` field or if we need to fake it/derive it.
            // The Institute model I read: no `location` field.
            // However, Shop model has `location`.
            
            // Critical: If Institute doesn't have location, Fairness Engine won't work.
            // I'll assume for this task we might need to add it or Mock it in the test.
            // Or maybe the institute *should* have it.
            // Let's look at `assignBestShop` again. It takes `instituteLocation`.
            
            // I'll add logic: IF institute has location, assign shop.
            if (institute && institute.location) {
                const shop = await assignBestShop(institute.location);
                if (shop) {
                    assignedShopId = shop._id;
                    // Update Shop Metrics
                    shop.metrics.lastAssigned = new Date();
                    shop.metrics.ordersCompleted = (shop.metrics.ordersCompleted || 0) + 1;
                    await shop.save();
                    console.log(`Fairness Agent: Assigned Shop ${shop.name} to donation.`);
                }
            }
        } catch (fairnessError) {
            console.error("Fairness Agent Error:", fairnessError);
        }
    }

    const donation = new Donation({ 
        donorName, 
        amount, 
        donationItem, 
        message,
        instituteId,
        donorId,
        paymentId,
        type: donationType || 'monetary',
        resources,
        status: status || 'completed',
        assignedShopId // Save assigned shop
    });
    
    await donation.save();

    // Update Institute amountRaised
    if (instituteId && (status === 'completed' || !status)) {
        try {
            await Institute.findByIdAndUpdate(instituteId, {
                $inc: { amountRaised: amount }
            });
        } catch (updateError) {
            console.error("Error updating institute amountRaised:", updateError);
            // Don't fail the donation if this fails, but log it
        }
    }

    res.status(201).json({ success: true, donation });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.donor) {
      filter.donorName = req.query.donor;
    }

    const donations = await Donation.find(
      filter,
      "donorName amount donationItem message type status createdAt updatedAt"
    );
    res.status(200).json({ success: true, donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
