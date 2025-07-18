const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics");
const authMiddleware = require("../middleware/auth");

// All routes require authentication
router.use(authMiddleware);

// Analytics routes
router.get("/simple", analyticsController.getSimpleAnalytics);
router.get("/profile", analyticsController.getProfileAnalytics);
router.get("/profile/views", analyticsController.getProfileViews);
router.get("/profile/summary", analyticsController.getProfileSummary);

module.exports = router;
