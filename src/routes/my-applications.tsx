import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchMyApplications,
  confirmApplication,
  withdrawApplication,
} from "#client/api/student";

import { addToGoogleCalendar } from "#client/utils/GoogleCalendar";

import { Button } from "#client/components/ui/button";
import { Card, CardContent } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Eye,
  FileText,
  AlertTriangle,
  CalendarPlus,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#client/components/ui/dialog";
import { Separator } from "#client/components/ui/separator";
import { Input } from "#client/components/ui/input";
import { Textarea } from "#client/components/ui/textarea";
import { Checkbox } from "#client/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "#client/components/ui/radio-group";

export const Route = createFileRoute("/my-applications")({
  component: MyApplications,
});

function MyApplications() {
  const queryClient = useQueryClient();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"withdraw" | "confirm" | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedApplicationData, setSelectedApplicationData] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Fetch user's applications
  const { data, isLoading, error } = useQuery({
    queryKey: ["student-applications"],
    queryFn: fetchMyApplications,
  });

  const applications = data?.applications ?? [];

  // 🔹 Filter applications based on search query
  const filterApplications = (apps: any[]) => {
    if (!searchQuery.trim()) return apps;
    const query = searchQuery.toLowerCase();
    return apps.filter((app: any) => {
      return (
        app.projectTitle?.toLowerCase().includes(query) ||
        app.organisation?.toLowerCase().includes(query) ||
        app.status?.toLowerCase().includes(query) ||
        app.motivation?.toLowerCase().includes(query) ||
        app.district?.toLowerCase().includes(query) ||
        app.country?.toLowerCase().includes(query)
      );
    });
  };

  // 🔹 Mutations
  const confirmMutation = useMutation({
    mutationFn: (id: number) => confirmApplication(id),
    onSuccess: () => {
      toast.success("✅ Application confirmed!");
      queryClient.invalidateQueries({ queryKey: ["student-applications"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to confirm application"),
  });

  const withdrawMutation = useMutation({
    mutationFn: (id: number) => withdrawApplication(id),
    onSuccess: () => {
      toast.success("🛑 Application withdrawn.");
      queryClient.invalidateQueries({ queryKey: ["student-applications"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to withdraw application"),
  });

  // 🔹 Action handlers
  const openConfirmDialog = (app: any, action: "withdraw" | "confirm") => {
    setSelectedApplication(app);
    setSelectedAction(action);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedApplication || !selectedAction) return;
    if (selectedAction === "confirm") {
      confirmMutation.mutate(selectedApplication.id);
    } else {
      withdrawMutation.mutate(selectedApplication.id);
    }
    setConfirmDialogOpen(false);
    setSelectedApplication(null);
    setSelectedAction(null);
  };

  const handleViewApplication = (app: any) => {
    setSelectedApplicationData(app);
    setViewDialogOpen(true);
  };

  const handleAddToCalendar = (app: any) => {
    const result = addToGoogleCalendar({
      title: app.projectTitle,
      date: app.startDate,
      time: `${app.timeStart || "09:00"} - ${app.timeEnd || "17:00"}`,
      location: app.district || "Singapore",
      description: `Community Service Project: ${app.projectTitle}\n\nOrganisation: ${app.organisation}\nService Hours: ${app.serviceHours ?? "N/A"}h`,
    });
    if (result.success) toast.success("📅 Event added to Google Calendar!");
    else toast.error("Failed to add to Google Calendar.");
  };

  // 🔹 Tab groupings with search filter
  const filteredApplications = filterApplications(applications);
  const groupedTabs = [
    { label: "All", value: "all", data: filteredApplications },
    { label: "Pending", value: "pending", data: filterApplications(applications.filter((a: any) => a.status === "pending")) },
    { label: "Accepted", value: "accepted", data: filterApplications(applications.filter((a: any) => a.status === "accepted")) },
    { label: "Confirmed", value: "confirmed", data: filterApplications(applications.filter((a: any) => a.status === "confirmed")) },
    { label: "Rejected", value: "rejected", data: filterApplications(applications.filter((a: any) => a.status === "rejected")) },
    { label: "Withdrawn", value: "withdrawn", data: filterApplications(applications.filter((a: any) => a.status === "withdrawn")) },
  ];

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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "accepted":
        return "Click confirm to accept your allocation.";
      case "pending":
        return "Your application is under review.";
      case "rejected":
        return "Unfortunately, your application was not accepted.";
      case "confirmed":
        return "You have confirmed your participation.";
      case "withdrawn":
        return "You have withdrawn from this CSP.";
      default:
        return "";
    }
  };

  if (isLoading) return <p className="text-center py-10 text-muted-foreground">Loading applications...</p>;
  if (error) return <p className="text-center py-10 text-destructive">Failed to load applications.</p>;

  return (
    <div className="min-h-screen bg-background">
      {/* ✅ View Application Modal */}
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

      {/* ✅ Confirm / Withdraw Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading capitalize">
              {selectedAction === "withdraw" ? "Withdraw Application" : "Confirm Allocation"}
            </DialogTitle>
            <DialogDescription className="font-body text-muted-foreground">
              {selectedAction === "withdraw"
                ? "Once withdrawn, you cannot apply again for this CSP. Are you sure you want to proceed?"
                : "Confirming means you agree to participate in this CSP and begin your service."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={selectedAction === "withdraw" ? "destructive" : "default"}
              onClick={handleConfirmAction}
              disabled={confirmMutation.isPending || withdrawMutation.isPending}
            >
              {selectedAction === "withdraw" ? "Withdraw" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 sm:mb-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold">My Applications</h1>
              <p className="text-muted-foreground font-body text-base sm:text-lg mt-2">Track and manage your CSP applications</p>
            </div>
             <div className="relative w-full sm:w-1/3">
               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
               <Input
                 type="search"
                 placeholder="Search applications..."
                 className="pl-10 h-10 text-sm sm:text-base w-full"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
          </div>
        </div>
      </div>

      {/* ✅ Tabs */}
      <div className="container mx-auto px-4 sm:px-6 py-6">

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="h-auto grid w-full grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-0">
            {groupedTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm whitespace-nowrap">
                {tab.label} ({tab.data.length})
              </TabsTrigger>
            ))}
          </TabsList>

          {groupedTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-4">
              {tab.data.length > 0 ? (
                tab.data.map((app: any) => (
                  <Card key={app.id} className="hover:shadow-lg transition-shadow group/card">
                    <CardContent className="px-4 sm:px-6 pt-0 pb-0">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-4">
                        <div className="flex-1 min-w-0">
                          <Link to="/csp/$projectID" params={{ projectID: app.projectId }}>
                            <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground group-hover/card:text-primary transition-colors cursor-pointer break-words">
                              {app.projectTitle}
                            </h3>
                          </Link>
                          <p className="text-sm sm:text-base text-muted-foreground font-body">{app.organisation}</p>
                        </div>
                        <Badge className={`${getStatusColor(app.status)} flex-shrink-0`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1 min-w-0">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
                          <span className="truncate">
                            <span>Applied: </span>
                            {new Date(app.submittedAt).toLocaleDateString("en-GB")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 min-w-0">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
                          <span className="truncate">
                            <span>Start: </span>
                            {new Date(app.startDate).toLocaleDateString("en-GB")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 min-w-0">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
                          <span className="truncate">
                            <span>End: </span>
                            {new Date(app.endDate).toLocaleDateString("en-GB")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">
                            <span>Location: </span>
                            {app.isRemote
                              ? "Remote"
                              : app.type === "overseas"
                                ? app.country || "—"
                                : app.district || "—"}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3 text-xs sm:text-sm text-muted-foreground font-body">
                        <strong>Your Motivation:</strong> <span className="break-words">{app.motivation}</span>
                      </div>

                      <div className="mb-4 p-2 sm:p-3 rounded-lg bg-muted/40">
                        <p className="text-xs sm:text-sm font-body">
                          <AlertTriangle className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 text-muted-foreground" />
                          {getStatusMessage(app.status)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-end">
                        {app.status === "accepted" && (
                          <>
                            <Button size="sm" onClick={() => openConfirmDialog(app, "confirm")} className="text-xs sm:text-sm">
                              <CheckCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openConfirmDialog(app, "withdraw")}
                              className="text-xs sm:text-sm"
                            >
                              <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Withdraw
                            </Button>
                          </>
                        )}

                        {app.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openConfirmDialog(app, "withdraw")}
                            className="text-xs sm:text-sm"
                          >
                            <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Withdraw
                          </Button>
                        )}

                        {(app.status === "confirmed" || app.status === "accepted") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddToCalendar(app)}
                            className="text-xs sm:text-sm"
                          >
                            <CalendarPlus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
                            <span className="hidden sm:inline">Add to Google Calendar</span>
                            <span className="sm:hidden">Calendar</span>
                          </Button>
                        )}

                        <Button size="sm" onClick={() => handleViewApplication(app)} className="text-xs sm:text-sm">
                          <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">View Application</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-muted-foreground/40 bg-muted/40 py-12 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <h3 className="font-heading text-lg text-foreground">
                      {tab.value === "all" 
                        ? "No applications yet" 
                        : `No ${tab.label.toLowerCase()} applications`}
                    </h3>
                    <p className="text-sm text-muted-foreground font-body">
                      {tab.value === "all"
                        ? "Start exploring CSPs and submit your first application to see it here"
                        : tab.value === "pending"
                        ? "Check other tabs or browse available CSPs"
                        : `Check other tabs to see your application history`}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
