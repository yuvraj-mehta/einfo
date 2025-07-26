import CreateAdminModal from "@/components/admin/CreateAdminModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Logo from "@/components/Logo";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  Users,
  UserCheck,
  UserX,
  Activity,
  Shield,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  MoreHorizontal
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProfiles: number;
  inactiveUsers: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  isActive: boolean;
  emailVerified: boolean;
  totalViews: number;
  totalClicks: number;
  createdAt: string;
  profile: {
    profileImageUrl?: string;
    jobTitle?: string;
    location?: string;
  } | null;
  _count: {
    links: number;
    portfolio: number;
    experiences: number;
    receivedStars: number;
  };
}

interface ActivityLog {
  id: string;
  action: string;
  details?: string;
  createdAt: string;
  admin: {
    name: string;
    email: string;
  };
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adminData, setAdminData] = useState<any>(null);
  const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken");
    const admin = localStorage.getItem("adminData");
    
    if (!token || !admin) {
      navigate("/admin/login");
      return;
    }

    setAdminData(JSON.parse(admin));
    loadDashboardData();
  }, [navigate]);

  useEffect(() => {
    if (adminData) {
      loadUsers();
    }
  }, [currentPage, searchTerm, statusFilter, adminData]);

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

  const loadDashboardData = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_BASE_URL}/admin/dashboard`
      );
      
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data.stats);
        setActivities(data.data.recentActivities); // Backend now limits to 10
      } else {
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      if (error.message !== "Unauthorized") {
        toast.error("Failed to load dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    if (!adminData) return;
    
    setIsUsersLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter })
      });

      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_BASE_URL}/admin/users?${params}`
      );
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data.users);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      console.error("Users error:", error);
      if (error.message !== "Unauthorized") {
        toast.error("Failed to load users");
      }
    } finally {
      setIsUsersLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_BASE_URL}/admin/users/${userId}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ isActive: !currentStatus })
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`User ${!currentStatus ? "activated" : "deactivated"} successfully`);
        loadUsers(); // Reload users list
        loadDashboardData(); // Reload stats
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

  const handleLogout = async () => {
    try {
      await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_BASE_URL}/admin/logout`,
        { method: "POST" }
      );
    } catch (error) {
      // Ignore logout API errors
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      navigate("/admin/login");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
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
              <Logo />
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {adminData && (
                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-medium">{adminData.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {adminData.role}
                  </Badge>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.activeUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.inactiveUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProfiles || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="mb-6">
                    <CardTitle>Users Management</CardTitle>
                    <CardDescription> </CardDescription>
                  </div>
                  {adminData?.role === "super_admin" && (
                    <Button size="sm" onClick={() => setIsCreateAdminModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Admin
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {isUsersLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {user.profile?.profileImageUrl ? (
                              <img
                                src={user.profile.profileImageUrl}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-600">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">@{user.username}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserStatus(user.id, user.isActive)}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`/@${user.username}`, '_blank')}
                            title={`View ${user.username}'s public profile`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center mt-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Previous
                        </Button>
                        
                        <span className="text-sm text-gray-600">
                          Page {currentPage} of {totalPages}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest admin actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="text-sm">
                      <div className="font-medium">{activity.action.replace(/_/g, ' ')}</div>
                      <div className="text-gray-500">by {activity.admin.name}</div>
                      <div className="text-xs text-gray-400">{formatDate(activity.createdAt)}</div>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No recent activities
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={isCreateAdminModalOpen}
        onClose={() => setIsCreateAdminModalOpen(false)}
        onSuccess={() => {
          // Reload dashboard data after creating admin
          loadDashboardData();
        }}
      />
    </div>
  );
};

export default AdminDashboard;
