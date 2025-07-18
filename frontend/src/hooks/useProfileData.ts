import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/stores/profileStore";

export const useProfileData = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { 
    isLoading: profileLoading,
    error: profileError,
    updateProfile, 
    updateProjects,
    updatePortfolioProjects,
    updateWorkExperiences,
    updateEducation,
    updateVisibilitySettings,
    setLoading,
    setError: setProfileError,
  } = useProfileStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'backend' | 'demo' | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    if (isDataLoaded) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setProfileError(null);

        // Try to load real data from backend
        const response = await api.getProfile();
        
        if (response.success && response.data) {
          // Update the store with the loaded data
          updateProfile(response.data.profile);
          updateProjects(response.data.links || []);
          updatePortfolioProjects(response.data.portfolio || []);
          updateWorkExperiences(response.data.experiences || []);
          updateEducation(response.data.education || []);
          updateVisibilitySettings(response.data.visibilitySettings || {
            showLinks: true,
            showExperience: true,
            showPortfolio: true,
            showEducation: true,
            showTitles: true,
          });
          
          setDataSource('backend');
          setIsDataLoaded(true);
        } else {
          // Fallback to demo data if backend fails
          console.warn('Failed to load backend data, using demo data');
          setDataSource('demo');
          setError('Using demo data - backend not available');
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
        // Set demo data source as fallback
        setDataSource('demo');
        setError('Using demo data - backend not available');
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, isAuthenticated, isDataLoaded, setLoading, setProfileError, updateProfile, updateProjects, updatePortfolioProjects, updateWorkExperiences, updateEducation, updateVisibilitySettings]);

  return { 
    isLoading: isLoading || profileLoading, 
    error: error || profileError, 
    dataSource,
    isDataLoaded 
  };
};
