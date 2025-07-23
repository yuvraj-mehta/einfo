// Achievement Types
export interface AchievementData {
  id: string;
  title: string;
  organization: string;
  duration: string;
  location: string;
  description: string;
  iconName?: string; // Store icon name as string instead of React component
  type: "competition" | "recognition" | "contribution" | "award";
  skillsInvolved: string[];
  keyPoints: string[];
  imageUrl?: string;
  websiteUrl?: string;
}

// Extracurricular Types
export interface ExtracurricularData {
  id: string;
  activityName: string;
  organization: string;
  duration: string;
  location: string;
  description: string;
  iconName?: string; // Store icon name as string instead of React component
  type: "leadership" | "volunteering" | "creative" | "advocacy" | "sports" | "academic";
  role: string;
  responsibilities: string[];
  achievements: string[];
  skillsDeveloped: string[];
  imageUrl?: string;
  websiteUrl?: string;
}
