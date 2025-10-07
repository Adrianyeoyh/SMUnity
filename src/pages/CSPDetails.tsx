import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  Clock,
  Heart,
  ArrowLeft,
  Share2,
  Bookmark,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { demoProjects } from '@/data/demoProjects';
import { addApplication, getUserApplications, type Application } from '@/utils/applicationManager';
import ApplicationModal from '@/components/ApplicationModal';

interface CSP {
  id: string;
  title: string;
  organization: string;
  description: string;
  longDescription: string;
  location: string;
  address: string;
  date: string;
  duration: number;
  spots: number;
  applicants: number;
  rating: number;
  category: string;
  skills: string[];
  requirements: string[];
  benefits: string[];
  contactEmail: string;
  contactPhone: string;
  website: string;
  imageUrl?: string;
  isApproved: boolean;
  acceptanceRate: number;
  createdBy: string;
  createdAt: string;
}

interface Application {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  message?: string;
}

const CSPDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [csp, setCsp] = useState<CSP | null>(null);
  const [loading, setLoading] = useState(true);
  const [userApplication, setUserApplication] = useState<Application | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCSPDetails();
      fetchUserApplication();
    }
  }, [id, user]);

  const fetchCSPDetails = async () => {
    try {
      setLoading(true);
      // Use demo data instead of API call
      const project = demoProjects.find(p => p.id === id);
      if (project) {
        setCsp(project);
      } else {
        setCsp(null);
      }
    } catch (error) {
      console.error('Failed to fetch CSP details:', error);
      toast({
        title: "Error",
        description: "Failed to load project details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserApplication = async () => {
    if (!user || !csp) return;
    
    try {
      // Check if user has applied to this CSP
      const applications = getUserApplications(user.id);
      const existingApplication = applications.find(app => app.cspId === csp.id);
      setUserApplication(existingApplication || null);
    } catch (error) {
      console.error('Failed to fetch user application:', error);
    }
  };

  const handleApply = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to apply for this project.",
        variant: "destructive",
      });
      return;
    }

    if (!csp) {
      toast({
        title: "Project Not Found",
        description: "Unable to load project details.",
        variant: "destructive",
      });
      return;
    }

    setShowApplicationModal(true);
  };

  const handleApplicationSuccess = () => {
    // Refresh user application after successful submission
    fetchUserApplication();
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
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smu-red"></div>
      </div>
    );
  }

  if (!csp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Project Not Found</h2>
            <p className="text-gray-600 mb-4">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/discover">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Discover
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-smu-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/discover">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Discover
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">{csp.category}</Badge>
                      <Badge variant={csp.spots > 0 ? "success" : "destructive"}>
                        {csp.spots > 0 ? `${csp.spots} spots left` : 'Full'}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl mb-2">{csp.title}</CardTitle>
                    <CardDescription className="text-lg text-smu-primary font-medium">
                      {csp.organization}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{csp.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{csp.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{csp.duration} hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{csp.rating}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* CSU Module Warning */}
            {user && user.role === 'student' && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-1">
                        Complete CSU Module First
                      </h3>
                      <p className="text-blue-700 text-sm">
                        Before applying for CSPs, make sure you have completed the Community Service 
                        Understanding (CSU) module on eLearn. This is required for all SMU students.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <a href="https://elearn.smu.edu.sg" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Go to eLearn
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{csp.longDescription}</p>
              </CardContent>
            </Card>

            {/* Skills & Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {csp.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {csp.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>What You'll Gain</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {csp.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Heart className="h-4 w-4 text-smu-red mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <a href={`mailto:${csp.contactEmail}`} className="text-smu-primary hover:underline">
                    {csp.contactEmail}
                  </a>
                </div>
                {csp.contactPhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${csp.contactPhone}`} className="text-smu-primary hover:underline">
                      {csp.contactPhone}
                    </a>
                  </div>
                )}
                {csp.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a href={csp.website} target="_blank" rel="noopener noreferrer" className="text-smu-primary hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Apply Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Project Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Available Spots</span>
                    <span className="font-semibold">{csp.spots}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Applicants</span>
                    <span className="font-semibold">{csp.applicants}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Acceptance Rate</span>
                    <span className="font-semibold">{csp.acceptanceRate}%</span>
                  </div>
                </div>

                {/* Application Status */}
                {userApplication && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Your Application Status</h4>
                    <div className="flex items-center justify-between">
                      {getApplicationStatusBadge(userApplication.status)}
                      <span className="text-sm text-gray-600">
                        Applied {new Date(userApplication.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {userApplication.message && (
                      <p className="text-sm text-gray-600 mt-2">{userApplication.message}</p>
                    )}
                  </div>
                )}

                {/* Apply Button */}
                {!userApplication && (
                  <Button 
                    className="w-full smu-gradient" 
                    onClick={handleApply}
                    disabled={csp.spots === 0}
                  >
                    {csp.spots === 0 ? 'Project Full' : 'Apply Now'}
                  </Button>
                )}

                {!user && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      Sign in to apply for this project
                    </p>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Created by</span>
                  <p className="text-sm">{csp.createdBy}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Posted</span>
                  <p className="text-sm">{new Date(csp.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <p className="text-sm">
                    <Badge variant={csp.isApproved ? "success" : "warning"}>
                      {csp.isApproved ? "Approved" : "Pending Approval"}
                    </Badge>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {csp && (
        <ApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          csp={{
            id: csp.id,
            title: csp.title,
            organization: csp.organization,
            spots: csp.spots
          }}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default CSPDetails;
