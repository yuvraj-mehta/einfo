/**
 * Demo data service for fallback mode when backend is not available
 */

import { User } from "@/stores/authStore";
import { CompleteProfileData, PublicProfileData } from "@/services/apiClient";

export class DemoDataService {
  private static instance: DemoDataService;

  static getInstance(): DemoDataService {
    if (!DemoDataService.instance) {
      DemoDataService.instance = new DemoDataService();
    }
    return DemoDataService.instance;
  }

  // Get demo user data
  getDemoUser(): User {
    return {
      id: "demo-user",
      email: "demo@example.com",
      username: "demouser",
      name: "Demo User",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      instantMessage: "Hey there! I'm using e-info.me to connect and share.",
    };
  }

  // Get complete demo profile data
  getDemoProfileData(): CompleteProfileData {
    const demoUser = this.getDemoUser();

    return {
      user: {
        ...demoUser,
        instant_message_subject: "Let's Connect!",
        instant_message_body:
          "Hey there! I'm using e-info.me to connect and share.",
      },
      profile: {
        name: demoUser.name,
        jobTitle: "Full Stack Developer",
        bio: "This is a demo profile. Backend is not connected. All features work in demo mode with local storage.",
        email: demoUser.email,
        website: "https://example.com",
        location: "Demo City, Demo State",
        profileImage: demoUser.avatar || "",
        resumeUrl: "",
        skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python"],
        visibility: {
          show_links: true,
          show_experience: true,
          show_portfolio: true,
          show_education: true,
          show_titles: true,
        },
      },
      links: [
        {
          id: "demo-link-1",
          title: "GitHub",
          description: "Check out my code",
          href: "https://github.com",
          icon: "github",
          imageUrl: "",
          projectDetails: "My open source projects and contributions",
        },
        {
          id: "demo-link-2",
          title: "LinkedIn",
          description: "Professional network",
          href: "https://linkedin.com",
          icon: "linkedin",
          imageUrl: "",
          projectDetails: "Connect with me professionally",
        },
      ],
      portfolio: [
        {
          id: "demo-portfolio-1",
          title: "Demo Project",
          description:
            "A sample project to demonstrate portfolio functionality",
          category: "Web Development",
          href: "https://example.com",
          icon: "globe",
          images: [
            {
              id: "demo-image-1",
              url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
              title: "Project Screenshot",
              description: "Main application interface",
            },
          ],
        },
      ],
      experience: [
        {
          id: "demo-exp-1",
          company: "Demo Company",
          position: "Senior Developer",
          duration: "2022 - Present",
          location: "Demo City, Demo State",
          description:
            "Leading development of web applications and mentoring junior developers.",
          icon: "briefcase",
          projects: [
            {
              id: "demo-work-project-1",
              title: "E-commerce Platform",
              description: "Built a scalable e-commerce solution",
              technologies: ["React", "Node.js", "PostgreSQL"],
            },
          ],
          achievements: [
            "Improved application performance by 40%",
            "Led a team of 5 developers",
            "Implemented CI/CD pipelines",
          ],
        },
      ],
      education: [
        {
          id: "demo-edu-1",
          institution: "Demo University",
          degree: "Bachelor of Science in Computer Science",
          duration: "2018 - 2022",
          location: "Demo City, Demo State",
          description: "Focused on software engineering and web development",
          icon: "graduation-cap",
          type: "degree",
          gpa: "3.8",
          achievements: [
            "Dean's List",
            "Computer Science Honor Society",
            "Outstanding Student Award",
          ],
          courses: [
            "Data Structures and Algorithms",
            "Database Systems",
            "Software Engineering",
            "Web Development",
          ],
          imageUrl: "",
          websiteUrl: "https://demo-university.edu",
        },
      ],
      analytics: {
        total_views: 42,
        total_stars: 7,
        total_clicks: 23,
      },
    };
  }

  // Get public demo profile data (for viewing other profiles)
  getPublicDemoProfile(username: string): PublicProfileData {
    const profileData = this.getDemoProfileData();

    return {
      ...profileData,
      username,
      is_owner: false,
      user: {
        username,
        name: `Demo User (${username})`,
        avatar_url:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      },
      profile: {
        ...profileData.profile,
        name: `Demo User (${username})`,
        bio: `This is a demo profile for @${username}. Backend is not connected.`,
      },
    };
  }

  // Check if we're in demo mode
  isDemoMode(): boolean {
    // You can add logic here to determine if we're in demo mode
    // For now, we'll assume demo mode if no backend is available
    return true;
  }

  // Show demo mode notification
  getDemoModeMessage(): string {
    return "You're currently in demo mode. Backend is not connected, but all features work with local storage.";
  }

  // Get demo analytics data
  getDemoAnalytics() {
    return {
      total_views: 42,
      total_stars: 7,
      total_clicks: 23,
      recent_views: [
        { date: "2024-01-15", views: 5 },
        { date: "2024-01-14", views: 8 },
        { date: "2024-01-13", views: 3 },
        { date: "2024-01-12", views: 12 },
        { date: "2024-01-11", views: 6 },
      ],
      top_referrers: [
        { source: "linkedin.com", clicks: 15 },
        { source: "github.com", clicks: 8 },
        { source: "Direct", clicks: 12 },
        { source: "google.com", clicks: 4 },
      ],
    };
  }
}

// Export singleton instance
export const demoDataService = DemoDataService.getInstance();
