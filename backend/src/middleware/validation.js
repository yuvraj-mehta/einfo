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
 * Google OAuth validation
 */
const validateGoogleAuth = [
  body("google_token")
    .notEmpty()
    .withMessage("Google token is required")
    .isString()
    .withMessage("Google token must be a string"),
  body("username")
    .optional()
    .isLength({ min: 5, max: 20 })
    .withMessage("Username must be between 5 and 20 characters")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Username can only contain lowercase letters, numbers, and hyphens")
    .custom((value) => {
      if (value && value.includes("--")) {
        throw new Error("Username cannot contain consecutive hyphens");
      }
      if (value && (value.startsWith("-") || value.endsWith("-"))) {
        throw new Error("Username cannot start or end with hyphens");
      }
      return true;
    }),
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
    .isLength({ max: 100 })
    .withMessage("Job title must be less than 100 characters")
    .trim(),
  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio must be less than 500 characters")
    .trim(),
  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("website")
    .optional({ nullable: true, checkFalsy: true })
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
    .withMessage("Skills must be an array")
    .custom((skills) => {
      if (skills.length > 30) {
        throw new Error("Maximum 30 skills allowed");
      }
      for (const skill of skills) {
        if (typeof skill !== "string" || skill.length > 30) {
          throw new Error("Each skill must be a string with max 30 characters");
        }
      }
      return true;
    }),
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
    .isLength({ max: 200 })
    .withMessage("Description must be less than 200 characters")
    .trim(),
  body("iconName")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Icon name must be less than 50 characters"),
  body("projectDetails")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Project details must be less than 500 characters")
    .trim(),
  handleValidationErrors,
];

/**
 * Portfolio project validation
 */
const validatePortfolioProject = [
  body("title")
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters")
    .trim(),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters")
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
  body("iconName")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Icon name must be less than 50 characters"),
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
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters")
    .trim(),
  body("achievements")
    .optional()
    .isArray()
    .withMessage("Achievements must be an array")
    .custom((achievements) => {
      if (achievements.length > 10) {
        throw new Error("Maximum 10 achievements allowed");
      }
      for (const achievement of achievements) {
        if (typeof achievement !== "string" || achievement.length > 200) {
          throw new Error("Each achievement must be a string with max 200 characters");
        }
      }
      return true;
    }),
  handleValidationErrors,
];

/**
 * Education validation
 */
const validateEducation = [
  body("institution")
    .isLength({ min: 1, max: 100 })
    .withMessage("Institution name must be between 1 and 100 characters")
    .trim(),
  body("degree")
    .isLength({ min: 1, max: 100 })
    .withMessage("Degree must be between 1 and 100 characters")
    .trim(),
  body("duration")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Duration must be less than 50 characters")
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
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters")
    .trim(),
  body("educationType")
    .optional()
    .isIn(["degree", "certification", "certificate", "course"])
    .withMessage("Education type must be one of: degree, certification, certificate, course"),
  body("gpa")
    .optional()
    .isLength({ max: 10 })
    .withMessage("GPA must be less than 10 characters"),
  body("achievements")
    .optional()
    .isArray()
    .withMessage("Achievements must be an array")
    .custom((achievements) => {
      if (achievements.length > 10) {
        throw new Error("Maximum 10 achievements allowed");
      }
      for (const achievement of achievements) {
        if (typeof achievement !== "string" || achievement.length > 200) {
          throw new Error("Each achievement must be a string with max 200 characters");
        }
      }
      return true;
    }),
  body("courses")
    .optional()
    .isArray()
    .withMessage("Courses must be an array")
    .custom((courses) => {
      if (courses.length > 20) {
        throw new Error("Maximum 20 courses allowed");
      }
      for (const course of courses) {
        if (typeof course !== "string" || course.length > 100) {
          throw new Error("Each course must be a string with max 100 characters");
        }
      }
      return true;
    }),
  handleValidationErrors,
];

/**
 * Account update validation
 */
const validateAccountUpdate = [
  body("name")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name must be between 1 and 100 characters")
    .trim(),
  body("username")
    .optional()
    .isLength({ min: 5, max: 20 })
    .withMessage("Username must be between 5 and 20 characters")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Username can only contain lowercase letters, numbers, and hyphens")
    .custom((value) => {
      if (value && value.includes("--")) {
        throw new Error("Username cannot contain consecutive hyphens");
      }
      if (value && (value.startsWith("-") || value.endsWith("-"))) {
        throw new Error("Username cannot start or end with hyphens");
      }
      return true;
    }),
  body("instantMessageSubject")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Instant message subject must be between 1 and 100 characters")
    .trim(),
  body("instantMessageBody")
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage("Instant message body must be between 1 and 500 characters")
    .trim(),
  handleValidationErrors,
];

/**
 * Email validation
 */
const validateEmail = [
  body("senderEmail")
    .isEmail()
    .withMessage("Please provide a valid sender email")
    .normalizeEmail(),
  body("message")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Message must be between 1 and 1000 characters")
    .trim(),
  body("senderName")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Sender name must be between 1 and 100 characters")
    .trim(),
  handleValidationErrors,
];

/**
 * Visibility settings validation
 */
