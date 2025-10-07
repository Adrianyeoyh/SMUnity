import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  BarChart3,
  Download,
  Mail,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cspAPI, userAPI } from '@/services/api';

interface CSP {
  id: string;
  title: string;
  organization: string;
  description: string;
  location: string;
  date: string;
  duration: number;
  spots: number;
  applicants: number;
  acceptedApplicants: number;
  rating: number;
  category: string;
  skills: string[];
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  isApproved: boolean;
}

interface Application {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  studentId: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  message?: string;
  skills: string[];
}

const CSPManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [csps, setCsps] = useState<CSP[]>([]);
  const [filteredCsps, setFilteredCsps] = useState<CSP[]>([]);
  const [selectedCSP, setSelectedCSP] = useState<CSP | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchMyCSPs();
    }
  }, [user]);

  useEffect(() => {
    filterCSPs();
  }, [csps, searchTerm, statusFilter]);

  const fetchMyCSPs = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getMyCSPs();
      setCsps(response.data);
    } catch (error) {
      console.error('Failed to fetch CSPs:', error);
      toast({
        title: "Error",
        description: "Failed to load your CSPs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (cspId: string) => {
    try {
      const response = await cspAPI.getApplications(cspId);
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const filterCSPs = () => {
    let filtered = csps.filter(csp => {
      const matchesSearch = csp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           csp.organization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || csp.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    setFilteredCsps(filtered);
  };

  const handleApplicationStatusChange = async (cspId: string, applicationId: string, status: string) => {
    try {
      await cspAPI.updateApplication(cspId, applicationId, status);
      toast({
        title: "Status Updated",
        description: `Application ${status} successfully.`,
      });
      fetchApplications(cspId);
      fetchMyCSPs(); // Refresh CSP stats
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update application status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'completed':
        return <Badge variant="info">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getApplicationStatusBadge = (status: string) => {
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

  const stats = {
    total: csps.length,
    approved: csps.filter(csp => csp.status === 'approved').length,
    pending: csps.filter(csp => csp.status === 'pending').length,
    totalApplicants: csps.reduce((sum, csp) => sum + csp.applicants, 0)
  };

  return (
    <div className="min-h-screen bg-smu-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-smu-blue mb-4">
              CSP Management
            </h1>
            <p className="text-xl text-gray-600">
              Manage your community service projects and applications
            </p>
          </div>
          <Button variant="smu" asChild className="mt-4 md:mt-0">
            <Link to="/csp/create">
              <Plus className="h-4 w-4 mr-2" />
              Create New CSP
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total CSPs</p>
                  <p className="text-2xl font-bold text-smu-blue">{stats.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
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
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                  <p className="text-2xl font-bold text-smu-red">{stats.totalApplicants}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CSPs List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Search your CSPs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* CSPs List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smu-red"></div>
              </div>
            ) : filteredCsps.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg text-gray-600 mb-2">
                    {csps.length === 0 ? 'No CSPs created yet' : 'No matching CSPs'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {csps.length === 0 
                      ? 'Create your first community service project to get started.'
                      : 'Try adjusting your search criteria.'
                    }
                  </p>
                  {csps.length === 0 && (
                    <Button variant="smu" asChild>
                      <Link to="/csp/create">Create Your First CSP</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredCsps.map((csp) => (
                  <Card key={csp.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{csp.title}</h3>
                              <p className="text-smu-blue font-medium">{csp.organization}</p>
                              <p className="text-sm text-gray-600 line-clamp-2">{csp.description}</p>
                            </div>
                            <div className="ml-4">
                              {getStatusBadge(csp.status)}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{csp.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(csp.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{csp.duration} hours</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{csp.applicants} applicants</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Available spots: {csp.spots}</span>
                              <span>Accepted: {csp.acceptedApplicants}</span>
                              {csp.rating > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span>{csp.rating}</span>
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              Created {new Date(csp.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 lg:ml-6">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSelectedCSP(csp);
                              fetchApplications(csp.id);
                            }}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            View Applications ({csp.applicants})
                          </Button>
                          <Button variant="outline" asChild>
                            <Link to={`/csp/${csp.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Project
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/csp/edit/${csp.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Applications Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>
                  {selectedCSP ? `${selectedCSP.title} - Applications` : 'Select a CSP to view applications'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCSP ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Applications: {applications.length}</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {applications.map((application) => (
                        <div key={application.id} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{application.userName}</h4>
                              <p className="text-xs text-gray-600">{application.userEmail}</p>
                              <p className="text-xs text-gray-500">ID: {application.studentId}</p>
                            </div>
                            {getApplicationStatusBadge(application.status)}
                          </div>

                          <p className="text-xs text-gray-600 mb-3">
                            Applied {new Date(application.appliedAt).toLocaleDateString()}
                          </p>

                          {application.message && (
                            <p className="text-xs text-gray-700 mb-3 bg-gray-50 p-2 rounded">
                              "{application.message}"
                            </p>
                          )}

                          {application.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleApplicationStatusChange(selectedCSP.id, application.id, 'accepted')}
                              >
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleApplicationStatusChange(selectedCSP.id, application.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}

                          <div className="flex items-center space-x-2 mt-2">
                            <Button variant="ghost" size="sm">
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-sm">
                      Select a CSP from the list to view and manage applications.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSPManagement;
