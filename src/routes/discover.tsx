import { createFileRoute, useSearch, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Input } from "#client/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#client/components/ui/select";

import { Label } from "#client/components/ui/label";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Search,
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

// Helper function to get category color
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Community": "bg-orange-100 text-orange-700 hover:bg-orange-200",
    "Mentoring": "bg-blue-100 text-blue-700 hover:bg-blue-200",
    "Environment": "bg-green-100 text-green-700 hover:bg-green-200",
    "Elderly": "bg-purple-100 text-purple-700 hover:bg-purple-200",
    "Arts & Culture": "bg-pink-100 text-pink-700 hover:bg-pink-200",
    "Animal Welfare": "bg-rose-100 text-rose-700 hover:bg-rose-200",
    "Sports & Leisure": "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    "Coding": "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
  };
  return colors[category] || "bg-gray-100 text-gray-700 hover:bg-gray-200";
};

// Helper function to get status color and text
const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    "open": { label: "Open", className: "bg-green-500 hover:bg-green-600 text-white" },
    "closing-soon": { label: "Closing Soon", className: "bg-yellow-500 hover:bg-yellow-600 text-white" },
    "full": { label: "Full", className: "bg-gray-500 hover:bg-gray-600 text-white" },
    "closed": { label: "Closed", className: "bg-red-500 hover:bg-red-600 text-white" },
  };
  return statusConfig[status] || statusConfig["open"];
};

