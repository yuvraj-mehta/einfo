/**
 * Validation utilities for user input
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate username according to requirements:
 * - 5-20 characters
 * - Lowercase letters and numbers only
 * - Only dash (-) allowed as special character
 * - Cannot start or end with dash
 * - Cannot have consecutive dashes
 */
export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return {
      isValid: false,
      error: "Username is required",
    };
  }

  // Length check
  if (username.length < 5) {
    return {
      isValid: false,
      error: "Username must be at least 5 characters long",
    };
  }

  if (username.length > 20) {
    return {
      isValid: false,
      error: "Username cannot be longer than 20 characters",
    };
  }

  // Character validation: only lowercase letters, numbers, and dashes
  const validCharacters = /^[a-z0-9-]+$/;
  if (!validCharacters.test(username)) {
    return {
      isValid: false,
      error: "Username can only contain lowercase letters, numbers, and dashes",
    };
  }

  // Cannot start with dash
  if (username.startsWith("-")) {
    return {
      isValid: false,
      error: "Username cannot start with a dash",
    };
  }

  // Cannot end with dash
  if (username.endsWith("-")) {
    return {
      isValid: false,
      error: "Username cannot end with a dash",
    };
  }

  // Cannot have consecutive dashes
  if (username.includes("--")) {
    return {
      isValid: false,
      error: "Username cannot contain consecutive dashes",
    };
  }

  // Reserved usernames
  const reservedUsernames = [
    "admin",
    "administrator",
    "api",
    "www",
    "mail",
    "email",
    "support",
    "help",
    "info",
    "contact",
    "about",
    "terms",
    "privacy",
    "blog",
    "news",
    "app",
    "mobile",
    "web",
    "dev",
    "test",
    "demo",
    "example",
    "sample",
    "null",
    "undefined",
    "true",
    "false",
    "root",
    "user",
    "users",
    "profile",
    "profiles",
  ];

  if (reservedUsernames.includes(username.toLowerCase())) {
    return {
      isValid: false,
      error: "This username is reserved and cannot be used",
    };
  }

  return {
    isValid: true,
  };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return {
      isValid: false,
      error: "Email is required",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address",
    };
  }

  return {
    isValid: true,
  };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return {
      isValid: false,
      error: "Password is required",
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      error: "Password cannot be longer than 128 characters",
    };
  }

  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      error: "Password must contain at least one letter and one number",
    };
  }

  return {
    isValid: true,
  };
};

/**
 * Sanitize username input
 */
export const sanitizeUsername = (input: string): string => {
  return input
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9-]/g, "") // Remove invalid characters
    .replace(/^-+/, "") // Remove leading dashes
    .replace(/-+$/, "") // Remove trailing dashes
    .replace(/--+/g, "-") // Replace consecutive dashes with single dash
    .substring(0, 20); // Limit to 20 characters
};

/**
 * Format username for display
 */
export const formatUsername = (username: string): string => {
  return `@${username}`;
};

/**
 * Extract username from formatted username
 */
export const extractUsername = (formattedUsername: string): string => {
  return formattedUsername.startsWith("@")
    ? formattedUsername.slice(1)
    : formattedUsername;
};
