const express = require("express");
const router = express.Router();
const educationController = require("../controllers/education");
const authMiddleware = require("../middleware/auth");
const { validateEducation } = require("../middleware/validation");

// All routes require authentication
router.use(authMiddleware);

// CRUD operations for education
router.post("/", validateEducation, educationController.createEducation);
router.get("/", educationController.getEducations);
router.get("/:id", educationController.getEducation);
router.put("/:id", validateEducation, educationController.updateEducation);
router.delete("/:id", educationController.deleteEducation);

// Batch operations
router.put("/reorder", educationController.reorderEducations);
router.post("/batch", educationController.batchUpdateEducations);

module.exports = router;
