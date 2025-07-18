const express = require("express");
const router = express.Router();
const publicController = require("../controllers/public");
const emailService = require("../services/email");

// Public routes (no authentication required)
router.get("/profile/:username", publicController.getPublicProfile);
router.post("/profile/:username/message", publicController.sendMessage);
router.post("/profile/:username/star", publicController.starProfile);
router.post("/profile/:username/click", publicController.trackClick);
router.get("/search", publicController.searchProfiles);

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "E-Info.me API is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
