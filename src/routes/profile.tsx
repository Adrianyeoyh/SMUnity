import { createFileRoute, Link } from "@tanstack/react-router";
import { useMe } from "#client/api/hooks";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import { Progress } from "#client/components/ui/progress";
import {
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
  Clock as ClockIcon,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

const FALLBACK_PROFILE = {
  name: "John Doe",
  email: "john.doe@smu.edu.sg",
  studentId: "12345678",
  phone: "+65 9123 4567",
  school: "Lee Kong Chian School of Business",
  entryYear: 2022,
  skills: ["Leadership", "Communication", "Project Management", "Teaching"],
  interests: ["Education", "Environment", "Community Service"],
  totalServiceHours: 120,
  requiredServiceHours: 200,
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  joinDate: "2022-08-15",
};

function Profile() {
  const { data, isError } = useMe();
  const profileData = data?.profile ?? null;

  const currentYear = new Date().getFullYear();
  const entryYear = profileData?.entryYear ?? FALLBACK_PROFILE.entryYear;
  const yearOfStudy = entryYear ? Math.max(1, currentYear - entryYear + 1) : 1;

  const displayName = data?.name ?? FALLBACK_PROFILE.name;
  const displayEmail = data?.email ?? FALLBACK_PROFILE.email;
  const displayStudentId = profileData?.studentId ?? (data ? "Not provided" : FALLBACK_PROFILE.studentId);
  const displayPhone = profileData?.phone ?? (data ? "" : FALLBACK_PROFILE.phone);
  const displaySchool = profileData?.school ?? (data ? "" : FALLBACK_PROFILE.school);
  const displaySkills =
    profileData?.skills && profileData.skills.length ? profileData.skills : data ? [] : FALLBACK_PROFILE.skills;
  const displayInterests =
    profileData?.interests && profileData.interests.length ? profileData.interests : data ? [] : FALLBACK_PROFILE.interests;
  const avatarImage = data?.image ?? FALLBACK_PROFILE.image;

  const totalServiceHours = data?.dashboard?.verifiedHours ?? FALLBACK_PROFILE.totalServiceHours;
  const requiredServiceHours = FALLBACK_PROFILE.requiredServiceHours;
  const progressPercentage = requiredServiceHours ? Math.min((totalServiceHours / requiredServiceHours) * 100, 100) : 0;
  const hoursRemaining = Math.max(requiredServiceHours - totalServiceHours, 0);
  const joinDate = FALLBACK_PROFILE.joinDate;

  // Mock data for demo sections
  const applications = [
    {
      id: "1",
      cspTitle: "Teaching English to Underprivileged Children",
      organisation: "Hope Foundation",
      status: "approved",
      appliedDate: "2024-01-15",
      startDate: "2024-02-15",
      serviceHours: 40,
      location: "Tampines",
    },
    {
      id: "2",
      cspTitle: "Environmental Cleanup at East Coast Park",
      organisation: "Green Singapore",
      status: "pending",
      appliedDate: "2024-01-20",
      startDate: "2024-02-20",
      serviceHours: 8,
      location: "East Coast Park",
    },
    {
      id: "3",
      cspTitle: "Senior Care Support",
      organisation: "Golden Years",
      status: "rejected",
      appliedDate: "2024-01-10",
      startDate: "2024-02-01",
      serviceHours: 30,
      location: "Toa Payoh",
    },
  ];

  const completedCSPs = [
    {
      id: "1",
      title: "Community Garden Project",
      organisation: "Green Thumbs",
      completedDate: "2023-12-15",
      serviceHours: 20,
      rating: 5,
    },
    {
      id: "2",
      title: "Food Bank Volunteer",
      organisation: "Food for All",
      completedDate: "2023-11-30",
      serviceHours: 15,
      rating: 4,
    },
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {isError && (
          <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            We&apos;re showing placeholder data because we couldn&apos;t load your latest profile details.
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <img src={avatarImage} alt={displayName} className="h-24 w-24 rounded-full object-cover mx-auto" />
                    <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full" asChild>
                      <Link to="/profileedit">
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-foreground">{displayName}</h2>
                    <p className="text-muted-foreground font-body">
                      {displaySchool || "School not specified"} • Year {yearOfStudy}
                    </p>
                    <p className="text-sm text-muted-foreground font-body">Student ID: {displayStudentId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Service Hours Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-body">Completed</span>
                    <span className="font-medium font-body">
                      {totalServiceHours} / {requiredServiceHours} hours
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="text-xs text-muted-foreground font-body">{Math.round(progressPercentage)}% complete</div>
                </div>
                <div className="text-sm text-muted-foreground font-body">{hoursRemaining} hours remaining</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body">{displayEmail}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body">
                    {displayPhone || <span className="text-muted-foreground">Add a phone number via Edit Profile</span>}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body">{displaySchool || "School not specified"}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body">Joined {new Date(joinDate).toLocaleDateString("en-GB")}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Skills & Interests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 font-body">Skills</h4>
                  {displaySkills.length ? (
                    <div className="flex flex-wrap gap-2">
                      {displaySkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-body">Add skills to highlight what you bring to each CSP.</p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium mb-2 font-body">Interests</h4>
                  {displayInterests.length ? (
                    <div className="flex flex-wrap gap-2">
                      {displayInterests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-body">Choose interests to tailor recommendations for you.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button className="w-full" asChild>
                  <Link to="/profileedit">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="applications" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="applications">My Applications</TabsTrigger>
                <TabsTrigger value="completed">Completed CSPs</TabsTrigger>
                <TabsTrigger value="favourites">Favourites</TabsTrigger>
              </TabsList>

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
                            <h4 className="font-heading text-lg font-semibold">{application.cspTitle}</h4>
                            <p className="text-muted-foreground font-body">{application.organisation}</p>
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
                            <h4 className="font-heading text-lg font-semibold">{csp.title}</h4>
                            <p className="text-muted-foreground font-body">{csp.organisation}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium font-body">{csp.rating}/5</span>
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

              <TabsContent value="favourites" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-heading text-xl font-semibold">Favourite CSPs</h3>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-heading text-lg font-semibold mb-2">No favourites yet</h4>
                  <p className="text-muted-foreground font-body mb-4">
                    Start exploring CSPs and add them to your favourites
                  </p>
                  <Button>Browse CSPs</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

