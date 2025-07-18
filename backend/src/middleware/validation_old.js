const { body, validationResult } = require("express-validator");

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

/**
 * Registration validation
 */
const validateRegistration = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("username")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage("Username can only contain letters, numbers, underscores, and hyphens")
    .custom((value) => {
      if (value.includes("--")) {
        throw new Error("Username cannot contain consecutive hyphens");
      }
      if (value.startsWith("-") || value.endsWith("-") || 
          value.startsWith("_") || value.endsWith("_")) {
        throw new Error("Username cannot start or end with hyphens or underscores");
      }
      return true;
    }),
  body("name")
    .isLength({ min: 1, max: 100 })
    .withMessage("Name must be between 1 and 100 characters")
    .trim(),
  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  handleValidationErrors,
];

/**
 * Login validation
 */
const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  handleValidationErrors,
];

/**
 * Google OAuth validation
 */
const validateGoogleAuth = [
  body("google_token")
    .notEmpty()
    .withMessage("Google token is required"),
  body("username")
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage("Username can only contain letters, numbers, underscores, and hyphens"),
  handleValidationErrors,
];

/**
 * Password reset request validation
 */
const validatePasswordResetRequest = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  handleValidationErrors,
];

/**
 * Password reset validation
 */
const validatePasswordReset = [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required"),
  body("new_password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  handleValidationErrors,
];

/**
 * Profile update validation
 */
const validateProfileUpdate = [
  body("name")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name must be between 1 and 100 characters")
    .trim(),
  body("jobTitle")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Job title must be less than 200 characters")
    .trim(),
  body("bio")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Bio must be less than 1000 characters")
    .trim(),
  body("website")
    .optional()
    .isURL()
    .withMessage("Please provide a valid website URL"),
  body("location")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Location must be less than 100 characters")
    .trim(),
  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array"),
  body("skills.*")
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each skill must be between 1 and 50 characters")
    .trim(),
  handleValidationErrors,
];

/**
 * Link validation
 */
const validateLink = [
  body("title")
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters")
    .trim(),
  body("url")
    .isURL()
    .withMessage("Please provide a valid URL"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters")
    .trim(),
  body("projectDetails")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Project details must be less than 1000 characters")
    .trim(),
  handleValidationErrors,
];

/**
 * Portfolio validation
 */
const validatePortfolio = [
  body("title")
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters")
    .trim(),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters")
    .trim(),
  body("category")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Category must be less than 50 characters")
    .trim(),
  body("url")
    .optional()
    .isURL()
    .withMessage("Please provide a valid URL"),
  handleValidationErrors,
];

/**
 * Work experience validation
 */
const validateWorkExperience = [
  body("company")
    .isLength({ min: 1, max: 100 })
    .withMessage("Company name must be between 1 and 100 characters")
    .trim(),
  body("position")
    .isLength({ min: 1, max: 100 })
    .withMessage("Position must be between 1 and 100 characters")
    .trim(),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date"),
  body("location")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Location must be less than 100 characters")
    .trim(),
  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description must be less than 2000 characters")
    .trim(),
  body("achievements")
    .optional()
    .isArray()
    .withMessage("Achievements must be an array"),
  body("achievements.*")
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage("Each achievement must be between 1 and 500 characters")
    .trim(),
  handleValidationErrors,
];

/**
 * Education validation
 */
const validateEducation = [
  body("institution")
    .isLength({ min: 1, max: 200 })
    .withMessage("Institution name must be between 1 and 200 characters")
    .trim(),
  body("degree")
    .isLength({ min: 1, max: 200 })
    .withMessage("Degree must be between 1 and 200 characters")
    .trim(),
  body("educationType")
    .isIn(["degree", "certification", "certificate", "course"])
    .withMessage("Education type must be one of: degree, certification, certificate, course"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date"),
  body("location")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Location must be less than 100 characters")
    .trim(),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters")
    .trim(),
  body("gpa")
    .optional()
    .isLength({ max: 20 })
    .withMessage("GPA must be less than 20 characters")
    .trim(),
  body("achievements")
    .optional()
    .isArray()
    .withMessage("Achievements must be an array"),
  body("courses")
    .optional()
    .isArray()
    .withMessage("Courses must be an array"),
  body("websiteUrl")
    .optional()
    .isURL()
    .withMessage("Please provide a valid website URL"),
  handleValidationErrors,
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateGoogleAuth,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateProfileUpdate,
  validateLink,
  validatePortfolio,
  validateWorkExperience,
  validateEducation,
  handleValidationErrors,
};
