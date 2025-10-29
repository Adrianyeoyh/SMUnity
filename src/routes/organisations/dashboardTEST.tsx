import { createFileRoute, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "#client/components/ui/button";
import { Badge } from "#client/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Separator } from "#client/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#client/components/ui/table";
import { ScrollArea } from "#client/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#client/components/ui/select";
import { Users, ClipboardList, Clock, CheckCircle2, Plus, Calendar, MapPin, Edit, Trash2, CalendarClock, Sun, Leaf, Home, HeartHandshake, GraduationCap, BookOpen, Tag, Contact } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchOrgDashboard } from "#client/api/organisations/dashboard.ts";

export const Route = createFileRoute("/organisations/dashboardTEST")({
  component: OrgDashboard,
  
});

type ApplicationStatus = "pending" | "shortlisted" | "confirmed" | "rejected";

const applicationStatusConfig: Record<ApplicationStatus, { label: string; tone: string }> = {
  pending: { label: "Pending review", tone: "bg-yellow-100 text-yellow-800" },
  shortlisted: { label: "Shortlisted", tone: "bg-blue-100 text-blue-800" },
  confirmed: { label: "Confirmed", tone: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", tone: "bg-red-100 text-red-800" },
};

function OrgDashboard() {

  const listings = [
    {
      id: "csp-001",
      title: "Community Garden Mentors",
      location: "Bukit Gombak",
      startDate: "2025-04-05",
      endDate: "2025-06-15",
      slots: 12,
      applications: 8,
      status: "Open",
      highlights: ["Weekends", "Outdoor", "Families"],
    },
    {
      id: "csp-002",
      title: "Digital Literacy Buddies",
      location: "Queenstown",
      startDate: "2025-03-30",
      endDate: "2025-05-20",
      slots: 20,
      applications: 15,
      status: "Shortlisting",
      highlights: ["Weeknights", "Indoor", "Elderly"],
    },
    {
      id: "csp-003",
      title: "North Bridge Homework Club",
      location: "North Bridge Rd",
      startDate: "2025-04-10",
      endDate: "2025-07-30",
      slots: 18,
      applications: 11,
      status: "Open",
      highlights: ["After school", "Mentoring"],
    },
  ];

  const applications = [
    {
      id: "app-1045",
      applicantId: "serena-liang",
      applicant: "Serena Liang",
      email: "serena.liang@smu.edu.sg",
      listingId: "csp-001",
      listingTitle: "Community Garden Mentors",
      submittedOn: "2025-03-04",
      status: "pending" as ApplicationStatus,
    },
    {
      id: "app-1046",
      applicantId: "daniel-ong",
      applicant: "Daniel Ong",
      email: "daniel.ong@smu.edu.sg",
      listingId: "csp-002",
      listingTitle: "Digital Literacy Buddies",
      submittedOn: "2025-03-03",
      status: "shortlisted" as ApplicationStatus,
    },
    {
      id: "app-1047",
      applicantId: "micah-koh",
      applicant: "Micah Koh",
      email: "micah.koh@smu.edu.sg",
      listingId: "csp-003",
      listingTitle: "North Bridge Homework Club",
      submittedOn: "2025-03-02",
      status: "confirmed" as ApplicationStatus,
    },
    {
      id: "app-1048",
      applicantId: "priya-nair",
      applicant: "Priya Nair",
      email: "priya.nair@smu.edu.sg",
      listingId: "csp-002",
      listingTitle: "Digital Literacy Buddies",
      submittedOn: "2025-03-02",
      status: "pending" as ApplicationStatus,
    },
    {
      id: "app-1049",
      applicantId: "jasper-teo",
      applicant: "Jasper Teo",
      email: "jasper.teo@smu.edu.sg",
      listingId: "csp-001",
      listingTitle: "Community Garden Mentors",
      submittedOn: "2025-03-01",
      status: "rejected" as ApplicationStatus,
    },
  ];

  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [listingStatusFilter, setListingStatusFilter] = useState<"all" | "open" | "shortlisting" | "archived">("all");
  const [listingSort, setListingSort] = useState<"date_asc" | "date_desc" | "applications_desc" | "applications_asc">("date_asc");

  const { data: summary, isLoading, isError } = useQuery({
  queryKey: ["orgDashboard"],
  queryFn: fetchOrgDashboard,
  });

  const statusTabs = useMemo(
    () => [
      { value: "all" as const, label: "All" },
      { value: "open" as const, label: "Open" },
      { value: "shortlisting" as const, label: "Shortlisting" },
      { value: "archived" as const, label: "Archived" },
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      { value: "date_asc" as const, label: "Start date · Soonest" },
      { value: "date_desc" as const, label: "Start date · Latest" },
      { value: "applications_desc" as const, label: "Applications · High to low" },
      { value: "applications_asc" as const, label: "Applications · Low to high" },
    ],
    [],
  );
  const handleCreateListing = useCallback(() => {
    toast.success("Start a new listing", {
      description: "Redirecting you to the listing builder.",
    });
    setTimeout(() => {
      navigate({ to: "/organisations/new" });
    }, 200);
  }, [navigate]);

  const handleUpdateListing = useCallback((listingTitle: string) => {
    toast.success("Listing updated", {
      description: `${listingTitle} has been saved.`,
    });
  }, []);

  const handleDeleteListing = useCallback((listingTitle: string) => {
    toast.error("Listing deleted", {
      description: `${listingTitle} has been removed from your dashboard.`,
    });
  }, []);

  const getTagIcon = useCallback((tag: string) => {
    const baseClass = "h-3 w-3";
    switch (tag) {
      case "Weekends":
        return <Sun className={baseClass} />;
      case "Outdoor":
        return <Leaf className={baseClass} />;
      case "Families":
        return <Users className={baseClass} />;
      case "Weeknights":
        return <CalendarClock className={baseClass} />;
      case "Indoor":
        return <Home className={baseClass} />;
      case "Elderly":
        return <HeartHandshake className={baseClass} />;
      case "After school":
        return <BookOpen className={baseClass} />;
      case "Mentoring":
        return <GraduationCap className={baseClass} />;
      default:
        return <Tag className={baseClass} />;
    }
  }, []);

  const getFillTone = useCallback((percentage: number) => {
    if (percentage >= 100) return "bg-emerald-500";
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-amber-500";
    if (percentage >= 25) return "bg-blue-500";
    return "bg-slate-400";
  }, []);

  const getFillBadgeTone = useCallback((percentage: number) => {
    if (percentage >= 100) return "bg-emerald-100 text-emerald-800";
    if (percentage >= 75) return "bg-green-100 text-green-800";
    if (percentage >= 50) return "bg-amber-100 text-amber-800";
    if (percentage >= 25) return "bg-blue-100 text-blue-800";
    return "bg-slate-200 text-slate-700";
  }, []);

  const getFillLabel = useCallback((percentage: number) => {
    if (percentage >= 100) return "Fully allocated";
    if (percentage >= 75) return "Almost full";
    if (percentage >= 50) return "Filling steadily";
    if (percentage >= 25) return "Needs promotion";
    return "Plenty of slots";
  }, []);

  const displayListings = useMemo(() => {
    const normalizedStatus = listingStatusFilter;
    const filtered =
      normalizedStatus === "all"
        ? listings
        : listings.filter((listing) => listing.status.toLowerCase() === normalizedStatus);

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      switch (listingSort) {
        case "date_desc":
          return dateB - dateA;
        case "applications_desc":
          return b.applications - a.applications;
        case "applications_asc":
          return a.applications - b.applications;
        case "date_asc":
        default:
          return dateA - dateB;
      }
    });

    return sorted;
  }, [listingSort, listingStatusFilter, listings]);

  // const summary = useMemo(() => {
  //   const pending = applications.filter((application) => application.status === "pending").length;
  //   const shortlisted = applications.filter((application) => application.status === "shortlisted").length;
  //   const confirmed = applications.filter((application) => application.status === "confirmed").length;

  //   return {
  //     listings: listings.length,
  //     totalApplications: applications.length,
  //     pending,
  //     shortlisted,
  //     confirmed,
  //   };
  // }, [listings.length, applications]);

  const countFor = useCallback(
    (status: ApplicationStatus | "all") =>
      applications.filter((application) => status === "all" || application.status === status).length,
    [applications],
  );

  const filteredApplications = useCallback(
    (status: ApplicationStatus | "all") =>
      applications.filter((application) => status === "all" || application.status === status),
    [applications],
  );

  if (isLoading) return <div className="p-8 text-muted-foreground text-lg">Loading dashboard data...</div>;
  if (isError || !summary) return <div className="p-8 text-red-500 text-lg">Failed to load dashboard stats.</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Organisation Dashboard
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            Create listings, keep track of applications, and manage your volunteer pipeline.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Button onClick={handleCreateListing}>
                <Plus className="mr-2 h-4 w-4" />
                Create new listing
              </Button>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium font-body">Active listings</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">{summary.listings}</p>
              <p className="text-xs text-muted-foreground font-body">Currently published opportunities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium font-body">Total applications</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">{summary.totalApplications}</p>
              <p className="text-xs text-muted-foreground font-body">Across every listing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium font-body">Pending review</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">{summary.pending}</p>
              <p className="text-xs text-muted-foreground font-body">Waiting for your decision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium font-body">Confirmed volunteers</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">{summary.confirmed}</p>
              <p className="text-xs text-muted-foreground font-body">Ready to be onboarded</p>
            </CardContent>
          </Card> */}
          <Card>
            <CardHeader className="pb-2 flex justify-between items-center">
              <CardTitle className="text-sm font-medium font-body">Active listings</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">{summary.listings}</p>
              <p className="text-xs text-muted-foreground font-body">
                Currently published opportunities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex justify-between items-center">
              <CardTitle className="text-sm font-medium font-body">Total applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">{summary.totalApplications}</p>
              <p className="text-xs text-muted-foreground font-body">
                Across every listing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex justify-between items-center">
              <CardTitle className="text-sm font-medium font-body">Pending review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">{summary.pending}</p>
              <p className="text-xs text-muted-foreground font-body">
                Waiting for your decision
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex justify-between items-center">
              <CardTitle className="text-sm font-medium font-body">Confirmed volunteers</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">{summary.confirmed}</p>
              <p className="text-xs text-muted-foreground font-body">
                Ready to be onboarded
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-lg border bg-card/70 p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Tabs
              value={listingStatusFilter}
              onValueChange={(value) =>
                setListingStatusFilter(value as "all" | "open" | "shortlisting" | "archived")
              }
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2 md:inline-flex md:w-auto">
                {statusTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="font-body">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="flex w-full items-center justify-between gap-3 md:w-auto">
              <span className="text-sm font-medium text-muted-foreground font-body">Sort by</span>
              <Select
                value={listingSort}
                onValueChange={(value) =>
                  setListingSort(value as "date_asc" | "date_desc" | "applications_desc" | "applications_asc")
                }
              >
                <SelectTrigger className="w-full md:w-[220px]">
                  <SelectValue placeholder="Choose sort order" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="font-body">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">Your listings</CardTitle>
            <CardDescription className="font-body">
              Progress for every CSP you currently oversee.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {displayListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-muted-foreground/40 bg-muted/40 py-12 text-center">
                <ClipboardList className="h-10 w-10 text-muted-foreground" />
                <div>
                  <h3 className="font-heading text-lg text-foreground">No listings in this view yet</h3>
                  <p className="text-sm text-muted-foreground font-body">
                    Try switching to a different status or create a new listing to get started.
                  </p>
                </div>
              </div>
            ) : (
              displayListings.map((listing) => {
                const fillPercentage = Math.round(
                  (Math.min(listing.applications, listing.slots) / listing.slots) * 100,
                );
                const fillTone = getFillTone(fillPercentage);
                const fillBadgeTone = getFillBadgeTone(fillPercentage);
                const fillLabel = getFillLabel(fillPercentage);

                return (
                  <div
                    key={listing.id}
                    className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm transition-all"
                  >
                    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_240px] lg:grid-cols-[minmax(0,1fr)_280px]">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-heading text-xl font-semibold text-foreground">{listing.title}</h3>
                          <Badge variant="secondary" className="font-medium capitalize">
                            {listing.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground font-body">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-muted-foreground" /> {listing.location}
                            </span>
                            <span className="hidden h-4 w-px bg-border md:block" />
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="h-4 w-4 text-muted-foreground" /> {listing.startDate} – {listing.endDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {listing.slots} volunteer slots
                              {fillPercentage >= 100 ? " (Waitlist only)" : ""}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {listing.highlights.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                            >
                              {getTagIcon(tag)}
                              <span>{tag}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 md:items-end">
                        <div className="w-full rounded-xl border bg-background/90 p-3 shadow-sm">
                          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            <span>{fillPercentage}% filled</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${fillBadgeTone}`}>
                              {fillLabel}
                            </span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${fillTone}`}
                              style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                            />
                          </div>
                          <p className="mt-2 text-sm font-medium text-foreground">
                            {listing.applications}
                            <span className="text-muted-foreground font-body"> / {listing.slots} volunteers</span>
                          </p>
                        </div>
                        <div className="flex w-full flex-wrap gap-2 md:justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              to="/organisations/$projectId"
                              params={{ projectId: listing.id }}
                            >
                              View listing
                            </Link>
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleUpdateListing(listing.title)}
                            aria-label={`Update ${listing.title}`}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Update listing</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteListing(listing.title)}
                            aria-label={`Delete ${listing.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete listing</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* <div id="applications">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Applications</CardTitle>
              <CardDescription className="font-body">
                Review every volunteer who has applied for your listings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as ApplicationStatus | "all")}
                className="space-y-4"
              >
                <TabsList>
                  <TabsTrigger value="all">All ({countFor("all")})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({countFor("pending")})</TabsTrigger>
                  <TabsTrigger value="shortlisted">Shortlisted ({countFor("shortlisted")})</TabsTrigger>
                  <TabsTrigger value="confirmed">Confirmed ({countFor("confirmed")})</TabsTrigger>
                </TabsList>
                {(["all", "pending", "shortlisted", "confirmed"] as const).map((key) => {
                  const dataset = filteredApplications(key === "all" ? "all" : (key as ApplicationStatus));
                  return (
                    <TabsContent key={key} value={key}>
                      <ScrollArea className="max-h-[420px] rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[220px] font-body">Applicant</TableHead>
                              <TableHead className="font-body">Listing</TableHead>
                              <TableHead className="font-body">Submitted</TableHead>
                              <TableHead className="font-body">Status</TableHead>
                              <TableHead className="text-right font-body">Contact</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {dataset.map((application) => (
                              <TableRow key={application.id}>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="font-medium font-body text-foreground">{application.applicant}</span>
                                    <span className="text-xs text-muted-foreground font-body">#{application.id}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="font-body">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-foreground">{application.listingTitle}</span>
                                    <span className="text-xs text-muted-foreground">Listing ID: {application.listingId}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="font-body">{application.submittedOn}</TableCell>
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${applicationStatusConfig[application.status].tone}`}
                                  >
                                    {applicationStatusConfig[application.status].label}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm" className="text-sm font-body" asChild>
                                    <Link
                                      to="/applicants/$applicantId"
                                      params={{ applicantId: application.applicantId }}
                                      search={{ from: "leader-dashboard" }}
                                      className="inline-flex items-center gap-2"
                                    >
                                      <Contact className="h-4 w-4" />
                                      View profile
                                    </Link>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {dataset.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground font-body">
                            <ClipboardList className="mb-2 h-10 w-10" />
                            <p>No applications match this filter yet.</p>
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </div> */}
        </div>
      </div>
    </div>
  );
}
