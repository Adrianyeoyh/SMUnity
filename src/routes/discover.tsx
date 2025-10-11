import { createFileRoute, useSearch, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Input } from "#client/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#client/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "#client/components/ui/sheet";
import { Label } from "#client/components/ui/label";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Search,
  Filter,
  Grid3x3,
  List,
  Map as MapIcon,
  Navigation,
  Heart,
  SlidersHorizontal
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/discover")({
  component: DiscoverCSPs,
  validateSearch: (search: Record<string, unknown>): { 
    q?: string; 
    category?: string;
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

function DiscoverCSPs() {
  const navigate = useNavigate({ from: "/discover" });
  const searchParams = useSearch({ from: "/discover" });
  
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.category || "all");
  const [searchQuery, setSearchQuery] = useState(searchParams.q || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMap, setShowMap] = useState(searchParams.showMap === "true");
  const [showMoreFilters, setShowMoreFilters] = useState(searchParams.showMore === "true");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // Advanced filters - Initialize from URL params
  const [locationFilter, setLocationFilter] = useState(searchParams.location || "all");
  const [sortBy, setSortBy] = useState(searchParams.sortBy || "relevance");
  const [startDate, setStartDate] = useState(searchParams.startDate || "");
  const [endDate, setEndDate] = useState(searchParams.endDate || "");
  const [selectedDurations, setSelectedDurations] = useState<string[]>(
    searchParams.durations ? searchParams.durations.split(",").filter(Boolean) : []
  );

  // Update URL with current filter state
  const updateURL = (updates: Partial<typeof searchParams>) => {
    const newParams = {
      q: searchQuery,
      category: selectedCategory,
      location: locationFilter,
      sortBy: sortBy,
      startDate: startDate,
      endDate: endDate,
      durations: selectedDurations.join(","),
      showMore: showMoreFilters.toString(),
      showMap: showMap.toString(),
      ...updates
    };
    
    // Remove empty values
    Object.keys(newParams).forEach(key => {
      if (newParams[key as keyof typeof newParams] === "" || 
          newParams[key as keyof typeof newParams] === "all" ||
          newParams[key as keyof typeof newParams] === "false") {
        delete newParams[key as keyof typeof newParams];
      }
    });
    
    navigate({ search: newParams as any, replace: true });
  };

  const locations = [
    "all",
    "North",
    "South", 
    "East",
    "West",
    "Central",
    "Remote"
  ];

  // Mock data for demonstration
  const cspLocations = [
    {
      id: "1",
      title: "Teaching English to Underprivileged Children",
      organization: "Hope Foundation",
      location: "Tampines",
      category: "Education",
      startDate: "2025-03-15",
      serviceHours: 40,
      maxVolunteers: 15,
      currentVolunteers: 8,
      latitude: 1.3496,
      longitude: 103.9568,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-28",
      description: "Help teach English to children from low-income families.",
      skills: ["Communication", "Patience", "Teaching"]
    },
    {
      id: "2",
      title: "Beach Cleanup at East Coast Park",
      organization: "Green Singapore",
      location: "East Coast Park",
      category: "Environment",
      startDate: "2025-02-20",
      serviceHours: 8,
      maxVolunteers: 50,
      currentVolunteers: 23,
      latitude: 1.3048,
      longitude: 103.9318,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-15",
      description: "Join us for a beach cleanup initiative.",
      skills: ["Teamwork", "Physical Activity"]
    },
    {
      id: "3",
      title: "Virtual Mentoring Program",
      organization: "Youth Connect",
      location: "Remote",
      category: "Mentoring",
      startDate: "2025-03-01",
      serviceHours: 60,
      maxVolunteers: 25,
      currentVolunteers: 25,
      latitude: null,
      longitude: null,
      isRemote: true,
      status: "full",
      applicationDeadline: "2025-02-10",
      description: "Provide virtual mentorship to at-risk youth.",
      skills: ["Mentoring", "Communication", "Leadership"]
    },
    {
      id: "4",
      title: "Community Garden Project",
      organization: "Green Thumbs",
      location: "Jurong West",
      category: "Environment",
      startDate: "2025-02-10",
      serviceHours: 20,
      maxVolunteers: 30,
      currentVolunteers: 15,
      latitude: 1.3396,
      longitude: 103.7068,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-01-31",
      description: "Help maintain and develop community gardens.",
      skills: ["Gardening", "Teamwork"]
    },
    {
      id: "5",
      title: "Senior Care Support Program",
      organization: "Golden Years",
      location: "Toa Payoh",
      category: "Healthcare",
      startDate: "2025-02-15",
      serviceHours: 30,
      maxVolunteers: 20,
      currentVolunteers: 7,
      latitude: 1.3329,
      longitude: 103.8483,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-05",
      description: "Provide companionship and support to elderly residents.",
      skills: ["Empathy", "Communication", "Patience"]
    },
    {
      id: "6",
      title: "Food Bank Volunteer",
      organization: "Food for All",
      location: "Jurong West",
      category: "Community",
      startDate: "2025-01-15",
      serviceHours: 15,
      maxVolunteers: 40,
      currentVolunteers: 40,
      latitude: 1.3401,
      longitude: 103.7098,
      isRemote: false,
      status: "full",
      applicationDeadline: "2025-01-10",
      description: "Help sort, pack, and distribute food items to families in need.",
      skills: ["Teamwork", "Organization"]
    },
    {
      id: "7",
      title: "Arts & Crafts Workshop for Kids",
      organization: "Creative Minds",
      location: "Bishan",
      category: "Arts & Culture",
      startDate: "2025-03-05",
      serviceHours: 25,
      maxVolunteers: 12,
      currentVolunteers: 5,
      latitude: 1.3521,
      longitude: 103.8487,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-20",
      description: "Teach children creative arts and crafts skills.",
      skills: ["Creativity", "Teaching", "Art"]
    },
    {
      id: "8",
      title: "Mental Health Awareness Campaign",
      organization: "Mind Matters",
      location: "Central",
      category: "Healthcare",
      startDate: "2025-02-25",
      serviceHours: 20,
      maxVolunteers: 15,
      currentVolunteers: 10,
      latitude: 1.3,
      longitude: 103.85,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-15",
      description: "Help raise awareness about mental health in the community.",
      skills: ["Public Speaking", "Empathy", "Communication"]
    },
    {
      id: "9",
      title: "Coding Classes for Underprivileged Youth",
      organization: "Tech for Good",
      location: "Remote",
      category: "Education",
      startDate: "2025-03-10",
      serviceHours: 50,
      maxVolunteers: 20,
      currentVolunteers: 8,
      latitude: null,
      longitude: null,
      isRemote: true,
      status: "open",
      applicationDeadline: "2025-02-28",
      description: "Teach basic programming and computer skills to youth.",
      skills: ["Programming", "Teaching", "Patience"]
    },
    {
      id: "10",
      title: "Animal Shelter Volunteer",
      organization: "Paws & Claws",
      location: "Pasir Ris",
      category: "Community",
      startDate: "2025-02-18",
      serviceHours: 12,
      maxVolunteers: 25,
      currentVolunteers: 18,
      latitude: 1.373,
      longitude: 103.9496,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-10",
      description: "Help care for rescued animals at our shelter.",
      skills: ["Animal Care", "Physical Activity", "Compassion"]
    },
    {
      id: "11",
      title: "Heritage Trail Guide",
      organization: "Singapore Heritage",
      location: "Chinatown",
      category: "Arts & Culture",
      startDate: "2025-03-15",
      serviceHours: 18,
      maxVolunteers: 10,
      currentVolunteers: 10,
      latitude: 1.2838,
      longitude: 103.8436,
      isRemote: false,
      status: "full",
      applicationDeadline: "2025-02-25",
      description: "Guide tours through Singapore's cultural heritage sites.",
      skills: ["Public Speaking", "History", "Communication"]
    },
    {
      id: "12",
      title: "Youth Sports Coaching",
      organization: "Sports for All",
      location: "Clementi",
      category: "Community",
      startDate: "2025-02-22",
      serviceHours: 35,
      maxVolunteers: 18,
      currentVolunteers: 11,
      latitude: 1.3162,
      longitude: 103.7649,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-12",
      description: "Coach underprivileged youth in various sports activities.",
      skills: ["Sports", "Leadership", "Teamwork"]
    },
    {
      id: "13",
      title: "Environmental Education Workshop",
      organization: "Green Singapore",
      location: "Woodlands",
      category: "Environment",
      startDate: "2025-03-08",
      serviceHours: 16,
      maxVolunteers: 22,
      currentVolunteers: 9,
      latitude: 1.4382,
      longitude: 103.7891,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-25",
      description: "Conduct workshops on environmental conservation and sustainability.",
      skills: ["Teaching", "Environmental Science", "Presentation"]
    },
    {
      id: "14",
      title: "Hospital Companionship Program",
      organization: "Care & Comfort",
      location: "Novena",
      category: "Healthcare",
      startDate: "2025-02-28",
      serviceHours: 45,
      maxVolunteers: 15,
      currentVolunteers: 6,
      latitude: 1.3202,
      longitude: 103.8438,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-18",
      description: "Provide companionship to patients in hospitals.",
      skills: ["Empathy", "Active Listening", "Patience"]
    },
    {
      id: "15",
      title: "Digital Literacy for Seniors",
      organization: "Tech Seniors",
      location: "Bedok",
      category: "Education",
      startDate: "2025-03-12",
      serviceHours: 28,
      maxVolunteers: 16,
      currentVolunteers: 7,
      latitude: 1.3236,
      longitude: 103.9273,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-03-01",
      description: "Teach elderly residents how to use smartphones and computers.",
      skills: ["Teaching", "Patience", "Technology"]
    },
  ];

  const categories = [
    "all", "Education", "Environment", "Healthcare", "Mentoring", "Community"
  ];

  // Enhanced filtering with all criteria
  const filteredCSPs = cspLocations.filter(csp => {
    // Category filter
    const matchesCategory = selectedCategory === "all" || csp.category === selectedCategory;
    
    // Search query
    const query = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      csp.title.toLowerCase().includes(query) ||
      csp.organization.toLowerCase().includes(query) ||
      csp.location.toLowerCase().includes(query) ||
      csp.category.toLowerCase().includes(query) ||
      csp.description.toLowerCase().includes(query) ||
      csp.skills.some(skill => skill.toLowerCase().includes(query));
    
    // Location filter
    const matchesLocation = locationFilter === "all" || locationFilter === "" || 
      csp.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    // Date filters
    const cspStartDate = new Date(csp.startDate);
    const cspEndDate = new Date(csp.startDate); // Using startDate as placeholder
    const matchesStartDate = startDate === "" || cspStartDate >= new Date(startDate);
    const matchesEndDate = endDate === "" || cspEndDate <= new Date(endDate);
    
    // Duration filter (multi-select)
    const matchesDuration = selectedDurations.length === 0 || selectedDurations.some(duration => {
      if (duration === "1-hour" && csp.serviceHours <= 1) return true;
      if (duration === "2-hour" && csp.serviceHours > 1 && csp.serviceHours <= 2) return true;
      if (duration === "3-hour" && csp.serviceHours > 2 && csp.serviceHours <= 3) return true;
      if (duration === "4-hour" && csp.serviceHours > 3 && csp.serviceHours <= 4) return true;
      if (duration === "full-day" && csp.serviceHours > 4 && csp.serviceHours <= 12) return true;
      if (duration === "multiple-days" && csp.serviceHours > 12) return true;
      return false;
    });
    
    return matchesCategory && matchesSearch && matchesLocation && 
           matchesStartDate && matchesEndDate && matchesDuration;
  });

  // Sorting
  const sortedCSPs = [...filteredCSPs].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      case "spots":
        return (b.maxVolunteers - b.currentVolunteers) - (a.maxVolunteers - a.currentVolunteers);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Discover Community Service Projects
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            Find and apply for meaningful volunteer opportunities at SMU
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-6 space-y-4">
          {/* First Row: Search Bar Only */}
          <div className="flex gap-3">
            <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search CSPs, organizations, locations, skills..."
                      className="pl-10 h-11"
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
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Category */}
            <div className="flex-1 lg:flex-[1.5] space-y-2">
              <Label className="text-sm font-body font-medium text-foreground">Category</Label>
              <Select value={selectedCategory} onValueChange={(val) => { 
                setSelectedCategory(val); 
                updateURL({ category: val });
                resetPagination(); 
              }}>
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

            {/* Location */}
            <div className="flex-1 lg:flex-[1.5] space-y-2">
              <Label className="text-sm font-body font-medium text-foreground">Location</Label>
              <Select value={locationFilter} onValueChange={(val) => { 
                setLocationFilter(val); 
                updateURL({ location: val });
                resetPagination(); 
              }}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="All Locations" />
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
            <div className="flex-1 lg:flex-[1.5] space-y-2">
              <Label className="text-sm font-body font-medium text-foreground">Sort By</Label>
              <Select value={sortBy} onValueChange={(val) => {
                setSortBy(val);
                updateURL({ sortBy: val });
              }}>
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
            <div className="flex flex-col sm:flex-row lg:flex-row gap-3 lg:items-end">
              <div className="hidden lg:block lg:h-7"></div> {/* Spacer for alignment */}
              <div className="flex flex-col sm:flex-row gap-3">
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
            <div className="pt-4 border-t">
              {/* Responsive Layout for Date Filters and Duration */}
              <div className="flex flex-col md:flex-row gap-4 md:items-end">
                {/* Start Date - Smaller */}
                <div className="w-full md:w-40 space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-body font-medium">
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
                <div className="w-full md:w-40 space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-body font-medium">
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
                  <Label className="text-sm font-body font-medium">
                    Duration
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "1-hour", label: "1 Hour" },
                      { value: "2-hour", label: "2 Hours" },
                      { value: "3-hour", label: "3 Hours" },
                      { value: "4-hour", label: "4 Hours" },
                      { value: "full-day", label: "Full Day" },
                      { value: "multiple-days", label: "Multiple Days" },
                    ].map((duration) => (
                      <Button
                        key={duration.value}
                        variant={selectedDurations.includes(duration.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newDurations = selectedDurations.includes(duration.value)
                            ? selectedDurations.filter(d => d !== duration.value)
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
      {showMap && (
        <div className="border-b">
          <div className="container mx-auto px-4 py-6">
            <Card className="h-[400px]">
              <CardContent className="p-0 h-full">
                <div className="h-full bg-muted/30 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <MapIcon className="h-16 w-16 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                        Interactive Map Coming Soon
                      </h3>
                      <p className="text-muted-foreground font-body">
                        Showing {sortedCSPs.filter(csp => !csp.isRemote).length} location-based CSPs
                      </p>
                    </div>
                    <Button variant="outline">
                      <Navigation className="mr-2 h-4 w-4" />
                      Use Current Location
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-lg font-semibold text-foreground font-body">
                Found {sortedCSPs.length} CSP{sortedCSPs.length !== 1 ? 's' : ''}
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
              </p>
              <p className="text-sm text-muted-foreground font-body">
                Showing {startIndex + 1}-{Math.min(endIndex, sortedCSPs.length)} of {sortedCSPs.length} results
              </p>
            </div>
            
            {/* View Toggle - Icon Only, Bigger */}
            <div className="flex items-center gap-2">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCSPs.map((csp) => (
                <Card key={csp.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {csp.category}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="font-heading text-lg group-hover:text-primary transition-colors">
                      {csp.title}
                    </CardTitle>
                    <CardDescription className="font-body">
                      {csp.organization}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground font-body line-clamp-2">
                        {csp.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span className="font-body">{csp.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span className="font-body">{csp.serviceHours}h</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span className="font-body">{new Date(csp.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span className="font-body">{csp.currentVolunteers}/{csp.maxVolunteers}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {csp.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {csp.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{csp.skills.length - 2}
                          </Badge>
                        )}
                      </div>

                      <Link to="/csp/$cspId" params={{ cspId: csp.id }}>
                        <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="space-y-4">
              {paginatedCSPs.map((csp) => (
                <Card key={csp.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left: Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {csp.category}
                              </Badge>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span className="font-body">{csp.location}</span>
                              </div>
                            </div>
                            <h3 className="font-heading text-xl font-semibold hover:text-primary transition-colors">
                              {csp.title}
                            </h3>
                            <p className="text-muted-foreground font-body">
                              {csp.organization}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-sm text-muted-foreground font-body line-clamp-2">
                          {csp.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span className="font-body">{new Date(csp.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span className="font-body">{csp.serviceHours}h</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span className="font-body">{csp.currentVolunteers}/{csp.maxVolunteers}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {csp.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {csp.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{csp.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Right: Action */}
                      <div className="flex md:flex-col items-center md:items-end gap-3">
                        <Link to="/csp/$cspId" params={{ cspId: csp.id }}>
                          <Button>
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {sortedCSPs.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold mb-2">No CSPs Found</h3>
              <p className="text-muted-foreground font-body mb-4">
                Try adjusting your search or filters
              </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setLocationFilter("all");
                  setStartDate("");
                  setEndDate("");
                  setSelectedDurations([]);
                  setSortBy("relevance");
                  resetPagination();
                }}>
                  Clear All Filters
                </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && sortedCSPs.length > 0 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-10 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
