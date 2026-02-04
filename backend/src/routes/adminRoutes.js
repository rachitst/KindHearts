const express = require("express");
const { protect, adminMiddleware } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  updateUserStatus,
  getAllRequests,
  updateRequestStatus
} = require("../controllers/adminController");

const router = express.Router();

// Conditional RBAC: enable when process.env.ENABLE_ADMIN_AUTH === 'true'
const withAuth = process.env.ENABLE_ADMIN_AUTH === 'true';

if (withAuth) {
  router.get("/dashboard", protect, adminMiddleware, getDashboardStats);
  router.get("/requests", protect, adminMiddleware, getAllRequests);
  router.put("/requests/:requestId", protect, adminMiddleware, updateRequestStatus);
  router.put("/users/:userId", protect, adminMiddleware, updateUserStatus);
} else {
  router.get("/dashboard", getDashboardStats);
  router.get("/requests", getAllRequests);
  router.put("/requests/:requestId", updateRequestStatus);
  router.put("/users/:userId", updateUserStatus);
}

module.exports = router;