// Helper function to format date range
const formatDateRange = (startDate: string, endDate?: string) => {
  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  if (!endDate || startDate === endDate) {
    return formatDate(startDate);
  }
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

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
  const [typeFilter, setTypeFilter] = useState(searchParams.type || "all");
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
      type: typeFilter,
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
      title: "Project Candela",
      organisation: "SMU Rotaract",
      location: "Kranji",
      category: "Community",
      startDate: "2025-03-15",
      endDate: "2025-06-15",
      duration: "2h, Every Tuesday",
      serviceHours: 40,
      maxVolunteers: 15,
      currentVolunteers: 8,
      latitude: 1.3496,
      longitude: 103.9568,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-28",
      description: "Join us to challenge and debunk negative stereotypes surrounding foreign workers while raising awareness among Singaporeans about the experiences and contributions of migrant workers.",
      skills: ["Communication", "Patience", "Teaching", "Empathy"],
      tags: ["Migrant", "Migrant Workers", "Community"]
    },
    {
      id: "2",
      title: "Beach Cleanup at East Coast Park",
      organisation: "Green Singapore",
      location: "East Coast Park",
      category: "Environment",
      startDate: "2025-02-20",
      endDate: "2025-02-20",
      duration: "4h, One-time",
      serviceHours: 8,
      maxVolunteers: 50,
      currentVolunteers: 48,
      latitude: 1.3048,
      longitude: 103.9318,
      isRemote: false,
      status: "closing-soon",
      applicationDeadline: "2025-02-15",
      description: "Join us for a beach cleanup initiative.",
      skills: ["Teamwork", "Physical Activity", "Outdoor"],
      tags: ["Environment", "Beach", "Cleanup"]
    },
    {
      id: "3",
      title: "Virtual Mentoring Program",
      organisation: "Youth Connect",
      location: "Remote",
      category: "Mentoring",
      startDate: "2025-03-01",
      endDate: "2025-08-31",
      duration: "1h, Weekly",
      serviceHours: 60,
      maxVolunteers: 25,
      currentVolunteers: 25,
      latitude: null,
      longitude: null,
      isRemote: true,
      status: "full",
      applicationDeadline: "2025-02-10",
      description: "Provide virtual mentorship to at-risk youth.",
      skills: ["Mentoring", "Communication", "Leadership", "Active Listening"],
      tags: ["Mentoring", "Youth", "Virtual"]
    },
    {
      id: "4",
      title: "Community Garden Project",
      organisation: "Green Thumbs",
      location: "Jurong West",
      category: "Environment",
      startDate: "2025-02-10",
      endDate: "2025-05-10",
      duration: "2h, Every Sunday",
      serviceHours: 20,
      maxVolunteers: 30,
      currentVolunteers: 15,
      latitude: 1.3396,
      longitude: 103.7068,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-01-31",
      description: "Help maintain and develop community gardens.",
      skills: ["Gardening", "Teamwork", "Physical Activity"],
      tags: ["Environment", "Gardening", "Community"]
    },
    {
      id: "5",
      title: "Senior Care Support Program",
      organisation: "Golden Years",
      location: "Toa Payoh",
      category: "Elderly",
      startDate: "2025-02-15",
      endDate: "2025-07-15",
      duration: "2h, Biweekly",
      serviceHours: 30,
      maxVolunteers: 20,
      currentVolunteers: 7,
      latitude: 1.3329,
      longitude: 103.8483,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-05",
      description: "Provide companionship and support to elderly residents.",
      skills: ["Empathy", "Communication", "Patience", "Care"],
      tags: ["Healthcare", "Elderly", "Companionship"]
    },
    {
      id: "6",
      title: "Food Bank Volunteer",
      organisation: "Food for All",
      location: "Jurong West",
      category: "Community",
      startDate: "2025-01-15",
      endDate: "2025-01-15",
      duration: "3h, One-time",
      serviceHours: 15,
      maxVolunteers: 40,
      currentVolunteers: 40,
      latitude: 1.3401,
      longitude: 103.7098,
      isRemote: false,
      status: "closed",
      applicationDeadline: "2025-01-10",
      description: "Help sort, pack, and distribute food items to families in need.",
      skills: ["Teamwork", "organisation", "Service"],
      tags: ["Community", "Food", "Charity"]
    },
    {
      id: "7",
      title: "Arts & Crafts Workshop for Kids",
      organisation: "Creative Minds",
      location: "Bishan",
      category: "Arts & Culture",
      startDate: "2025-03-05",
      endDate: "2025-04-15",
      duration: "3h, Every Saturday",
      serviceHours: 25,
      maxVolunteers: 12,
      currentVolunteers: 5,
      latitude: 1.3521,
      longitude: 103.8487,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-20",
      description: "Teach children creative arts and crafts skills.",
      skills: ["Creativity", "Teaching", "Art", "Patience"],
      tags: ["Arts", "Culture", "Workshop", "Children"]
    },
    {
      id: "8",
      title: "Project Kidleidoscope",
      organisation: "SMU Kidleidoscope",
      location: "Central",
      category: "Mentoring",
      startDate: "2025-12-07",
      endDate: "2025-06-07",
      duration: "2h, Every Wednesday",
      serviceHours: 20,
      maxVolunteers: 50,
      currentVolunteers: 15,
      latitude: 1.3,
      longitude: 103.85,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-11-15",
      description: "Empower children from less priviledged backgrounds to pursue their dreams.",
      skills: ["Empathy", "Communication", "Patience", "Basic Art Skills"],
      tags: ["Children", "Kids", "Less Privileged", "Art", "School", "Education"]
    },
    {
      id: "9",
      title: "Coding Classes for Underprivileged Youth",
      organisation: "Tech for Good",
      location: "Remote",
      category: "Coding",
      startDate: "2025-03-10",
      endDate: "2025-09-10",
      duration: "2h, Twice Weekly",
      serviceHours: 50,
      maxVolunteers: 20,
      currentVolunteers: 8,
      latitude: null,
      longitude: null,
      isRemote: true,
      status: "open",
      applicationDeadline: "2025-02-28",
      description: "Teach basic programming and computer skills to youth.",
      skills: ["Programming", "Teaching", "Patience", "Technology"],
      tags: ["Education", "Technology", "Youth", "Virtual", "Mentoring", "Coding"]
    },
    {
      id: "10",
      title: "Animal Shelter Volunteer",
      organisation: "Paws & Claws",
      location: "Pasir Ris",
      category: "Animal Welfare",
      startDate: "2025-02-18",
      endDate: "2025-06-18",
      duration: "3h, Weekly",
      serviceHours: 12,
      maxVolunteers: 25,
      currentVolunteers: 18,
      latitude: 1.373,
      longitude: 103.9496,
      isRemote: false,
      status: "closing-soon",
      applicationDeadline: "2025-02-10",
      description: "Help care for rescued animals at our shelter.",
      skills: ["Animal Care", "Physical Activity", "Compassion", "Teamwork"],
      tags: ["Community", "Animals", "Welfare"]
    },
    {
      id: "11",
      title: "Heritage Trail Guide",
      organisation: "Singapore Heritage",
      location: "Chinatown",
      category: "Arts & Culture",
      startDate: "2025-03-15",
      endDate: "2025-06-15",
      duration: "2h, Weekends",
      serviceHours: 18,
      maxVolunteers: 10,
      currentVolunteers: 10,
      latitude: 1.2838,
      longitude: 103.8436,
      isRemote: false,
      status: "full",
      applicationDeadline: "2025-02-25",
      description: "Guide tours through Singapore's cultural heritage sites.",
      skills: ["Public Speaking", "History", "Communication", "Storytelling"],
      tags: ["Arts", "Culture", "Heritage", "Tourism"]
    },
    {
      id: "12",
      title: "Youth Sports Coaching",
      organisation: "Sports for All",
      location: "Clementi",
      category: "Sports & Leisure",
      startDate: "2025-02-22",
      endDate: "2025-07-22",
      duration: "2h, Every Friday",
      serviceHours: 35,
      maxVolunteers: 18,
      currentVolunteers: 11,
      latitude: 1.3162,
      longitude: 103.7649,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-12",
      description: "Coach underprivileged youth in various sports activities.",
      skills: ["Sports", "Leadership", "Teamwork", "Coaching"],
      tags: ["Community", "Sports", "Youth", "Coaching"]
    },
    {
      id: "13",
      title: "Environmental Education Workshop",
      organisation: "Green Singapore",
      location: "Woodlands",
      category: "Environment",
      startDate: "2025-03-08",
      endDate: "2025-04-08",
      duration: "2h, Monthly",
      serviceHours: 16,
      maxVolunteers: 22,
      currentVolunteers: 9,
      latitude: 1.4382,
      longitude: 103.7891,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-25",
      description: "Conduct workshops on environmental conservation and sustainability.",
      skills: ["Teaching", "Environmental Science", "Presentation", "Public Speaking"],
      tags: ["Environment", "Education", "Workshop", "Sustainability"]
    },
    {
      id: "14",
      title: "Hospital Companionship Program",
      organisation: "Care & Comfort",
      location: "Novena",
      category: "Community",
      startDate: "2025-02-28",
      endDate: "2025-08-28",
      duration: "3h, Biweekly",
      serviceHours: 45,
      maxVolunteers: 15,
      currentVolunteers: 6,
      latitude: 1.3202,
      longitude: 103.8438,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-18",
      description: "Provide companionship to patients in hospitals.",
      skills: ["Empathy", "Active Listening", "Patience", "Care"],
      tags: ["Healthcare", "Hospital", "Companionship", "Elderly"]
    },
    {
      id: "15",
      title: "Digital Literacy for Seniors",
      organisation: "Tech Seniors",
      location: "Bedok",
      category: "Elderly",
      startDate: "2025-03-12",
      endDate: "2025-06-12",
      duration: "2h, Weekly",
      serviceHours: 28,
      maxVolunteers: 16,
      currentVolunteers: 7,
      latitude: 1.3236,
      longitude: 103.9273,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-03-01",
      description: "Teach elderly residents how to use smartphones and computers.",
      skills: ["Teaching", "Patience", "Technology", "Communication"],
      tags: ["Education", "Technology", "Elderly", "Digital", "Mentoring"]
    },
    {
      id: "16",
      title: "Education Support in Rural Cambodia",
      organisation: "SMU Global Outreach",
      location: "Cambodia",
      category: "Mentoring",
      type: "overseas",
      startDate: "2025-06-01",
      endDate: "2025-06-14",
      duration: "Full day, 2 weeks",
      serviceHours: 100,
      maxVolunteers: 20,
      currentVolunteers: 12,
      latitude: null,
      longitude: null,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-04-15",
      description: "Teach English and basic computer skills to children in rural Cambodian schools. Immersive cultural experience with accommodation provided.",
      skills: ["Teaching", "Adaptability", "Cross-cultural Communication", "Patience"],
      tags: ["Overseas", "Education", "Teaching", "Cambodia", "Youth"]
    },
    {
      id: "17",
      title: "Marine Conservation Project - Thailand",
      organisation: "Ocean Guardians International",
      location: "Phuket, Thailand",
      category: "Environment",
      type: "overseas",
      startDate: "2025-07-05",
      endDate: "2025-07-19",
      duration: "Full day, 2 weeks",
      serviceHours: 120,
      maxVolunteers: 15,
      currentVolunteers: 8,
      latitude: null,
      longitude: null,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-05-01",
      description: "Participate in coral reef restoration, marine wildlife surveys, and beach cleanups. Contribute to preserving Thailand's coastal ecosystems.",
      skills: ["Swimming", "Marine Biology", "Physical Fitness", "Teamwork"],
      tags: ["Overseas", "Environment", "Conservation", "Thailand", "Marine Life"]
    },
    {
      id: "18",
      title: "Virtual Tech Mentorship - Philippines",
      organisation: "Code for Communities",
      location: "Remote",
      category: "Coding",
      type: "overseas",
      startDate: "2025-03-20",
      endDate: "2025-08-20",
      duration: "2h, Weekly",
      serviceHours: 50,
      maxVolunteers: 30,
      currentVolunteers: 15,
      latitude: null,
      longitude: null,
      isRemote: true,
      status: "open",
      applicationDeadline: "2025-03-10",
      description: "Mentor Filipino students in web development and programming remotely. Flexible schedule with virtual sessions.",
      skills: ["Programming", "Web Development", "Mentoring", "Communication"],
      tags: ["Overseas", "Coding", "Virtual", "Philippines", "Youth", "Technology"]
    },
    {
      id: "19",
      title: "Community Building in Nepal",
      organisation: "Habitat for Humanity Asia",
      location: "Kathmandu, Nepal",
      category: "Community",
      type: "overseas",
      startDate: "2025-05-15",
      endDate: "2025-05-29",
      duration: "Full day, 2 weeks",
      serviceHours: 110,
      maxVolunteers: 25,
      currentVolunteers: 18,
      latitude: null,
      longitude: null,
      isRemote: false,
      status: "closing-soon",
      applicationDeadline: "2025-03-30",
      description: "Help build homes and community facilities for families in need. Hands-on construction work with local communities.",
      skills: ["Physical Activity", "Teamwork", "Construction", "Leadership"],
      tags: ["Overseas", "Community", "Building", "Nepal", "Housing"]
    },
    {
      id: "20",
      title: "Orphanage Care Program - Vietnam",
      organisation: "Children First Asia",
      location: "Ho Chi Minh City, Vietnam",
      category: "Community",
      type: "overseas",
      startDate: "2025-08-01",
      endDate: "2025-08-21",
      duration: "Full day, 3 weeks",
      serviceHours: 150,
      maxVolunteers: 12,
      currentVolunteers: 5,
      latitude: null,
      longitude: null,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-06-01",
      description: "Provide care, education, and companionship to children at an orphanage. Teach English, organize activities, and support daily operations.",
      skills: ["Childcare", "Teaching", "Empathy", "Creativity"],
      tags: ["Overseas", "Children", "Orphanage", "Vietnam", "Care"]
    },
  ];

  const categories = [
    "all", "Community", "Mentoring", "Environment", "Elderly", "Arts & Culture", "Animal Welfare", "Sports & Leisure", "Coding"
  ];

  // Enhanced filtering with all criteria
  const filteredCSPs = cspLocations.filter(csp => {
    // Category filter
    const matchesCategory = selectedCategory === "all" || csp.category === selectedCategory;
    
    // Type filter
    const cspType = (csp as any).type || "local"; // Default to local if not specified
    const matchesType = typeFilter === "all" || cspType === typeFilter;
    
    // Search query
    const query = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      csp.title.toLowerCase().includes(query) ||
      csp.organisation.toLowerCase().includes(query) ||
      csp.location.toLowerCase().includes(query) ||
      csp.category.toLowerCase().includes(query) ||
      csp.description.toLowerCase().includes(query) ||
      csp.skills.some(skill => skill.toLowerCase().includes(query)) ||
      (csp.tags && csp.tags.some(tag => tag.toLowerCase().includes(query)));
    
    // Location filter - only apply if type is "local" or "all" (or if location is "Remote")
    const matchesLocation = locationFilter === "all" || locationFilter === "" || 
      (cspType === "overseas" && (csp.location === "Remote" || csp.isRemote)) ||
      (cspType === "local" && csp.location.toLowerCase().includes(locationFilter.toLowerCase()));
    
    // Date filters
    const cspStartDate = new Date(csp.startDate);
    const cspEndDate = new Date(csp.startDate); // Using startDate as placeholder
    const matchesStartDate = startDate === "" || cspStartDate >= new Date(startDate);
    const matchesEndDate = endDate === "" || cspEndDate <= new Date(endDate);
    
    // Duration filter (multi-select)
    const matchesDuration = selectedDurations.length === 0 || selectedDurations.some(duration => {
      const cspDuration = (csp as any).duration || '';
      const durationLower = cspDuration.toLowerCase();
      
      if (duration === "1-hour" && durationLower.includes('1h')) return true;
      if (duration === "2-hour" && durationLower.includes('2h')) return true;
      if (duration === "3-hour" && durationLower.includes('3h')) return true;
      if (duration === "4-hour" && durationLower.includes('4h')) return true;
      if (duration === "full-day" && durationLower.includes('full day')) return true;
      if (duration === "one-time" && durationLower.includes('one-time')) return true;
      return false;
    });
    
    return matchesCategory && matchesType && matchesSearch && matchesLocation && 
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
                      placeholder="Search for CSPs, organisations, or skills..."
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

            {/* Type */}
            <div className="flex-1 lg:flex-[1.5] space-y-2">
              <Label className="text-sm font-body font-medium text-foreground">Type</Label>
              <Select value={typeFilter} onValueChange={(val) => { 
                setTypeFilter(val); 
                updateURL({ type: val });
                resetPagination(); 
              }}>
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
            <div className="flex-1 lg:flex-[1.5] space-y-2">
              <Label className="text-sm font-body font-medium text-foreground">Location</Label>
              <Select value={locationFilter} onValueChange={(val) => { 
                setLocationFilter(val); 
                updateURL({ location: val });
                resetPagination(); 
              }} disabled={typeFilter === "overseas" && locationFilter !== "Remote"}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder={typeFilter === "overseas" ? "N/A (Overseas)" : "All Locations"} />
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
                  <Label className="text-sm font-body font-medium text-foreground">
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
              {paginatedCSPs.map((csp) => {
                const statusBadge = getStatusBadge(csp.status);
                const duration = (csp as any).duration || `${csp.serviceHours}h`;
                
                return (
                  <Card key={csp.id} className="hover:shadow-lg transition-shadow cursor-pointer group flex flex-col h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <div className="flex flex-wrap gap-1">
                          <Badge className={`text-xs ${getCategoryColor(csp.category)}`}>
                            {csp.category}
                          </Badge>
                          <Badge className={`text-xs ${statusBadge.className}`}>
                            {statusBadge.label}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className="font-heading text-lg group-hover:text-primary transition-colors">
                        {csp.title}
                      </CardTitle>
                      <CardDescription className="font-body">
                        {csp.organisation}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground font-body line-clamp-2">
                        {csp.description}
                      </p>
                      
                      {/* Location + Duration Row */}
                      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="font-body truncate">{csp.location}</span>
                        </div>
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span className="font-body truncate">{duration}</span>
                        </div>
                      </div>

                      {/* Date + Volunteers Row */}
                      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="font-body truncate">{formatDateRange(csp.startDate, csp.startDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span className="font-body">{csp.currentVolunteers}/{csp.maxVolunteers}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {csp.skills.slice(0, window.innerWidth >= 1280 ? 3 : 2).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {csp.skills.length > (window.innerWidth >= 1280 ? 3 : 2) && (
                          <Badge variant="outline" className="text-xs">
                            +{csp.skills.length - (window.innerWidth >= 1280 ? 3 : 2)}
                          </Badge>
                        )}
                      </div>
                    </div>

                      <Link to="/csp/$cspId" params={{ cspId: csp.id }}>
                        <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="space-y-4">
              {paginatedCSPs.map((csp) => {
                const statusBadge = getStatusBadge(csp.status);
                const duration = (csp as any).duration || `${csp.serviceHours}h`;
                
                return (
                  <Card key={csp.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Left: Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={`text-xs ${getCategoryColor(csp.category)}`}>
                                  {csp.category}
                                </Badge>
                                <Badge className={`text-xs ${statusBadge.className}`}>
                                  {statusBadge.label}
                                </Badge>
                              </div>
                              <h3 className="font-heading text-xl font-semibold group-hover:text-primary transition-colors">
                                {csp.title}
                              </h3>
                              <p className="text-muted-foreground font-body">
                                {csp.organisation}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>

                          <p className="text-sm text-muted-foreground font-body line-clamp-2">
                            {csp.description}
                          </p>

                          {/* Location + Duration Row */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span className="font-body">{csp.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span className="font-body">{duration}</span>
                            </div>
                          </div>

                          {/* Date + Volunteers Row */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span className="font-body">{formatDateRange(csp.startDate, csp.startDate)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span className="font-body">{csp.currentVolunteers}/{csp.maxVolunteers}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {csp.skills.slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
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
                        <div className="flex md:flex-col items-center md:items-end gap-3">
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
                onClick={() => {
                  setCurrentPage(prev => Math.max(1, prev - 1));
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                    className="w-10 h-10 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage(prev => Math.min(totalPages, prev + 1));
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
