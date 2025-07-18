import { EducationData } from "@/components/Education";
import { PortfolioProject } from "@/lib/portfolioData";
import { PersonProfile } from "@/lib/profileData";
import { ProjectLink } from "@/lib/profileData";
import { WorkExperienceData } from "@/lib/workExperienceData";

// API Service for communicating with backend

// Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Types for API responses
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  error?: string;
}

interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    name: string;
    avatar?: string;
  };
  token: string;
}

interface VisibilitySettings {
  showLinks: boolean;
  showExperience: boolean;
  showPortfolio: boolean;
  showEducation: boolean;
  showTitles: boolean;
}

interface FullProfileData {
  profile: PersonProfile;
  visibilitySettings: VisibilitySettings;
  links: ProjectLink[];
  experiences: WorkExperienceData[];
  portfolio: PortfolioProject[];
  education: EducationData[];
}

// API Client class
class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // Authentication methods
  async googleLogin(googleToken: string, username?: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({
        google_token: googleToken,
        username: username,
      }),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response;
  }

  async checkUsername(username: string): Promise<ApiResponse<{ available: boolean }>> {
    return this.makeRequest(`/auth/check-username/${username}`);
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.makeRequest("/auth/logout", {
      method: "POST",
    });

    if (response.success) {
      localStorage.removeItem("authToken");
    }

    return response;
  }

  async verifyToken(): Promise<ApiResponse<{ user: any }>> {
    return this.makeRequest("/auth/verify");
  }

  // User management
  async getCurrentUser(): Promise<ApiResponse<{ user: any }>> {
    return this.makeRequest("/profile/me");
  }

  async updateAccount(accountData: {
    name: string;
    username: string;
    instantMessageSubject: string;
  }): Promise<ApiResponse<{ user: any }>> {
    return this.makeRequest("/profile/account", {
      method: "PUT",
      body: JSON.stringify(accountData),
    });
  }

  async updateInstantMessage(messageData: {
    instant_message_subject: string;
    instant_message_body: string;
  }): Promise<ApiResponse<{ user: any }>> {
    return this.makeRequest("/profile/instant-message", {
      method: "PUT",
      body: JSON.stringify(messageData),
    });
  }

  async deleteAccount(confirmData: {
    username: string;
    confirmDeletion: boolean;
  }): Promise<ApiResponse> {
    return this.makeRequest("/profile/account", {
      method: "DELETE",
      body: JSON.stringify(confirmData),
    });
  }

  // Profile management
  async getProfile(): Promise<ApiResponse<FullProfileData>> {
    return this.makeRequest("/profile");
  }

  async updateBasicProfile(
    profileData: PersonProfile,
  ): Promise<ApiResponse<{ profile: PersonProfile }>> {
    return this.makeRequest("/profile/basic", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async updateVisibilitySettings(
    settings: VisibilitySettings,
  ): Promise<ApiResponse<{ visibilitySettings: VisibilitySettings }>> {
    return this.makeRequest("/profile/visibility", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  async updateLinks(
    links: ProjectLink[],
  ): Promise<ApiResponse<{ links: ProjectLink[] }>> {
    return this.makeRequest("/profile/links", {
      method: "PUT",
      body: JSON.stringify({ links }),
    });
  }

  async updateExperiences(
    experiences: WorkExperienceData[],
  ): Promise<ApiResponse<{ experiences: WorkExperienceData[] }>> {
    return this.makeRequest("/profile/experiences", {
      method: "PUT",
      body: JSON.stringify({ experiences }),
    });
  }

  async updatePortfolio(
    portfolio: PortfolioProject[],
  ): Promise<ApiResponse<{ portfolio: PortfolioProject[] }>> {
    return this.makeRequest("/profile/portfolio", {
      method: "PUT",
      body: JSON.stringify({ portfolio }),
    });
  }

  async updateEducation(
    education: EducationData[],
  ): Promise<ApiResponse<{ education: EducationData[] }>> {
    return this.makeRequest("/profile/education", {
      method: "PUT",
      body: JSON.stringify({ education }),
    });
  }

  // Public profile access
  async getPublicProfile(username: string): Promise<
    ApiResponse<{
      username: string;
      profile: PersonProfile;
      visibilitySettings: VisibilitySettings;
      sections: {
        links?: ProjectLink[];
        experiences?: WorkExperienceData[];
        portfolio?: PortfolioProject[];
        education?: EducationData[];
      };
    }>
  > {
    return this.makeRequest(`/public/profile/${username}`);
  }

  async checkUsernameAvailability(username: string): Promise<
    ApiResponse<{
      available: boolean;
    }>
  > {
    return this.makeRequest(`/auth/check-username/${username}`);
  }

  // File upload methods
  async uploadFile(
    file: File,
    type: "profile" | "portfolio" | "education",
  ): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const token = localStorage.getItem("authToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Upload failed! status: ${response.status}`,
      );
    }

    return data;
  }

  // Search and discovery
  async searchProfiles(
    query: string,
    limit: number = 10,
  ): Promise<
    ApiResponse<{
      profiles: Array<{
        username: string;
        name: string;
        title?: string;
        profileImage?: string;
        bio?: string;
      }>;
    }>
  > {
    return this.makeRequest(
      `/public/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
  }

  // Analytics
  async getProfileAnalytics(): Promise<
    ApiResponse<{
      totalViews: number;
      weeklyViews: number;
      monthlyViews: number;
      topReferrers: Array<{ source: string; count: number }>;
      viewsHistory: Array<{ date: string; views: number }>;
    }>
  > {
    return this.makeRequest("/analytics/profile");
  }

  // Simple analytics
  async getSimpleAnalytics(): Promise<ApiResponse<{ totalViews: number; totalClicks: number }>> {
    return this.makeRequest("/analytics/simple");
  }

  async trackClick(username: string): Promise<ApiResponse> {
    return this.makeRequest(`/public/profile/${username}/click`, {
      method: "POST",
    });
  }

  async sendMessage(
    username: string,
    messageData: {
      message: string;
      senderEmail: string;
      senderName?: string;
    }
  ): Promise<ApiResponse> {
    return this.makeRequest(`/public/profile/${username}/message`, {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  }

  async trackProfileView(username: string): Promise<ApiResponse> {
    return this.makeRequest("/analytics/view", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
  }

  // Star profile
  async starProfile(username: string): Promise<ApiResponse<{ starCount: number }>> {
    return this.makeRequest(`/public/profile/${username}/star`, {
      method: "POST",
      body: JSON.stringify({ visitorIp: "" }), // Backend will use req.ip
    });
  }

  // Password reset
  async requestPasswordReset(email: string): Promise<ApiResponse> {
    return this.makeRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    return this.makeRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Email verification
  async requestEmailVerification(): Promise<ApiResponse> {
    return this.makeRequest("/auth/request-verification", {
      method: "POST",
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    return this.makeRequest("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }
}

// Create and export a singleton instance
export const api = new ApiClient();

// Export types for use in components
export type { ApiResponse, AuthResponse, VisibilitySettings, FullProfileData };
