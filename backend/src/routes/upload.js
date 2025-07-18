const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  },
});

// All routes require authentication
router.use(authMiddleware);

// Upload routes
router.post("/profile-image", upload.single('image'), uploadController.uploadProfileImage);
router.post("/portfolio-image", upload.single('image'), uploadController.uploadPortfolioImage);
router.post("/education-image", upload.single('image'), uploadController.uploadEducationImage);
router.post("/resume", upload.single('file'), uploadController.uploadResume);

// Delete uploaded files
router.delete("/file/:publicId", uploadController.deleteFile);

module.exports = router;
