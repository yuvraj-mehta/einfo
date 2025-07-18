import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  PersonProfile,
  ProjectLink,
  defaultProfile,
  defaultProjects,
} from "@/lib/profileData";
import {
  PortfolioProject,
  defaultPortfolioProjects,
} from "@/lib/portfolioData";
import {
  WorkExperienceData,
  defaultWorkExperiences,
} from "@/lib/workExperienceData";
import type { EducationData } from "@/components/Education";
import { defaultEducation } from "@/lib/educationData";

export interface VisibilitySettings {
  showLinks: boolean;
  showExperience: boolean;
  showPortfolio: boolean;
  showEducation: boolean;
  showTitles: boolean;
}

interface ProfileState {
  // Profile data
  profile: PersonProfile;
  projects: ProjectLink[];
  portfolioProjects: PortfolioProject[];
  workExperiences: WorkExperienceData[];
  education: EducationData[];

  // Visibility settings
  visibilitySettings: VisibilitySettings;

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Actions
  updateProfile: (profile: PersonProfile) => void;
  updateProjects: (projects: ProjectLink[]) => void;
  updatePortfolioProjects: (projects: PortfolioProject[]) => void;
  updateWorkExperiences: (experiences: WorkExperienceData[]) => void;
  updateEducation: (education: EducationData[]) => void;
  updateVisibilitySettings: (settings: VisibilitySettings) => void;
  initializeWithUserData: (userData: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  resetProfile: () => void;

  // Individual item actions
  addProject: (project: ProjectLink) => void;
  removeProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<ProjectLink>) => void;
  addPortfolioProject: (project: PortfolioProject) => void;
  removePortfolioProject: (projectId: string) => void;
  updatePortfolioProject: (
    projectId: string,
    updates: Partial<PortfolioProject>,
  ) => void;
  addWorkExperience: (experience: WorkExperienceData) => void;
  removeWorkExperience: (experienceId: string) => void;
  updateWorkExperience: (
    experienceId: string,
    updates: Partial<WorkExperienceData>,
  ) => void;
  addEducation: (education: EducationData) => void;
  removeEducation: (educationId: string) => void;
  updateEducationItem: (
    educationId: string,
    updates: Partial<EducationData>,
  ) => void;
}

const defaultVisibilitySettings: VisibilitySettings = {
  showLinks: true,
  showExperience: true,
  showPortfolio: true,
  showEducation: true,
  showTitles: true,
};

