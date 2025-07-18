const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolio");
const authMiddleware = require("../middleware/auth");
const { validatePortfolioProject } = require("../middleware/validation");

// All routes require authentication
router.use(authMiddleware);

// CRUD operations for portfolio projects
router.post("/", validatePortfolioProject, portfolioController.createProject);
router.get("/", portfolioController.getProjects);
router.get("/:id", portfolioController.getProject);
router.put("/:id", validatePortfolioProject, portfolioController.updateProject);
router.delete("/:id", portfolioController.deleteProject);

// Project image management
router.post("/:id/images", portfolioController.addProjectImage);
router.delete("/:id/images/:imageId", portfolioController.removeProjectImage);
router.put("/:id/images/reorder", portfolioController.reorderProjectImages);

// Batch operations
router.put("/reorder", portfolioController.reorderProjects);
router.post("/batch", portfolioController.batchUpdateProjects);

module.exports = router;
