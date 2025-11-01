import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState, useEffect } from "react";
import { Button } from "#client/components/ui/button";
import { Badge } from "#client/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#client/components/ui/select";
import { Users, ClipboardList, Clock, CheckCircle2, Plus, Calendar, MapPin, Edit, Trash2, CalendarClock, Sun, Leaf, Home, HeartHandshake, GraduationCap, BookOpen, Tag, Search } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchOrgDashboard, fetchOrgListings } from "#client/api/organisations/dashboard.ts";
import { Input } from "#client/components/ui/input";

export const Route = createFileRoute("/organisations/dashboard")({
  component: OrgDashboard,
});

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
  console.log("listingsData:", listingsData);


  // Count of listings for each status
  const listingCounts = useMemo(() => {
    const counts = { open: 0, shortlisting: 0, ongoing: 0, archived: 0 };
    const baseListings = listingsData?.listings ?? [];

    baseListings.forEach((listing: { status: string; [key: string]: any }) => {
      if (counts.hasOwnProperty(listing.status)) {
        counts[listing.status as keyof typeof counts]++;
      }
    });

    return counts;
  }, [listingsData]);

  // --- State ---
  const [listingStatusFilter, setListingStatusFilter] =
    useState<"open" | "shortlisting" | "ongoing" | "archived">("open");
  const [listingSort, setListingSort] = useState<
    "date_asc" | "date_desc" | "applications_desc" | "applications_asc"
  >("date_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Status Tabs ---
  const statusTabs = useMemo(
    () => [
      { value: "open" as const, label: `Open (${listingCounts.open})` },
      { value: "shortlisting" as const, label: `Shortlisting (${listingCounts.shortlisting})` },
      { value: "ongoing" as const, label: `Ongoing (${listingCounts.ongoing})` },
      { value: "archived" as const, label: `Archived (${listingCounts.archived})` },
    ],
    [listingCounts]
  );

  //Search Box
  const [searchTerm, setSearchTerm] = useState("");

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
      (listing: { status: string; startDate: string; volunteerCount: number; title: string; [key: string]: any }) => {
        const matchesStatus = listing.status === listingStatusFilter;
        const matchesSearch = searchTerm === "" || 
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.district?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
      }
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
  }, [listingSort, listingStatusFilter, searchTerm, listingsData]);

  // Pagination logic
  const totalPages = Math.ceil(displayListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = displayListings.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [listingStatusFilter, listingSort, searchTerm]);

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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Organisation Dashboard
                </h1>
                <p className="text-muted-foreground font-body text-lg">
                  Create listings, keep track of applications, and manage your volunteer pipeline
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button className="inline-flex items-center gap-2" onClick={handleCreateListing}>
                  <Plus className="mr-2 h-4 w-4" />
                    Create New Listing
                </Button>
              </div>
            </div>
        </div>
      </div>
      

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-8">

        {/* Top metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold mt-2 mb-7 sm:mt-0 sm:mb-4 lg:mt-3 lg:mb-6 xl:mt-0 xl:mb-4">Active Listings</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{summary.listings}</CardTitle>
                </div>
                <div className="hidden sm:block bg-blue-100 rounded-full p-3 ml-4">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardHeader>
             <CardContent className="pt-0 pb-0">
              <div className="text-xs text-muted-foreground font-body">
                Opened opportunities
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">Total Applications</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{summary.totalApplications}</CardTitle>
                </div>
                <div className="hidden sm:block bg-green-100 rounded-full p-3 ml-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardHeader>
             <CardContent className="pt-0 pb-0">
              <div className="text-xs text-muted-foreground font-body">
                Across every listing
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold mt-2 mb-7 sm:mt-0 sm:mb-4 lg:mt-3 lg:mb-6 xl:mt-0 xl:mb-4">Pending Reviews</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{summary.pending}</CardTitle>
                </div>
                <div className="hidden sm:block bg-orange-100 rounded-full p-3 ml-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardHeader>
             <CardContent className="pt-0 pb-0">
              <div className="text-xs text-muted-foreground font-body">
                Waiting for your decision
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="font-body mb-4 font-semibold">Confirmed Volunteers</CardDescription>
                  <CardTitle className="font-heading text-3xl text-primary">{summary.confirmed}</CardTitle>
                </div>
                <div className="hidden sm:block bg-purple-100 rounded-full p-3 ml-4">
                  <CheckCircle2 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardHeader>
             <CardContent className="pt-0 pb-0">
              <div className="text-xs text-muted-foreground font-body">
                Ready to be onboarded
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organisation's Listings */}

        <div className="pb-4">
          {/* <div className="flex flex-wrap items-center gap-3 md:justify-between"> */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="font-heading text-2xl">Your Listings</h2>
              <p className="font-body mt-2 text-muted-foreground">
                Progress for every project you currently oversee
              </p>
            </div>

            
            {/* <div className="flex flex-wrap items-center gap-3 justify-between relative w-full md:w-auto"> */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="relative w-full md:max-w-[360px] lg:max-w-[420px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>

              
              <span className="flex flex-row justify-end items-center gap-2 text-sm font-medium text-foreground font-body whitespace-nowrap">
                Sort By
                <Select
                  value={listingSort}
                  onValueChange={(value) =>
                    setListingSort(
                      value as "date_asc" | "date_desc" | "applications_desc" | "applications_asc"
                    )
                  }
                >
                  <SelectTrigger className="w-full md:w-[220px] font-normal">
                    <SelectValue placeholder="Choose sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="font-body font-normal">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </span>
            </div>
            
          </div>
        
          <Tabs
            value={listingStatusFilter}
            onValueChange={(value) =>
              setListingStatusFilter(value as "open" | "shortlisting" | "ongoing" | "archived")
            }
            className="w-full mt-6"
          >
            <TabsList className="h-auto grid w-full grid-cols-2 md:h-9 md:inline-flex md:w-auto">
              {statusTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="font-body">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Filters */}
        {/* <div className="rounded-lg border bg-card/70 p-4 shadow-sm mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Tabs
              value={listingStatusFilter}
              onValueChange={(value) =>
                setListingStatusFilter(value as "open" | "shortlisting" | "ongoing" | "archived")
              }
              className="w-full md:w-auto"
            >
              <TabsList className="h-auto grid w-full grid-cols-2 md:h-9 md:inline-flex md:w-auto">
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
        </div> */}

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
          <>
          {currentListings.map((listing) => {
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
                          View Listing
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
            })}

            {displayListings.length > 0 && (
              <div className="mt-8 pb-12">
                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm text-muted-foreground font-body">
                    Showing {startIndex + 1}-{Math.min(endIndex, displayListings.length)} of {displayListings.length} results
                  </p>
                  
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Listings */}
        {/* <Card>
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
        </Card> */}
      </div>
    </div>
    </div>
  );
}