import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CircleCheck,
  CircleCheckBig,
  Clock,
  Heart,
  MapPin,
  Target,
  TrendingUp,
} from "lucide-react";

import { useMe } from "#client/api/hooks";
import {
  fetchAllApplications,
  fetchCompletedProjects,
  fetchOngoingProjects,
  fetchPendingApplications,
  fetchUpcomingSessions,
} from "#client/api/student";
import { Badge } from "#client/components/ui/badge";
import { Button } from "#client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#client/components/ui/card";
import { Checkbox } from "#client/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "#client/components/ui/dialog";
import { Input } from "#client/components/ui/input";
import { Progress } from "#client/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "#client/components/ui/radio-group";
import { Separator } from "#client/components/ui/separator";
import { Textarea } from "#client/components/ui/textarea";

export const Route = createFileRoute("/_student/dashboard")({
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
  const userName = userData?.name
    ? userData.name.replace(/_/g, " ").trim()
    : undefined;
  // console.log("user data: ", userData);

  console.log(userData);
  const [showCSUCard, setShowCSUCard] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedApplicationData, setSelectedApplicationData] = useState<
    any | null
  >(null);

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
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-heading text-foreground mb-4 text-3xl font-bold md:text-4xl">
            {isLoadingUser
              ? "Welcome back!"
              : `Welcome back, ${userName || "there"}!`}
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            Track your community service journey and upcoming commitments
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* CSU Module Reminder */}
        {showCSUCard && (
          <Card className="to-primary/5 mb-8 bg-gradient-to-r from-pink-500/10">
            <CardContent className="pt-1">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="md:flex-1">
                  <h3 className="font-heading text-foreground mb-1 text-base font-semibold md:mb-2 md:text-lg">
                    Complete CSU Module First
                  </h3>
                  <p className="text-muted-foreground font-body mb-3 text-sm md:mb-0 md:text-base">
                    Before applying for CSPs, make sure you've completed the
                    Community Service Understanding (CSU) module on eLearn.
                  </p>
                  <button
                    onClick={handleCSUCardDismiss}
                    className="text-muted-foreground hover:text-foreground text-sm underline"
                  >
                    I've already completed it!
                  </button>
                </div>
                <Button
                  className="bg-primary hover:bg-primary/90 w-full text-white md:w-auto"
                  onClick={() =>
                    window.open("https://elearn.smu.edu.sg", "_blank")
                  }
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Go to eLearn
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">
                    Active Projects
                  </CardDescription>
                  <CardTitle className="font-heading text-primary text-3xl">
                    {ongoingProjects.length}
                  </CardTitle>
                </div>
                <div className="ml-4 hidden rounded-full bg-green-100 p-3 sm:block">
                  <CircleCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-0">
              <div className="text-muted-foreground font-body text-xs">
                Currently participating
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">
                    Pending Applications
                  </CardDescription>
                  <CardTitle className="font-heading text-primary text-3xl">
                    {pendingCount}
                  </CardTitle>
                </div>
                <div className="ml-4 hidden rounded-full bg-orange-100 p-3 sm:block">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-0">
              <div className="text-muted-foreground font-body text-xs">
                Awaiting response
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">
                    Successful Applications
                  </CardDescription>
                  <CardTitle className="font-heading text-primary text-3xl">
                    {completedCount}
                  </CardTitle>
                </div>
                <div className="ml-4 hidden rounded-full bg-blue-100 p-3 sm:block">
                  <CircleCheckBig className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-0">
              <div className="text-muted-foreground font-body text-xs">
                Total contributions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">
                    Completed Projects
                  </CardDescription>
                  <CardTitle className="font-heading text-primary text-3xl">
                    {completedCount}
                  </CardTitle>
                </div>
                <div className="ml-4 hidden rounded-full bg-purple-100 p-3 sm:block">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-0">
              <div className="text-muted-foreground font-body text-xs">
                Total contributions
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Ongoing Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Ongoing Projects
                </CardTitle>
                <CardDescription className="font-body">
                  Projects you're currently participating in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ongoingProjects.length === 0 ? (
                  <p className="text-muted-foreground py-4 text-center text-sm">
                    No active projects
                  </p>
                ) : (
                  ongoingProjects.map((project: any) => (
                    <div
                      key={project.id}
                      className="hover:bg-muted/50 rounded-lg border p-4 transition-colors"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h3 className="font-heading mb-1 text-lg font-semibold">
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground font-body text-sm">
                            {project.orgName}
                          </p>
                          <p className="text-muted-foreground font-body mt-1 flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3" />
                            {project.isRemote
                              ? "Remote"
                              : project.type === "overseas"
                                ? project.country || "—"
                                : project.district || "—"}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700"
                        >
                          Active
                        </Badge>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link
                          to="/csp/$projectID"
                          params={{ projectID: project.id }}
                        >
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
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
                  <p className="text-muted-foreground py-4 text-center text-sm">
                    No applications found
                  </p>
                ) : (
                  applications.map((app: any) => (
                    <div
                      key={app.id}
                      className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                    >
                      <Link
                        to="/csp/$projectID"
                        params={{ projectID: app.projectId.toString() }}
                        className="flex-1"
                      >
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h4 className="font-heading font-semibold">
                            {app.projectTitle}
                          </h4>
                          <Badge
                            className={`text-xs ${getStatusColor(app.status)}`}
                          >
                            {getStatusLabel(app.status)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground font-body mt-1 flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3" />
                          Applied on:{" "}
                          {new Date(app.submittedAt).toLocaleDateString(
                            "en-GB",
                          )}
                        </p>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewApplication(app);
                        }}
                      >
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
                  <p className="text-muted-foreground py-4 text-center text-sm">
                    Loading upcoming sessions...
                  </p>
                ) : upcomingSessions.length === 0 ? (
                  <p className="text-muted-foreground py-4 text-center text-sm">
                    No upcoming sessions this week
                  </p>
                ) : (
                  upcomingSessions.map((session: any) => (
                    <div
                      key={`${session.projectId}-${session.sessionDate}`}
                      className="hover:bg-muted/50 rounded-lg border p-3 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 flex-shrink-0 rounded-lg p-2">
                          <Calendar className="text-primary h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-heading mb-1 truncate text-sm font-semibold">
                            {session.title}
                          </h4>
                          <div className="text-muted-foreground font-body space-y-1 text-xs">
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
                                  : session.district || "—"}{" "}
                              • {session.dayOfWeek}
                            </div>
                            <div className="text-xs">
                              {new Date(session.sessionDate).toLocaleDateString(
                                "en-GB",
                              )}
                            </div>
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Application for {selectedApplicationData?.projectTitle}
            </DialogTitle>
          </DialogHeader>

          {selectedApplicationData ? (
            <div className="font-body mt-4 space-y-6 text-sm">
              <div>
                <h3 className="font-heading mb-2 text-lg">Motivation</h3>
                <Textarea
                  value={selectedApplicationData.motivation}
                  readOnly
                  className="min-h-[100px]"
                />
              </div>

              <Separator />

              <div>
                <h3 className="font-heading mb-2 text-lg">Experience</h3>
                <RadioGroup value={selectedApplicationData.experience} disabled>
                  <div className="flex gap-2">
                    {["none", "some", "extensive"].map((exp) => (
                      <div
                        key={exp}
                        className="flex items-center space-x-2 rounded-md border p-2"
                      >
                        <RadioGroupItem value={exp} />
                        <span className="font-body capitalize">{exp}</span>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="font-heading mb-2 text-lg">Skills</h3>
                <Input value={selectedApplicationData.skills || "—"} readOnly />
              </div>

              <div>
                <h3 className="font-heading mb-2 text-lg">
                  Additional Comments
                </h3>
                <Textarea
                  value={selectedApplicationData.comments || "—"}
                  readOnly
                  className="min-h-[80px]"
                />
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox checked={selectedApplicationData.agree} disabled />
                  <span className="text-muted-foreground text-sm">
                    Agreed to Code of Conduct
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedApplicationData.acknowledgeSchedule}
                    disabled
                  />
                  <span className="text-muted-foreground text-sm">
                    Acknowledged Project Schedule
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground py-4 text-center">Loading...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
