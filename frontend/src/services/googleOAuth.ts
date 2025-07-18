// Google Identity Services types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
          storeCredential: (credential: any) => void;
          cancel: () => void;
          onGoogleLibraryLoad: (callback: () => void) => void;
        };
      };
    };
  }
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  given_name?: string;
  family_name?: string;
}

export interface GoogleOAuthConfig {
  clientId: string;
  redirectUri: string;
  scope?: string;
  hostedDomain?: string;
}

class GoogleOAuthService {
  private config: GoogleOAuthConfig;
  private isInitialized = false;
  private currentCredential: string | null = null;

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirectUri: `${import.meta.env.VITE_APP_URL}/auth/callback`,
      scope: "openid profile email",
      hostedDomain: import.meta.env.VITE_GOOGLE_HOSTED_DOMAIN,
    };
    
    console.log("Google OAuth Config:", {
      clientId: this.config.clientId,
      redirectUri: this.config.redirectUri,
      isConfigured: this.isConfigured()
    });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log("Starting Google OAuth initialization with config:", this.config);
      
      // Wait for the Google Identity Services library to be available
      await new Promise<void>((resolve) => {
        const checkGoogle = () => {
          if (typeof window.google !== 'undefined' && window.google?.accounts?.id) {
            console.log("Google Identity Services is available");
            resolve();
          } else {
            console.log("Waiting for Google Identity Services...");
            setTimeout(checkGoogle, 100);
          }
        };
        checkGoogle();
      });

      console.log("Initializing Google Identity Services with client_id:", this.config.clientId);
      
      const initConfig: any = {
        client_id: this.config.clientId,
        callback: (response: any) => {
          console.log("Google OAuth callback received:", response);
          this.currentCredential = response.credential;
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      };

      // Only add hd (hosted domain) if it's defined
      if (this.config.hostedDomain) {
        initConfig.hd = this.config.hostedDomain;
      }

      window.google.accounts.id.initialize(initConfig);

      console.log("Google Identity Services initialized successfully");
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Google OAuth:", error);
      throw new Error(`Failed to initialize Google OAuth: ${error.message}`);
    }
  }

  async signIn(): Promise<GoogleUser & { idToken: string }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log("Starting Google sign-in process");
      
      return new Promise((resolve, reject) => {
        // Configure the callback to handle the response
        window.google.accounts.id.initialize({
          client_id: this.config.clientId,
          callback: (response: any) => {
            console.log("Google sign-in response:", response);
            
            if (response.credential) {
              // Parse the JWT token to get user info
              const user = this.parseJWTToken(response.credential);
              console.log("Parsed user data:", user);
              
              resolve({
                ...user,
                idToken: response.credential
              });
            } else {
              reject(new Error("No credential received from Google"));
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Directly trigger the Google sign-in prompt
        window.google.accounts.id.prompt((notification) => {
          console.log("Google prompt notification:", notification);
          
          // Handle cases where the prompt is not shown
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback: try to show the sign-in popup directly
            try {
              // Create a temporary invisible button and click it
              const tempDiv = document.createElement('div');
              tempDiv.style.position = 'fixed';
              tempDiv.style.top = '-1000px';
              tempDiv.style.left = '-1000px';
              tempDiv.style.visibility = 'hidden';
              document.body.appendChild(tempDiv);
              
              window.google.accounts.id.renderButton(tempDiv, {
                theme: 'outline',
                size: 'large',
                type: 'standard',
              });
              
              // Auto-click the button
              setTimeout(() => {
                const button = tempDiv.querySelector('div[role="button"]');
                if (button) {
                  (button as HTMLElement).click();
                }
                document.body.removeChild(tempDiv);
              }, 100);
            } catch (error) {
              console.error("Fallback sign-in failed:", error);
              reject(new Error("Google sign-in failed"));
            }
          }
        });
      });
    } catch (error) {
      console.error("Google sign-in failed:", error);
      throw new Error("Google sign-in failed");
    }
  }

  private parseJWTToken(token: string): GoogleUser {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("JWT payload:", payload);
      
      return {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
      };
    } catch (error) {
      console.error("Failed to parse JWT token:", error);
      throw new Error("Failed to parse user data from token");
    }
  }

  async signOut(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      window.google.accounts.id.disableAutoSelect();
      this.currentCredential = null;
      console.log("Google sign-out completed");
    } catch (error) {
      console.error("Google sign-out failed:", error);
      throw new Error("Google sign-out failed");
    }
  }

  isSignedIn(): boolean {
    return !!this.currentCredential;
  }

  getCurrentUser(): GoogleUser | null {
    if (!this.currentCredential) return null;

    try {
      return this.parseJWTToken(this.currentCredential);
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  }

  // Validate configuration
  isConfigured(): boolean {
    return (
      !!this.config.clientId &&
      this.config.clientId !== "your_google_client_id_here"
    );
  }

  getConfig(): GoogleOAuthConfig {
    return { ...this.config };
  }

  // Method to render Google sign-in button
  renderButton(element: HTMLElement, theme: 'outline' | 'filled' = 'outline'): void {
    if (!this.isInitialized) {
      console.error("Google OAuth not initialized");
      return;
    }

    window.google.accounts.id.renderButton(element, {
      theme: theme,
      size: 'large',
      type: 'standard',
      shape: 'rectangular',
      text: 'signin_with',
      logo_alignment: 'left',
      width: 250,
    });
  }
}

export const googleOAuth = new GoogleOAuthService();
