export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  instantMessage?: string;
}

export interface ContactInfo {
  email: string;
  website: string;
  location: string;
}

export interface PersonalInfo {
  name: string;
  jobTitle: string;
  bio: string;
  profileImage: string;
}

export interface PersonProfile extends PersonalInfo, ContactInfo {
  resumeUrl?: string;
  skills?: string[];
}

export interface DashboardStats {
  cardViews: number;
  stars: number;
  totalClicks: number;
}

export interface MessageData {
  title: string;
  message: string;
  timestamp: string;
}

// Navigation-related types
export interface NavigationItem {
  path: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  external?: boolean;
}

// Component prop types
export interface WithClassName {
  className?: string;
}

export interface WithChildren {
  children: React.ReactNode;
}

export interface OptionalWithChildren {
  children?: React.ReactNode;
}
