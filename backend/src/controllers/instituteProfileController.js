const InstituteProfile = require("../models/InstituteProfile");

// Create or Update Profile
const updateProfile = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let profile = await InstituteProfile.findOne({ email });

    if (profile) {
      // Update existing
      profile = await InstituteProfile.findOneAndUpdate(
        { email },
        { $set: req.body },
        { new: true }
      );
    } else {
      // Create new
      profile = new InstituteProfile(req.body);
      await profile.save();
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error updating institute profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Profile by Email
const getProfile = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const profile = await InstituteProfile.findOne({ email });
    
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching institute profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updateProfile, getProfile };
