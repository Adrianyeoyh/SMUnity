import { createFileRoute } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Eye,
  FileText
} from "lucide-react";

export const Route = createFileRoute("/my-applications")({
  component: MyApplications,
});

function MyApplications() {
  // Mock data for demonstration
  const applications = [
    {
      id: "1",
      cspTitle: "Teaching English to Underprivileged Children",
      organisation: "Hope Foundation",
      status: "approved",
      appliedDate: "2024-01-15",
      startDate: "2024-02-15",
      endDate: "2024-05-15",
      serviceHours: 40,
      location: "Tampines",
      motivation: "I have experience working with children and am passionate about education. I believe every child deserves access to quality education regardless of their background."
    },
    {
      id: "2",
      cspTitle: "Environmental Cleanup at East Coast Park",
      organisation: "Green Singapore",
      status: "pending",
      appliedDate: "2024-01-20",
      startDate: "2024-02-20",
      endDate: "2024-02-20",
      serviceHours: 8,
      location: "East Coast Park",
      motivation: "I'm very interested in environmental conservation and have participated in similar activities before. I want to contribute to keeping Singapore clean."
    },
    {
      id: "3",
      cspTitle: "Senior Care Support",
      organisation: "Golden Years",
      status: "rejected",
      appliedDate: "2024-01-10",
      startDate: "2024-02-01",
      endDate: "2024-04-01",
      serviceHours: 30,
      location: "Toa Payoh",
      motivation: "I want to help the elderly community and gain experience in healthcare. I have good communication skills and patience."
    },
    {
      id: "4",
      cspTitle: "Virtual Mentoring Program",
      organisation: "Youth Connect",
      status: "pending",
      appliedDate: "2024-01-25",
      startDate: "2024-03-01",
      endDate: "2024-08-31",
      serviceHours: 60,
      location: "Remote",
      motivation: "I have leadership experience and want to mentor young people. This virtual format works well with my schedule."
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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "approved":
        return "Congratulations! Your application has been approved. You can now start your community service project.";
      case "pending":
        return "Your application is being reviewed. We'll notify you once a decision has been made.";
      case "rejected":
        return "Unfortunately, your application was not successful this time. You can apply for other CSPs.";
      default:
        return "";
    }
  };

  const pendingApplications = applications.filter(app => app.status === "pending");
  const approvedApplications = applications.filter(app => app.status === "approved");
  const rejectedApplications = applications.filter(app => app.status === "rejected");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            My Applications
          </h1>
          <p className="text-muted-foreground font-body">
            Track the status of your CSP applications
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedApplications.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
          </TabsList>

          {/* All Applications */}
          <TabsContent value="all" className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="font-heading text-xl font-semibold">
                        {application.cspTitle}
                      </h3>
                      <p className="text-muted-foreground font-body">
                        {application.organisation}
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
                      <Clock className="h-4 w-4" />
                      <span className="font-body">{application.serviceHours} hours</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span className="font-body">{application.location}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground font-body">
                      <strong>Your Motivation:</strong> {application.motivation}
                    </p>
                  </div>

                  <div className="mb-4 p-3 rounded-lg bg-muted/50">
                    <p className="text-sm font-body">
                      <strong>Status:</strong> {getStatusMessage(application.status)}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    {application.status === "pending" && (
                      <Button size="sm" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Withdraw
                      </Button>
                    )}
                    {application.status === "approved" && (
                      <Button size="sm" variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        View Schedule
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Pending Applications */}
          <TabsContent value="pending" className="space-y-4">
            {pendingApplications.length > 0 ? (
              pendingApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <h3 className="font-heading text-xl font-semibold">
                          {application.cspTitle}
                        </h3>
                        <p className="text-muted-foreground font-body">
                          {application.organisation}
                        </p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <p className="text-sm font-body text-yellow-800">
                        <strong>Status:</strong> {getStatusMessage(application.status)}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Withdraw
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <ClockIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-lg font-semibold mb-2">No Pending Applications</h3>
                <p className="text-muted-foreground font-body mb-4">
                  You don't have any pending applications at the moment.
                </p>
                <Button>
                  Browse CSPs
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Approved Applications */}
          <TabsContent value="approved" className="space-y-4">
            {approvedApplications.length > 0 ? (
              approvedApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <h3 className="font-heading text-xl font-semibold">
                          {application.cspTitle}
                        </h3>
                        <p className="text-muted-foreground font-body">
                          {application.organisation}
                        </p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-sm font-body text-green-800">
                        <strong>Status:</strong> {getStatusMessage(application.status)}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        View Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-lg font-semibold mb-2">No Approved Applications</h3>
                <p className="text-muted-foreground font-body mb-4">
                  You don't have any approved applications yet.
                </p>
                <Button>
                  Browse CSPs
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Rejected Applications */}
          <TabsContent value="rejected" className="space-y-4">
            {rejectedApplications.length > 0 ? (
              rejectedApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <h3 className="font-heading text-xl font-semibold">
                          {application.cspTitle}
                        </h3>
                        <p className="text-muted-foreground font-body">
                          {application.organisation}
                        </p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-sm font-body text-red-800">
                        <strong>Status:</strong> {getStatusMessage(application.status)}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Apply Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-lg font-semibold mb-2">No Rejected Applications</h3>
                <p className="text-muted-foreground font-body mb-4">
                  Great! You don't have any rejected applications.
                </p>
                <Button>
                  Browse CSPs
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
