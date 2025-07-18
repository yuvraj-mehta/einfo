import AuthButton from "@/components/AuthButton";
import EditableEducationSection from "@/components/EditableEducationSection";
import EditableExperienceSection from "@/components/EditableExperienceSection";
import EditableLinksSection from "@/components/EditableLinksSection";
import EditablePortfolioSection from "@/components/EditablePortfolioSection";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Logo from "@/components/Logo";
import UnifiedProfileSection from "@/components/UnifiedProfileSection";
import { Eye, EyeOff, LayoutDashboard, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { EducationData } from "@/components/Education";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getIconFromName } from "@/lib/iconUtils";
import type { PortfolioProject } from "@/lib/portfolioData";
import type { PersonProfile, ProjectLink, VisibilitySettings } from "@/lib/profileData";
import type { WorkExperienceData } from "@/lib/workExperienceData";
import { api } from "@/services/api";
import { useAuthStore, useProfileStore } from "@/stores";

const EditProfile = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const {
    profile,
    projects,
    portfolioProjects,
    workExperiences,
    education,
    visibilitySettings,
    updateProfile,
    updateProjects,
    updatePortfolioProjects,
    updateWorkExperiences,
    updateEducation,
    updateVisibilitySettings,
    initializeWithUserData,
  } = useProfileStore();
  const navigate = useNavigate();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Initialize profile with user data and load profile data
  useEffect(() => {
    if (user) {
      initializeWithUserData(user);
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await api.getProfile();
      if (response.success && response.data) {
        const { profile: profileData, visibilitySettings: visibility, links, experiences, portfolio, education: educationData } = response.data;
        
        // Transform backend data to match frontend interface
        const transformedLinks = (links || []).map((link: any) => ({
          ...link,
          href: link.url || link.href, // Map url to href
          icon: link.iconName || "Link", // iconName from backend is already a string
        }));
        
        // Transform portfolio data to match frontend interface
        const transformedPortfolio = (portfolio || []).map((project: any) => ({
          ...project,
          href: project.url || project.href, // Map url to href
          icon: project.iconName ? getIconFromName(project.iconName) : null, // Convert iconName to icon component
        }));
        
        // Transform experience data to match frontend interface
        const transformedExperiences = (experiences || []).map((exp: any) => ({
          ...exp,
          duration: exp.duration || "Duration not specified", // Use duration field directly
          icon: exp.iconName ? getIconFromName(exp.iconName) : null, // Convert iconName to icon component
        }));
        
        // Transform education data to match frontend interface
        const transformedEducation = (educationData || []).map((edu: any) => ({
          ...edu,
          duration: edu.duration || "Duration not specified", // Use duration field directly
          icon: edu.iconName ? getIconFromName(edu.iconName) : null, // Convert iconName to icon component
        }));
        
        // Update all store data with backend data
        updateProfile(profileData);
        updateVisibilitySettings(visibility);
        updateProjects(transformedLinks);
        updateWorkExperiences(transformedExperiences);
        updatePortfolioProjects(transformedPortfolio);
        updateEducation(transformedEducation);
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // API-integrated update functions
  const handleProfileUpdate = async (newProfile: PersonProfile) => {
    try {
      const response = await api.updateBasicProfile(newProfile);
      if (response.success) {
        updateProfile(newProfile);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleProjectsUpdate = async (newProjects: ProjectLink[]) => {
    try {
      // Transform frontend data to backend format
      const transformedProjects = newProjects.map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        url: project.href || project.url, // Map href to url
        iconName: typeof project.icon === 'string' ? project.icon : "Link", // Ensure iconName is a string
        imageUrl: project.imageUrl || "",
        projectDetails: project.projectDetails || "",
      }));
      
      const response = await api.updateLinks(transformedProjects);
      if (response.success) {
        updateProjects(newProjects);
        toast.success('Links updated successfully');
      } else {
        console.error('Links update failed:', response.message);
        toast.error(response.message || 'Failed to update links');
      }
    } catch (error) {
      console.error('Failed to update links:', error);
      // Check if it's an authentication error
      if (error.message?.includes('Authentication') || error.message?.includes('401')) {
        toast.error('Authentication expired. Please sign in again.');
        // You might want to redirect to login page here
      } else {
        toast.error('Failed to update links. Please try again.');
      }
    }
  };

  const handlePortfolioUpdate = async (newPortfolio: PortfolioProject[]) => {
    try {
      // Transform portfolio data back to backend format
      const backendPortfolio = newPortfolio.map((project: any) => ({
        ...project,
        url: project.href || project.url, // Map href back to url
        iconName: typeof project.icon === 'string' ? project.icon : 'FolderOpen', // Extract icon name or default
      }));
      
      const response = await api.updatePortfolio(backendPortfolio);
      if (response.success) {
        updatePortfolioProjects(newPortfolio);
        toast.success('Portfolio updated successfully');
      } else {
        toast.error('Failed to update portfolio');
      }
    } catch (error) {
      console.error('Failed to update portfolio:', error);
      toast.error('Failed to update portfolio');
    }
  };

  const handleExperiencesUpdate = async (newExperiences: WorkExperienceData[]) => {
    try {
      // Transform frontend data back to backend format
      const backendExperiences = newExperiences.map(exp => ({
        ...exp,
        duration: exp.duration, // Pass duration as-is
        iconName: typeof exp.icon === 'string' ? exp.icon : 'Building', // Convert icon to iconName
      }));
      
      const response = await api.updateExperiences(backendExperiences);
      if (response.success) {
        updateWorkExperiences(newExperiences);
        toast.success('Work experience updated successfully');
      } else {
        toast.error('Failed to update work experience');
      }
    } catch (error) {
      console.error('Failed to update work experience:', error);
      toast.error('Failed to update work experience');
    }
  };

  const handleEducationUpdate = async (newEducation: EducationData[]) => {
    try {
      // Transform frontend data back to backend format
      const backendEducation = newEducation.map(edu => ({
        ...edu,
        duration: edu.duration, // Pass duration as-is
        iconName: typeof edu.icon === 'string' ? edu.icon : 'GraduationCap', // Convert icon to iconName
      }));
      
      const response = await api.updateEducation(backendEducation);
      if (response.success) {
        updateEducation(newEducation);
        toast.success('Education updated successfully');
      } else {
        toast.error('Failed to update education');
      }
    } catch (error) {
      console.error('Failed to update education:', error);
      toast.error('Failed to update education');
    }
  };

  const handleVisibilityUpdate = async (newSettings: VisibilitySettings) => {
    try {
      const response = await api.updateVisibilitySettings(newSettings);
      if (response.success) {
        updateVisibilitySettings(newSettings);
        toast.success('Visibility settings updated successfully');
      } else {
        toast.error('Failed to update visibility settings');
      }
    } catch (error) {
      console.error('Failed to update visibility settings:', error);
      toast.error('Failed to update visibility settings');
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading..." />
      </div>
    );
  }

  // Redirect will handle navigation for unauthenticated users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-4 md:p-6 relative">
      {/* Logo - Top Left */}
      <div className="absolute top-4 left-4 z-50">
        <Logo />
      </div>

      {/* Navigation - Top Right */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <Button
          onClick={() => (window.location.href = "/dashboard")}
          variant="outline"
          size="sm"
          className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        <AuthButton />
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-lg mx-auto pt-40 pb-64">
        {/* Info Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            My Profile
          </h2>
          <p className="text-gray-600 text-sm">
            Customize your digital card and links below
          </p>
        </div>

        {/* Editable Profile Section - Closer to title */}
        <div className="mb-20">
          <UnifiedProfileSection
            profile={profile}
            canEdit={true}
            onProfileUpdate={handleProfileUpdate}
          />
        </div>

        {/* Visibility Controls Section */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Visibility Settings
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Control which sections are visible on your public profile
          </p>

          <div className="space-y-4">
            {/* Section Visibility Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="show-links"
                    className="text-sm font-medium text-gray-700"
                  >
                    Links Section
                  </Label>
                </div>
                <Switch
                  id="show-links"
                  checked={visibilitySettings.showLinks}
                  onCheckedChange={(checked) =>
                    handleVisibilityUpdate({
                      ...visibilitySettings,
                      showLinks: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="show-experience"
                    className="text-sm font-medium text-gray-700"
                  >
                    Experience Section
                  </Label>
                </div>
                <Switch
                  id="show-experience"
                  checked={visibilitySettings.showExperience}
                  onCheckedChange={(checked) =>
                    handleVisibilityUpdate({
                      ...visibilitySettings,
                      showExperience: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="show-portfolio"
                    className="text-sm font-medium text-gray-700"
                  >
                    Portfolio Section
                  </Label>
                </div>
                <Switch
                  id="show-portfolio"
                  checked={visibilitySettings.showPortfolio}
                  onCheckedChange={(checked) =>
                    handleVisibilityUpdate({
                      ...visibilitySettings,
                      showPortfolio: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="show-education"
                    className="text-sm font-medium text-gray-700"
                  >
                    Education Section
                  </Label>
                </div>
                <Switch
                  id="show-education"
                  checked={visibilitySettings.showEducation}
                  onCheckedChange={(checked) =>
                    handleVisibilityUpdate({
                      ...visibilitySettings,
                      showEducation: checked,
                    })
                  }
                />
              </div>
            </div>

            {/* Title Visibility Control */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <Label
                    htmlFor="show-titles"
                    className="text-sm font-semibold text-gray-800"
                  >
                    Show Section Titles & Descriptions
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    When disabled, only content will be shown without section
                    headers
                  </p>
                </div>
                <Switch
                  id="show-titles"
                  checked={visibilitySettings.showTitles}
                  onCheckedChange={(checked) =>
                    handleVisibilityUpdate({
                      ...visibilitySettings,
                      showTitles: checked,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Editable Links Section - Closer to profile card */}
        <div className="mb-20">
          <EditableLinksSection
            projects={projects}
            onProjectsUpdate={handleProjectsUpdate}
          />
        </div>

        {/* Editable Experience Section */}
        <div className="mb-20">
          <EditableExperienceSection
            experiences={workExperiences}
            onExperiencesUpdate={handleExperiencesUpdate}
          />
        </div>

        {/* Editable Portfolio Section */}
        <div className="mb-20">
          <EditablePortfolioSection
            projects={portfolioProjects}
            onProjectsUpdate={handlePortfolioUpdate}
          />
        </div>

        {/* Editable Education Section */}
        <div className="mb-20">
          <EditableEducationSection
            education={education}
            onEducationUpdate={handleEducationUpdate}
          />
        </div>

        {/* Extra spacing for consistency with public profile */}
        <div className="h-0"></div>
      </div>
      <div className="pt-12">
        <Footer position="relative" />
      </div>
    </div>
  );
};

export default EditProfile;
