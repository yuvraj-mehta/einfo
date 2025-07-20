import { AlertCircle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { googleOAuth } from "@/services/googleOAuth";
import { useAuthStore } from "@/stores";

const AuthCallback = () => {
  const { signIn, getRedirectPath } = useAuthStore();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus("loading");
        setMessage("Verifying Google authentication...");

        // Check if user is signed in with Google
        if (!googleOAuth.isSignedIn()) {
          throw new Error("Google authentication not found");
        }

        // Get current user from Google
        const googleUser = googleOAuth.getCurrentUser();
        if (!googleUser) {
          throw new Error("Failed to get user information from Google");
        }

        setMessage("Setting up your account...");

        // Convert Google user to our user format
        const user = {
          id: googleUser.id,
          name: googleUser.name,
          email: googleUser.email,
          avatar: googleUser.avatar,
        };

        // Sign in the user to our system
        await signIn(user);

        setStatus("success");
        setMessage("Authentication successful! Redirecting...");

        // Redirect to the intended page
        setTimeout(() => {
          const redirectTo = getRedirectPath();
          navigate(redirectTo);
        }, 1500);
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Authentication failed",
        );
      }
    };

    handleCallback();
  }, [signIn, navigate, getRedirectPath]);

  const handleRetry = () => {
    navigate("/auth");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center space-y-6">
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-6">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-16 h-16 object-contain animate-pulse"
                style={{
                  filter: 'brightness(0)',
                  animation: 'logo-fade 2s ease-in-out infinite'
                }}
              />
            </div>
            <LoadingSpinner size="lg" />
            <p className="text-gray-800 font-light">Turning Personality into Pixels...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Success!</h1>
              <p className="text-gray-600">{message}</p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Authentication Failed
              </h1>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleRetry} variant="default">
                  Try Again
                </Button>
                <Button onClick={handleGoHome} variant="outline">
                  Go Home
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
