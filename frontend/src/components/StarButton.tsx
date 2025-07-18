import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores";

const STARS_STORAGE_KEY = "profile_stars";
const USER_STARRED_KEY = "user_starred_profiles";

interface StarButtonProps {
  profileId?: string;
  className?: string;
}

const StarButton: React.FC<StarButtonProps> = ({
  profileId = "demo-profile",
  className,
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const [starCount, setStarCount] = useState(0);
  const [isStarred, setIsStarred] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load star data from backend
  useEffect(() => {
    const loadStarData = async () => {
      try {
        // Import API service
        const { api } = await import("@/services/api");
        
        // Get public profile data which includes star count
        const response = await api.getPublicProfile(profileId);
        
        if (response.success) {
          // The star count is returned in a different structure from the public profile
          // For now, we'll initialize with 0 and update via the star API
          setStarCount(0);
        } else {
          // Fallback to localStorage for backward compatibility
          const allStars = JSON.parse(
            localStorage.getItem(STARS_STORAGE_KEY) || "{}",
          );
          setStarCount(allStars[profileId] || 0);
        }

        // For now, we'll use localStorage for starred status tracking
        // In a real app, this would come from backend user data
        if (isAuthenticated && user) {
          const userStarred = JSON.parse(
            localStorage.getItem(USER_STARRED_KEY) || "{}",
          );
          setIsStarred(userStarred[user.id]?.includes(profileId) || false);
        }
      } catch (error) {
        console.error("Failed to load star data:", error);
        // Fallback to localStorage
        const allStars = JSON.parse(
          localStorage.getItem(STARS_STORAGE_KEY) || "{}",
        );
        setStarCount(allStars[profileId] || 0);
      }
    };

    loadStarData();
  }, [profileId, isAuthenticated, user]);

  const handleStarClick = async () => {
    console.log("Star click - isAuthenticated:", isAuthenticated, "user:", user);
    
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to give stars");
      return;
    }

    setIsLoading(true);

    try {
      // Import API service
      const { api } = await import("@/services/api");
      
      // Call backend API to star the profile
      const response = await api.starProfile(profileId);
      
      if (response.success) {
        setIsStarred(true);
        setStarCount(response.data.starCount);
        
        // Also update localStorage for "has starred" tracking
        const userStarred = JSON.parse(
          localStorage.getItem(USER_STARRED_KEY) || "{}",
        );
        if (!userStarred[user.id]) {
          userStarred[user.id] = [];
        }
        userStarred[user.id].push(profileId);
        localStorage.setItem(USER_STARRED_KEY, JSON.stringify(userStarred));
        
        toast.success("Star added! ⭐");
      } else {
        // Handle different error types
        if (response.message && response.message.includes("already starred")) {
          toast.info("You've already starred this profile! ⭐");
          setIsStarred(true);
        } else {
          toast.error(response.message || "Failed to star profile");
        }
      }
    } catch (error) {
      console.error("Failed to star profile:", error);
      toast.error("Failed to star profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        onClick={handleStarClick}
        variant="outline"
        size="sm"
        disabled={isLoading || !isAuthenticated}
        className={cn(
          "flex items-center gap-2 transition-all duration-200",
          isStarred
            ? "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50",
          !isAuthenticated && "opacity-60 cursor-not-allowed",
        )}
        aria-label={
          isAuthenticated
            ? isStarred
              ? "Remove star"
              : "Give star"
            : "Sign in to give stars"
        }
      >
        <Star
          className={cn(
            "w-4 h-4 transition-all duration-200",
            isStarred ? "fill-current text-yellow-500" : "text-gray-400",
          )}
        />
        <span className="text-sm font-medium">{starCount}</span>
      </Button>

      {!isAuthenticated && (
        <span className="text-xs text-gray-500">Sign in to star</span>
      )}
    </div>
  );
};

export default StarButton;
