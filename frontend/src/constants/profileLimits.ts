// Maximum limits for profile sections
export const PROFILE_LIMITS = {
  LINKS: 25,
  EXPERIENCE: 10,
  PORTFOLIO: 10,
  EDUCATION: 10,
  ACHIEVEMENTS: 8,
  EXTRACURRICULARS: 8,
} as const;

// Helper function to check if a section has reached its limit
export const hasReachedLimit = (currentCount: number, sectionType: keyof typeof PROFILE_LIMITS): boolean => {
  return currentCount >= PROFILE_LIMITS[sectionType];
};

// Helper function to get the limit for a specific section
export const getLimit = (sectionType: keyof typeof PROFILE_LIMITS): number => {
  return PROFILE_LIMITS[sectionType];
};
