const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile");
const authMiddleware = require("../middleware/auth");
const { validateProfileUpdate } = require("../middleware/validation");

// Protected routes (require authentication)
router.get("/", authMiddleware, profileController.getMyProfile);
router.get("/me", authMiddleware, profileController.getMyProfile);
router.put("/me", authMiddleware, validateProfileUpdate, profileController.updateProfile);
router.put("/account", authMiddleware, profileController.updateAccount);
router.put("/instant-message", authMiddleware, profileController.updateInstantMessage);

// New profile update routes
router.put("/basic", authMiddleware, profileController.updateBasicProfile);
router.put("/visibility", authMiddleware, profileController.updateVisibilitySettings);
router.put("/links", authMiddleware, profileController.updateLinks);
router.put("/experiences", authMiddleware, profileController.updateExperiences);
router.put("/portfolio", authMiddleware, profileController.updatePortfolio);
router.put("/education", authMiddleware, profileController.updateEducation);

// Public routes
router.get("/:username", profileController.getPublicProfile);

module.exports = router;
