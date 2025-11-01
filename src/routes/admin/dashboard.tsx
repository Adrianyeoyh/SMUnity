import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { Button } from "#client/components/ui/button";
import { Badge } from "#client/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { ScrollArea } from "#client/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#client/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#client/components/ui/dialog";
import { Input } from "#client/components/ui/input";
import { Label } from "#client/components/ui/label";
import { Textarea } from "#client/components/ui/textarea";
import { ClipboardList, CheckCircle2, XCircle, Calendar, Search, Building2, Mail, Phone, UserCheck, Clock4, Plus } from "lucide-react";
import { toast } from "sonner";
import { fetchAdminDashboard } from "#client/api/admin/dashboard.ts";
import { createOrganiser } from "#client/api/admin/create.ts";
import { fetchApprovalQueue, approveRequest, rejectRequest } from "#client/api/admin/queue.ts";


type OrganiserStatus = "pending" | "approved" | "rejected";

type OrganiserRecord = {
  id: string;
  organiserName: string;
  organisationName: string;
  email: string;
  phone: string;
  submittedOn: string;
  status: OrganiserStatus;
  reviewedOn?: string;
  reviewedBy?: string;
};


const statusBadge: Record<OrganiserStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

const statusLabel: Record<OrganiserStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};


export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {

  const [organiserQueue, setOrganiserQueue] = useState<OrganiserRecord[]>([]);
  const [tabValue, setTabValue] = useState<"all" | OrganiserStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"submitted_asc" | "submitted_desc" | "reviewed_asc" | "reviewed_desc" | "default">("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [showOrganiserModal, setShowOrganiserModal] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [organiserForm, setOrganiserForm] = useState({
    email: "",
    organiserName: "",
    organisationName: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    organiserName: "",
    organisationName: "",
    password: "",
  });
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRejectOrganiser, setSelectedRejectOrganiser] = useState<OrganiserRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectAttempted, setRejectAttempted] = useState(false);

  const [stats, setStats] = useState<{
  activeOrganisations: number;
  totalCSPListings: number;
  activeUsers: number;
  // serviceHours: number;
  pending: number;
} | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await fetchAdminDashboard();
        setStats({
          activeOrganisations: data.totals.organisations,
          totalCSPListings: data.totals.projects,
          activeUsers: data.totals.users,
          // serviceHours: data.totals.serviceHours,
          pending: data.pendingOrgRequests,
        });
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);
      }
  }

  loadDashboard();
  }, []);

  const refreshStats = async () => {
  try {
    const data = await fetchAdminDashboard();
    setStats({
      activeOrganisations: data.totals.organisations,
      totalCSPListings: data.totals.projects,
      activeUsers: data.totals.users,
      // serviceHours: data.totals.serviceHours,
      pending: data.pendingOrgRequests,
    });
  } catch (err) {
    console.error("Failed to refresh dashboard stats:", err);
  }
};

  useEffect(() => {
    async function loadQueue() {
      try {
              const data = await fetchApprovalQueue();

      // 🧩 Transform DB schema → frontend shape
      const formatted = data.map((req: any) => ({
        id: req.id,
        organiserName: req.requesterName || "Unknown",
        organisationName: req.orgName,
        email: req.requesterEmail,
        phone: req.phone || "",
        submittedOn: req.createdAt
          ? new Date(req.createdAt).toISOString().split("T")[0]
          : "",
        status: req.status,
        reviewedOn: req.decidedAt
          ? new Date(req.decidedAt).toISOString().split("T")[0]
          : undefined,
        reviewedBy: req.decidedBy || undefined,
      }));

      setOrganiserQueue(formatted);
      } catch (err) {
        console.error("Failed to load approval queue:", err);
      }
    }
    loadQueue();
  }, []);

  // Calculate counts for each status
  const statusCounts = useMemo(() => {
    return {
      all: organiserQueue.length,
      pending: organiserQueue.filter((o) => o.status === "pending").length,
      approved: organiserQueue.filter((o) => o.status === "approved").length,
      rejected: organiserQueue.filter((o) => o.status === "rejected").length,
    };
  }, [organiserQueue]);

  const filteredQueue = useMemo(() => {
    let filtered = organiserQueue;
    
    // Filter by status
    if (tabValue !== "all") {
      filtered = filtered.filter((organiser) => organiser.status === tabValue);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((organiser) =>
        organiser.organiserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        organiser.organisationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        organiser.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort based on selected sort option
    if (sortBy === "default") {
      // Default sort: by status (pending first, then approved, then rejected)
      // Then by earliest submitted date for pending, or latest reviewed date for approved/rejected
      filtered.sort((a, b) => {
        // First sort by status priority: pending (0), approved (1), rejected (2)
        const statusOrder = { pending: 0, approved: 1, rejected: 2 };
        const statusComparison = statusOrder[a.status] - statusOrder[b.status];
        
        if (statusComparison !== 0) {
          return statusComparison;
        }
        
        // If same status, sort differently based on status
        if (a.status === "pending") {
          // For pending: earliest submitted date to latest submitted date (oldest first)
          return new Date(a.submittedOn).getTime() - new Date(b.submittedOn).getTime();
        } else {
          // For approved/rejected: latest reviewed date to earliest reviewed date (newest first)
          const aReviewed = a.reviewedOn ? new Date(a.reviewedOn).getTime() : 0;
          const bReviewed = b.reviewedOn ? new Date(b.reviewedOn).getTime() : 0;
          return bReviewed - aReviewed;
        }
      });
    } else {
      // Custom sort based on user selection
      filtered.sort((a, b) => {
        if (sortBy === "submitted_asc") {
          return new Date(a.submittedOn).getTime() - new Date(b.submittedOn).getTime();
        } else if (sortBy === "submitted_desc") {
          return new Date(b.submittedOn).getTime() - new Date(a.submittedOn).getTime();
        } else if (sortBy === "reviewed_asc") {
          const aReviewed = a.reviewedOn ? new Date(a.reviewedOn).getTime() : 0;
          const bReviewed = b.reviewedOn ? new Date(b.reviewedOn).getTime() : 0;
          return aReviewed - bReviewed;
        } else if (sortBy === "reviewed_desc") {
          const aReviewed = a.reviewedOn ? new Date(a.reviewedOn).getTime() : 0;
          const bReviewed = b.reviewedOn ? new Date(b.reviewedOn).getTime() : 0;
          return bReviewed - aReviewed;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [organiserQueue, tabValue, searchTerm, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredQueue.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrganisers = filteredQueue.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [tabValue, searchTerm, sortBy]);

  // Reset scroll position when page changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [currentPage]);


  const handleStatusChange = async (id: string, status: OrganiserStatus, reason?: string) => {
    try {
      if (status === "approved") await approveRequest(id);
      else await rejectRequest(id);

      // Optimistic UI update
      setOrganiserQueue(prev =>
        prev.map(org =>
          org.id === id
            ? { ...org, status, reviewedOn: new Date().toISOString().split("T")[0], reviewedBy: "Admin" }
            : org
        )
      );

      await refreshStats();

      const notify = status === "rejected" ? toast.error : toast.success;
      notify(`Organiser ${status}`, {
        description: reason ? `Reason: ${reason}` : "Decision has been recorded successfully.",
      });
    } catch (error) {
      toast.error("Action failed", { description: (error as Error).message });
    }
  };

  const handleRejectClick = (organiser: OrganiserRecord) => {
    setSelectedRejectOrganiser(organiser);
    setRejectionReason("");
    setRejectAttempted(false);
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedRejectOrganiser) return;
    
    if (!rejectionReason.trim()) {
      setRejectAttempted(true);
      return;
    }
    
    await handleStatusChange(selectedRejectOrganiser.id, "rejected", rejectionReason);
    setShowRejectModal(false);
    setSelectedRejectOrganiser(null);
    setRejectionReason("");
    setRejectAttempted(false);
  };


  const handleOrganiserSubmit = async () => {
  setHasAttemptedSubmit(true);

  // Reset errors
  setFormErrors({ email: "", organiserName: "", organisationName: "", password: "" });

  let hasErrors = false;
  const newErrors = { email: "", organiserName: "", organisationName: "", password: "" };

  // Validate email
  if (!organiserForm.email.trim()) {
    newErrors.email = "Email is required";
    hasErrors = true;
  } else if (!/\S+@\S+\.\S+/.test(organiserForm.email)) {
    newErrors.email = "Please enter a valid email address";
    hasErrors = true;
  }

  // Validate organiser name
  if (!organiserForm.organiserName.trim()) {
    newErrors.organiserName = "Organiser name is required";
    hasErrors = true;
  }

  // Validate organisation name
  if (!organiserForm.organisationName.trim()) {
    newErrors.organisationName = "Organisation name is required";
    hasErrors = true;
  }

  // Validate password
  if (!organiserForm.password.trim()) {
    newErrors.password = "Password is required";
    hasErrors = true;
  } else if (organiserForm.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
    hasErrors = true;
  }

  if (hasErrors) {
    setFormErrors(newErrors);
    return;
  }

  try {
    await createOrganiser(organiserForm);

    toast.success("Organiser created successfully", {
      description: `${organiserForm.organiserName} from ${organiserForm.organisationName} has been added.`,
      className: "bg-green-50 border border-green-200 font-body",
    });

    // Reset form and close modal
    setOrganiserForm({ email: "", organiserName: "", organisationName: "", password: "" });
    setFormErrors({ email: "", organiserName: "", organisationName: "", password: "" });
    setHasAttemptedSubmit(false);
    setShowOrganiserModal(false);
  } catch (error: any) {
    toast.error("Failed to create organiser", {
      description: error.message || "Something went wrong",
    });
  }
};


  const handleOrganiserFormChange = (field: string, value: string) => {
    setOrganiserForm(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground font-body text-lg">
                Monitor platform performance, verify CSP submissions, and stay on top of recent activity
            </p>
          </div>
            <div className="flex-shrink-0">
              <Button className="inline-flex items-center gap-2" onClick={() => setShowOrganiserModal(true)}>
                <Plus className="h-4 w-4" />
                Create New Organiser
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-8">

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">Active Organisations</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{stats?.activeOrganisations ?? 0}</CardTitle>
                </div>
                <div className="hidden sm:block bg-blue-100 rounded-full p-3 ml-4">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardHeader>
             <CardContent className="pt-0 pb-0">
              <div className="text-xs text-muted-foreground font-body">
                Currently managing CSPs
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">Total CSP Listings</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{stats?.totalCSPListings ?? 0}</CardTitle>
                </div>
                <div className="hidden sm:block bg-green-100 rounded-full p-3 ml-4">
                  <ClipboardList className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardHeader>
             <CardContent className="pt-0 pb-0">
              <div className="text-xs text-muted-foreground font-body">
                {stats?.pending ?? 0} pending
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold lg:mt-3 lg:mb-6 xl:mt-0 xl:mb-4">Active Users</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{stats?.activeUsers ?? 0}</CardTitle>
                </div>
                <div className="hidden sm:block bg-orange-100 rounded-full p-3 ml-4">
                  <UserCheck className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardHeader>
             <CardContent className="pt-0 pb-0">
              <div className="text-xs text-muted-foreground font-body">
                Students and volunteers
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold lg:mt-3 lg:mb-6 xl:mt-0 xl:mb-4">Service Hours</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{stats?.serviceHours ?? 0}</CardTitle>
                </div>
                <div className="hidden sm:block bg-purple-100 rounded-full p-3 ml-4">
                  <Clock4 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardHeader>
             <CardContent className="pt-0 pb-0">
              <div className="text-xs text-muted-foreground font-body">
                Total hours contributed
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Organisation Approval Queue */}
        <div className="space-y-6" data-section="organiser-queue">
          <div className="pb-4">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="font-heading text-2xl">Organisation Approval Queue</h2>
                <p className="font-body mt-2 text-muted-foreground">
                  Review pending requests and confirm organiser readiness before listings go live
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="relative w-full md:max-w-[360px] lg:max-w-[420px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search organisers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full"
                  />
                </div>
                <span className="flex flex-row justify-end items-center gap-2 text-sm font-medium text-foreground font-body whitespace-nowrap">
                  Sort By
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                    <SelectTrigger className="w-full md:w-[220px] font-normal">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default" className="font-body font-normal">Default (Status)</SelectItem>
                      <SelectItem value="submitted_asc" className="font-body font-normal">Submitted · Oldest</SelectItem>
                      <SelectItem value="submitted_desc" className="font-body font-normal">Submitted · Newest</SelectItem>
                      <SelectItem value="reviewed_asc" className="font-body font-normal">Reviewed · Oldest</SelectItem>
                      <SelectItem value="reviewed_desc" className="font-body font-normal">Reviewed · Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </span>
              </div>
            </div>
          
              <Tabs value={tabValue} onValueChange={(value) => setTabValue(value as typeof tabValue)} className="w-full mt-6">
                <TabsList className="h-auto grid w-full grid-cols-2 md:h-9 md:inline-flex md:w-auto">
                  <TabsTrigger value="all" className="font-body">All ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="pending" className="font-body">
                Pending ({statusCounts.pending})
              </TabsTrigger>
                  <TabsTrigger value="approved" className="font-body">Approved ({statusCounts.approved})</TabsTrigger>
                  <TabsTrigger value="rejected" className="font-body">Rejected ({statusCounts.rejected})</TabsTrigger>
                </TabsList>
              </Tabs>
          </div>

              <ScrollArea ref={scrollAreaRef} className="max-h-[480px] overflow-x-hidden">
            <div className="space-y-4" data-section="request-list">
              {currentOrganisers.map((organiser) => (
                    <div
                  key={organiser.id}
                      className="rounded-xl border border-border/60 bg-white p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-lg font-semibold text-foreground">{organiser.organisationName}</h3>
                        <Badge className={`${statusBadge[organiser.status]} font-body`}>{statusLabel[organiser.status]}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-body">
                        Submitted by: {organiser.organiserName}
                          </p>
                      <div className="flex flex-wrap gap-4 text-sm font-body text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> Submitted on: {organiser.submittedOn}
                            </span>
                        <a 
                          href={`mailto:${organiser.email}`}
                          className="inline-flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                        >
                              <Mail className="h-4 w-4" />
                          {organiser.email}
                        </a>
                        <a 
                          href={`tel:${organiser.phone}`}
                          className="inline-flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                        >
                              <Phone className="h-4 w-4" />
                          {organiser.phone}
                        </a>
                          </div>
                        </div>
                    {organiser.status === "pending" && (
                        <div className="flex flex-col items-start gap-2 md:items-end">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleStatusChange(organiser.id, "approved")}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleRejectClick(organiser)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                    )}
                    {(organiser.status === "approved" || organiser.status === "rejected") && organiser.reviewedOn && (
                      <div className="flex flex-col items-start gap-2 md:items-end">
                        <div className="flex flex-wrap gap-4 text-sm font-body text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-4 w-4" /> 
                            {organiser.status === "approved" ? "Approved" : "Rejected"} on: {organiser.reviewedOn}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <UserCheck className="h-4 w-4" /> Reviewed by: {organiser.reviewedBy}
                          </span>
                        </div>
                      </div>
                    )}
                      </div>
                    </div>
                  ))}

              {currentOrganisers.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 py-12 text-center">
                  <h4 className="font-heading text-lg text-foreground">No organisers in this view</h4>
                      <p className="text-sm text-muted-foreground font-body">
                        Switch to another filter to manage different parts of the pipeline.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>

          {/* Results Counter and Pagination */}
          {filteredQueue.length > 0 && (
            <div className="mt-6">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredQueue.length)} of {filteredQueue.length} results
                </p>
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentPage(Math.max(1, currentPage - 1));
                      setTimeout(() => {
                        const element = document.querySelector('[data-section="organiser-queue"]');
                        if (element) {
                          const rect = element.getBoundingClientRect();
                          const scrollTop = window.pageYOffset + rect.top - 100;
                          window.scrollTo({ top: scrollTop, behavior: 'smooth' });
                        }
                      }, 300);
                    }}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setCurrentPage(page);
                          setTimeout(() => {
                            const element = document.querySelector('[data-section="organiser-queue"]');
                            if (element) {
                              const rect = element.getBoundingClientRect();
                              const scrollTop = window.pageYOffset + rect.top - 100;
                              window.scrollTo({ top: scrollTop, behavior: 'smooth' });
                            }
                          }, 300);
                        }}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentPage(Math.min(totalPages, currentPage + 1));
                      setTimeout(() => {
                        const element = document.querySelector('[data-section="organiser-queue"]');
                        if (element) {
                          const rect = element.getBoundingClientRect();
                          const scrollTop = window.pageYOffset + rect.top - 100;
                          window.scrollTo({ top: scrollTop, behavior: 'smooth' });
                        }
                      }, 300);
                    }}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
              </div>
          )}
        </div>
        </div>
      </div>

      {/* Create New Organiser Modal */}
      <Dialog 
        open={showOrganiserModal} 
        onOpenChange={(open) => {
          setShowOrganiserModal(open);
          if (!open) {
            setHasAttemptedSubmit(false);
            setFormErrors({ email: "", organiserName: "", organisationName: "", password: "" });
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Create New Organiser</DialogTitle>
            <DialogDescription className="font-body">
              Add a new organiser to the platform to create and manage projects
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@organisation.org"
                className={`h-12 text-base ${hasAttemptedSubmit && formErrors.email ? 'border-red-500' : ''}`}
                value={organiserForm.email}
                onChange={(e) => handleOrganiserFormChange("email", e.target.value)}
                required
              />
              {hasAttemptedSubmit && formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
                </div>
            <div className="space-y-2">
              <Label htmlFor="organiserName" className="text-base font-medium">
                Organiser Name
              </Label>
              <Input
                id="organiserName"
                placeholder="Jane Doe"
                className={`h-12 text-base ${hasAttemptedSubmit && formErrors.organiserName ? 'border-red-500' : ''}`}
                value={organiserForm.organiserName}
                onChange={(e) => handleOrganiserFormChange("organiserName", e.target.value)}
                required
              />
              {hasAttemptedSubmit && formErrors.organiserName && (
                <p className="text-sm text-red-500">{formErrors.organiserName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="organisationName" className="text-base font-medium">
                Organisation
              </Label>
              <Input
                id="organisationName"
                placeholder="Helping Hands"
                className={`h-12 text-base ${hasAttemptedSubmit && formErrors.organisationName ? 'border-red-500' : ''}`}
                value={organiserForm.organisationName}
                onChange={(e) => handleOrganiserFormChange("organisationName", e.target.value)}
                required
              />
              {hasAttemptedSubmit && formErrors.organisationName && (
                <p className="text-sm text-red-500">{formErrors.organisationName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`h-12 text-base ${hasAttemptedSubmit && formErrors.password ? 'border-red-500' : ''}`}
                value={organiserForm.password}
                onChange={(e) => handleOrganiserFormChange("password", e.target.value)}
                required
              />
              {hasAttemptedSubmit && formErrors.password && (
                <p className="text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>

          </div>
          <DialogFooter className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowOrganiserModal(false);
                setHasAttemptedSubmit(false);
                setFormErrors({ email: "", organiserName: "", organisationName: "", password: "" });
              }}
              className="flex-1 h-10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleOrganiserSubmit}
              className="flex-1 h-10"
            >
              Create Organiser
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Organisation Modal */}
      <Dialog 
        open={showRejectModal} 
        onOpenChange={(open) => {
          setShowRejectModal(open);
          if (!open) {
            setSelectedRejectOrganiser(null);
            setRejectionReason("");
            setRejectAttempted(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Reject Organisation Request</DialogTitle>
            <DialogDescription className="font-body">
              Please provide a reason for rejecting this organisation request. This information will be recorded.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRejectOrganiser && (
            <div className="space-y-4 py-4">
              {/* Organisation Details */}
              <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Organisation Details</Label>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Organisation Name:</span>
                    <span className="font-medium">{selectedRejectOrganiser.organisationName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Submitted by:</span>
                    <span className="font-medium">{selectedRejectOrganiser.organiserName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <a href={`mailto:${selectedRejectOrganiser.email}`} className="font-medium hover:text-primary">
                      {selectedRejectOrganiser.email}
                    </a>
                  </div>
                  {selectedRejectOrganiser.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <a href={`tel:${selectedRejectOrganiser.phone}`} className="font-medium hover:text-primary">
                        {selectedRejectOrganiser.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Submitted on:</span>
                    <span className="font-medium">{selectedRejectOrganiser.submittedOn}</span>
                  </div>
                </div>
              </div>

              {/* Rejection Reason */}
              <div className="space-y-2">
                <Label htmlFor="rejectionReason" className="text-base font-medium">
                  Reason for Rejection *
                </Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="Enter the reason for rejecting this organisation request..."
                  className={`min-h-[120px] text-base ${rejectAttempted && !rejectionReason.trim() ? 'border-red-500' : ''}`}
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (rejectAttempted && e.target.value.trim()) {
                      setRejectAttempted(false);
                    }
                  }}
                  required
                />
                {rejectAttempted && !rejectionReason.trim() && (
                  <p className="text-sm text-red-500">
                    Please provide a reason for rejection.
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRejectModal(false);
                setSelectedRejectOrganiser(null);
                setRejectionReason("");
                setRejectAttempted(false);
              }}
              className="flex-1 h-10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmReject}
              className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
