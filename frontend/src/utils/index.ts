import type { PersonProfile } from "@/types";

/**
 * Creates user initials from a full name
 */
export const createInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2); // Limit to 2 characters
};

/**
 * Handles external link navigation with proper security
 */
export const handleExternalLink = (url: string, useMailto = false): void => {
  if (!url?.trim()) return;

  const finalUrl = useMailto ? `mailto:${url}` : `https://${url}`;
  const target = useMailto ? "_self" : "_blank";
  const windowFeatures = useMailto ? "" : "noopener,noreferrer";

  window.open(finalUrl, target, windowFeatures);
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

/**
 * Formats large numbers for display
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString();
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * Clamps a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Checks if profile is complete
 */
export const isProfileComplete = (profile: Partial<PersonProfile>): boolean => {
  const requiredFields: (keyof PersonProfile)[] = ["name", "jobTitle", "email"];
  return requiredFields.every((field) => profile[field]?.trim());
};

/**
 * Truncates text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

/**
 * Safely gets nested object property
 */
export const safeGet = <T>(obj: any, path: string, defaultValue: T): T => {
  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result?.[key] === undefined) {
      return defaultValue;
    }
    result = result[key];
  }

  return result ?? defaultValue;
};

/**
 * Generates a random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Checks if code is running in browser
 */
export const isBrowser = (): boolean => {
  return typeof window !== "undefined";
};

/**
 * Formats date for display
 */
export const formatDate = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return dateObj.toLocaleDateString("en-US", { ...defaultOptions, ...options });
};
