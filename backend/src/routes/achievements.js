const express = require("express");
const router = express.Router();
const achievementController = require("../controllers/achievements");
const authMiddleware = require("../middleware/auth");
const { validateAchievement } = require("../middleware/validation");

// All routes require authentication
router.use(authMiddleware);

// CRUD operations for achievements
router.post("/", validateAchievement, achievementController.createAchievement);
router.get("/", achievementController.getAchievements);
router.get("/:id", achievementController.getAchievement);
router.put("/:id", validateAchievement, achievementController.updateAchievement);
router.delete("/:id", achievementController.deleteAchievement);

// Batch operations
router.put("/reorder", achievementController.reorderAchievements);
router.post("/batch", achievementController.batchUpdateAchievements);

module.exports = router;
