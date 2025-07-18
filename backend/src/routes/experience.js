const express = require("express");
const router = express.Router();
const experienceController = require("../controllers/experience");
const authMiddleware = require("../middleware/auth");
const { validateExperience } = require("../middleware/validation");

// All routes require authentication
router.use(authMiddleware);

// CRUD operations for work experience
router.post("/", validateExperience, experienceController.createExperience);
router.get("/", experienceController.getExperiences);
router.get("/:id", experienceController.getExperience);
router.put("/:id", validateExperience, experienceController.updateExperience);
router.delete("/:id", experienceController.deleteExperience);

// Experience project management
router.post("/:id/projects", experienceController.addExperienceProject);
router.put("/:id/projects/:projectId", experienceController.updateExperienceProject);
router.delete("/:id/projects/:projectId", experienceController.removeExperienceProject);
router.put("/:id/projects/reorder", experienceController.reorderExperienceProjects);

// Batch operations
router.put("/reorder", experienceController.reorderExperiences);
router.post("/batch", experienceController.batchUpdateExperiences);

module.exports = router;
