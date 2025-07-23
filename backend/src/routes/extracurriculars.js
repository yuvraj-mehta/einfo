const express = require("express");
const router = express.Router();
const extracurricularController = require("../controllers/extracurriculars");
const authMiddleware = require("../middleware/auth");
const { validateExtracurricular } = require("../middleware/validation");

// All routes require authentication
router.use(authMiddleware);

// CRUD operations for extracurriculars
router.post("/", validateExtracurricular, extracurricularController.createExtracurricular);
router.get("/", extracurricularController.getExtracurriculars);
router.get("/:id", extracurricularController.getExtracurricular);
router.put("/:id", validateExtracurricular, extracurricularController.updateExtracurricular);
router.delete("/:id", extracurricularController.deleteExtracurricular);

// Batch operations
router.put("/reorder", extracurricularController.reorderExtracurriculars);
router.post("/batch", extracurricularController.batchUpdateExtracurriculars);

module.exports = router;
