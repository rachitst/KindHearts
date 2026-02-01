const express = require("express");
const { protect, adminMiddleware } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  updateUserStatus,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/dashboard", protect, adminMiddleware, getDashboardStats);

router.put("/users/:userId", protect, adminMiddleware, updateUserStatus);

module.exports = router;
