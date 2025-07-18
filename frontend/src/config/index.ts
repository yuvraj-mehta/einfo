// Configuration management for the application

interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  app: {
    name: string;
    version: string;
  };
  features: {
    analytics: boolean;
    search: boolean;
    fileUpload: boolean;
  };
  fileUpload: {
    maxSize: number;
    allowedTypes: string[];
  };
  social: {
    twitter?: string;
    github?: string;
    supportEmail?: string;
  };
}

const config: AppConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    timeout: 30000, // 30 seconds
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || "Digital Profile App",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    search: import.meta.env.VITE_ENABLE_SEARCH === "true",
    fileUpload: import.meta.env.VITE_ENABLE_FILE_UPLOAD === "true",
  },
  fileUpload: {
    maxSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || "5242880"), // 5MB default
    allowedTypes: (
      import.meta.env.VITE_ALLOWED_FILE_TYPES ||
      "image/jpeg,image/png,image/webp"
    ).split(","),
  },
  social: {
    twitter: import.meta.env.VITE_COMPANY_TWITTER,
    github: import.meta.env.VITE_COMPANY_GITHUB,
    supportEmail: import.meta.env.VITE_SUPPORT_EMAIL,
  },
};

// Validation
const validateConfig = () => {
  if (!config.api.baseUrl) {
    console.warn("API base URL not configured. Using default localhost.");
  }

  if (config.features.fileUpload && config.fileUpload.maxSize <= 0) {
    console.warn("Invalid max file size configuration. Using 5MB default.");
    config.fileUpload.maxSize = 5242880;
  }
};

validateConfig();

export default config;

// Helper functions
export const isProduction = () => import.meta.env.PROD;
export const isDevelopment = () => import.meta.env.DEV;

// Feature flags
export const features = config.features;

// API configuration
export const apiConfig = config.api;

// File upload utilities
export const fileUploadConfig = config.fileUpload;

export const validateFileSize = (file: File): boolean => {
  return file.size <= config.fileUpload.maxSize;
};

export const validateFileType = (file: File): boolean => {
  return config.fileUpload.allowedTypes.includes(file.type);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
