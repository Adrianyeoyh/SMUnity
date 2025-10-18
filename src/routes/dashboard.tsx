import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Button } from "#client/components/ui/button";
import { Badge } from "#client/components/ui/badge";
import { Progress } from "#client/components/ui/progress";
import {
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Award,
  Heart,
  CheckCircle2,
  AlertCircle,
  CircleCheck,
  ArrowRight,
  Target,
  BookOpen
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  // Mock user data
  const user = {
    name: "Sam Chong",
    email: "student@smu.edu.sg",
    totalHours: 45,
    requiredHours: 80,
    activeApplications: 3,
    completedProjects: 2,
  };

  // Mock ongoing projects
  const ongoingProjects = [
    {
      id: "1",
      title: "Project Candela",
      organization: "SMU Rotaract",
      location: "Kranji",
      nextSession: "2025-03-18",
      hoursCompleted: 12,
      totalHours: 40,
      status: "in-progress",
    },
    {
      id: "2",
      title: "Elderly Home Visitation Program",
      organization: "Silver Care Association",
      location: "Bishan",
      nextSession: "2025-03-15",
      hoursCompleted: 8,
      totalHours: 30,
      status: "in-progress",
    },
  ];

  // Mock pending applications
  const pendingApplications = [
    {
      id: "3",
      title: "Community Arts Workshop",
      organization: "Creative Hearts SG",
      status: "pending",
      appliedDate: "2025-02-20",
    },
    {
      id: "4",
      title: "Food Distribution Drive",
      organization: "Food4All Singapore",
      status: "accepted",
      appliedDate: "2025-02-18",
    },
  ];

  // Mock upcoming sessions
  const upcomingSessions = [
    {
      id: "1",
      title: "Project Candela",
      date: "2025-03-18",
      time: "2:00 PM - 4:00 PM",
      location: "Kranji",
    },
    {
      id: "2",
      title: "Elderly Home Visitation",
      date: "2025-03-15",
      time: "10:00 AM - 12:00 PM",
      location: "Bishan",
    },
  ];

  const progressPercentage = (user.totalHours / user.requiredHours) * 100;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground font-body">
            Track your community service journey and upcoming commitments
          </p>
        </div>

        {/* CSU Module Reminder */}
        <Card className="mb-8 bg-gradient-to-r from-pink-500/10 to-primary/5">
          <CardContent className="pt-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  Complete CSU Module First
                </h3>
                <p className="text-muted-foreground font-body">
                  Before applying for CSPs, make sure you've completed the Community Service Understanding (CSU) module on eLearn.
                </p>
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => window.open('https://elearn.smu.edu.sg', '_blank')}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Go to eLearn
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="font-body">Total Hours Completed</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{user.totalHours}h</CardTitle>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground font-body">
                {user.requiredHours - user.totalHours}h remaining for CSU
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="font-body">Active Projects</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{ongoingProjects.length}</CardTitle>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <CircleCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground font-body">
                Currently participating
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="font-body">Pending Applications</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{user.activeApplications}</CardTitle>
                </div>
                <div className="bg-orange-100 rounded-full p-3">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground font-body">
                Awaiting response
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="font-body">Completed Projects</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{user.completedProjects}</CardTitle>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground font-body">
                Total contributions
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* CSU Progress */}
            {/* <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-heading">CSU Module Progress</CardTitle>
                    <CardDescription className="font-body">Track your progress towards module completion</CardDescription>
                  </div>
                  <Award className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Hours Completed</span>
                    <span className="font-medium">{user.totalHours} / {user.requiredHours} hours</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <p className="text-xs text-muted-foreground font-body">
                    You're {Math.round(progressPercentage)}% of the way there! Keep up the great work.
                  </p>
                </div>
              </CardContent>
            </Card> */}

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
                {ongoingProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-heading font-semibold text-lg mb-1">{project.title}</h3>
                        <p className="text-sm text-muted-foreground font-body">{project.organization}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="font-body">{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="font-body">Next: {new Date(project.nextSession).toLocaleDateString("en-GB")}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-body">
                        <span className="text-muted-foreground">Hours Progress</span>
                        <span className="font-medium">{project.hoursCompleted} / {project.totalHours}h</span>
                      </div>
                      <Progress value={(project.hoursCompleted / project.totalHours) * 100} className="h-2" />
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Link to="/csp/$cspId" params={{ cspId: project.id }}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        Log Hours
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Application Status
                </CardTitle>
                <CardDescription className="font-body">Track your pending and accepted applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-heading font-semibold mb-1">{app.title}</h4>
                      <p className="text-sm text-muted-foreground font-body">{app.organization}</p>
                      <p className="text-xs text-muted-foreground font-body mt-1">
                        Applied: {new Date(app.appliedDate).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {app.status === "pending" ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Accepted
                        </Badge>
                      )}
                      <Link to="/csp/$cspId" params={{ cspId: app.id }}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
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
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-lg p-2 flex-shrink-0">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-semibold text-sm mb-1 truncate">{session.title}</h4>
                        <div className="space-y-1 text-xs text-muted-foreground font-body">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {session.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  View All Sessions
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/discover" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Target className="mr-2 h-4 w-4" />
                    Browse New CSPs
                  </Button>
                </Link>
                <Link to="/favorites" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Heart className="mr-2 h-4 w-4" />
                    View Saved Projects
                  </Button>
                </Link>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Service Hours
                </Button>
              </CardContent>
            </Card>

            
          </div>
        </div>
      </div>
    </div>
  );
}
