import { useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import {
  Calendar,
  Clock,
  Grid3x3,
  Heart,
  List,
  Loader2,
  Map as MapIcon,
  MapPin,
  Navigation,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { fetchDiscoverProjects } from "#client/api/public/discover.ts";
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
import { Label } from "#client/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#client/components/ui/select";
import { env } from "#client/env.ts";
// import { useMe } from "#client/api/hooks.ts";
import { useAuth } from "#client/hooks/use-auth.ts";
import {
  fetchSavedProjects,
  fetchSaveProject,
  fetchUnsaveProject,
} from "../api/student";
import { CATEGORY_OPTIONS, DISTRICT_REGION_MAP } from "../helper";

// import type { MapTypeStyle, LatLngLiteral, Map as GoogleMapInstance } from "google.maps";
type MapTypeStyle = google.maps.MapTypeStyle;
type LatLngLiteral = google.maps.LatLngLiteral;
type GoogleMapInstance = google.maps.Map;

async function extractCoordsFromGoogleMapsUrl(
  url: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    if (url.includes("goo.gl") || url.includes("maps.app.goo.gl")) {
      console.warn(
        "Shortened URL detected, needs manual coordinate extraction:",
        url,
      );
      return null;
    }

    // Google maps link shld be with coordinates like this:  https://www.google.com/maps/place/.../@LAT,LNG,ZOOM
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2]),
      };
    }

    const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
      return {
        lat: parseFloat(qMatch[1]),
        lng: parseFloat(qMatch[2]),
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to extract coordinates from URL:", error);
    return null;
  }
}

export const Route = createFileRoute("/discover")({
  component: DiscoverCSPs,
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    q?: string;
    category?: string;
    type?: string;
    location?: string;
    sortBy?: string;
    startDate?: string;
    endDate?: string;
    durations?: string;
    showMore?: string;
    showMap?: string;
  } => {
    return {
      q: (search.q as string) || "",
      category: (search.category as string) || "all",
      type: (search.type as string) || "all",
      location: (search.location as string) || "all",
      sortBy: (search.sortBy as string) || "relevance",
      startDate: (search.startDate as string) || "",
      endDate: (search.endDate as string) || "",
      durations: (search.durations as string) || "",
      showMore: (search.showMore as string) || "false",
      showMap: (search.showMap as string) || "false",
    };
  },
});

type CspLocation = {
  id: string;
  title: string;
  organisation: string;
  location: string;
  category: string;
  type?: "local" | "overseas";
  startDate: string;
  endDate?: string;
  duration: string;
  serviceHours: number;
  maxVolunteers: number;
  currentVolunteers: number;
  latitude?: number | null;
  longitude?: number | null;
  isRemote: boolean;
  status: string;
  applicationDeadline: string;
  description: string;
  skills: string[];
  tags: string[];
  timeStart?: string | null;
  timeEnd?: string | null;
  daysOfWeek?: string[] | null;
};

const MINIMAL_MAP_STYLE: MapTypeStyle[] = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "poi.medical", stylers: [{ visibility: "off" }] },
  { featureType: "poi.school", stylers: [{ visibility: "off" }] },
  { featureType: "poi.place_of_worship", stylers: [{ visibility: "off" }] },
  { featureType: "poi.government", stylers: [{ visibility: "off" }] },
  { featureType: "poi.sports_complex", stylers: [{ visibility: "off" }] },
  { featureType: "poi.attraction", stylers: [{ visibility: "off" }] },
  {
    featureType: "poi.park",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
];

// Helper function to get category color
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Community: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    Mentoring: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    Environment: "bg-green-100 text-green-700 hover:bg-green-200",
    Elderly: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    "Arts & Culture": "bg-pink-100 text-pink-700 hover:bg-pink-200",
    "Animal Welfare": "bg-rose-100 text-rose-700 hover:bg-rose-200",
    "Sports & Leisure": "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    Coding: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
  };
  return colors[category] || "bg-gray-100 text-gray-700 hover:bg-gray-200";
};

