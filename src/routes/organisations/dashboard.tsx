import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock,
  GraduationCap,
  HeartHandshake,
  Home,
  Leaf,
  MapPin,
  Plus,
  Search,
  Sun,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  fetchOrgDashboard,
  fetchOrgListings,
} from "#client/api/organisations/dashboard.ts";
import { deleteOrganisationProject } from "#client/api/organisations/listing.ts";
import { Badge } from "#client/components/ui/badge";
import { Button } from "#client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#client/components/ui/card";
import { Input } from "#client/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#client/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "#client/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/organisations/dashboard")({
  component: OrgDashboard,
});

function OrgDashboard() {
  const navigate = useNavigate();

  // Dashboard summary
  const {
    data: summary,
    isLoading,
    isError,
  } = useQuery({
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
  // console.log("listingsData:", listingsData);

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
  const [listingStatusFilter, setListingStatusFilter] = useState<
    "open" | "shortlisting" | "ongoing" | "archived"
  >("open");
  const [listingSort, setListingSort] = useState<
    "date_asc" | "date_desc" | "applications_desc" | "applications_asc"
  >("date_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);


  // --- Status Tabs ---
  const statusTabs = useMemo(
    () => [
      { value: "open" as const, label: `Open (${listingCounts.open})` },
      {
        value: "shortlisting" as const,
        label: `Shortlisting (${listingCounts.shortlisting})`,
      },
      {
        value: "ongoing" as const,
        label: `Ongoing (${listingCounts.ongoing})`,
      },
      {
        value: "archived" as const,
        label: `Archived (${listingCounts.archived})`,
      },
    ],
    [listingCounts],
  );

  //Search Box
  const [searchTerm, setSearchTerm] = useState("");

  // --- Sort Options ---
  const sortOptions = useMemo(
    () => [
      { value: "date_asc" as const, label: "Start date · Soonest" },
      { value: "date_desc" as const, label: "Start date · Latest" },
      {
        value: "applications_desc" as const,
        label: "Volunteers · High to low",
      },
      { value: "applications_asc" as const, label: "Volunteers · Low to high" },
    ],
    [],
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

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteOrganisationProject,
    onSuccess: (_, projectId) => {
      toast.success("Listing deleted", {
        description: "Project removed successfully.",
      });
      // Invalidate listings to refetch updated list
      queryClient.invalidateQueries({ queryKey: ["orgListings"] });
    },
    onError: (err: any) => {
      toast.error("Failed to delete listing", { description: err.message });
    },
  });

  const handleDeleteListing = useCallback(
  (projectId: string, title: string) => {
    setDeleteTarget({ id: projectId, title });
  },
  []
);

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
      (listing: {
        status: string;
        startDate: string;
        volunteerCount: number;
        title: string;
        [key: string]: any;
      }) => {
        const matchesStatus = listing.status === listingStatusFilter;
        const matchesSearch =
          searchTerm === "" ||
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.organization
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          listing.district?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
      },
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
    return (
      <div className="text-muted-foreground p-8 text-lg">
        Loading dashboard...
      </div>
    );

  if (isError || listingsError || !summary)
    return (
      <div className="p-8 text-lg text-red-500">
        Failed to load dashboard data.
      </div>
    );

  // --- Render ---
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-heading text-foreground mb-4 text-3xl font-bold md:text-4xl">
                Organisation Dashboard
              </h1>
              <p className="text-muted-foreground font-body text-lg">
                Create listings, keep track of applications, and manage your
                volunteer pipeline
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button
                className="inline-flex items-center gap-2"
                onClick={handleCreateListing}
              >
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
          <div className="mb-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardDescription className="font-body mt-2 mb-4 mb-7 font-semibold sm:mt-0 sm:mb-4 lg:mt-3 lg:mb-6 xl:mt-0 xl:mb-4">
                      Active Listings
                    </CardDescription>
                    <CardTitle className="font-heading text-primary text-3xl">
                      {summary.listings}
                    </CardTitle>
                  </div>
                  <div className="ml-4 hidden rounded-full bg-blue-100 p-3 sm:block">
                    <ClipboardList className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-0">
                <div className="text-muted-foreground font-body text-xs">
                  Opened opportunities
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardDescription className="font-body mb-4 font-semibold">
                      Total Applications
                    </CardDescription>
                    <CardTitle className="font-heading text-primary text-3xl">
                      {summary.totalApplications}
                    </CardTitle>
                  </div>
                  <div className="ml-4 hidden rounded-full bg-green-100 p-3 sm:block">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-0">
                <div className="text-muted-foreground font-body text-xs">
                  Across every listing
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardDescription className="font-body mt-2 mb-4 mb-7 font-semibold sm:mt-0 sm:mb-4 lg:mt-3 lg:mb-6 xl:mt-0 xl:mb-4">
                      Pending Reviews
                    </CardDescription>
                    <CardTitle className="font-heading text-primary text-3xl">
                      {summary.pending}
                    </CardTitle>
                  </div>
                  <div className="ml-4 hidden rounded-full bg-orange-100 p-3 sm:block">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-0">
                <div className="text-muted-foreground font-body text-xs">
                  Waiting for your decision
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardDescription className="font-body mb-4 font-semibold">
                      Confirmed Volunteers
                    </CardDescription>
                    <CardTitle className="font-heading text-primary text-3xl">
                      {summary.confirmed}
                    </CardTitle>
                  </div>
                  <div className="ml-4 hidden rounded-full bg-purple-100 p-3 sm:block">
                    <CheckCircle2 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-0">
                <div className="text-muted-foreground font-body text-xs">
                  Ready to be onboarded
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Organisation's Listings */}

          <div className="pb-4">
            {/* <div className="flex flex-wrap items-center gap-3 md:justify-between"> */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
              <div>
                <h2 className="font-heading text-2xl">Your Listings</h2>
                <p className="font-body text-muted-foreground mt-2">
                  Progress for every project you currently oversee
                </p>
              </div>

              {/* <div className="flex flex-wrap items-center gap-3 justify-between relative w-full md:w-auto"> */}
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-[360px] lg:max-w-[420px]">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="Search listings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 pr-4 pl-10"
                  />
                </div>

                <span className="text-foreground font-body flex flex-row items-center justify-end gap-2 text-sm font-medium whitespace-nowrap">
                  Sort By
                  <Select
                    value={listingSort}
                    onValueChange={(value) =>
                      setListingSort(
                        value as
                          | "date_asc"
                          | "date_desc"
                          | "applications_desc"
                          | "applications_asc",
                      )
                    }
                  >
                    <SelectTrigger className="w-full font-normal md:w-[220px]">
                      <SelectValue placeholder="Choose sort order" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="font-body font-normal"
                        >
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
                setListingStatusFilter(
                  value as "open" | "shortlisting" | "ongoing" | "archived",
                )
              }
              className="mt-6 w-full"
            >
              <TabsList className="grid h-auto w-full grid-cols-2 md:inline-flex md:h-9 md:w-auto">
                {statusTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="font-body"
                  >
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
            <div className="border-muted-foreground/40 bg-muted/40 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-12 text-center">
              <ClipboardList className="text-muted-foreground h-10 w-10" />
              <div>
                <h3 className="font-heading text-foreground text-lg">
                  No listings in this view yet
                </h3>
                <p className="text-muted-foreground font-body text-sm">
                  Try switching to a different status or create a new listing to
                  get started.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className="max-h-[600px] space-y-6 overflow-x-hidden overflow-y-auto"
                style={{
                  overscrollBehavior: "contain",
                }}
                onWheel={(e) => {
                  const target = e.currentTarget;
                  const { scrollTop, scrollHeight, clientHeight } = target;
                  const isAtTop = scrollTop === 0;
                  const isAtBottom =
                    scrollTop + clientHeight >= scrollHeight - 1;

                  // Prevent page scroll if we can scroll within the container
                  if (
                    (e.deltaY < 0 && !isAtTop) ||
                    (e.deltaY > 0 && !isAtBottom)
                  ) {
                    e.stopPropagation();
                    e.preventDefault();
                    // Manually scroll the container
                    target.scrollTop += e.deltaY;
                  }
                }}
              >
                {currentListings.map((listing) => {
                  const fillPercentage = Math.round(
                    (Math.min(listing.volunteerCount, listing.slotsTotal) /
                      listing.slotsTotal) *
                      100,
                  );
                  const fillTone = getFillTone(fillPercentage);
                  const fillBadgeTone = getFillBadgeTone(fillPercentage);
                  const fillLabel = getFillLabel(fillPercentage);

                  return (
                    <div
                      key={listing.id}
                      className="border-border/60 bg-card/60 rounded-2xl border p-5 shadow-sm transition-all"
                    >
                      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_240px] lg:grid-cols-[minmax(0,1fr)_280px]">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-heading text-foreground text-xl font-semibold">
                              {listing.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="font-medium capitalize"
                            >
                              {listing.status}
                            </Badge>
                          </div>

                          <div className="text-muted-foreground font-body space-y-2 text-sm">
                            <div className="flex flex-wrap items-center gap-3">
                              {!listing.isRemote && (
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="text-muted-foreground h-4 w-4" />
                                  {listing.type === "overseas"
                                    ? listing.country || "—"
                                    : listing.district || "—"}
                                </span>
                              )}
                              <span className="bg-border hidden h-4 w-px md:block" />
                              <span className="inline-flex items-center gap-1.5">
                                <Calendar className="text-muted-foreground h-4 w-4" />{" "}
                                {listing.repeatInterval === 0
                                  ? listing.startDate?.slice(0, 10)
                                  : `${listing.startDate?.slice(0, 10)} – ${listing.endDate?.slice(0, 10)}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="text-muted-foreground h-4 w-4" />
                              <span>
                                {listing.slotsTotal} volunteer slots
                                {fillPercentage >= 100
                                  ? " (Waitlist only)"
                                  : ""}
                              </span>
                            </div>
                          </div>

                          {listing.projectTags?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {listing.projectTags.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="bg-muted text-muted-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                                >
                                  {getTagIcon(tag)}
                                  <span>{tag}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-4 md:items-end">
                          <div className="bg-background/90 w-full rounded-xl border p-3 shadow-sm">
                            <div className="text-muted-foreground flex items-center justify-between text-xs font-medium tracking-wide uppercase">
                              <span>{fillPercentage}% filled</span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${fillBadgeTone}`}
                              >
                                {fillLabel}
                              </span>
                            </div>
                            <div className="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${fillTone}`}
                                style={{
                                  width: `${Math.min(fillPercentage, 100)}%`,
                                }}
                              />
                            </div>
                            <p className="text-foreground mt-2 text-sm font-medium">
                              {listing.volunteerCount}
                              <span className="text-muted-foreground font-body">
                                {" "}
                                / {listing.slotsTotal} volunteers
                              </span>
                            </p>
                          </div>

                          <div className="flex w-full flex-wrap gap-2 md:justify-end">
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                to="/organisations/$projectId"
                                params={{ projectId: listing.id }}
                              >
                                View Listing
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeleteListing(listing.id, listing.title)
                              }
                              aria-label={`Delete ${listing.title}`}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {displayListings.length > 0 && (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-muted-foreground font-body text-sm">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, displayListings.length)} of{" "}
                    {displayListings.length}{" "}
                    {displayListings.length === 1 ? "result" : "results"}
                  </p>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={
                              page === currentPage ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="h-8 w-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-500 h-5 w-5" />
              <DialogTitle>Delete Project</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.title}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) {
                  deleteMutation.mutate(deleteTarget.id);
                  setDeleteTarget(null);
                }
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}