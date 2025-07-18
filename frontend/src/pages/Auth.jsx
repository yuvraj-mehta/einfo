import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { AlertCircle, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { googleOAuth } from "@/services/googleOAuth";
import { useAuthStore } from "@/stores";
import { sanitizeUsername, validateUsername } from "@/utils/validation";

const Auth = () => {
  const { signIn, isLoading, error, clearError, getRedirectPath } =
    useAuthStore();
  const navigate = useNavigate();
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [googleError, setGoogleError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize Google OAuth on component mount
  useEffect(() => {
    const initializeGoogle = async () => {
      try {
        setIsInitializing(true);
        setGoogleError(null);

        if (!googleOAuth.isConfigured()) {
          setGoogleError(
            "Google OAuth is not configured. Please add your Google Client ID to the environment variables.",
          );
          setIsGoogleReady(false);
          return;
        }

        await googleOAuth.initialize();
        setIsGoogleReady(true);
      } catch (error) {
        console.error("Failed to initialize Google OAuth:", error);
        setGoogleError(
          "Failed to initialize Google OAuth. Please check your configuration.",
        );
        setIsGoogleReady(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeGoogle();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      // Clear any previous errors
      clearError();
      setGoogleError(null);

      if (!isGoogleReady) {
        throw new Error("Google OAuth is not ready");
      }

      // Sign in with Google OAuth
      const googleUser = await googleOAuth.signIn();

      // Send Google token to backend for validation and user creation/login
      const response = await api.googleLogin(googleUser.idToken);

      if (response.success && response.data) {
        // Convert backend user data to frontend format
        const user = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          avatar: response.data.user.avatarUrl,
          username: response.data.user.username,
          instantMessage: response.data.user.instantMessageBody,
        };

        await signIn(user);
        const redirectTo = getRedirectPath();
        navigate(redirectTo);
      } else {
        throw new Error(response.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Google sign in failed:", error);
      setGoogleError(error.message || "Google sign in failed");
    }
  };

  const handleDemoSignIn = async () => {
    try {
      // Clear any previous errors
      clearError();
      setGoogleError(null);

      // Demo user data with random avatar
      const demoUsers = [
        {
          id: "demo-1",
          name: "Alex Johnson",
          email: "alex.demo@example.com",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        },
        {
          id: "demo-2",
          name: "Sarah Chen",
          email: "sarah.demo@example.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        },
        {
          id: "demo-3",
          name: "Michael Rodriguez",
          email: "michael.demo@example.com",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        },
      ];

      // Pick a random demo user
      const randomUser =
        demoUsers[Math.floor(Math.random() * demoUsers.length)];

      await signIn(randomUser);
      const redirectTo = getRedirectPath();
      navigate(redirectTo);
    } catch (error) {
      console.error("Demo sign in failed:", error);
      setGoogleError(error.message || "Demo sign in failed");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center">
        <Logo />
        <Link to="/">
          <Button variant="ghost" size="sm">
            Back to Home
          </Button>
        </Link>
      </nav>

      {/* Main Content - Centered */}
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="max-w-md mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600">
              Sign in to create and manage your developer profile
            </p>
          </div>

          {/* Configuration Warning */}
          {!isGoogleReady && !isInitializing && (
            <Alert className="mb-4">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {googleError ||
                  "Google OAuth is not configured. Please add your Google Client ID to continue."}
                <div className="mt-2 text-xs text-gray-500">
                  To set up Google OAuth:
                  <ol className="list-decimal list-inside mt-1 ml-2">
                    <li>
                      Go to{" "}
                      <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Google Cloud Console
                      </a>
                    </li>
                    <li>Create OAuth 2.0 credentials</li>
                    <li>Add your Google Client ID to the .env file</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Authentication Options */}
          <div className="space-y-4">
            {/* Demo Sign In - Always Available */}
            <Button
              variant="default"
              size="lg"
              className="w-full flex items-center justify-center gap-3 py-3 bg-black hover:bg-gray-800 text-white transition-colors font-medium"
              onClick={handleDemoSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <>🚀 Try Demo Account</>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-3 py-3 border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isInitializing || !isGoogleReady}
            >
              {!isLoading && !isInitializing && (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : isInitializing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  Initializing...
                </div>
              ) : !isGoogleReady ? (
                "Google OAuth Not Configured"
              ) : (
                "Continue with Google"
              )}
            </Button>

            {(error || googleError) && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{error || googleError}</span>
                  <button
                    onClick={() => {
                      clearError();
                      setGoogleError(null);
                    }}
                    className="ml-auto text-red-400 hover:text-red-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
