const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class AuthService {
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.JWT_ALGORITHM = process.env.JWT_ALGORITHM || "HS256";
    this.JWT_EXPIRES_IN = process.env.JWT_ACCESS_TOKEN_EXPIRE_MINUTES || "10080"; // 7 days
  }

  /**
   * Generate JWT token
   */
  generateToken(user) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      algorithm: this.JWT_ALGORITHM,
      expiresIn: `${this.JWT_EXPIRES_IN}m`,
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  /**
   * Generate random token
   */
  generateRandomToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Validate username
   */
  validateUsername(username) {
    if (!username || typeof username !== "string") {
      return {
        isValid: false,
        error: "Username is required and must be a string",
      };
    }

    if (username.length < 3 || username.length > 30) {
      return {
        isValid: false,
        error: "Username must be between 3 and 30 characters",
      };
    }

    // Check for valid characters (alphanumeric, underscore, hyphen)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return {
        isValid: false,
        error: "Username can only contain letters, numbers, underscores, and hyphens",
      };
    }

    // Check for consecutive hyphens
    if (username.includes("--")) {
      return {
        isValid: false,
        error: "Username cannot contain consecutive hyphens",
      };
    }

    // Check for starting/ending with hyphen or underscore
    if (username.startsWith("-") || username.endsWith("-") || 
        username.startsWith("_") || username.endsWith("_")) {
      return {
        isValid: false,
        error: "Username cannot start or end with hyphens or underscores",
      };
    }

    // Reserved usernames
    const reservedUsernames = [
      "admin", "api", "www", "mail", "ftp", "blog", "support", "help",
      "info", "news", "about", "contact", "privacy", "terms", "legal",
      "root", "user", "guest", "test", "demo", "example", "null", "undefined"
    ];

    if (reservedUsernames.includes(username.toLowerCase())) {
      return {
        isValid: false,
        error: "This username is reserved and cannot be used",
      };
    }

    return { isValid: true };
  }

  /**
   * Validate email
   */
  validateEmail(email) {
    if (!email || typeof email !== "string") {
      return {
        isValid: false,
        error: "Email is required and must be a string",
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        error: "Please provide a valid email address",
      };
    }

    return { isValid: true };
  }

  // Password validation removed - only Google OAuth is supported
}

module.exports = new AuthService();
