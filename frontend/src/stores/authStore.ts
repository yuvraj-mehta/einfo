import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { api } from "@/services/api";
import { googleOAuth } from "@/services/googleOAuth";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  instantMessage?: string;
  instantMessageSubject?: string;
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  redirectPath: string;

  // Actions
  signIn: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
  setRedirectPath: (path: string) => void;
  getRedirectPath: () => string;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  verifyToken: () => Promise<boolean>;
}

const AUTH_EXPIRY_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      redirectPath: "/dashboard",

      // Actions
      signIn: async (userData: User) => {
        try {
          set({ isLoading: true, error: null });

          // Validate user data
          if (!userData.id || !userData.name || !userData.email) {
            throw new Error("Invalid user data");
          }

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Sign in failed";
          set({
            error: errorMessage,
            isLoading: false,
            user: null,
            isAuthenticated: false,
          });
          throw new Error(errorMessage);
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });

          // Call backend logout endpoint
          try {
            await api.logout();
          } catch (apiError) {
            console.warn("Backend logout failed:", apiError);
            // Continue with local logout even if backend fails
          }

          // Sign out from Google if user is signed in
          try {
            if (googleOAuth.isSignedIn()) {
              await googleOAuth.signOut();
            }
          } catch (googleError) {
            console.warn("Google sign-out failed:", googleError);
            // Continue with local sign-out even if Google sign-out fails
          }

          // Clear local storage
          localStorage.removeItem("authToken");

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Sign out failed";
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({
          user: { ...currentUser, ...updates },
        });
      },

      clearError: () => set({ error: null }),

      setRedirectPath: (path: string) => set({ redirectPath: path }),

      getRedirectPath: () => get().redirectPath,

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      verifyToken: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.verifyToken();

          if (response.success && response.data?.user) {
            const user = {
              id: response.data.user.id,
              name: response.data.user.name,
              email: response.data.user.email,
              avatar: response.data.user.avatarUrl,
              username: response.data.user.username,
              instantMessage: response.data.user.instantMessageBody,
              instantMessageSubject: response.data.user.instantMessageSubject,
            };

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } else {
            // Invalid token, clear auth state
            console.warn("Token verification failed:", response.message);
            localStorage.removeItem("authToken");
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: "Authentication expired. Please sign in again.",
            });
            return false;
          }
        } catch (error) {
          console.error("Token verification error:", error);
          // Token verification failed, clear auth state
          localStorage.removeItem("authToken");
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: "Authentication expired. Please sign in again.",
          });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => ({
        getItem: (name: string) => {
          const item = localStorage.getItem(name);
          if (!item) return null;

          try {
            const parsed = JSON.parse(item);
            const expiryTime = parsed.state?.expiryTime;

            if (expiryTime && Date.now() > expiryTime) {
              localStorage.removeItem(name);
              return null;
            }

            return item;
          } catch {
            localStorage.removeItem(name);
            return null;
          }
        },
        setItem: (name: string, value: string) => {
          try {
            const parsed = JSON.parse(value);
            const dataWithExpiry = {
              ...parsed,
              state: {
                ...parsed.state,
                expiryTime: Date.now() + AUTH_EXPIRY_DURATION,
              },
            };
            localStorage.setItem(name, JSON.stringify(dataWithExpiry));
          } catch {
            localStorage.setItem(name, value);
          }
        },
        removeItem: (name: string) => localStorage.removeItem(name),
      })),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        redirectPath: state.redirectPath,
      }),
    },
  ),
);

// Initialize auth state by checking token validity
export const initializeAuth = async () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    const { verifyToken } = useAuthStore.getState();
    await verifyToken();
  }
};

// Auto-refresh session before expiry
let refreshInterval: NodeJS.Timeout | null = null;

export const startAuthRefresh = () => {
  if (refreshInterval) return;

  refreshInterval = setInterval(
    () => {
      const state = useAuthStore.getState();
      if (!state.user) return;

      const authData = localStorage.getItem("auth-storage");
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          const expiryTime = parsed.state?.expiryTime;

          if (expiryTime) {
            const timeUntilExpiry = expiryTime - Date.now();

            // If session expires in less than 1 hour, refresh it
            if (timeUntilExpiry < 60 * 60 * 1000 && timeUntilExpiry > 0) {
              const newExpiryTime = Date.now() + AUTH_EXPIRY_DURATION;
              const refreshedData = {
                ...parsed,
                state: {
                  ...parsed.state,
                  expiryTime: newExpiryTime,
                },
              };
              localStorage.setItem(
                "auth-storage",
                JSON.stringify(refreshedData),
              );
            }
          }
        } catch (error) {
          console.warn("Failed to refresh auth session:", error);
        }
      }
    },
    10 * 60 * 1000,
  ); // Check every 10 minutes
};

export const stopAuthRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};
