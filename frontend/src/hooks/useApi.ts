import { useState, useCallback } from "react";
import { api, ApiResponse } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

// Generic hook for API calls
export function useApiCall<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const execute = useCallback(
    async (
      apiCall: () => Promise<ApiResponse<T>>,
      options?: {
        showSuccessToast?: boolean;
        successMessage?: string;
        showErrorToast?: boolean;
        onSuccess?: (data: T) => void;
        onError?: (error: string) => void;
      },
    ): Promise<ApiResponse<T> | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiCall();

        if (response.success) {
          if (options?.showSuccessToast) {
            toast({
              title: "Success",
              description:
                options.successMessage ||
                response.message ||
                "Operation completed successfully",
            });
          }

          if (options?.onSuccess && response.data) {
            options.onSuccess(response.data);
          }
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);

        if (options?.showErrorToast !== false) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }

        if (options?.onError) {
          options.onError(errorMessage);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return { execute, loading, error };
}

// Authentication hooks
export function useAuth() {
  const { execute, loading, error } = useApiCall();

  const login = useCallback(
    (credentials: { email: string; password: string }) => {
      return execute(() => api.login(credentials), {
        showSuccessToast: true,
        successMessage: "Successfully logged in!",
      });
    },
    [execute],
  );

  const register = useCallback(
    (userData: {
      username: string;
      email: string;
      password: string;
      name: string;
    }) => {
      return execute(() => api.register(userData), {
        showSuccessToast: true,
        successMessage: "Account created successfully!",
      });
    },
    [execute],
  );

  const logout = useCallback(() => {
    return execute(() => api.logout(), {
      showSuccessToast: true,
      successMessage: "Successfully logged out!",
    });
  }, [execute]);

  const verifyToken = useCallback(() => {
    return execute(() => api.verifyToken(), { showErrorToast: false });
  }, [execute]);

  return {
    login,
    register,
    logout,
    verifyToken,
    loading,
    error,
  };
}

// Profile management hooks
export function useProfile() {
  const { execute, loading, error } = useApiCall();

  const getProfile = useCallback(() => {
    return execute(() => api.getProfile(), { showErrorToast: false });
  }, [execute]);

  const updateBasicProfile = useCallback(
    (profileData: any) => {
      return execute(() => api.updateBasicProfile(profileData), {
        showSuccessToast: true,
        successMessage: "Profile updated successfully!",
      });
    },
    [execute],
  );

  const updateVisibilitySettings = useCallback(
    (settings: any) => {
      return execute(() => api.updateVisibilitySettings(settings), {
        showSuccessToast: true,
        successMessage: "Visibility settings updated!",
      });
    },
    [execute],
  );

  const updateLinks = useCallback(
    (links: any) => {
      return execute(() => api.updateLinks(links), {
        showSuccessToast: true,
        successMessage: "Links updated successfully!",
      });
    },
    [execute],
  );

  const updateExperiences = useCallback(
    (experiences: any) => {
      return execute(() => api.updateExperiences(experiences), {
        showSuccessToast: true,
        successMessage: "Experience updated successfully!",
      });
    },
    [execute],
  );

  const updatePortfolio = useCallback(
    (portfolio: any) => {
      return execute(() => api.updatePortfolio(portfolio), {
        showSuccessToast: true,
        successMessage: "Portfolio updated successfully!",
      });
    },
    [execute],
  );

  const updateEducation = useCallback(
    (education: any) => {
      return execute(() => api.updateEducation(education), {
        showSuccessToast: true,
        successMessage: "Education updated successfully!",
      });
    },
    [execute],
  );

  return {
    getProfile,
    updateBasicProfile,
    updateVisibilitySettings,
    updateLinks,
    updateExperiences,
    updatePortfolio,
    updateEducation,
    loading,
    error,
  };
}

// File upload hook
export function useFileUpload() {
  const { execute, loading, error } = useApiCall();

  const uploadFile = useCallback(
    (file: File, type: "profile" | "portfolio" | "education") => {
      return execute(() => api.uploadFile(file, type), {
        showSuccessToast: true,
        successMessage: "File uploaded successfully!",
      });
    },
    [execute],
  );

  return {
    uploadFile,
    loading,
    error,
  };
}

// Public profile hook
export function usePublicProfile() {
  const { execute, loading, error } = useApiCall();

  const getPublicProfile = useCallback(
    (username: string) => {
      return execute(() => api.getPublicProfile(username), {
        showErrorToast: false,
      });
    },
    [execute],
  );

  const checkUsernameAvailability = useCallback(
    (username: string) => {
      return execute(() => api.checkUsernameAvailability(username), {
        showErrorToast: false,
      });
    },
    [execute],
  );

  const trackProfileView = useCallback(
    (username: string) => {
      return execute(() => api.trackProfileView(username), {
        showErrorToast: false,
        showSuccessToast: false,
      });
    },
    [execute],
  );

  return {
    getPublicProfile,
    checkUsernameAvailability,
    trackProfileView,
    loading,
    error,
  };
}

// Search hook
export function useSearch() {
  const { execute, loading, error } = useApiCall();

  const searchProfiles = useCallback(
    (query: string, limit?: number) => {
      return execute(() => api.searchProfiles(query, limit), {
        showErrorToast: false,
      });
    },
    [execute],
  );

  return {
    searchProfiles,
    loading,
    error,
  };
}

// Analytics hook
export function useAnalytics() {
  const { execute, loading, error } = useApiCall();

  const getProfileAnalytics = useCallback(() => {
    return execute(() => api.getProfileAnalytics(), { showErrorToast: false });
  }, [execute]);

  return {
    getProfileAnalytics,
    loading,
    error,
  };
}
