import { createFileRoute } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import { Progress } from "#client/components/ui/progress";
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Clock, 
  Award,
  Edit,
  Settings,
  Heart,
  CheckCircle,
  XCircle,
  Clock as ClockIcon
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  // Mock user data
  const user = {
    id: "1",
    name: "John Doe",
    email: "john.doe@smu.edu.sg",
    studentId: "12345678",
    phone: "+65 9123 4567",
    yearOfStudy: 3,
    major: "Business",
    skills: ["Leadership", "Communication", "Project Management", "Teaching"],
    interests: ["Education", "Environment", "Community Service"],
    totalServiceHours: 120,
    requiredServiceHours: 200,
    isCspLeader: false,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    joinDate: "2022-08-15"
  };

  // Mock applications data
  const applications = [
    {
      id: "1",
      cspTitle: "Teaching English to Underprivileged Children",
      organization: "Hope Foundation",
      status: "approved",
      appliedDate: "2024-01-15",
      startDate: "2024-02-15",
      serviceHours: 40,
      location: "Tampines"
    },
    {
      id: "2",
      cspTitle: "Environmental Cleanup at East Coast Park",
      organization: "Green Singapore",
      status: "pending",
      appliedDate: "2024-01-20",
      startDate: "2024-02-20",
      serviceHours: 8,
      location: "East Coast Park"
    },
    {
      id: "3",
      cspTitle: "Senior Care Support",
      organization: "Golden Years",
      status: "rejected",
      appliedDate: "2024-01-10",
      startDate: "2024-02-01",
      serviceHours: 30,
      location: "Toa Payoh"
    }
  ];

  // Mock completed CSPs
  const completedCSPs = [
    {
      id: "1",
      title: "Community Garden Project",
      organization: "Green Thumbs",
      completedDate: "2023-12-15",
      serviceHours: 20,
      rating: 5
    },
    {
      id: "2",
      title: "Food Bank Volunteer",
      organization: "Food for All",
      completedDate: "2023-11-30",
      serviceHours: 15,
      rating: 4
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const progressPercentage = (user.totalServiceHours / user.requiredServiceHours) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-24 w-24 rounded-full object-cover mx-auto"
                    />
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-foreground">
                      {user.name}
                    </h2>
                    <p className="text-muted-foreground font-body">
                      {user.major} • Year {user.yearOfStudy}
                    </p>
                    <p className="text-sm text-muted-foreground font-body">
                      Student ID: {user.studentId}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Hours Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Service Hours Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-body">Completed</span>
                    <span className="font-medium font-body">
                      {user.totalServiceHours} / {user.requiredServiceHours} hours
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="text-xs text-muted-foreground font-body">
                    {Math.round(progressPercentage)}% complete
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-body">
                  {user.requiredServiceHours - user.totalServiceHours} hours remaining
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body">{user.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body">SMU Student</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body">
                    Joined {new Date(user.joinDate).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Skills & Interests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 font-body">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 font-body">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="applications" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="applications">My Applications</TabsTrigger>
                <TabsTrigger value="completed">Completed CSPs</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>

              {/* Applications Tab */}
              <TabsContent value="applications" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-heading text-xl font-semibold">My Applications</h3>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>

                <div className="space-y-4">
                  {applications.map((application) => (
                    <Card key={application.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                            <h4 className="font-heading text-lg font-semibold">
                              {application.cspTitle}
                            </h4>
                            <p className="text-muted-foreground font-body">
                              {application.organization}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(application.status)}
                            <Badge className={getStatusColor(application.status)}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span className="font-body">
                              Applied: {new Date(application.appliedDate).toLocaleDateString("en-GB")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span className="font-body">
                              Start: {new Date(application.startDate).toLocaleDateString("en-GB")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4" />
                            <span className="font-body">{application.serviceHours} hours</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span className="font-body">{application.location}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          {application.status === "pending" && (
                            <Button size="sm" variant="outline">
                              Withdraw
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Completed CSPs Tab */}
              <TabsContent value="completed" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-heading text-xl font-semibold">Completed CSPs</h3>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>

                <div className="space-y-4">
                  {completedCSPs.map((csp) => (
                    <Card key={csp.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                            <h4 className="font-heading text-lg font-semibold">
                              {csp.title}
                            </h4>
                            <p className="text-muted-foreground font-body">
                              {csp.organization}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium font-body">
                              {csp.rating}/5
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span className="font-body">
                              Completed: {new Date(csp.completedDate).toLocaleDateString("en-GB")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span className="font-body">{csp.serviceHours} hours</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View Certificate
                          </Button>
                          <Button size="sm" variant="outline">
                            Leave Review
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-heading text-xl font-semibold">Favorite CSPs</h3>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>

                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-heading text-lg font-semibold mb-2">No favorites yet</h4>
                  <p className="text-muted-foreground font-body mb-4">
                    Start exploring CSPs and add them to your favorites
                  </p>
                  <Button>
                    Browse CSPs
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
