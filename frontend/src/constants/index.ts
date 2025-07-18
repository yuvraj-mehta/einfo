// Application-wide constants
export const APP_CONFIG = {
  name: "e-info.me",
  tagline: "Connect & Share",
  description: "Showcase Your Developer Identity in One Link",
  subtitle:
    "Create a beautiful, unified profile to share all your work and links.",
} as const;

// Route paths
export const ROUTES = {
  HOME: "/",
  DEMO: "/demo",
  AUTH: "/auth",
  EDIT_PROFILE: "/mycard",
  ACCOUNT: "/account",
  DASHBOARD: "/dashboard",
} as const;

// UI Constants
export const UI_CONFIG = {
  CARD_MIN_HEIGHT: 320,
  ANIMATION_DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 700,
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
} as const;

// Default profile data
export const DEFAULT_PROFILE = {
  name: "Pranav",
  jobTitle: "Developer & Consultant",
  bio: "Creating digital experiences that matter. Clean, functional, human-centered design.",
  email: "alex@example.com",
  website: "alexjohnson.design",
  location: "San Francisco",
  profileImage: "/placeholder.svg",
  resumeUrl: "https://drive.google.com/file/d/example/view",
  skills: ["UI Design", "Prototyping", "User Research", "Figma", "React"],
} as const;

// Error messages
export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "Authentication required",
  INVALID_EMAIL: "Please enter a valid email address",
  REQUIRED_FIELD: "This field is required",
  UPLOAD_FAILED: "Failed to upload file",
  NETWORK_ERROR: "Network error, please try again",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  MESSAGE_SENT: "Message sent successfully!",
  PROFILE_SAVED: "Profile saved successfully!",
  IMAGE_UPLOADED: "Image uploaded successfully!",
} as const;