// Helper function to get status color and text
const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    open: {
      label: "Open",
      className: "bg-green-500 hover:bg-green-600 text-white",
    },
    "closing-soon": {
      label: "Closing Soon",
      className: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    full: {
      label: "Full",
      className: "bg-gray-500 hover:bg-gray-600 text-white",
    },
    closed: {
      label: "Closed",
      className: "bg-red-500 hover:bg-red-600 text-white",
    },
  };
  return statusConfig[status] || statusConfig["open"];
};

// Helper function to format date range
const formatDateRange = (startDate: string, endDate?: string) => {
  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!endDate || startDate === endDate) {
    return formatDate(startDate);
  }
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

function formatScheduleFromFields(csp: CspLocation): string {
  const { timeStart, timeEnd, daysOfWeek } = csp;

  const to12h = (hhmmss?: string | null) => {
    if (!hhmmss) return null;
    const [hh, mm] = hhmmss.split(":");
    const d = new Date();
    d.setHours(Number(hh), Number(mm), 0, 0);
    return d.toLocaleTimeString("en-SG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    // examples: "8:30 AM"
  };

  const start = to12h(timeStart);
  const end = to12h(timeEnd);
  const timePart = start && end ? `${start} – ${end}` : start || end || "";

  const daysPart = daysOfWeek && daysOfWeek.length ? daysOfWeek.join(", ") : "";

  return [timePart, daysPart].filter(Boolean).join(", ");
}

function DiscoverCSPs() {
  const queryClient = useQueryClient();

  const {
    data: cspLocations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["discover-projects"],
    queryFn: fetchDiscoverProjects,
  });

  const { user, isLoggedIn } = useAuth();
  const isStudent = user?.accountType === "student";

  const { data: savedData = { saved: [] } } = useQuery({
    queryKey: ["saved-projects"],
    queryFn: fetchSavedProjects,
    enabled: isStudent && user !== undefined, // runs once auth context is resolved
    staleTime: 60_000, // optional: 1 min cache
    retry: 1,
  });

  const savedIds = useMemo(
    () =>
      new Set((savedData?.saved || []).map((s: any) => s.projectId || s.id)),
    [savedData?.saved?.length],
  );

  const [tempSavedIds, setTempSavedIds] = useState<Set<string>>(new Set());
  const [glitteringProjectId, setGlitteringProjectId] = useState<string | null>(
    null,
  );

  const handleToggleSave = async (projectId: string) => {
    try {
      if (!isLoggedIn) return toast.error("Please log in to save CSPs");
      if (!isStudent) return toast.error("Only students can save CSPs");

      const currentlySaved =
        savedIds.has(projectId) || tempSavedIds.has(projectId);

      // Optimistic UI update
      setTempSavedIds((prev) => {
        const next = new Set(prev);
        if (currentlySaved) next.delete(projectId);
        else next.add(projectId);
        return next;
      });

      if (currentlySaved) {
        await fetchUnsaveProject(projectId);
        toast.success("Removed from favourites");
      } else {
        await fetchSaveProject(projectId);
        toast.success("Added to favourites");
        // Trigger glitter animation when adding to favourites
        if (!currentlySaved) {
          setGlitteringProjectId(projectId);
          setTimeout(() => setGlitteringProjectId(null), 600);
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["saved-projects"] });
    } catch (err) {
      toast.error("Failed to update favourites");
    }
  };

  useEffect(() => {
    if (isStudent && isLoggedIn)
      queryClient.invalidateQueries({ queryKey: ["saved-projects"] });
  }, [isLoggedIn, isStudent]);

  useEffect(() => {
    console.log("Saved projects:", savedData);
  }, [savedData]);

  const navigate = useNavigate({ from: "/discover" });
  const searchParams = useSearch({ from: "/discover" });

  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.category || "all",
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.q || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMap, setShowMap] = useState(searchParams.showMap === "true");
  const [showMoreFilters, setShowMoreFilters] = useState(
    searchParams.showMore === "true",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Advanced filters - Initialize from URL params
  const [typeFilter, setTypeFilter] = useState(searchParams.type || "all");
  const [locationFilter, setLocationFilter] = useState(
    searchParams.location || "all",
  );
  const [sortBy, setSortBy] = useState(searchParams.sortBy || "relevance");
  const [startDate, setStartDate] = useState(searchParams.startDate || "");
  const [endDate, setEndDate] = useState(searchParams.endDate || "");
  const [selectedDurations, setSelectedDurations] = useState<string[]>(
    searchParams.durations
      ? searchParams.durations.split(",").filter(Boolean)
      : [],
  );

  // Update URL with current filter state
  const updateURL = (updates: Partial<typeof searchParams>) => {
    const newParams = {
      q: searchQuery,
      category: selectedCategory,
      type: typeFilter,
      location: locationFilter,
      sortBy: sortBy,
      startDate: startDate,
      endDate: endDate,
      durations: selectedDurations.join(","),
      showMore: showMoreFilters.toString(),
      showMap: showMap.toString(),
      ...updates,
    };

    // Remove empty values
    Object.keys(newParams).forEach((key) => {
      if (
        newParams[key as keyof typeof newParams] === "" ||
        newParams[key as keyof typeof newParams] === "all" ||
        newParams[key as keyof typeof newParams] === "false"
      ) {
        delete newParams[key as keyof typeof newParams];
      }
    });

    navigate({ search: newParams as any, replace: true });
  };

  const locations = [
    "all",
    "North",
    "North-East",
    "East",
    "West",
    "Central",
    "Remote",
  ];

  // Mock data for demonstration
  if (isLoading)
    return (
      <div className="text-muted-foreground p-12 text-center">
        <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
        Loading available projects…
      </div>
    );

  if (isError)
    return (
      <div className="text-destructive p-12 text-center">
        Failed to load projects. Please try again later.
      </div>
    );

  const categories = [
    "all",
    "Community",
    "Mentoring",
    "Environment",
    "Elderly",
    "Arts & Culture",
    "Animal Welfare",
    "Sports & Leisure",
    "Coding",
  ];

  // Filtering for CSP
  const filteredCSPs = cspLocations.filter((csp) => {
    // Category filter
    const matchesCategory =
      selectedCategory === "all" || csp.category === selectedCategory;

    // Type filter
    const cspType = (csp as any).type || "local"; // Default to local if not specified
    const matchesType = typeFilter === "all" || cspType === typeFilter;

    // Search query
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      csp.title.toLowerCase().includes(query) ||
      csp.organisation.toLowerCase().includes(query) ||
      csp.location.toLowerCase().includes(query) ||
      csp.category.toLowerCase().includes(query) ||
      csp.description.toLowerCase().includes(query) ||
      csp.skills.some((skill) => skill.toLowerCase().includes(query)) ||
      (csp.tags && csp.tags.some((tag) => tag.toLowerCase().includes(query)));

    // Location filter - only apply if type is "local" or "all" (or if location is "Remote")
    console.log(csp.location);

    const region = DISTRICT_REGION_MAP[csp.location ?? ""] || "Unknown";
    const matchesLocation =
      locationFilter === "all" ||
      locationFilter === "" ||
      (csp.isRemote && locationFilter === "Remote") ||
      region === locationFilter;

    // Date filters
    const cspStartDate = new Date(csp.startDate);
    const cspEndDate = new Date(csp.startDate); // Using startDate as placeholder
    const matchesStartDate =
      startDate === "" || cspStartDate >= new Date(startDate);
    const matchesEndDate = endDate === "" || cspEndDate <= new Date(endDate);

    // Duration filter (multi-select)
    const matchesDuration =
      selectedDurations.length === 0 ||
      selectedDurations.some((duration) => {
        const cspDuration = (csp as any).duration || "";
        const durationLower = cspDuration.toLowerCase();

        if (duration === "1-hour" && durationLower.includes("1h")) return true;
        if (duration === "2-hour" && durationLower.includes("2h")) return true;
        if (duration === "3-hour" && durationLower.includes("3h")) return true;
        if (duration === "4-hour" && durationLower.includes("4h")) return true;
        if (duration === "full-day" && durationLower.includes("full day"))
          return true;
        if (duration === "one-time" && durationLower.includes("one-time"))
          return true;
        return false;
      });

    return (
      matchesCategory &&
      matchesType &&
      matchesSearch &&
      matchesLocation &&
      matchesStartDate &&
      matchesEndDate &&
      matchesDuration
    );
  });

  // Sorting
  const sortedCSPs = [...filteredCSPs].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      case "spots":
        return (
          b.maxVolunteers -
          b.currentVolunteers -
          (a.maxVolunteers - a.currentVolunteers)
        );
      case "hours":
        return b.serviceHours - a.serviceHours;
      default:
        return 0; // relevance (original order)
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedCSPs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCSPs = sortedCSPs.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const resetPagination = () => {
    setCurrentPage(1);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-heading text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Discover Community Service Projects
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            Find and apply for meaningful volunteer opportunities at SMU
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-background border-b">
        <div className="container mx-auto space-y-4 px-4 py-6">
          {/* First Row: Search Bar Only */}
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  type="search"
                  placeholder="Search for CSPs, organisations, or skills..."
                  className="h-11 pl-10 text-sm sm:text-base"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    updateURL({ q: e.target.value });
                    resetPagination();
                  }}
                />
              </div>
            </div>
          </div>

          {/* Second Row: All Filters - Responsive Layout */}
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Category */}
            <div className="flex-1 space-y-2 lg:flex-[1.5]">
              <Label className="font-body text-foreground text-sm font-medium">
                Category
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={(val) => {
                  setSelectedCategory(val);
                  updateURL({ category: val });
                  resetPagination();
                }}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="flex-1 space-y-2 lg:flex-[1.5]">
              <Label className="font-body text-foreground text-sm font-medium">
                Type
              </Label>
              <Select
                value={typeFilter}
                onValueChange={(val) => {
                  setTypeFilter(val);
                  updateURL({ type: val });
                  resetPagination();
                }}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="overseas">Overseas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="flex-1 space-y-2 lg:flex-[1.5]">
              <Label className="font-body text-foreground text-sm font-medium">
                Location
              </Label>
              <Select
                value={locationFilter}
                onValueChange={(val) => {
                  setLocationFilter(val);
                  updateURL({ location: val });
                  resetPagination();
                }}
                disabled={
                  typeFilter === "overseas" && locationFilter !== "Remote"
                }
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue
                    placeholder={
                      typeFilter === "overseas"
                        ? "N/A (Overseas)"
                        : "All Locations"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location === "all" ? "All Locations" : location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="flex-1 space-y-2 lg:flex-[1.5]">
              <Label className="font-body text-foreground text-sm font-medium">
                Sort By
              </Label>
              <Select
                value={sortBy}
                onValueChange={(val) => {
                  setSortBy(val);
                  updateURL({ sortBy: val });
                }}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Relevance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="date">Start Date</SelectItem>
                  <SelectItem value="spots">Available Spots</SelectItem>
                  <SelectItem value="hours">Service Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons - Hidden label on large screens to align with dropdowns */}
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-row lg:items-end">
              <div className="hidden lg:block lg:h-7"></div>{" "}
              {/* Spacer for alignment */}
              <div className="flex flex-col gap-3 sm:flex-row">
                {/* More Filters Toggle */}
                <Button
                  variant="outline"
                  className="h-10 flex-shrink-0 px-4 whitespace-nowrap"
                  onClick={() => {
                    setShowMoreFilters(!showMoreFilters);
                    updateURL({ showMore: (!showMoreFilters).toString() });
                  }}
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <span>More Filters</span>
                  {showMoreFilters ? " ▲" : " ▼"}
                </Button>

                {/* Show Map */}
                <Button
                  variant={showMap ? "default" : "outline"}
                  className="h-10 flex-shrink-0 px-4 whitespace-nowrap"
                  onClick={() => {
                    setShowMap(!showMap);
                    updateURL({ showMap: (!showMap).toString() });
                  }}
                >
                  <MapIcon className="mr-2 h-4 w-4" />
                  <span>{showMap ? "Hide" : "Show"} Map</span>
                </Button>

                {/* Clear All Filters */}
                <Button
                  variant="ghost"
                  className="h-10 flex-shrink-0 px-4 whitespace-nowrap"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setTypeFilter("all");
                    setLocationFilter("all");
                    setStartDate("");
                    setEndDate("");
                    setSelectedDurations([]);
                    setSortBy("relevance");
                    setShowMoreFilters(false);
                    setShowMap(false);
                    navigate({ search: {} });
                    resetPagination();
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Fourth Row: Expandable More Filters - Responsive */}
          {showMoreFilters && (
            <div className="border-t pt-4">
              {/* Responsive Layout for Date Filters and Duration */}
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                {/* Start Date - Smaller */}
                <div className="w-full space-y-2 md:w-40">
                  <Label
                    htmlFor="startDate"
                    className="font-body text-sm font-medium"
                  >
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    className="h-10 cursor-pointer"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      updateURL({ startDate: e.target.value });
                      resetPagination();
                    }}
                    onClick={(e) => {
                      // Ensure the date picker opens on click
                      e.currentTarget.showPicker?.();
                    }}
                  />
                </div>

                {/* End Date - Smaller */}
                <div className="w-full space-y-2 md:w-40">
                  <Label
                    htmlFor="endDate"
                    className="font-body text-sm font-medium"
                  >
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    className="h-10 cursor-pointer"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      updateURL({ endDate: e.target.value });
                      resetPagination();
                    }}
                    onClick={(e) => {
                      // Ensure the date picker opens on click
                      e.currentTarget.showPicker?.();
                    }}
                  />
                </div>

                {/* Duration Multi-Select Buttons */}
                <div className="flex-1 space-y-2">
                  <Label className="font-body text-foreground text-sm font-medium">
                    Duration
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "1-hour", label: "1 Hour" },
                      { value: "2-hour", label: "2 Hours" },
                      { value: "3-hour", label: "3 Hours" },
                      { value: "4-hour", label: "4 Hours" },
                      { value: "full-day", label: "Full Day" },
                      { value: "one-time", label: "One-Time" },
                    ].map((duration) => (
                      <Button
                        key={duration.value}
                        variant={
                          selectedDurations.includes(duration.value)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          const newDurations = selectedDurations.includes(
                            duration.value,
                          )
                            ? selectedDurations.filter(
                                (d) => d !== duration.value,
                              )
                            : [...selectedDurations, duration.value];
                          setSelectedDurations(newDurations);
                          updateURL({ durations: newDurations.join(",") });
                          resetPagination();
                        }}
                      >
                        {duration.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Section (conditional) */}
      {showMap && <MapSection sortedCSPs={sortedCSPs} />}

      {/* Results */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-foreground font-body text-lg font-semibold">
                Found {sortedCSPs.length} CSP
                {sortedCSPs.length !== 1 ? "s" : ""}
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
              </p>
              <p className="text-muted-foreground font-body text-sm">
                Showing {startIndex + 1}-{Math.min(endIndex, sortedCSPs.length)}{" "}
                of {sortedCSPs.length}{" "}
                {sortedCSPs.length === 1 ? "result" : "results"}
              </p>
            </div>

            {/* View Toggle - Icon Only, Bigger - Hidden on small screens */}
            <div className="hidden items-center gap-2 md:flex">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="default"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="default"
                onClick={() => setViewMode("list")}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedCSPs.map((csp) => {
                const statusBadge = getStatusBadge(csp.status);
                const duration =
                  (csp as any).duration || `${csp.serviceHours}h`;

                return (
                  <Card
                    key={csp.id}
                    className="group flex h-full cursor-pointer flex-col transition-shadow hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            className={`text-xs ${getCategoryColor(csp.category)}`}
                          >
                            {csp.category}
                          </Badge>
                          <Badge className={`text-xs ${statusBadge.className}`}>
                            {statusBadge.label}
                          </Badge>
                        </div>
                        {isLoggedIn && isStudent && (
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="relative h-8 w-8 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSave(csp.id);
                              }}
                            >
                              <Heart
                                className={`h-4 w-4 transition-all ${
                                  savedIds.has(csp.id) ||
                                  tempSavedIds.has(csp.id)
                                    ? "fill-red-500 text-red-500"
                                    : "text-black hover:text-black"
                                }`}
                              />
                              {glitteringProjectId === csp.id && (
                                <>
                                  {[...Array(8)].map((_, i) => {
                                    const angle = (i * 360) / 8;
                                    const distance = 20;
                                    const radians = (angle * Math.PI) / 180;
                                    const tx = Math.cos(radians) * distance;
                                    const ty = Math.sin(radians) * distance;
                                    return (
                                      <span
                                        key={i}
                                        className="glitter-particle"
                                        style={
                                          {
                                            left: "50%",
                                            top: "50%",
                                            "--tx": `${tx}px`,
                                            "--ty": `${ty}px`,
                                            animationDelay: `${i * 0.05}s`,
                                          } as React.CSSProperties
                                        }
                                      />
                                    );
                                  })}
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                      <CardTitle className="font-heading group-hover:text-primary text-lg transition-colors">
                        {csp.title}
                      </CardTitle>
                      <CardDescription className="font-body">
                        {csp.organisation}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between gap-4">
                      <div className="space-y-3">
                        <p className="text-muted-foreground font-body line-clamp-2 text-sm">
                          {csp.description}
                        </p>

                        {/* Location + Duration Row */}
                        <div className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
                          <div className="flex min-w-0 flex-1 items-center space-x-1">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="font-body truncate">
                              {csp.isRemote
                                ? "Remote"
                                : csp.type === "overseas"
                                  ? csp.country || "—"
                                  : csp.location || "—"}
                            </span>
                          </div>

                          <div className="flex min-w-0 flex-1 items-center">
                            <Clock className="mr-1.5 h-4 w-4 flex-shrink-0" />
                            <span
                              className="font-body text-muted-foreground line-clamp-2 pl-0.5 text-xs leading-tight break-words sm:text-sm"
                              title={
                                formatScheduleFromFields(csp) ||
                                (csp as any).duration ||
                                `${csp.serviceHours}h`
                              }
                            >
                              {formatScheduleFromFields(csp) ||
                                (csp as any).duration ||
                                `${csp.serviceHours}h`}
                            </span>
                          </div>
                        </div>

                        {/* Date + Volunteers Row */}
                        <div className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
                          <div className="flex min-w-0 flex-1 items-center space-x-1">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span className="font-body truncate">
                              {formatDateRange(csp.startDate, csp.startDate)}
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 items-center space-x-1">
                            <Users className="h-4 w-4 flex-shrink-0" />
                            <span className="font-body">
                              {csp.currentVolunteers}/{csp.maxVolunteers}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {csp.skills
                            .slice(0, window.innerWidth >= 1280 ? 3 : 2)
                            .map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          {csp.skills.length >
                            (window.innerWidth >= 1280 ? 3 : 2) && (
                            <Badge variant="outline" className="text-xs">
                              +
                              {csp.skills.length -
                                (window.innerWidth >= 1280 ? 3 : 2)}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Link to="/csp/$cspId" params={{ cspId: csp.id }}>
                        <Button className="group-hover:bg-primary group-hover:text-primary-foreground w-full transition-colors">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* List View - Hidden on small screens */}
          {viewMode === "list" && (
            <div className="hidden md:block">
              <div className="space-y-4">
                {paginatedCSPs.map((csp) => {
                  const statusBadge = getStatusBadge(csp.status);
                  const duration =
                    (csp as any).duration || `${csp.serviceHours}h`;

                  return (
                    <Card
                      key={csp.id}
                      className="group cursor-pointer transition-shadow hover:shadow-lg"
                    >
                      <CardContent className="px-6">
                        <div className="flex flex-col gap-6 md:flex-row">
                          {/* Left: Content */}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="mb-2 flex items-center gap-2">
                                  <Badge
                                    className={`text-xs ${getCategoryColor(csp.category)}`}
                                  >
                                    {csp.category}
                                  </Badge>
                                  <Badge
                                    className={`text-xs ${statusBadge.className}`}
                                  >
                                    {statusBadge.label}
                                  </Badge>
                                </div>
                                <h3 className="font-heading group-hover:text-primary text-xl font-semibold transition-colors">
                                  {csp.title}
                                </h3>
                                <p className="text-muted-foreground font-body">
                                  {csp.organisation}
                                </p>
                              </div>
                              {isLoggedIn && isStudent && (
                                <div className="relative">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleSave(csp.id);
                                    }}
                                  >
                                    <Heart
                                      className={`h-4 w-4 transition-all ${
                                        savedIds.has(csp.id) ||
                                        tempSavedIds.has(csp.id)
                                          ? "fill-red-500 text-red-500"
                                          : "text-black hover:text-black"
                                      }`}
                                    />
                                    {glitteringProjectId === csp.id && (
                                      <>
                                        {[...Array(8)].map((_, i) => {
                                          const angle = (i * 360) / 8;
                                          const distance = 20;
                                          const radians =
                                            (angle * Math.PI) / 180;
                                          const tx =
                                            Math.cos(radians) * distance;
                                          const ty =
                                            Math.sin(radians) * distance;
                                          return (
                                            <span
                                              key={i}
                                              className="glitter-particle"
                                              style={
                                                {
                                                  left: "50%",
                                                  top: "50%",
                                                  "--tx": `${tx}px`,
                                                  "--ty": `${ty}px`,
                                                  animationDelay: `${i * 0.05}s`,
                                                } as React.CSSProperties
                                              }
                                            />
                                          );
                                        })}
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>

                            <p className="text-muted-foreground font-body line-clamp-2 text-sm">
                              {csp.description}
                            </p>

                            {/* Location, Time, Date, and Participants Row */}
                            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                <span className="font-body">
                                  {csp.isRemote
                                    ? "Remote"
                                    : csp.type === "overseas"
                                      ? csp.country || "—"
                                      : csp.location || "—"}
                                </span>
                              </div>

                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span className="font-body">{duration}</span>
                              </div>

                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span className="font-body">
                                  {formatDateRange(
                                    csp.startDate,
                                    csp.startDate,
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span className="font-body">
                                  {csp.currentVolunteers}/{csp.maxVolunteers}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {csp.skills.slice(0, 4).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {csp.skills.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{csp.skills.length - 4}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Right: Action */}
                          <div className="flex items-center gap-3 md:flex-col md:items-end">
                            <Link to="/csp/$cspId" params={{ cspId: csp.id }}>
                              <Button className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {sortedCSPs.length === 0 && (
            <div className="py-12 text-center">
              <Search className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="font-heading mb-2 text-lg font-semibold">
                No CSPs Found
              </h3>
              <p className="text-muted-foreground font-body mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setLocationFilter("all");
                  setStartDate("");
                  setEndDate("");
                  setSelectedDurations([]);
                  setSortBy("relevance");
                  resetPagination();
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && sortedCSPs.length > 0 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "instant" });
                      }}
                      className="h-10 w-10 p-0"
                    >
                      {page}
                    </Button>
                  ),
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type MapSectionProps = {
  sortedCSPs: CspLocation[];
};

function MapSection({ sortedCSPs }: MapSectionProps) {
  const nonRemoteCSPs = useMemo(() => {
    const cspsWithCoords = sortedCSPs
      .map((csp) => {
        // If already has valid lat/lng, use it
        if (
          typeof csp.latitude === "number" &&
          typeof csp.longitude === "number" &&
          !isNaN(csp.latitude) &&
          !isNaN(csp.longitude)
        ) {
          return csp;
        }

        // If Google Maps URL has no coordinates, then skips LOL
        if (csp.googleMaps && !csp.latitude && !csp.longitude) {
          console.log(
            `CSP "${csp.title}" has Google Maps URL but no coordinates yet`,
          );
          return null;
        }

        return null;
      })
      .filter(
        (csp): csp is NonNullable<typeof csp> => csp !== null && !csp.isRemote,
      );

    console.log(`Found ${cspsWithCoords.length} CSPs with valid coordinates`);
    return cspsWithCoords;
  }, [sortedCSPs]);

  const fallbackCenter = useMemo<LatLngLiteral>(
    () => ({ lat: 1.3521, lng: 103.8198 }), // Singapore
    [],
  );

  const defaultCenter = useMemo<LatLngLiteral>(
    () =>
      nonRemoteCSPs.length
        ? {
            lat: nonRemoteCSPs[0].latitude as number,
            lng: nonRemoteCSPs[0].longitude as number,
          }
        : fallbackCenter,
    [nonRemoteCSPs, fallbackCenter],
  );

  const [mapCenter, setMapCenter] = useState<LatLngLiteral>(defaultCenter);
  const [selectedCspId, setSelectedCspId] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const mapRef = useRef<GoogleMapInstance | null>(null);

  useEffect(() => {
    setMapCenter(defaultCenter);
  }, [defaultCenter]);

  const selectedCsp = useMemo(
    () => nonRemoteCSPs.find((csp) => csp.id === selectedCspId) ?? null,
    [nonRemoteCSPs, selectedCspId],
  );

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const handleMapLoad = (map: GoogleMapInstance) => {
    mapRef.current = map;
  };

  const handleMapUnmount = () => {
    mapRef.current = null;
  };

  const handleUseCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported on this browser.");
      return;
    }
    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCenter: LatLngLiteral = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMapCenter(nextCenter);
        mapRef.current?.panTo(nextCenter);
        mapRef.current?.setZoom(13);
        setIsGeolocating(false);
      },
      () => {
        toast.error("Unable to retrieve your location.");
        setIsGeolocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="bg-background border-b">
      <div className="container mx-auto space-y-4 px-4 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="font-heading text-foreground text-lg font-semibold">
              CSP Locations
            </h3>
            <p className="text-muted-foreground font-body text-sm">
              Showing {nonRemoteCSPs.length} location-based CSP
              {nonRemoteCSPs.length === 1 ? "" : "s"}
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleUseCurrentLocation}
            disabled={isGeolocating || !isLoaded}
          >
            {isGeolocating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Locating…
              </>
            ) : (
              <>
                <Navigation className="mr-2 h-4 w-4" />
                Use Current Location
              </>
            )}
          </Button>
        </div>

        <div className="border-border/70 bg-muted/10 h-[500px] overflow-hidden rounded-xl border shadow-sm">
          <div className="relative h-full">
            {!isLoaded ? (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading map
              </div>
            ) : loadError ? (
              <div className="text-destructive flex h-full items-center justify-center">
                Unable to load Google Maps. Please try again later.
              </div>
            ) : (
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "100%",
                }}
                center={mapCenter}
                zoom={12.45}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  styles: MINIMAL_MAP_STYLE.length
                    ? MINIMAL_MAP_STYLE
                    : undefined,
                  clickableIcons: false,
                }}
                onLoad={handleMapLoad}
                onUnmount={handleMapUnmount}
              >
                {nonRemoteCSPs.map((csp) => (
                  <Marker
                    key={csp.id}
                    position={{
                      lat: csp.latitude as number,
                      lng: csp.longitude as number,
                    }}
                    onClick={() => setSelectedCspId(csp.id)}
                    title={csp.title}
                  />
                ))}
                {selectedCsp &&
                  selectedCsp.latitude &&
                  selectedCsp.longitude && (
                    <InfoWindow
                      position={{
                        lat: selectedCsp.latitude,
                        lng: selectedCsp.longitude,
                      }}
                      onCloseClick={() => setSelectedCspId(null)}
                    >
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-heading text-foreground text-sm font-semibold">
                            {selectedCsp.title}
                          </h4>
                          <p className="text-muted-foreground text-xs">
                            {selectedCsp.organisation}
                          </p>
                        </div>
                        <div className="text-muted-foreground space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{selectedCsp.location}</span>
                          </div>
                          <div>
                            Starts{" "}
                            {new Date(selectedCsp.startDate).toLocaleDateString(
                              "en-GB",
                            )}
                          </div>
                          <div>{selectedCsp.serviceHours} service hours</div>
                        </div>
                        <Button asChild size="sm" className="h-8 px-3">
                          <Link to={`/csp/${selectedCsp.id}`}>
                            View details
                          </Link>
                        </Button>
                      </div>
                    </InfoWindow>
                  )}
              </GoogleMap>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