export const useProfileStore = create<ProfileState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    profile: defaultProfile,
    projects: defaultProjects,
    portfolioProjects: defaultPortfolioProjects,
    workExperiences: defaultWorkExperiences,
    education: defaultEducation,
    visibilitySettings: defaultVisibilitySettings,
    isLoading: false,
    error: null,

    // Main update actions
    updateProfile: (newProfile: PersonProfile) => {
      set({ profile: newProfile });
      console.log("Profile updated:", newProfile);
    },

    updateProjects: (newProjects: ProjectLink[]) => {
      set({ projects: newProjects });
      console.log("Projects updated:", newProjects);
    },

    updatePortfolioProjects: (newProjects: PortfolioProject[]) => {
      set({ portfolioProjects: newProjects });
      console.log("Portfolio projects updated:", newProjects);
    },

    updateWorkExperiences: (newExperiences: WorkExperienceData[]) => {
      set({ workExperiences: newExperiences });
      console.log("Work experiences updated:", newExperiences);
    },

    updateEducation: (newEducation: EducationData[]) => {
      set({ education: newEducation });
      console.log("Education updated:", newEducation);
    },

    updateVisibilitySettings: (newSettings: VisibilitySettings) => {
      set({ visibilitySettings: newSettings });
      console.log("Visibility settings updated:", newSettings);
    },

    initializeWithUserData: (userData: any) => {
      if (userData) {
        const currentProfile = get().profile;
        set({
          profile: {
            ...currentProfile,
            name: userData.name || currentProfile.name,
            email: userData.email || currentProfile.email,
            profileImage: userData.avatar || currentProfile.profileImage,
          },
        });
        console.log("Profile initialized with user data:", userData);
      }
    },

    // Utility actions
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),

    resetProfile: () => {
      set({
        profile: defaultProfile,
        projects: defaultProjects,
        portfolioProjects: defaultPortfolioProjects,
        workExperiences: defaultWorkExperiences,
        education: defaultEducation,
        visibilitySettings: defaultVisibilitySettings,
        isLoading: false,
        error: null,
      });
      console.log("Profile reset to defaults");
    },

    // Individual item actions
    addProject: (project: ProjectLink) => {
      const projects = get().projects;
      set({
        projects: [
          ...projects,
          { ...project, id: project.id || Date.now().toString() },
        ],
      });
    },

    removeProject: (projectId: string) => {
      const projects = get().projects;
      set({ projects: projects.filter((p) => p.id !== projectId) });
    },

    updateProject: (projectId: string, updates: Partial<ProjectLink>) => {
      const projects = get().projects;
      set({
        projects: projects.map((p) =>
          p.id === projectId ? { ...p, ...updates } : p,
        ),
      });
    },

    addPortfolioProject: (project: PortfolioProject) => {
      const portfolioProjects = get().portfolioProjects;
      set({
        portfolioProjects: [
          ...portfolioProjects,
          { ...project, id: project.id || Date.now().toString() },
        ],
      });
    },

    removePortfolioProject: (projectId: string) => {
      const portfolioProjects = get().portfolioProjects;
      set({
        portfolioProjects: portfolioProjects.filter((p) => p.id !== projectId),
      });
    },

    updatePortfolioProject: (
      projectId: string,
      updates: Partial<PortfolioProject>,
    ) => {
      const portfolioProjects = get().portfolioProjects;
      set({
        portfolioProjects: portfolioProjects.map((p) =>
          p.id === projectId ? { ...p, ...updates } : p,
        ),
      });
    },

    addWorkExperience: (experience: WorkExperienceData) => {
      const workExperiences = get().workExperiences;
      set({
        workExperiences: [
          ...workExperiences,
          { ...experience, id: experience.id || Date.now().toString() },
        ],
      });
    },

    removeWorkExperience: (experienceId: string) => {
      const workExperiences = get().workExperiences;
      set({
        workExperiences: workExperiences.filter((e) => e.id !== experienceId),
      });
    },

    updateWorkExperience: (
      experienceId: string,
      updates: Partial<WorkExperienceData>,
    ) => {
      const workExperiences = get().workExperiences;
      set({
        workExperiences: workExperiences.map((e) =>
          e.id === experienceId ? { ...e, ...updates } : e,
        ),
      });
    },

    addEducation: (education: EducationData) => {
      const educationList = get().education;
      set({
        education: [
          ...educationList,
          { ...education, id: education.id || Date.now().toString() },
        ],
      });
    },

    removeEducation: (educationId: string) => {
      const educationList = get().education;
      set({
        education: educationList.filter((e) => e.id !== educationId),
      });
    },

    updateEducationItem: (
      educationId: string,
      updates: Partial<EducationData>,
    ) => {
      const educationList = get().education;
      set({
        education: educationList.map((e) =>
          e.id === educationId ? { ...e, ...updates } : e,
        ),
      });
    },
  })),
);

// Subscribe to auth changes to initialize profile with user data
if (typeof window !== "undefined") {
  import("./authStore").then(({ useAuthStore }) => {
    useAuthStore.subscribe(
      (state) => state.user,
      (user) => {
        if (user) {
          useProfileStore.getState().initializeWithUserData(user);
        } else {
          // Reset profile when user logs out
          useProfileStore.getState().resetProfile();
        }
      },
    );
  });
}
