import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Clock,
  Users,
  Star,
  Eye,
  Filter,
  Download,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock as ClockIcon
} from 'lucide-react';
import { userAPI } from '@/services/api';
import { getUserApplications, type Application as AppManagerApplication } from '@/utils/applicationManager';

// Demo applications data
const demoApplications: Application[] = [
  {
    id: '1',
    cspId: '1',
    cspTitle: 'Tutoring Underprivileged Children',
    organization: 'Children\'s Society Singapore',
    description: 'Help underprivileged children with their studies and provide mentorship.',
    location: 'Toa Payoh',
    projectDate: '2024-02-15',
    duration: 4,
    status: 'accepted',
    appliedAt: '2024-01-20T10:00:00Z',
    message: 'Thank you for your interest! We are pleased to inform you that your application has been accepted. Please report to Toa Payoh Community Centre on February 15th at 9:00 AM.',
    responseDate: '2024-01-25T14:30:00Z',
    rating: 4.8,
    skills: ['Teaching', 'Mentoring', 'Communication']
  },
  {
    id: '2',
    cspId: '2',
    cspTitle: 'Beach Cleanup at East Coast',
    organization: 'Green Earth Society',
    description: 'Help keep Singapore\'s beaches clean and protect marine life.',
    location: 'East Coast Park',
    projectDate: '2024-02-20',
    duration: 3,
    status: 'pending',
    appliedAt: '2024-01-28T15:45:00Z',
    skills: ['Teamwork', 'Environmental Awareness']
  },
  {
    id: '3',
    cspId: '3',
    cspTitle: 'Senior Care Home Visits',
    organization: 'Singapore Red Cross',
    description: 'Provide companionship and support to elderly residents.',
    location: 'Various Locations',
    projectDate: '2024-02-18',
    duration: 2,
    status: 'rejected',
    appliedAt: '2024-01-15T09:20:00Z',
    message: 'Thank you for your application. Unfortunately, we have already filled all available positions for this project. We encourage you to apply for other opportunities.',
    responseDate: '2024-01-22T11:15:00Z',
    skills: ['Empathy', 'Communication']
  }
];

interface Application {
  id: string;
  cspId: string;
  cspTitle: string;
  organization: string;
  description: string;
  location: string;
  projectDate: string;
  duration: number;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  message?: string;
  responseDate?: string;
  rating?: number;
  skills: string[];
}

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  // Listen for new applications
  useEffect(() => {
    const handleApplicationAdded = () => {
      if (user) {
        fetchApplications();
      }
    };

    window.addEventListener('applicationAdded', handleApplicationAdded);
    return () => {
      window.removeEventListener('applicationAdded', handleApplicationAdded);
    };
  }, [user]);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchTerm, statusFilter, sortBy]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      if (user) {
        // Get applications from application manager
        const userApps = getUserApplications(user.id);
        setApplications(userApps);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortApplications = () => {
    let filtered = applications.filter(app => {
      const matchesSearch = app.cspTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.organization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort applications
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'project':
          return a.cspTitle.localeCompare(b.cspTitle);
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <Badge variant="success" className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>Accepted</span>
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="flex items-center space-x-1">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" className="flex items-center space-x-1">
            <ClockIcon className="h-3 w-3" />
            <span>Under Review</span>
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const exportApplications = () => {
    const csvContent = [
      ['Project Title', 'Organization', 'Status', 'Applied Date', 'Project Date', 'Duration'],
      ...filteredApplications.map(app => [
        app.cspTitle,
        app.organization,
        app.status,
        new Date(app.appliedAt).toLocaleDateString(),
        new Date(app.projectDate).toLocaleDateString(),
        `${app.duration} hours`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-applications.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    totalHours: applications
      .filter(app => app.status === 'accepted')
      .reduce((sum, app) => sum + app.duration, 0)
  };

  return (
    <div className="min-h-screen bg-smu-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-smu-blue mb-4">
            My Applications
          </h1>
          <p className="text-xl text-gray-600">
            Track and manage your community service project applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-smu-blue">{stats.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Under Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Under Review</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date Applied</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="project">Project Name</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={exportApplications}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smu-red"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-gray-600 mb-2">
                {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
              </h3>
              <p className="text-gray-500 mb-4">
                {applications.length === 0 
                  ? 'Start your community service journey by applying for projects.'
                  : 'Try adjusting your search criteria.'
                }
              </p>
              {applications.length === 0 && (
                <Button variant="smu" asChild>
                  <Link to="/discover">Discover Projects</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{application.cspTitle}</h3>
                          <p className="text-smu-blue font-medium">{application.organization}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{application.description}</p>
                        </div>
                        <div className="ml-4">
                          {getStatusBadge(application.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{application.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(application.projectDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{application.duration} hours</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {application.skills && application.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {application.skills.slice(0, 5).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {application.skills.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{application.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {application.message && (
                        <div className="bg-gray-50 border rounded-md p-3">
                          <p className="text-sm text-gray-700">
                            <strong>Response:</strong> {application.message}
                          </p>
                          {application.responseDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              Received {new Date(application.responseDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 lg:ml-6">
                      <Button variant="outline" asChild>
                        <Link to={`/csp/${application.cspId}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Project
                        </Link>
                      </Button>
                      
                      {application.status === 'accepted' && (
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4 mr-2" />
                          Rate Experience
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredApplications.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Applications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
