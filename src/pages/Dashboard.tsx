import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  Clock, 
  TrendingUp,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  Plus,
  Bell,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
  Award
} from 'lucide-react';
import { cspAPI, userAPI, analyticsAPI } from '@/services/api';
import { getRecentApplications, getUserApplications, resetApplications, type Application as AppManagerApplication } from '@/utils/applicationManager';

interface RecentApplication {
  id: string;
  cspTitle: string;
  organization: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  projectDate: string;
}

// Demo applications data for dashboard
const demoDashboardApplications: RecentApplication[] = [
  {
    id: '1',
    cspTitle: 'Tutoring Underprivileged Children',
    organization: 'Children\'s Society Singapore',
    status: 'accepted',
    appliedAt: '2024-01-20T10:00:00Z',
    projectDate: '2024-02-15'
  },
  {
    id: '2',
    cspTitle: 'Beach Cleanup at East Coast',
    organization: 'Green Earth Society',
    status: 'pending',
    appliedAt: '2024-01-28T15:45:00Z',
    projectDate: '2024-02-20'
  },
  {
    id: '3',
    cspTitle: 'Senior Care Home Visits',
    organization: 'Singapore Red Cross',
    status: 'rejected',
    appliedAt: '2024-01-15T09:20:00Z',
    projectDate: '2024-02-18'
  }
];

interface DashboardStats {
  totalApplications: number;
  acceptedApplications: number;
  pendingApplications: number;
  totalHours: number;
  upcomingProjects: number;
}

interface UpcomingCSP {
  id: string;
  title: string;
  organization: string;
  date: string;
  location: string;
  spots: number;
  rating: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [upcomingCSPs, setUpcomingCSPs] = useState<UpcomingCSP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Listen for new applications
  useEffect(() => {
    const handleApplicationAdded = () => {
      if (user) {
        fetchDashboardData();
      }
    };

    window.addEventListener('applicationAdded', handleApplicationAdded);
    return () => {
      window.removeEventListener('applicationAdded', handleApplicationAdded);
    };
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user applications and stats using application manager
      const userApplications = getUserApplications(user.id);
      const recentApps = getRecentApplications(5);
      
      // Calculate stats from actual applications
      const totalApplications = userApplications.length;
      const acceptedApplications = userApplications.filter(app => app.status === 'accepted').length;
      const pendingApplications = userApplications.filter(app => app.status === 'pending').length;
      const totalHours = userApplications
        .filter(app => app.status === 'accepted')
        .length * 4; // Assume 4 hours per accepted application

      setStats({
        totalApplications,
        acceptedApplications,
        pendingApplications,
        totalHours,
        upcomingProjects: acceptedApplications // Number of accepted applications
      });

      // Set recent applications from application manager
      setRecentApplications(recentApps.map(app => ({
        id: app.id,
        cspTitle: app.cspTitle,
        organization: app.organization,
        status: app.status,
        appliedAt: app.appliedAt,
        projectDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      })));

      // Set upcoming CSPs (use demo data for now)
      setUpcomingCSPs(demoDashboardApplications.slice(0, 3));

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="warning">Under Review</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smu-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-smu-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-smu-blue mb-2">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-xl text-gray-600">
                {user?.role === 'student' 
                  ? "Continue your community service journey and make a difference."
                  : user?.role === 'csp_leader'
                  ? "Manage your community service projects and volunteers."
                  : "Monitor platform activity and support the SMU community."
                }
              </p>
            </div>
            <Button 
              onClick={() => {
                resetApplications();
                fetchDashboardData();
              }}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Load Demo Applications
            </Button>
          </div>
        </div>

        {/* Quick Actions for Students */}
        {user?.role === 'student' && (
          <div className="mb-8">
            <Card className="border-smu-red bg-gradient-to-r from-red-50 to-blue-50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Complete CSU Module First</h3>
                    <p className="text-gray-600 mb-4">
                      Before applying for CSPs, make sure you've completed the Community Service 
                      Understanding (CSU) module on eLearn.
                    </p>
                  </div>
                  <Button variant="smu" asChild>
                    <a href="https://elearn.smu.edu.sg" target="_blank" rel="noopener noreferrer">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Go to eLearn
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-smu-blue">{stats.totalApplications}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Accepted</p>
                    <p className="text-2xl font-bold text-green-600">{stats.acceptedApplications}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingApplications}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Hours</p>
                    <p className="text-2xl font-bold text-smu-red">{stats.totalHours}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>
                    Track the status of your recent community service applications
                  </CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/my-applications">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg text-gray-600 mb-2">
                      No applications yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Start your community service journey by applying for projects.
                    </p>
                    <Button variant="smu" asChild>
                      <Link to="/discover">Discover Projects</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{application.cspTitle}</h4>
                          <p className="text-sm text-gray-600">{application.organization}</p>
                          <p className="text-xs text-gray-500">
                            Applied {new Date(application.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(application.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="smu" className="w-full" asChild>
                  <Link to="/discover">
                    <Heart className="h-4 w-4 mr-2" />
                    Discover CSPs
                  </Link>
                </Button>
                
                {user?.role === 'csp_leader' && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/csp-management">
                      <Plus className="h-4 w-4 mr-2" />
                      Create CSP
                    </Link>
                  </Button>
                )}
                
                {user?.role === 'admin' && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/admin">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  </Button>
                )}
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/profile">
                    <Users className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Featured CSPs */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Projects</CardTitle>
                <CardDescription>
                  Popular community service opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingCSPs.map((csp) => (
                  <div key={csp.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm line-clamp-2">{csp.title}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{csp.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{csp.organization}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{csp.location}</span>
                      </div>
                      <span>{csp.spots} spots left</span>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
                      <Link to={`/csp/${csp.id}`}>View Details</Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Progress Tracker for Students */}
            {user?.role === 'student' && stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Service Hours Progress</CardTitle>
                  <CardDescription>
                    Track your community service requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Hours Completed</span>
                      <span className="font-semibold">{stats.totalHours} / 80</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-smu-red h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((stats.totalHours / 80) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600">
                      {80 - stats.totalHours} more hours needed for graduation
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to="/my-applications">View Applications</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