const validateVisibilitySettings = [
  body("showLinks")
    .optional()
    .isBoolean()
    .withMessage("showLinks must be a boolean"),
  body("showExperience")
    .optional()
    .isBoolean()
    .withMessage("showExperience must be a boolean"),
  body("showPortfolio")
    .optional()
    .isBoolean()
    .withMessage("showPortfolio must be a boolean"),
  body("showEducation")
    .optional()
    .isBoolean()
    .withMessage("showEducation must be a boolean"),
  body("showAchievements")
    .optional()
    .isBoolean()
    .withMessage("showAchievements must be a boolean"),
  body("showExtracurriculars")
    .optional()
    .isBoolean()
    .withMessage("showExtracurriculars must be a boolean"),
  body("showTitles")
    .optional()
    .isBoolean()
    .withMessage("showTitles must be a boolean"),
  handleValidationErrors,
];

/**
 * Achievement validation
 */
const validateAchievement = [
  body("title")
    .isLength({ min: 1, max: 120 })
    .withMessage("Title must be between 1 and 120 characters")
    .trim(),
  body("organization")
    .isLength({ min: 1, max: 80 })
    .withMessage("Organization must be between 1 and 80 characters")
    .trim(),
  body("duration")
    .optional()
    .isLength({ max: 25 })
    .withMessage("Duration must be less than 25 characters")
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
    .isLength({ max: 40 })
    .withMessage("Location must be less than 40 characters")
    .trim(),
  body("description")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Description must be less than 300 characters")
    .trim(),
  body("type")
    .isIn(["competition", "recognition", "contribution"])
    .withMessage("Type must be one of: competition, recognition, contribution"),
  body("skillsInvolved")
    .optional()
    .isArray()
    .withMessage("Skills involved must be an array")
    .custom((skills) => {
      if (skills.length > 15) {
        throw new Error("Maximum 15 skills allowed");
      }
      for (const skill of skills) {
        if (typeof skill !== "string" || skill.length > 40) {
          throw new Error("Each skill must be a string with max 40 characters");
        }
      }
      return true;
    }),
  body("keyPoints")
    .optional()
    .isArray()
    .withMessage("Key points must be an array")
    .custom((keyPoints) => {
      if (keyPoints.length > 10) {
        throw new Error("Maximum 10 key points allowed");
      }
      for (const point of keyPoints) {
        if (typeof point !== "string" || point.length > 200) {
          throw new Error("Each key point must be a string with max 200 characters");
        }
      }
      return true;
    }),
  body("iconName")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Icon name must be less than 50 characters"),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
  body("websiteUrl")
    .optional()
    .isURL()
    .withMessage("Website URL must be a valid URL"),
  handleValidationErrors,
];

/**
 * Extracurricular validation
 */
const validateExtracurricular = [
  body("activityName")
    .isLength({ min: 1, max: 100 })
    .withMessage("Activity name must be between 1 and 100 characters")
    .trim(),
  body("organization")
    .isLength({ min: 1, max: 80 })
    .withMessage("Organization must be between 1 and 80 characters")
    .trim(),
  body("duration")
    .optional()
    .isLength({ max: 25 })
    .withMessage("Duration must be less than 25 characters")
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
    .isLength({ max: 40 })
    .withMessage("Location must be less than 40 characters")
    .trim(),
  body("role")
    .optional()
    .isLength({ max: 60 })
    .withMessage("Role must be less than 60 characters")
    .trim(),
  body("description")
    .optional()
    .isLength({ max: 350 })
    .withMessage("Description must be less than 350 characters")
    .trim(),
  body("type")
    .isIn(["leadership", "volunteering", "creative", "advocacy", "sports", "academic"])
    .withMessage("Type must be one of: leadership, volunteering, creative, advocacy, sports, academic"),
  body("responsibilities")
    .optional()
    .isArray()
    .withMessage("Responsibilities must be an array")
    .custom((responsibilities) => {
      if (responsibilities.length > 10) {
        throw new Error("Maximum 10 responsibilities allowed");
      }
      for (const responsibility of responsibilities) {
        if (typeof responsibility !== "string" || responsibility.length > 150) {
          throw new Error("Each responsibility must be a string with max 150 characters");
        }
      }
      return true;
    }),
  body("achievements")
    .optional()
    .isArray()
    .withMessage("Achievements must be an array")
    .custom((achievements) => {
      if (achievements.length > 8) {
        throw new Error("Maximum 8 achievements allowed");
      }
      for (const achievement of achievements) {
        if (typeof achievement !== "string" || achievement.length > 150) {
          throw new Error("Each achievement must be a string with max 150 characters");
        }
      }
      return true;
    }),
  body("skillsDeveloped")
    .optional()
    .isArray()
    .withMessage("Skills developed must be an array")
    .custom((skills) => {
      if (skills.length > 12) {
        throw new Error("Maximum 12 skills allowed");
      }
      for (const skill of skills) {
        if (typeof skill !== "string" || skill.length > 40) {
          throw new Error("Each skill must be a string with max 40 characters");
        }
      }
      return true;
    }),
  body("iconName")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Icon name must be less than 50 characters"),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
  body("websiteUrl")
    .optional()
    .isURL()
    .withMessage("Website URL must be a valid URL"),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateGoogleAuth,
  validateProfileUpdate,
  validateLink,
  validatePortfolioProject,
  validateWorkExperience,
  validateExperience: validateWorkExperience, // Alias for backward compatibility
  validateEducation,
  validateAccountUpdate,
  validateEmail,
  validateVisibilitySettings,
  validateAchievement,
  validateExtracurricular,
};
