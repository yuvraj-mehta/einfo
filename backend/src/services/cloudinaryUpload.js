const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const logger = require("../utils/logger");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudinaryUploadService {
  constructor() {
    // Configure multer for memory storage
    this.upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
        files: 5,
      },
      fileFilter: this.validateFile.bind(this),
    });
  }

  validateFile(req, file, cb) {
    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const allowedDocTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file.fieldname === "resume") {
      if (allowedDocTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only PDF and Word documents are allowed for resumes."));
      }
    } else {
      if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."));
      }
    }
  }

  async uploadProfileImage(file, userId) {
    try {
      // Process image with Sharp
      const processedImage = await sharp(file.buffer)
        .resize(400, 400, { 
          fit: "cover",
          position: "center"
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "profiles",
            public_id: `profile_${userId}_${uuidv4()}`,
            transformation: [
              { width: 400, height: 400, crop: "fill" },
              { quality: "auto" },
              { fetch_format: "auto" }
            ],
            overwrite: true,
            invalidate: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(processedImage);
      });

      return result; // Return full result object with secure_url and public_id
    } catch (error) {
      logger.error("Profile image upload error", {
        error: error.message,
        stack: error.stack,
        fileName: file?.originalname
      });
      throw new Error("Failed to upload profile image");
    }
  }

  async uploadPortfolioImage(file, userId, projectId) {
    try {
      // Process image
      const processedImage = await sharp(file.buffer)
        .resize(800, 600, { 
          fit: "inside",
          withoutEnlargement: true
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "portfolio",
            public_id: `portfolio_${userId}_${projectId}_${uuidv4()}`,
            transformation: [
              { width: 800, height: 600, crop: "limit" },
              { quality: "auto" },
              { fetch_format: "auto" }
            ],
            overwrite: true,
            invalidate: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(processedImage);
      });

      return result; // Return full result object with secure_url and public_id
    } catch (error) {
      logger.error("Portfolio image upload error", {
        error: error.message,
        stack: error.stack,
        fileName: file?.originalname
      });
      throw new Error("Failed to upload portfolio image");
    }
  }

  async uploadEducationImage(file, userId, educationId) {
    try {
      // Process image
      const processedImage = await sharp(file.buffer)
        .resize(200, 200, { 
          fit: "cover",
          position: "center"
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "education",
            public_id: `education_${userId}_${educationId}_${uuidv4()}`,
            transformation: [
              { width: 200, height: 200, crop: "fill" },
              { quality: "auto" },
              { fetch_format: "auto" }
            ],
            overwrite: true,
            invalidate: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(processedImage);
      });

      return result; // Return full result object with secure_url and public_id
    } catch (error) {
      logger.error("Education image upload error", {
        error: error.message,
        stack: error.stack,
        fileName: file?.originalname,
        userId: userId
      });
      throw new Error("Failed to upload education image");
    }
  }

  async uploadResume(file, userId) {
    try {
      // Upload PDF to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "resumes",
            public_id: `resume_${userId}_${uuidv4()}`,
            format: path.extname(file.originalname).substring(1),
            overwrite: true,
            invalidate: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });

      return result; // Return full result object with secure_url and public_id
    } catch (error) {
      logger.error("Resume upload error", {
        error: error.message,
        stack: error.stack,
        fileName: file?.originalname,
        userId: userId
      });
      throw new Error("Failed to upload resume");
    }
  }

  async deleteFile(url) {
    try {
      // Extract public ID from Cloudinary URL
      const publicId = this.extractPublicId(url);
      if (!publicId) {
        logger.warn("Could not extract public ID from URL", {
          url: url
        });
        return;
      }

      // Determine resource type
      const resourceType = url.includes("/raw/") ? "raw" : "image";
      
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      logger.info("File deleted successfully", {
        publicId: publicId,
        resourceType: resourceType
      });
    } catch (error) {
      logger.error("File deletion error", {
        error: error.message,
        stack: error.stack,
        url: url,
        publicId: publicId
      });
      // Don't throw error for deletion failures
    }
  }

  extractPublicId(url) {
    try {
      // Extract public ID from Cloudinary URL
      const parts = url.split("/");
      const filename = parts[parts.length - 1];
      const publicId = filename.split(".")[0];
      
      // Find the folder part
      const folderIndex = parts.findIndex(part => 
        ["profiles", "portfolio", "education", "resumes"].includes(part)
      );
      
      if (folderIndex !== -1) {
        return `${parts[folderIndex]}/${publicId}`;
      }
      
      return publicId;
    } catch (error) {
      logger.error("Error extracting public ID", {
        error: error.message,
        stack: error.stack,
        url: url
      });
      return null;
    }
  }

  // Helper method to get optimized image URL
  getOptimizedImageUrl(publicId, options = {}) {
    const {
      width = 400,
      height = 400,
      crop = "fill",
      quality = "auto",
      format = "auto"
    } = options;

    return cloudinary.url(publicId, {
      width,
      height,
      crop,
      quality,
      fetch_format: format,
      secure: true,
    });
  }
}

module.exports = new CloudinaryUploadService();
