import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Input } from "#client/components/ui/input";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Heart,
  Star,
  ArrowRight,
  BookOpen,
  Target,
  Users2,
  TreePine,
  PawPrint,
  Trophy,
  Code
} from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
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

function Index() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const fullText = "SMUnity";
  const typingSpeed = 1000 / fullText.length;
  const deletingSpeed = 50; 
  const pauseAfterTyping = 3000;
  const pauseBeforeRestart = 1000;

  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let typingInterval: NodeJS.Timeout;

    const type = () => {
      if (!isDeleting && currentIndex <= fullText.length) {
        // Typing forward
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else if (!isDeleting && currentIndex > fullText.length) {
        // Pause before deleting
        isDeleting = true;
        clearInterval(typingInterval);
        setTimeout(() => {
          typingInterval = setInterval(type, deletingSpeed);
        }, pauseAfterTyping);
        return;
      } else if (isDeleting && currentIndex > 0) {
        // Deleting backward
        currentIndex--;
        setTypedText(fullText.slice(0, currentIndex));
      } else if (isDeleting && currentIndex === 0) {
        // Restart typing
        isDeleting = false;
        clearInterval(typingInterval);
        setTimeout(() => {
          typingInterval = setInterval(type, typingSpeed);
        }, pauseBeforeRestart);
        return;
      }
    };

    typingInterval = setInterval(type, typingSpeed);

    return () => clearInterval(typingInterval);
  }, []);
  // Mock data for demonstration
  const featuredCSPs = [
    {
      id: "1",
      title: "Project Candela",
      organization: "SMU Rotaract",
      location: "Kranji",
      category: "Community",
      startDate: "2025-03-15",
      endDate: "2025-06-15",
      duration: "2h, Every Tuesday",
      serviceHours: 40,
      maxVolunteers: 15,
      currentVolunteers: 8,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-28",
      description: "Join us to challenge and debunk negative stereotypes surrounding foreign workers while raising awareness among Singaporeans about the experiences and contributions of migrant workers.",
      skills: ["Communication", "Patience", "Teaching", "Empathy"],
      tags: ["Migrant", "Migrant Workers", "Community"]
    },
    {
      id: "2", 
      title: "Environmental Cleanup at East Coast Park",
      organization: "Green Singapore",
      location: "East Coast Park",
      category: "Environment",
      startDate: "2025-02-20",
      endDate: "2025-02-20",
      duration: "4h, One-time",
      serviceHours: 8,
      maxVolunteers: 50,
      currentVolunteers: 48,
      isRemote: false,
      status: "closing-soon",
      applicationDeadline: "2025-02-15",
      description: "Join us for a beach cleanup initiative to keep Singapore's coastline clean and beautiful.",
      skills: ["Teamwork", "Physical Activity", "Outdoor"],
      tags: ["Environment", "Beach", "Cleanup"]
    },
    {
      id: "3",
      title: "Virtual Mentoring Program",
      organization: "Youth Connect",
      location: "Remote",
      category: "Mentoring",
      startDate: "2025-03-01",
      endDate: "2025-08-31",
      duration: "1h, Weekly",
      serviceHours: 60,
      maxVolunteers: 25,
      currentVolunteers: 25,
      isRemote: true,
      status: "full",
      applicationDeadline: "2025-02-10",
      description: "Provide virtual mentorship to at-risk youth through online sessions and activities.",
      skills: ["Mentoring", "Communication", "Leadership", "Active Listening"],
      tags: ["Mentoring", "Youth", "Virtual"]
    },
    {
      id: "4",
      title: "Elderly Home Visitation Program",
      organization: "Silver Care Association",
      location: "Bishan",
      category: "Elderly",
      startDate: "2025-02-01",
      endDate: "2025-06-30",
      duration: "2h, Biweekly",
      serviceHours: 30,
      maxVolunteers: 20,
      currentVolunteers: 5,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-01-25",
      description: "Visit and spend quality time with elderly residents. Bring joy and companionship to seniors in our community.",
      skills: ["Empathy", "Communication", "Patience", "Care"],
      tags: ["Healthcare", "Elderly", "Companionship"]
    },
    {
      id: "5",
      title: "Community Arts Workshop",
      organization: "Creative Hearts SG",
      location: "Toa Payoh",
      category: "Arts & Culture",
      startDate: "2025-03-05",
      endDate: "2025-04-15",
      duration: "3h, Every Saturday",
      serviceHours: 20,
      maxVolunteers: 12,
      currentVolunteers: 7,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-20",
      description: "Conduct art workshops for children and families in the community. Share your creativity and inspire others.",
      skills: ["Arts", "Teaching", "Creativity", "Patience"],
      tags: ["Arts", "Culture", "Workshop"]
    },
    {
      id: "6",
      title: "Food Distribution Drive",
      organization: "Food4All Singapore",
      location: "Jurong",
      category: "Community",
      startDate: "2025-02-25",
      endDate: "2025-02-25",
      duration: "3h, One-time",
      serviceHours: 6,
      maxVolunteers: 30,
      currentVolunteers: 18,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-20",
      description: "Help distribute food packages to families in need. Make a direct impact in fighting food insecurity.",
      skills: ["Teamwork", "Organization", "Physical Activity", "Service"],
      tags: ["Community", "Food", "One-time"]
    }
  ];

  const categories = [
    { value: "Community", label: "Community" },
    { value: "Mentoring", label: "Mentoring" },
    { value: "Environment", label: "Environment" },
    { value: "Elderly", label: "Elderly" },
    { value: "Arts & Culture", label: "Arts & Culture" },
    { value: "Animal Welfare", label: "Animal Welfare" },
    { value: "Sports & Leisure", label: "Sports & Leisure" },
    { value: "Coding", label: "Coding" }
  ];

  // Filter CSPs based on search and category
  const filteredFeaturedCSPs = featuredCSPs.filter(csp => {
    const matchesCategory = selectedCategory === "all" || csp.category === selectedCategory;
    
    if (searchQuery === "") return matchesCategory;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      csp.title.toLowerCase().includes(query) ||
      csp.organization.toLowerCase().includes(query) ||
      csp.location.toLowerCase().includes(query) ||
      csp.category.toLowerCase().includes(query) ||
      csp.description.toLowerCase().includes(query) ||
      csp.skills.some(skill => skill.toLowerCase().includes(query)) ||
      csp.tags.some(tag => tag.toLowerCase().includes(query));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
              Find Your Perfect{" "}
              <span style={{ color: 'oklch(0.45 0.15 200)' }}>Community Service</span>
              {" "}Project with{" "}
              <span className="text-gradient-smunity">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            </h1>
            <p className="text-xl text-muted-foreground font-body mb-12 max-w-2xl mx-auto">
              Connect with meaningful volunteer opportunities that align with your interests, 
              schedule, and SMU graduation requirements.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for CSPs, organisations, or skills..."
                  className="pl-12 pr-4 py-4 text-lg h-14 rounded-xl border-2 focus:border-transparent focus:outline-none focus:ring-0 placeholder:opacity-100 focus:placeholder:opacity-0 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate({ to: "/discover", search: { q: searchQuery } });
                    }
                  }}
                  onFocus={(e) => e.target.placeholder = ""}
                  onBlur={(e) => e.target.placeholder = "Search for CSPs, organisations, or skills..."}
                />
                <Button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6"
                  onClick={() => {
                    // Navigate to Discover page with search query
                    navigate({ to: "/discover", search: { q: searchQuery } });
                  }}
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary font-heading">150+</div>
                <div className="text-muted-foreground font-body">Active CSPs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#34d399] font-heading">2,500+</div>
                <div className="text-muted-foreground font-body">Students Helped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary font-heading">50+</div>
                <div className="text-muted-foreground font-body">Partner Organisations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground font-body">
              Find CSPs that match your interests and passion
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary/5 hover:border-primary transition-colors"
                onClick={() => {
                  // Navigate to Discover page with category filter
                  navigate({ to: "/discover", search: { category: category.value } });
                }}
              >
                <div className="text-2xl">
                  {category.value === "Community" && <Users className="h-6 w-6" />}
                  {category.value === "Mentoring" && <BookOpen className="h-6 w-6" />}
                  {category.value === "Environment" && <TreePine className="h-6 w-6" />}
                  {category.value === "Elderly" && <Heart className="h-6 w-6" />}
                  {category.value === "Arts & Culture" && <Star className="h-6 w-6" />}
                  {category.value === "Animal Welfare" && <PawPrint className="h-6 w-6" />}
                  {category.value === "Sports & Leisure" && <Trophy className="h-6 w-6" />}
                  {category.value === "Coding" && <Code className="h-6 w-6" />}
                </div>
                <span className="text-sm font-medium">{category.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured CSPs Section */}
      <section id="featured-csps" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                {searchQuery || selectedCategory !== "all" ? "Search Results" : "Featured CSPs"}
              </h2>
              <p className="text-muted-foreground font-body">
                {searchQuery || selectedCategory !== "all" 
                  ? `Found ${filteredFeaturedCSPs.length} CSP${filteredFeaturedCSPs.length !== 1 ? 's' : ''}`
                  : "Discover popular and trending community service projects"
                }
              </p>
            </div>
            <Link to="/discover">
              <Button variant="outline" className="hidden md:flex">
                View All CSPs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeaturedCSPs.map((csp) => {
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
                      {csp.organization}
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
                          <span className="truncate">{csp.location}</span>
                        </div>
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{duration}</span>
                        </div>
                      </div>

                      {/* Date + Volunteers Row */}
                      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{formatDateRange(csp.startDate, csp.startDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span>{csp.currentVolunteers}/{csp.maxVolunteers}</span>
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
                        {csp.status === "full" || csp.status === "closed" ? "View Details" : "Apply Now"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredFeaturedCSPs.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold mb-2">No CSPs Found</h3>
              <p className="text-muted-foreground font-body mb-4">
                No community service projects match your search criteria.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/discover">
              <Button variant="outline">
                View All CSPs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of SMU students who are already making an impact in their communities. 
            Start your community service journey today!
          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/discover">
              <Button size="lg" variant="secondary" className="text-primary">
                Discover CSPs
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button size="lg" variant="outline" className="border-primary-foreground text-black hover:bg-primary-foreground hover:text-primary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
