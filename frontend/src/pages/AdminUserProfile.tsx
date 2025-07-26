import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Calendar,
  Eye,
  MousePointer,
  Shield,
  CheckCircle,
  XCircle,
  Globe,
  Link as LinkIcon,
  Briefcase,
  GraduationCap,
  Award,
  Star
} from "lucide-react";

interface UserDetails {
  id: string;
  name: string;
  email: string;
  username: string;
  isActive: boolean;
  emailVerified: boolean;
  totalViews: number;
  totalClicks: number;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  profile: {
    id: string;
    jobTitle?: string;
    bio?: string;
    email?: string;
    website?: string;
    location?: string;
    profileImageUrl?: string;
    resumeUrl?: string;
    skills?: string[];
    showLinks: boolean;
    showExperience: boolean;
    showPortfolio: boolean;
    showEducation: boolean;
    showAchievements: boolean;
    showExtracurriculars: boolean;
    showTitles: boolean;
  } | null;
  _count: {
    links: number;
    portfolio: number;
    experience: number;
    education: number;
    achievements: number;
    extracurriculars: number;
  };
}

const AdminUserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("adminToken");
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (response.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      navigate("/admin/login");
      throw new Error("Unauthorized");
    }

    return response;
  };

  useEffect(() => {
    const loadUserDetails = async () => {
      if (!userId) return;

      try {
        const response = await makeAuthenticatedRequest(
          `${import.meta.env.VITE_API_BASE_URL}/admin/users/${userId}`
        );
        
        const data = await response.json();
        
        if (data.success) {
          setUser(data.data.user);
        } else {
          toast.error("Failed to load user details");
          navigate("/admin/dashboard");
        }
      } catch (error) {
        console.error("User details error:", error);
        if (error.message !== "Unauthorized") {
          toast.error("Failed to load user details");
          navigate("/admin/dashboard");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserDetails();
  }, [userId, navigate]);

  const toggleUserStatus = async () => {
    if (!user) return;

    try {
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_BASE_URL}/admin/users/${user.id}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ isActive: !user.isActive })
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setUser(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
        toast.success(`User ${!user.isActive ? "activated" : "deactivated"} successfully`);
      } else {
        toast.error(data.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Toggle user status error:", error);
      if (error.message !== "Unauthorized") {
        toast.error("Failed to update user status");
      }
    }
  };

  const openUserProfile = () => {
    if (user?.username) {
      window.open(`/profile/${user.username}`, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-4">The requested user could not be found.</p>
          <Button onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/admin/dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">User Profile</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openUserProfile}
              >
                <Globe className="w-4 h-4 mr-2" />
                View Public Profile
              </Button>
              <Button 
                variant={user.isActive ? "destructive" : "default"}
                size="sm" 
                onClick={toggleUserStatus}
              >
                {user.isActive ? (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Deactivate User
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activate User
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  {user.profile?.profileImageUrl || user.avatarUrl ? (
                    <img 
                      src={user.profile?.profileImageUrl || user.avatarUrl} 
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>@{user.username}</CardDescription>
                <div className="flex justify-center gap-2 mt-2">
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {user.emailVerified && (
                    <Badge variant="secondary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.profile?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{user.profile.location}</span>
                  </div>
                )}
                {user.profile?.website && (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-gray-400" />
                    <a 
                      href={user.profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {user.profile.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Joined {formatDate(user.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Profile Views</span>
                  </div>
                  <span className="font-semibold">{user.totalViews}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Total Clicks</span>
                  </div>
                  <span className="font-semibold">{user.totalClicks}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.profile?.jobTitle && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Job Title</label>
                    <p className="text-sm mt-1">{user.profile.jobTitle}</p>
                  </div>
                )}
                {user.profile?.bio && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Bio</label>
                    <p className="text-sm mt-1">{user.profile.bio}</p>
                  </div>
                )}
                {user.profile?.skills && user.profile.skills.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Skills</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.profile.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Content Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Content Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <LinkIcon className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold">{user._count.links}</div>
                    <div className="text-sm text-gray-600">Links</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Briefcase className="w-6 h-6 mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold">{user._count.portfolio}</div>
                    <div className="text-sm text-gray-600">Portfolio</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Briefcase className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                    <div className="text-2xl font-bold">{user._count.experience}</div>
                    <div className="text-sm text-gray-600">Experience</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <GraduationCap className="w-6 h-6 mx-auto text-orange-600 mb-2" />
                    <div className="text-2xl font-bold">{user._count.education}</div>
                    <div className="text-sm text-gray-600">Education</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Award className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
                    <div className="text-2xl font-bold">{user._count.achievements}</div>
                    <div className="text-sm text-gray-600">Achievements</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Star className="w-6 h-6 mx-auto text-red-600 mb-2" />
                    <div className="text-2xl font-bold">{user._count.extracurriculars}</div>
                    <div className="text-sm text-gray-600">Activities</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Visibility */}
            <Card>
              <CardHeader>
                <CardTitle>Section Visibility</CardTitle>
                <CardDescription>What sections are visible on the user's profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'showLinks', label: 'Links' },
                    { key: 'showExperience', label: 'Experience' },
                    { key: 'showPortfolio', label: 'Portfolio' },
                    { key: 'showEducation', label: 'Education' },
                    { key: 'showAchievements', label: 'Achievements' },
                    { key: 'showExtracurriculars', label: 'Activities' },
                    { key: 'showTitles', label: 'Titles' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{label}</span>
                      <Badge variant={user.profile?.[key as keyof typeof user.profile] ? "default" : "secondary"}>
                        {user.profile?.[key as keyof typeof user.profile] ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserProfile;
