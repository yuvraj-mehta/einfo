/**
 * API Configuration for E-Info.me Backend Integration
 */

// Environment-based API configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  TIMEOUT: 10000, // 10 seconds (reduced for faster fallback)
  RETRY_ATTEMPTS: 1, // Reduced retries for faster fallback
  RETRY_DELAY: 500, // 0.5 seconds
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    GOOGLE_LOGIN: "/auth/google",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    CHECK_USERNAME: "/auth/check-username",
  },

  // User Profile
  PROFILE: {
    ME: "/profile/me",
    BY_USERNAME: (username: string) => `/profile/${username}`,
    UPDATE: "/profile/me",
    UPDATE_ACCOUNT: "/profile/account",
    UPDATE_INSTANT_MESSAGE: "/profile/instant-message",
  },

  // Profile Links
  LINKS: {
    LIST: "/profile/links",
    CREATE: "/profile/links",
    UPDATE: (id: string) => `/profile/links/${id}`,
    DELETE: (id: string) => `/profile/links/${id}`,
    REORDER: "/profile/links/reorder",
  },

  // Portfolio
  PORTFOLIO: {
    LIST: "/portfolio",
    CREATE: "/portfolio",
    UPDATE: (id: string) => `/portfolio/${id}`,
    DELETE: (id: string) => `/portfolio/${id}`,
    ADD_IMAGES: (id: string) => `/portfolio/${id}/images`,
    DELETE_IMAGE: (imageId: string) => `/portfolio/images/${imageId}`,
  },

  // Work Experience
  EXPERIENCE: {
    LIST: "/experience",
    CREATE: "/experience",
    UPDATE: (id: string) => `/experience/${id}`,
    DELETE: (id: string) => `/experience/${id}`,
  },

  // Education
  EDUCATION: {
    LIST: "/education",
    CREATE: "/education",
    UPDATE: (id: string) => `/education/${id}`,
    DELETE: (id: string) => `/education/${id}`,
  },

  // File Upload
  UPLOAD: {
    PROFILE_IMAGE: "/upload/profile-image",
    PORTFOLIO_IMAGE: "/upload/portfolio-image",
    RESUME: "/upload/resume",
    EDUCATION_IMAGE: "/upload/education-image",
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: "/analytics/dashboard",
    TRACK: "/analytics/track",
  },

  // Profile Stars
  STARS: {
    STAR_PROFILE: (username: string) => `/profile/${username}/star`,
    UNSTAR_PROFILE: (username: string) => `/profile/${username}/star`,
    GET_STARS: (username: string) => `/profile/${username}/stars`,
  },

  // Search & Discovery
  SEARCH: {
    PROFILES: "/search/profiles",
    TRENDING: "/discover/trending",
    FEATURED: "/discover/featured",
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API Error Codes
export const API_ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  USERNAME_TAKEN: "USERNAME_TAKEN",
  EMAIL_TAKEN: "EMAIL_TAKEN",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

// Request/Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{
      field?: string;
      message: string;
    }>;
  };
  request_id?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  has_more: boolean;
  offset: number;
  limit: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{
    field?: string;
    message: string;
  }>;
  status: number;
}

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: {
    AVATAR: 100 * 1024, // 100KB for profile avatars
    IMAGE: 5 * 1024 * 1024, // 5MB for other images
    RESUME: 25 * 1024 * 1024, // 25MB
  },
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
  ALLOWED_RESUME_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

// Analytics Event Types
export const ANALYTICS_EVENTS = {
  PROFILE_VIEW: "profile_view",
  LINK_CLICK: "link_click",
  PORTFOLIO_VIEW: "portfolio_view",
  RESUME_DOWNLOAD: "resume_download",
  CONTACT_CLICK: "contact_click",
  STAR_GIVEN: "star_given",
  STAR_REMOVED: "star_removed",
} as const;

// Default request headers
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;
