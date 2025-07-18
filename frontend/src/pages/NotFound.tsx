import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLikelyUsername, setIsLikelyUsername] = useState(false);
  const [suggestedUsername, setSuggestedUsername] = useState("");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );

    // Check if this looks like a username without @
    const pathname = location.pathname;
    const knownRoutes = ['/demo', '/auth', '/mycard', '/account', '/dashboard', '/auth/callback'];
    
    if (pathname.startsWith('/') && pathname.length > 1 && !knownRoutes.includes(pathname)) {
      const possibleUsername = pathname.substring(1);
      if (!possibleUsername.includes('/') && possibleUsername.length >= 3) {
        setIsLikelyUsername(true);
        setSuggestedUsername(possibleUsername);
      }
    }
  }, [location.pathname]);

  const handleGoToProfile = () => {
    if (suggestedUsername) {
      navigate(`/@${suggestedUsername}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        
        {isLikelyUsername && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium mb-2">
              Looking for a profile?
            </p>
            <p className="text-blue-700 text-sm mb-4">
              Did you mean <span className="font-semibold">@{suggestedUsername}</span>?
            </p>
            <Button 
              onClick={handleGoToProfile}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-2"
            >
              Go to @{suggestedUsername}
            </Button>
            <p className="text-xs text-blue-600">
              Profile URLs should start with @ symbol
            </p>
          </div>
        )}
        
        <Button 
          onClick={() => navigate("/")}
          variant="outline"
          className="border-gray-300 hover:bg-gray-50"
        >
          Return to Home
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
