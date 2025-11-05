import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Button } from "#client/components/ui/button";
import { Badge } from "#client/components/ui/badge";
import { Progress } from "#client/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "#client/components/ui/dialog";
import { Separator } from "#client/components/ui/separator";
import { Input } from "#client/components/ui/input";
import { Textarea } from "#client/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "#client/components/ui/radio-group";
import { Checkbox } from "#client/components/ui/checkbox";
import { useMe } from "#client/api/hooks";
import {
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Award,
  Heart,
  CircleCheckBig,
  AlertCircle,
  CircleCheck,
  ArrowRight,
  Target,
  BookOpen
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchOngoingProjects,
  fetchPendingApplications,
  fetchCompletedProjects,
  fetchAllApplications,
  fetchUpcomingSessions
 } from "../api/student";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "withdrawn":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "pending":
      return "Pending";
    case "rejected":
      return "Rejected";
    case "confirmed":
      return "Confirmed";
    case "withdrawn":
      return "Withdrawn";
    default:
      return status;
  }
};

function Dashboard() {
  const { data: userData, isLoading: isLoadingUser } = useMe();
  const userName = userData?.name ? userData.name.replace(/_/g, " ").trim() : undefined;
  // console.log("user data: ", userData);

  console.log(userData);
  const [showCSUCard, setShowCSUCard] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedApplicationData, setSelectedApplicationData] = useState<any | null>(null);
  

  useEffect(() => {
    const csuCardHidden = localStorage.getItem("csuCardHidden");
    if (csuCardHidden === "true") {
      setShowCSUCard(false);
    }
  }, []);

  const handleCSUCardDismiss = () => {
    setShowCSUCard(false);
  };

  const handleViewApplication = (app: any) => {
    setSelectedApplicationData(app);
    setViewDialogOpen(true);
  };

  // 🔹 Fetch Dashboard Data
  const { data: ongoingData, isLoading: loadingOngoing } = useQuery({
    queryKey: ["ongoing-projects"],
    queryFn: fetchOngoingProjects,
  });

  const { data: pendingData } = useQuery({
    queryKey: ["pending-applications"],
    queryFn: fetchPendingApplications,
  });

  const { data: completedData } = useQuery({
    queryKey: ["completed-projects"],
    queryFn: fetchCompletedProjects,
  });

  const { data: allAppsData } = useQuery({
    queryKey: ["all-applications"],
    queryFn: fetchAllApplications,
  });

  const { data: upcomingData, isLoading: loadingUpcoming } = useQuery({
  queryKey: ["upcoming-sessions"],
  queryFn: fetchUpcomingSessions,
});

  // 🔹 Derived Counts
  const ongoingProjects = ongoingData?.projects ?? [];
  const pendingCount = pendingData?.pendingCount ?? 0;
  const completedCount = completedData?.completedCount ?? 0;
  const applications = allAppsData?.applications ?? [];
  const upcomingSessions = upcomingData?.sessions ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {isLoadingUser ? "Welcome back!" : `Welcome back, ${userName || "there"}!`}
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            Track your community service journey and upcoming commitments
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">

        {/* CSU Module Reminder */}
        {showCSUCard && (
          <Card className="mb-8 bg-gradient-to-r from-pink-500/10 to-primary/5">
            <CardContent className="pt-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="md:flex-1">
                  <h3 className="font-heading font-semibold text-base md:text-lg text-foreground mb-1 md:mb-2">
                    Complete CSU Module First
                  </h3>
                  <p className="text-muted-foreground font-body text-sm md:text-base mb-3 md:mb-0">
                    Before applying for CSPs, make sure you've completed the Community Service Understanding (CSU) module on eLearn.
                  </p>
                  <button
                    onClick={handleCSUCardDismiss}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    I've already completed it!
                  </button>
                </div>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white w-full md:w-auto"
                  onClick={() => window.open('https://elearn.smu.edu.sg', '_blank')}
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Go to eLearn
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">Active Projects</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{ongoingProjects.length}</CardTitle>
                </div>
                <div className="hidden sm:block bg-green-100 rounded-full p-3 ml-4">
                  <CircleCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-0">
              <div className="text-xs text-muted-foreground font-body">Currently participating</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">Pending Applications</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{pendingCount}</CardTitle>
                </div>
                <div className="hidden sm:block bg-orange-100 rounded-full p-3 ml-4">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-0">
              <div className="text-xs text-muted-foreground font-body">Awaiting response</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">Successful Applications</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{completedCount}</CardTitle>
                </div>
                <div className="hidden sm:block bg-blue-100 rounded-full p-3 ml-4">
                  <CircleCheckBig className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-0">
              <div className="text-xs text-muted-foreground font-body">Total contributions</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">Completed Projects</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{completedCount}</CardTitle>
                </div>
                <div className="hidden sm:block bg-purple-100 rounded-full p-3 ml-4">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-0">
              <div className="text-xs text-muted-foreground font-body">Total contributions</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ongoing Projects */}
<Card>
  <CardHeader>
    <CardTitle className="font-heading flex items-center gap-2">
      <Target className="h-5 w-5" />
      Ongoing Projects
    </CardTitle>
    <CardDescription className="font-body">Projects you're currently participating in</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {ongoingProjects.length === 0 ? (
      <p className="text-sm text-muted-foreground text-center py-4">No active projects</p>
    ) : (
      ongoingProjects.map((project: any) => (
        <div key={project.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex justify-between items-start mb-3">
           <div>
            <h3 className="font-heading font-semibold text-lg mb-1">{project.title}</h3>
            <p className="text-sm text-muted-foreground font-body">{project.orgName}</p>
            <p className="text-xs text-muted-foreground font-body mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {project.isRemote
                ? "Remote"
                : project.type === "overseas"
                  ? project.country || "—"
                  : project.district || "—"}
            </p>
          </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
          </div>
          <div className="flex gap-2 mt-4">
            <Link to="/csp/$projectID" params={{ projectID: project.id }} search={{ from: undefined }}>
              <Button variant="outline" size="sm">View Details</Button>
            </Link>
          </div>
        </div>
      ))
    )}
  </CardContent>
