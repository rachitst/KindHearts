const express = require("express");
const router = express.Router();
const { updateProfile, getProfile } = require("../controllers/instituteProfileController");

router.post("/", updateProfile);
router.get("/:email", getProfile);

module.exports = router;
