import AuthButton from "@/components/AuthButton";
import EducationSection from "@/components/EducationSection";
import Footer from "@/components/Footer";
import LinkButton from "@/components/LinkButton";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Logo from "@/components/Logo";
import PortfolioSection from "@/components/PortfolioSection";
import UnifiedProfileSection from "@/components/UnifiedProfileSection";
import WorkExperienceSection from "@/components/WorkExperienceSection";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getIconFromName } from "@/lib/iconUtils";
import { api } from "@/services/api";
import { useAuthStore } from "@/stores";

import {
  Home,
  Share2,
  ExternalLink,
  AlertCircle,
  Eye,
  LayoutGrid,
} from "lucide-react";

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  // Check if URL starts with @ (proper format)
  const hasAtSymbol = location.pathname.startsWith('/@');
  
  // Clean username (remove @ if present)
  const cleanUsername = username?.startsWith("@")
    ? username.slice(1)
    : username;

  // Handle invalid URL format (without @)
  useEffect(() => {
    if (username && !hasAtSymbol) {
      // Show redirect message instead of loading
      setShowRedirectMessage(true);
      setIsLoading(false);
      return;
    } else if (username && hasAtSymbol) {
      // Reset redirect message for valid URLs
      setShowRedirectMessage(false);
    }
  }, [username, hasAtSymbol]);

  useEffect(() => {
    if (!cleanUsername || !hasAtSymbol || showRedirectMessage) {
      setIsLoading(false);
      return;
    }

    loadProfile();
    // Analytics tracking removed
  }, [cleanUsername, hasAtSymbol, showRedirectMessage]);

  useEffect(() => {
    // Check if viewing own profile
    if (user && profile && user.username === profile.username) {
      setIsOwner(true);
    }
  }, [user, profile]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.getPublicProfile(cleanUsername!);

      if (response.success && response.data) {
        // Transform portfolio and experience data to match frontend interface
        const apiData = response.data as any; // Bypass TypeScript checking to access the original data structure
        const transformedData = {
          ...apiData,
          portfolio: apiData.portfolio ? apiData.portfolio.map((project: any) => ({
            ...project,
            href: project.url || project.href, // Map url to href
            icon: project.iconName ? getIconFromName(project.iconName) : null, // Convert iconName to icon component
          })) : [],
          experiences: apiData.experiences ? apiData.experiences.map((exp: any) => ({
            ...exp,
            duration: exp.duration || "Duration not specified", // Use duration field directly
            icon: exp.iconName ? getIconFromName(exp.iconName) : null, // Convert iconName to icon component
          })) : [],
          education: apiData.education ? apiData.education.map((edu: any) => ({
            ...edu,
            duration: edu.duration || "Duration not specified", // Use duration field directly
            icon: edu.iconName ? getIconFromName(edu.iconName) : null, // Convert iconName to icon component
          })) : [],
          links: apiData.links ? apiData.links.map((link: any) => ({
            ...link,
            href: link.url || link.href, // Map url to href
            icon: link.iconName ? getIconFromName(link.iconName) : null, // Convert iconName to icon component
          })) : [],
        };
        
        setProfile(transformedData);
      } else {
        setError("Profile not found");
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      setError("Profile not found");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/@${cleanUsername}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.user.name} - E-Info.me`,
          text: `Check out ${profile?.user.name}'s profile on E-Info.me`,
          url,
        });
      } catch (error) {
        // User cancelled or error occurred
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Profile link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleLinkClick = (href: string, title: string) => {
    // Track click asynchronously
    (async () => {
      try {
        const { api } = await import("@/services/api");
        await api.trackClick(cleanUsername);
      } catch (error) {
        console.error("Failed to track click:", error);
        // Continue even if tracking fails
      }
    })();

    // Open link immediately
    window.open(href, "_blank", "noopener,noreferrer");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading profile..." />
      </div>
    );
  }

  // Show redirect message for invalid URL format
  if (showRedirectMessage) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Logo - Top Left */}
        <div className="absolute top-4 left-4 z-50">
          <Logo />
        </div>

        {/* Navigation - Top Right */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="sm"
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        {/* Redirect Message Content */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Looking for a profile?
              </h1>
              <p className="text-gray-600">
                User profiles start with the @ symbol
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Try going to:
              </p>
              <Button
                onClick={() => {
                  navigate(`/@${cleanUsername}`, { replace: true });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
              >
                <span>/@{cleanUsername}</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate("/")} variant="default">
                Go Home
              </Button>
              <Button
                onClick={() => navigate("/demo")}
                variant="outline"
                className="text-gray-600"
              >
                View Demo Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Logo - Top Left */}
        <div className="absolute top-4 left-4 z-50">
          <Logo />
        </div>

        {/* Navigation - Top Right */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="sm"
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        {/* Error Content */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                404 - Profile Not Found
              </h1>
              <p className="text-gray-600">
                Looking for profile @{cleanUsername}? It doesn't exist or has been removed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate("/")} variant="default">
                Go Home
              </Button>
              <Button
                onClick={() => navigate("/demo")}
                variant="outline"
                className="text-gray-600"
              >
                View Demo Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 relative">
      {/* Logo - Top Left */}
      <div className="absolute top-4 left-4 z-50">
        <Logo />
      </div>

      {/* Navigation - Top Right */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 px-4"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>

        {isOwner ? (
          <Link to="/mycard">
            <Button
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Edit Profile
            </Button>
          </Link>
        ) : !isAuthenticated ? (
          <Link to="/auth">
            <Button
              size="sm"
              className="bg-gray-700 hover:bg-gray-800 text-white"
            >
              Want Your Public Profile?
            </Button>
          </Link>
        ) : (
          <Link to="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        )}

        <AuthButton />
      </div>

      {/* Owner Alert */}
      {isOwner && (
        <div className="max-w-lg mx-auto mt-20 mb-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Eye className="h-4 w-4" />
            <AlertDescription className="text-blue-800">
              This is how your profile appears to others. You can{" "}
              <Link
                to="/mycard"
                className="font-medium underline hover:no-underline"
              >
                edit your profile
              </Link>{" "}
              or view your{" "}
              <Link
                to="/dashboard"
                className="font-medium underline hover:no-underline"
              >
                analytics dashboard
              </Link>
              .
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content Container */}
      <div className="w-full max-w-lg mx-auto pt-40 pb-64">
        {/* Profile Section */}
        <UnifiedProfileSection profile={profile.profile} canEdit={false} />

        {/* Links Section */}
        {profile.visibilitySettings.showLinks && profile.links.length > 0 && (
          <div className="space-y-2 mt-4">
            {profile.links.map((project) => (
              <LinkButton
                key={project.id}
                href={project.url}
                title={project.title}
                description={project.description}
                icon={project.iconName ? getIconFromName(project.iconName) : null}
                onDirectLink={() => handleLinkClick(project.url, project.title)}
              />
            ))}
          </div>
        )}

        {/* Work Experience Section */}
        {profile.visibilitySettings.showExperience &&
          profile.experiences.length > 0 && (
            <div className="space-y-4 mt-24">
              {profile.visibilitySettings.showTitles && (
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Experience
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Professional journey and key achievements
                  </p>
                </div>
              )}
              <WorkExperienceSection experiences={profile.experiences} />
            </div>
          )}

        {/* Portfolio Section */}
        {profile.visibilitySettings.showPortfolio &&
          profile.portfolio.length > 0 && (
            <div className="space-y-4 mt-24">
              {profile.visibilitySettings.showTitles && (
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Portfolio
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Selected projects and creative work
                  </p>
                </div>
              )}
              <PortfolioSection projects={profile.portfolio} />
            </div>
          )}

        {/* Education Section */}
        {profile.visibilitySettings.showEducation &&
          profile.education.length > 0 && (
            <div className="space-y-4 mt-24">
              {profile.visibilitySettings.showTitles && (
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Education
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Academic background and qualifications
                  </p>
                </div>
              )}
              <EducationSection education={profile.education} />
            </div>
          )}

        {/* Bottom spacing for non-authenticated users */}
        {!isAuthenticated && (
          <div className="h-0"></div>
        )}
      </div>

      <div className="pt-12">
        <Footer position="relative" />
      </div>
    </div>
  );
};

export default PublicProfile;
