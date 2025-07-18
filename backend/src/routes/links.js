const express = require("express");
const router = express.Router();
const linksController = require("../controllers/links");
const authMiddleware = require("../middleware/auth");
const { validateLink } = require("../middleware/validation");

// All routes require authentication
router.use(authMiddleware);

// CRUD operations for links
router.post("/", validateLink, linksController.createLink);
router.get("/", linksController.getLinks);
router.get("/:id", linksController.getLink);
router.put("/:id", validateLink, linksController.updateLink);
router.delete("/:id", linksController.deleteLink);

// Batch operations
router.put("/reorder", linksController.reorderLinks);
router.post("/batch", linksController.batchUpdateLinks);

module.exports = router;