</Card>

{/* Application Status */}
<Card>
  <CardHeader>
    <CardTitle className="font-heading flex items-center gap-2">
      <BookOpen className="h-5 w-5" />
      Application Status
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    {applications.length === 0 ? (
      <p className="text-sm text-muted-foreground text-center py-4">No applications found</p>
    ) : (
      applications.map((app: any) => (
        <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
          <Link 
            to="/csp/$projectID" 
            params={{ projectID: app.projectId.toString() }} 
            search={{ from: "dashboard" }}
            className="flex-1"
          >
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-heading font-semibold">{app.projectTitle}</h4>
              <Badge className={`text-xs ${getStatusColor(app.status)}`}>
                {getStatusLabel(app.status)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-body mt-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Applied on: {new Date(app.submittedAt).toLocaleDateString("en-GB")}
            </p>
          </Link>
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleViewApplication(app); }}>
            View Application
          </Button>
        </div>
      ))
    )}
  </CardContent>
</Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loadingUpcoming ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Loading upcoming sessions...</p>
                ) : upcomingSessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No upcoming sessions this week</p>
                ) : (
                  upcomingSessions.map((session: any) => (
                    <div key={`${session.projectId}-${session.sessionDate}`} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 rounded-lg p-2 flex-shrink-0">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading font-semibold text-sm mb-1 truncate">{session.title}</h4>
                          <div className="space-y-1 text-xs text-muted-foreground font-body">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {session.timeStart} - {session.timeEnd}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {session.isRemote
                                ? "Remote"
                                : session.type === "overseas"
                                  ? session.country || "—"
                                  : session.district || "—"} • {session.dayOfWeek}
                            </div>
                            <div className="text-xs">{new Date(session.sessionDate).toLocaleDateString("en-GB")}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>

            </Card>
          </div>
        </div>
      </div>

      {/* View Application Modal */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Application for {selectedApplicationData?.projectTitle}
            </DialogTitle>
          </DialogHeader>

          {selectedApplicationData ? (
            <div className="space-y-6 font-body text-sm mt-4">
              <div>
                <h3 className="font-heading text-lg mb-2">Motivation</h3>
                <Textarea value={selectedApplicationData.motivation} readOnly className="min-h-[100px]" />
              </div>

              <Separator />

              <div>
                <h3 className="font-heading text-lg mb-2">Experience</h3>
                <RadioGroup value={selectedApplicationData.experience} disabled>
                  <div className="flex gap-2">
                    {["none", "some", "extensive"].map((exp) => (
                      <div key={exp} className="flex items-center space-x-2 border rounded-md p-2">
                        <RadioGroupItem value={exp} />
                        <span className="capitalize font-body">{exp}</span>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="font-heading text-lg mb-2">Skills</h3>
                <Input value={selectedApplicationData.skills || "—"} readOnly />
              </div>

              <div>
                <h3 className="font-heading text-lg mb-2">Additional Comments</h3>
                <Textarea value={selectedApplicationData.comments || "—"} readOnly className="min-h-[80px]" />
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox checked={selectedApplicationData.agree} disabled />
                  <span className="text-sm text-muted-foreground">Agreed to Code of Conduct</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={selectedApplicationData.acknowledgeSchedule} disabled />
                  <span className="text-sm text-muted-foreground">Acknowledged Project Schedule</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">Loading...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
