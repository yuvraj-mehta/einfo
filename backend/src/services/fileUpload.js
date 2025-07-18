// DEPRECATED: Do not use this file. All uploads should use cloudinaryUpload.js for image and file uploads.
// This file is intentionally left blank.
        "image/gif": [".gif"],
        "image/webp": [".webp"],
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      };

      const isAllowed = allowedTypes[file.mimetype];
      if (isAllowed) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"), false);
      }
    };

    // Configure multer
    this.upload = multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
        files: 5, // Maximum 5 files at once
      },
    });
  }

  /**
   * Get upload middleware
   */
  getUploadMiddleware() {
    return this.upload;
  }

  /**
   * Process and optimize image
   */
  async processImage(filePath, options = {}) {
    try {
      const {
        width = 800,
        height = 600,
        quality = 85,
        format = "jpeg",
      } = options;

      const processedPath = filePath.replace(
        path.extname(filePath),
        `_processed${path.extname(filePath)}`
      );

      await sharp(filePath)
        .resize(width, height, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .toFormat(format, { quality })
        .toFile(processedPath);

      // Delete original file
      await fs.unlink(filePath);

      return processedPath;
    } catch (error) {
      console.error("Image processing error:", error);
      throw new Error("Failed to process image");
    }
  }

  /**
   * Upload file to S3
   */
  async uploadToS3(filePath, key, contentType) {
    if (!this.useS3) {
      throw new Error("S3 not configured");
    }

    try {
      const fileContent = await fs.readFile(filePath);

      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: fileContent,
        ContentType: contentType,
        ACL: "public-read",
      };

      const result = await this.s3.upload(params).promise();
      
      // Delete local file after successful upload
      await fs.unlink(filePath);

      return result.Location;
    } catch (error) {
      console.error("S3 upload error:", error);
      throw new Error("Failed to upload to S3");
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFromS3(key) {
    if (!this.useS3) {
      return;
    }

    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      };

      await this.s3.deleteObject(params).promise();
    } catch (error) {
      console.error("S3 delete error:", error);
      // Don't throw error for delete operations
    }
  }

  /**
   * Generate file URL
   */
  generateFileUrl(filename) {
    if (this.useS3) {
      return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
    } else {
      return `${process.env.BACKEND_URL || "http://localhost:8000"}/uploads/${filename}`;
    }
  }

  /**
   * Handle profile image upload
   */
  async handleProfileImageUpload(file) {
    try {
      // Process image
      const processedPath = await this.processImage(file.path, {
        width: 400,
        height: 400,
        quality: 90,
        format: "jpeg",
      });

      // Upload to S3 if configured
      if (this.useS3) {
        const key = `profiles/${path.basename(processedPath)}`;
        const url = await this.uploadToS3(processedPath, key, "image/jpeg");
        return { url, key };
      } else {
        const url = this.generateFileUrl(path.basename(processedPath));
        return { url, key: path.basename(processedPath) };
      }
    } catch (error) {
      console.error("Profile image upload error:", error);
      throw new Error("Failed to upload profile image");
    }
  }

  /**
   * Handle portfolio image upload
   */
  async handlePortfolioImageUpload(file) {
    try {
      // Process image
      const processedPath = await this.processImage(file.path, {
        width: 1200,
        height: 800,
        quality: 85,
        format: "jpeg",
      });

      // Upload to S3 if configured
      if (this.useS3) {
        const key = `portfolio/${path.basename(processedPath)}`;
        const url = await this.uploadToS3(processedPath, key, "image/jpeg");
        return { url, key };
      } else {
        const url = this.generateFileUrl(path.basename(processedPath));
        return { url, key: path.basename(processedPath) };
      }
    } catch (error) {
      console.error("Portfolio image upload error:", error);
      throw new Error("Failed to upload portfolio image");
    }
  }

  /**
   * Handle resume upload
   */
  async handleResumeUpload(file) {
    try {
      // Upload to S3 if configured
      if (this.useS3) {
        const key = `resumes/${path.basename(file.path)}`;
        const url = await this.uploadToS3(file.path, key, file.mimetype);
        return { url, key };
      } else {
        const url = this.generateFileUrl(path.basename(file.path));
        return { url, key: path.basename(file.path) };
      }
    } catch (error) {
      console.error("Resume upload error:", error);
      throw new Error("Failed to upload resume");
    }
  }

  /**
   * Handle education image upload
   */
  async handleEducationImageUpload(file) {
    try {
      // Process image
      const processedPath = await this.processImage(file.path, {
        width: 300,
        height: 300,
        quality: 90,
        format: "jpeg",
      });

      // Upload to S3 if configured
      if (this.useS3) {
        const key = `education/${path.basename(processedPath)}`;
        const url = await this.uploadToS3(processedPath, key, "image/jpeg");
        return { url, key };
      } else {
        const url = this.generateFileUrl(path.basename(processedPath));
        return { url, key: path.basename(processedPath) };
      }
    } catch (error) {
      console.error("Education image upload error:", error);
      throw new Error("Failed to upload education image");
    }
  }

  /**
   * Clean up temp files
   */
  async cleanupTempFiles(files) {
    if (!Array.isArray(files)) {
      files = [files];
    }

    for (const file of files) {
      if (file && file.path) {
        try {
          await fs.unlink(file.path);
        } catch (error) {
          console.error("Error cleaning up temp file:", error);
        }
      }
    }
  }
}

module.exports = new FileUploadService();
