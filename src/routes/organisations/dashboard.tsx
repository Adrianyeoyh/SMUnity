import { createFileRoute, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "#client/components/ui/button";
import { Badge } from "#client/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Separator } from "#client/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#client/components/ui/select";
import { Users, ClipboardList, Clock, CheckCircle2, Plus, Calendar, MapPin, Edit, Trash2, CalendarClock, Sun, Leaf, Home, HeartHandshake, GraduationCap, BookOpen, Tag, Contact } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchOrgDashboard, fetchOrgListings } from "#client/api/organisations/dashboard.ts";

export const Route = createFileRoute("/organisations/dashboard")({
  component: OrgDashboard,
});

type ApplicationStatus = "pending" | "shortlisted" | "confirmed" | "rejected";

function OrgDashboard() {
  const navigate = useNavigate();

  // Dashboard summary
  const { data: summary, isLoading, isError } = useQuery({
    queryKey: ["orgDashboard"],
    queryFn: fetchOrgDashboard,
  });

  // Listings from backend
  const {
    data: listingsData,
    isLoading: listingsLoading,
    isError: listingsError,
  } = useQuery({
    queryKey: ["orgListings"],
    queryFn: fetchOrgListings,
  });

  // --- State ---
  const [listingStatusFilter, setListingStatusFilter] =
    useState<"open" | "shortlisting" | "ongoing" | "archived">("open");
  const [listingSort, setListingSort] = useState<
    "date_asc" | "date_desc" | "applications_desc" | "applications_asc"
  >("date_asc");

  // --- Status Tabs ---
  const statusTabs = useMemo(
    () => [
      { value: "open" as const, label: "Open" },
      { value: "shortlisting" as const, label: "Shortlisting" },
      { value: "ongoing" as const, label: "Ongoing" },
      { value: "archived" as const, label: "Archived" },
    ],
    []
  );

  // --- Sort Options ---
  const sortOptions = useMemo(
    () => [
      { value: "date_asc" as const, label: "Start date · Soonest" },
      { value: "date_desc" as const, label: "Start date · Latest" },
      { value: "applications_desc" as const, label: "Volunteers · High to low" },
      { value: "applications_asc" as const, label: "Volunteers · Low to high" },
    ],
    []
  );

  // --- UI Helper Functions ---
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

  // --- Listings filtering + sorting ---
  const displayListings = useMemo(() => {
    const baseListings = listingsData?.listings ?? [];
    const filtered = baseListings.filter(
      (listing) => listing.status === listingStatusFilter
    );

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      switch (listingSort) {
        case "date_desc":
          return dateB - dateA;
        case "applications_desc":
          return b.volunteerCount - a.volunteerCount;
        case "applications_asc":
          return a.volunteerCount - b.volunteerCount;
        case "date_asc":
        default:
          return dateA - dateB;
      }
    });

    return sorted;
  }, [listingSort, listingStatusFilter, listingsData]);

  // --- Loading / Error States ---
  if (isLoading || listingsLoading)
    return <div className="p-8 text-muted-foreground text-lg">Loading dashboard...</div>;

  if (isError || listingsError || !summary)
    return <div className="p-8 text-red-500 text-lg">Failed to load dashboard data.</div>;

  // --- Render ---
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
        {/* Top metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2 flex justify-between items-center">
              <CardTitle className="text-sm font-medium font-body">Active listings</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">{summary.listings}</p>
              <p className="text-xs text-muted-foreground font-body">Currently published opportunities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex justify-between items-center">
              <CardTitle className="text-sm font-medium font-body">Total applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">{summary.totalApplications}</p>
              <p className="text-xs text-muted-foreground font-body">Across every listing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex justify-between items-center">
              <CardTitle className="text-sm font-medium font-body">Pending review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">{summary.pending}</p>
              <p className="text-xs text-muted-foreground font-body">Waiting for your decision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex justify-between items-center">
              <CardTitle className="text-sm font-medium font-body">Confirmed volunteers</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">{summary.confirmed}</p>
              <p className="text-xs text-muted-foreground font-body">Ready to be onboarded</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="rounded-lg border bg-card/70 p-4 shadow-sm mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Tabs
              value={listingStatusFilter}
              onValueChange={(value) =>
                setListingStatusFilter(value as "open" | "shortlisting" | "ongoing" | "archived")
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
                  setListingSort(
                    value as "date_asc" | "date_desc" | "applications_desc" | "applications_asc"
                  )
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

        {/* Listings */}
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
                  (Math.min(listing.volunteerCount, listing.slotsTotal) / listing.slotsTotal) * 100
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
                          <h3 className="font-heading text-xl font-semibold text-foreground">
                            {listing.title}
                          </h3>
                          <Badge variant="secondary" className="font-medium capitalize">
                            {listing.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground font-body">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-muted-foreground" /> {listing.district}
                            </span>
                            <span className="hidden h-4 w-px bg-border md:block" />
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="h-4 w-4 text-muted-foreground" />{" "}
                              {listing.startDate?.slice(0, 10)} – {listing.endDate?.slice(0, 10)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {listing.slotsTotal} volunteer slots
                              {fillPercentage >= 100 ? " (Waitlist only)" : ""}
                            </span>
                          </div>
                        </div>

                        {listing.projectTags?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {listing.projectTags.map((tag: string) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                              >
                                {getTagIcon(tag)}
                                <span>{tag}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-4 md:items-end">
                        <div className="w-full rounded-xl border bg-background/90 p-3 shadow-sm">
                          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            <span>{fillPercentage}% filled</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${fillBadgeTone}`}
                            >
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
                            {listing.volunteerCount}
                            <span className="text-muted-foreground font-body">
                              {" "}
                              / {listing.slotsTotal} volunteers
                            </span>
                          </p>
                        </div>

                        <div className="flex w-full flex-wrap gap-2 md:justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/organisations/$projectId" params={{ projectId: listing.id }}>
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
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteListing(listing.title)}
                            aria-label={`Delete ${listing.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
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
      </div>
    </div>
    </div>
  );
}