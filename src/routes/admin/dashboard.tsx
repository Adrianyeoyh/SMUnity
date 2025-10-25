import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { Button } from "#client/components/ui/button";
import { Badge } from "#client/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { ScrollArea } from "#client/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#client/components/ui/dialog";
import { Input } from "#client/components/ui/input";
import { Label } from "#client/components/ui/label";
import {
  ShieldCheck,
  Users,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Search,
  Building2,
  AlertTriangle,
  Mail,
  Phone,
  UserCheck,
  Clock4,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { fetchAdminDashboard } from "#client/api/admin/dashboard.ts";
import { requireSession } from "#server/api/_utils/auth.ts";

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


const initialOrganiserQueue: OrganiserRecord[] = [
  {
    id: "org-401",
    organiserName: "Sarah Chen",
    organisationName: "Heartfull Kitchen",
    email: "sarah@heartfullkitchen.org",
    phone: "+65 9334 1122",
    submittedOn: "2025-03-02",
    status: "pending",
  },
  {
    id: "org-402",
    organiserName: "Michael Tan",
    organisationName: "Repair Forward",
    email: "michael@repairforward.org",
    phone: "+65 9456 7788",
    submittedOn: "2025-03-01",
    status: "pending",
  },
  {
    id: "org-399",
    organiserName: "Jennifer Lim",
    organisationName: "CareSMU",
    email: "jennifer@caresmu.com",
    phone: "+65 8123 5678",
    submittedOn: "2025-02-28",
    status: "approved",
    reviewedOn: "2025-03-01",
    reviewedBy: "Admin",
  },
  {
    id: "org-395",
    organiserName: "David Wong",
    organisationName: "Bright Minds SG",
    email: "david@brightminds.sg",
    phone: "+65 8765 4432",
    submittedOn: "2025-02-25",
    status: "rejected",
    reviewedOn: "2025-02-26",
    reviewedBy: "Admin",
  },
  {
    id: "org-403",
    organiserName: "Emily Rodriguez",
    organisationName: "Green Earth Initiative",
    email: "emily@greenearth.sg",
    phone: "+65 9234 5678",
    submittedOn: "2025-02-24",
    status: "pending",
  },
  {
    id: "org-404",
    organiserName: "James Kumar",
    organisationName: "Tech for Good",
    email: "james@techforgood.org",
    phone: "+65 9345 6789",
    submittedOn: "2025-02-23",
    status: "approved",
    reviewedOn: "2025-02-24",
    reviewedBy: "Admin",
  },
  {
    id: "org-405",
    organiserName: "Lisa Park",
    organisationName: "Youth Empowerment Hub",
    email: "lisa@youthempowerment.sg",
    phone: "+65 9456 7890",
    submittedOn: "2025-02-22",
    status: "pending",
  },
  {
    id: "org-406",
    organiserName: "Robert Singh",
    organisationName: "Community Care Network",
    email: "robert@communitycare.org",
    phone: "+65 9567 8901",
    submittedOn: "2025-02-21",
    status: "rejected",
    reviewedOn: "2025-02-22",
    reviewedBy: "Admin",
  },
  {
    id: "org-407",
    organiserName: "Amanda Lee",
    organisationName: "Elderly Support Foundation",
    email: "amanda@elderlysupport.sg",
    phone: "+65 9678 9012",
    submittedOn: "2025-02-20",
    status: "pending",
  },
  {
    id: "org-408",
    organiserName: "Thomas Ng",
    organisationName: "Digital Literacy Project",
    email: "thomas@digitalliteracy.org",
    phone: "+65 9789 0123",
    submittedOn: "2025-02-19",
    status: "approved",
    reviewedOn: "2025-02-20",
    reviewedBy: "Admin",
  },
  {
    id: "org-409",
    organiserName: "Maria Garcia",
    organisationName: "Children's Hope Center",
    email: "maria@childrenshope.sg",
    phone: "+65 9890 1234",
    submittedOn: "2025-02-18",
    status: "pending",
  },
  {
    id: "org-410",
    organiserName: "Kevin Lim",
    organisationName: "Environmental Action Group",
    email: "kevin@envaction.org",
    phone: "+65 9901 2345",
    submittedOn: "2025-02-17",
    status: "approved",
    reviewedOn: "2025-02-18",
    reviewedBy: "Admin",
  },
  {
    id: "org-411",
    organiserName: "Rachel Tan",
    organisationName: "Mental Health Advocates",
    email: "rachel@mentalhealth.sg",
    phone: "+65 9012 3456",
    submittedOn: "2025-02-16",
    status: "pending",
  },
  {
    id: "org-412",
    organiserName: "Alex Chen",
    organisationName: "Homeless Support Services",
    email: "alex@homelesssupport.org",
    phone: "+65 9123 4567",
    submittedOn: "2025-02-15",
    status: "rejected",
    reviewedOn: "2025-02-16",
    reviewedBy: "Admin",
  },
  {
    id: "org-413",
    organiserName: "Sophie Williams",
    organisationName: "Animal Rescue Foundation",
    email: "sophie@animalrescue.sg",
    phone: "+65 9234 5678",
    submittedOn: "2025-02-14",
    status: "pending",
  },
  {
    id: "org-414",
    organiserName: "Daniel Kim",
    organisationName: "Education Access Initiative",
    email: "daniel@educationaccess.org",
    phone: "+65 9345 6789",
    submittedOn: "2025-02-13",
    status: "approved",
    reviewedOn: "2025-02-14",
    reviewedBy: "Admin",
  },
  {
    id: "org-415",
    organiserName: "Grace Wong",
    organisationName: "Women's Empowerment Network",
    email: "grace@womenempowerment.sg",
    phone: "+65 9456 7890",
    submittedOn: "2025-02-12",
    status: "pending",
  },
  {
    id: "org-416",
    organiserName: "Marcus Johnson",
    organisationName: "Disability Support Alliance",
    email: "marcus@disabilitysupport.org",
    phone: "+65 9567 8901",
    submittedOn: "2025-02-11",
    status: "approved",
    reviewedOn: "2025-02-12",
    reviewedBy: "Admin",
  },
  {
    id: "org-417",
    organiserName: "Catherine Liu",
    organisationName: "Food Security Coalition",
    email: "catherine@foodsecurity.sg",
    phone: "+65 9678 9012",
    submittedOn: "2025-02-10",
    status: "pending",
  },
  {
    id: "org-418",
    organiserName: "Benjamin Ong",
    organisationName: "Sports for Development",
    email: "benjamin@sportsfordev.org",
    phone: "+65 9789 0123",
    submittedOn: "2025-02-09",
    status: "rejected",
    reviewedOn: "2025-02-10",
    reviewedBy: "Admin",
  },
  {
    id: "org-419",
    organiserName: "Isabella Martinez",
    organisationName: "Arts and Culture Society",
    email: "isabella@artsculture.sg",
    phone: "+65 9890 1234",
    submittedOn: "2025-02-08",
    status: "pending",
  },
  {
    id: "org-420",
    organiserName: "Oliver Thompson",
    organisationName: "Community Garden Project",
    email: "oliver@communitygarden.org",
    phone: "+65 9901 2345",
    submittedOn: "2025-02-07",
    status: "approved",
    reviewedOn: "2025-02-08",
    reviewedBy: "Admin",
  },
  {
    id: "org-421",
    organiserName: "Zoe Zhang",
    organisationName: "Senior Citizens Club",
    email: "zoe@seniorcitizens.sg",
    phone: "+65 9012 3456",
    submittedOn: "2025-02-06",
    status: "pending",
  },
  {
    id: "org-422",
    organiserName: "Nathan Davis",
    organisationName: "Youth Mentorship Program",
    email: "nathan@youthmentorship.org",
    phone: "+65 9123 4567",
    submittedOn: "2025-02-05",
    status: "approved",
    reviewedOn: "2025-02-06",
    reviewedBy: "Admin",
  },
  {
    id: "org-423",
    organiserName: "Chloe Anderson",
    organisationName: "Healthcare Access Initiative",
    email: "chloe@healthcareaccess.sg",
    phone: "+65 9234 5678",
    submittedOn: "2025-02-04",
    status: "pending",
  },
  {
    id: "org-424",
    organiserName: "Ethan Brown",
    organisationName: "Digital Inclusion Project",
    email: "ethan@digitalinclusion.org",
    phone: "+65 9345 6789",
    submittedOn: "2025-02-03",
    status: "rejected",
    reviewedOn: "2025-02-04",
    reviewedBy: "Admin",
  },
  {
    id: "org-425",
    organiserName: "Maya Patel",
    organisationName: "Cultural Exchange Society",
    email: "maya@culturalexchange.sg",
    phone: "+65 9456 7890",
    submittedOn: "2025-02-02",
    status: "pending",
  },
];


export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {

  const [organiserQueue, setOrganiserQueue] = useState<OrganiserRecord[]>(initialOrganiserQueue);
  const [tabValue, setTabValue] = useState<"all" | OrganiserStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [showOrganiserModal, setShowOrganiserModal] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [organiserForm, setOrganiserForm] = useState({
    email: "",
    organiserName: "",
    organisationName: ""
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    organiserName: "",
    organisationName: ""
  });
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const [stats, setStats] = useState<{
  activeOrganisations: number;
  totalCSPListings: number;
  activeUsers: number;
  serviceHours: number;
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
        serviceHours: data.totals.serviceHours,
        pending: data.pendingOrgRequests,
      });
    } catch (err) {
      console.error("Failed to load admin dashboard:", err);
    }
  }

  loadDashboard();
}, []);

  // const stats = useMemo(() => {
  //   const totals = organiserQueue.reduce(
  //     (acc, organiser) => {
  //       acc.total += 1;
  //       if (organiser.status === "pending") acc.pending += 1;
  //       if (organiser.status === "approved") acc.approved += 1;
  //       if (organiser.status === "rejected") acc.rejected += 1;
  //       return acc;
  //     },
  //     {
  //       total: 0,
  //       pending: 0,
  //       approved: 0,
  //       rejected: 0,
  //     },
  //   );

  //   return {
  //     activeOrganisations: 12, // Mock data - active organisations
  //     totalCSPListings: totals.total,
  //     activeUsers: 245, // Mock data - active users
  //     serviceHours: 1847, // Mock data - total service hours
  //     pending: totals.pending,
  //     approved: totals.approved,
  //     rejected: totals.rejected,
  //   };
  // }, [organiserQueue]);

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
    
    // Sort by status (pending first, then approved, then rejected) and by earliest submitted date within each status
    filtered.sort((a, b) => {
      // First sort by status priority: pending (0), approved (1), rejected (2)
      const statusOrder = { pending: 0, approved: 1, rejected: 2 };
      const statusComparison = statusOrder[a.status] - statusOrder[b.status];
      
      if (statusComparison !== 0) {
        return statusComparison;
      }
      
      // If same status, sort by earliest submitted date (oldest first)
      return new Date(a.submittedOn).getTime() - new Date(b.submittedOn).getTime();
    });
    
    return filtered;
  }, [organiserQueue, tabValue, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredQueue.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrganisers = filteredQueue.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [tabValue, searchTerm]);

  // Reset scroll position when page changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [currentPage]);


  const handleStatusChange = (id: string, status: OrganiserStatus) => {
    const organiser = organiserQueue.find(org => org.id === id);
    
    setOrganiserQueue((prev) =>
      prev.map((organiser) => 
        organiser.id === id 
          ? { 
              ...organiser, 
              status,
              reviewedOn: new Date().toISOString().split('T')[0],
              reviewedBy: "Admin"
            }
          : organiser
      ),
    );

    const label = statusLabel[status];
    const notify = status === "rejected" ? toast.error : toast.success;

    notify(`Organiser '${organiser?.organiserName}' successfully ${status}`, {
      description: "Organiser has been notified of this decision.",
      className: status === "rejected" ? "bg-red-50 border border-red-200 font-body" : "bg-green-50 border border-green-200 font-body",
    });
  };

  const handleOrganiserSubmit = () => {
    setHasAttemptedSubmit(true);
    
    // Reset errors
    setFormErrors({ email: "", organiserName: "", organisationName: "" });
    
    let hasErrors = false;
    const newErrors = { email: "", organiserName: "", organisationName: "" };

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

    if (hasErrors) {
      setFormErrors(newErrors);
      return;
    }

    // Here you would typically send the data to your backend
    toast.success("Organiser created successfully", {
      description: `${organiserForm.organiserName} from ${organiserForm.organisationName} has been added.`,
      className: "bg-green-50 border border-green-200 font-body",
    });

    // Reset form and close modal
    setOrganiserForm({ email: "", organiserName: "", organisationName: "" });
    setFormErrors({ email: "", organiserName: "", organisationName: "" });
    setHasAttemptedSubmit(false);
    setShowOrganiserModal(false);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">Active Organisations</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{stats?.activeOrganisations ?? 0}</CardTitle>
                </div>
                <div className="bg-blue-100 rounded-full p-3 ml-4">
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
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">Total CSP Listings</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{stats?.totalCSPListings ?? 0}</CardTitle>
                </div>
                <div className="bg-green-100 rounded-full p-3 ml-4">
                  <ClipboardList className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardHeader>
             <CardContent className="pt-0 pb-0">
              <div className="text-xs text-muted-foreground font-body">
                {stats?.approved} approved · {stats?.pending} pending
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">Active Users</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{stats?.activeUsers ?? 0}</CardTitle>
                </div>
                <div className="bg-orange-100 rounded-full p-3 ml-4">
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

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">Service Hours</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{stats?.serviceHours ?? 0}</CardTitle>
                </div>
                <div className="bg-purple-100 rounded-full p-3 ml-4">
                  <Clock4 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardHeader>
             <CardContent className="pt-0 pb-0">
              <div className="text-xs text-muted-foreground font-body">
                Total hours contributed
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organiser Approval Queue */}
        <div className="space-y-6" data-section="organiser-queue">
          <div className="pb-4">
            <div className="flex flex-wrap items-center gap-3 md:justify-between">
              <div>
                <h2 className="font-heading text-2xl">Organiser Approval Queue</h2>
                <p className="font-body mt-2 text-muted-foreground">
                  Review pending requests and confirm organiser readiness before listings go live
                </p>
              </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search organisers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-80"
              />
                </div>
              </div>
          
              <Tabs value={tabValue} onValueChange={(value) => setTabValue(value as typeof tabValue)} className="w-full mt-6">
                <TabsList className="flex w-full flex-wrap justify-start gap-2">
                  <TabsTrigger value="all" className="font-body">All</TabsTrigger>
              <TabsTrigger value="pending" className="font-body">
                Pending {stats?.pending > 0 && `(${stats?.pending})`}
              </TabsTrigger>
                  <TabsTrigger value="approved" className="font-body">Approved</TabsTrigger>
                  <TabsTrigger value="rejected" className="font-body">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

              <ScrollArea ref={scrollAreaRef} className="max-h-[480px] overflow-x-hidden pr-2">
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
                            onClick={() => handleStatusChange(organiser.id, "rejected")}
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
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredQueue.length)} of {filteredQueue.length} requests
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
            setFormErrors({ email: "", organiserName: "", organisationName: "" });
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
                Email *
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
                Organiser Name *
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
                Organisation *
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
          </div>
          <DialogFooter className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowOrganiserModal(false);
                setHasAttemptedSubmit(false);
                setFormErrors({ email: "", organiserName: "", organisationName: "" });
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
    </div>
  );
}
