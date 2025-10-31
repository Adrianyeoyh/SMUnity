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
  TreePine,
  PawPrint,
  Trophy,
  Code,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

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
  const [selectedType, setSelectedType] = useState<string>("local");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideOffset, setSlideOffset] = useState(0);
  const [countCSPs, setCountCSPs] = useState(0);
  const [countPartners, setCountPartners] = useState(0);
  const [countCountries, setCountCountries] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  
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

  // Stats counting animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            const duration = 2000; // 2 seconds total
            const fps = 60; // 60 frames per second
            const totalFrames = (duration / 1000) * fps;
            const frameInterval = duration / totalFrames;
            
            let frame = 0;
            const countInterval = setInterval(() => {
              frame++;
              const progress = frame / totalFrames;
              
              // Calculate current values based on progress
              setCountCSPs(Math.floor(150 * progress));
              setCountPartners(Math.floor(430 * progress));
              setCountCountries(Math.floor(40 * progress));
              
              // Stop when animation completes
              if (frame >= totalFrames) {
                setCountCSPs(150);
                setCountPartners(430);
                setCountCountries(40);
                clearInterval(countInterval);
              }
            }, frameInterval);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  // Mock data for demonstration
  const featuredCSPs = [
    {
      id: "1",
      title: "Project Candela",
      organisation: "SMU Rotaract",
      location: "Kranji",
      category: "Community",
      type: "local",
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
      organisation: "Green Singapore",
      location: "East Coast Park",
      category: "Environment",
      type: "local",
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
      organisation: "Youth Connect",
      location: "Remote",
      category: "Mentoring",
      type: "local",
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
      organisation: "Silver Care Association",
      location: "Bishan",
      category: "Elderly",
      type: "local",
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
      organisation: "Creative Hearts SG",
      location: "Toa Payoh",
      category: "Arts & Culture",
      type: "local",
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
      organisation: "Food4All Singapore",
      location: "Jurong",
      category: "Community",
      type: "local",
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
      skills: ["Teamwork", "organisation", "Physical Activity", "Service"],
      tags: ["Community", "Food", "One-time"]
    },
    // Overseas Projects
    {
      id: "7",
      title: "Cambodia School Building Project",
      organisation: "Habitat for Humanity",
      location: "Siem Reap, Cambodia",
      category: "Community",
      type: "overseas",
      startDate: "2025-06-01",
      endDate: "2025-06-14",
      duration: "Full day, 2 weeks",
      serviceHours: 100,
      maxVolunteers: 20,
      currentVolunteers: 12,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-04-01",
      description: "Help build classrooms and facilities for underprivileged children in rural Cambodia. Make a lasting impact on education infrastructure.",
      skills: ["Construction", "Teamwork", "Physical Fitness", "Adaptability"],
      tags: ["Overseas", "Construction", "Education", "Cambodia"]
    },
    {
      id: "8",
      title: "Vietnam Community Teaching Program",
      organisation: "Global Education Initiative",
      location: "Ho Chi Minh City, Vietnam",
      category: "Mentoring",
      type: "overseas",
      startDate: "2025-07-05",
      endDate: "2025-07-19",
      duration: "Full day, 2 weeks",
      serviceHours: 120,
      maxVolunteers: 15,
      currentVolunteers: 8,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-05-01",
      description: "Teach English and basic computer skills to children in underserved communities. Experience Vietnamese culture while making a difference.",
      skills: ["Teaching", "Communication", "Patience", "Cultural Sensitivity"],
      tags: ["Overseas", "Teaching", "Education", "Vietnam"]
    },
    {
      id: "9",
      title: "Thailand Elephant Conservation",
      organisation: "Wildlife Conservation Network",
      location: "Chiang Mai, Thailand",
      category: "Animal Welfare",
      type: "overseas",
      startDate: "2025-03-20",
      endDate: "2025-08-20",
      duration: "2h, Weekly",
      serviceHours: 50,
      maxVolunteers: 30,
      currentVolunteers: 15,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-15",
      description: "Work with rescued elephants in an ethical sanctuary. Learn about conservation efforts and help care for these magnificent animals.",
      skills: ["Animal Care", "Physical Fitness", "Observation", "Compassion"],
      tags: ["Overseas", "Wildlife", "Conservation", "Thailand"]
    },
    {
      id: "10",
      title: "Indonesia Disaster Relief Support",
      organisation: "Red Cross International",
      location: "Jakarta, Indonesia",
      category: "Community",
      type: "overseas",
      startDate: "2025-05-15",
      endDate: "2025-05-29",
      duration: "Full day, 2 weeks",
      serviceHours: 110,
      maxVolunteers: 25,
      currentVolunteers: 18,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-04-01",
      description: "Assist in disaster relief efforts and community rebuilding. Provide essential support to families affected by natural disasters.",
      skills: ["Crisis Management", "Teamwork", "Resilience", "First Aid"],
      tags: ["Overseas", "Disaster Relief", "Emergency", "Indonesia"]
    },
    {
      id: "11",
      title: "Nepal Mountain School Renovation",
      organisation: "Education Without Borders",
      location: "Pokhara, Nepal",
      category: "Environment",
      type: "overseas",
      startDate: "2025-08-01",
      endDate: "2025-08-21",
      duration: "Full day, 3 weeks",
      serviceHours: 150,
      maxVolunteers: 12,
      currentVolunteers: 5,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-06-01",
      description: "Renovate and improve school facilities in remote mountain villages. Experience Himalayan culture while supporting education.",
      skills: ["Construction", "Adaptability", "Physical Fitness", "Problem Solving"],
      tags: ["Overseas", "Education", "Construction", "Nepal"]
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

  // Filter CSPs based on search, category, and type
  const filteredFeaturedCSPs = featuredCSPs.filter(csp => {
    const matchesCategory = selectedCategory === "all" || csp.category === selectedCategory;
    const matchesType = selectedType === "all" || (csp as any).type === selectedType;
    
    if (searchQuery === "") return matchesCategory && matchesType;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      csp.title.toLowerCase().includes(query) ||
      csp.organisation.toLowerCase().includes(query) ||
      csp.location.toLowerCase().includes(query) ||
      csp.category.toLowerCase().includes(query) ||
      csp.description.toLowerCase().includes(query) ||
      csp.skills.some(skill => skill.toLowerCase().includes(query)) ||
      csp.tags.some(tag => tag.toLowerCase().includes(query));
    
    return matchesCategory && matchesType && matchesSearch;
  });

  // Carousel auto-rotation - move to next item every 30 seconds
  useEffect(() => {
    if (filteredFeaturedCSPs.length === 0) return;
    
    const carouselInterval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % filteredFeaturedCSPs.length);
    }, 30000); // 30 seconds

    return () => clearInterval(carouselInterval);
  }, [filteredFeaturedCSPs.length]);

  // Show 3 cards at a time, centered around carouselIndex
  const getVisibleIndices = () => {
    if (filteredFeaturedCSPs.length === 0) return [];
    if (filteredFeaturedCSPs.length <= 3) return [0, 1, 2].slice(0, filteredFeaturedCSPs.length);
    
    const prev = (carouselIndex - 1 + filteredFeaturedCSPs.length) % filteredFeaturedCSPs.length;
    const curr = carouselIndex;
    const next = (carouselIndex + 1) % filteredFeaturedCSPs.length;
    
    return [prev, curr, next];
  };

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // Slide right first
    setSlideOffset(1);
    
    setTimeout(() => {
      // Update index
      setCarouselIndex((prev) => (prev - 1 + filteredFeaturedCSPs.length) % filteredFeaturedCSPs.length);
      setSlideOffset(0);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 700);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // Slide left first
    setSlideOffset(-1);
    
    setTimeout(() => {
      // Update index
      setCarouselIndex((prev) => (prev + 1) % filteredFeaturedCSPs.length);
      setSlideOffset(0);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 700);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20">
        <div className="container mx-auto px-4 md:px-6">
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
                  className="pl-12 pr-20 sm:pr-24 md:pr-28 py-4 text-base sm:text-lg h-14 rounded-xl border-2 focus:border-transparent focus:outline-none focus:ring-0 placeholder:opacity-100 focus:placeholder:opacity-0 transition-all placeholder:text-sm sm:placeholder:text-base"
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 sm:px-6 text-sm sm:text-base"
                  onClick={() => {
                    // Navigate to Discover page with search query
                    navigate({ to: "/discover", search: { q: searchQuery } });
                  }}
                >
                  <span className="hidden sm:inline">Search</span>
                  <Search className="h-4 w-4 sm:hidden" />
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary font-heading">{countCSPs}+</div>
                <div className="text-muted-foreground font-body">Active CSPs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#10b981] font-heading">{countPartners}+</div>
                <div className="text-muted-foreground font-body">Partner Organisations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary font-heading">{countCountries}</div>
                <div className="text-muted-foreground font-body">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About SMUnity Section */}
      <section className="pt-16 pb-20 md:pb-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="space-y-6">
            <h2 className="font-heading text-4xl font-bold text-foreground text-center md:text-left">
              Connecting <span className="text-gradient-smunity">SMU</span> with the{" "}
              <span className="text-gradient-smunity">Community</span>
            </h2>
            <p className="text-lg text-muted-foreground font-body leading-relaxed text-center md:text-left">
              Finding a volunteer cause should not be complicated. SMUnity aims to brings all your community service needs into <strong className="text-foreground">one centralised, seamless platform.</strong> Discover verified local and overseas projects, submit applications instantly, and track your service hours for CSU requirements all within SMUnity! 
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 max-w-4xl mx-auto">
              <div className="space-y-3 text-center">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#2563eb] to-[#10b981] rounded-full flex items-center justify-center">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-lg">Find Your Match</h3>
                <p className="text-sm text-muted-foreground font-body">
                  Filter by category, location, and duration to find opportunities that fit you
                </p>
              </div>
              <div className="space-y-3 text-center">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#2563eb] to-[#10b981] rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-lg">Apply with Ease</h3>
                <p className="text-sm text-muted-foreground font-body">
                  Submit applications instantly and track your status in real-time
                </p>
              </div>
              <div className="space-y-3 text-center">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#2563eb] to-[#10b981] rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-lg">Track Your Hours</h3>
                <p className="text-sm text-muted-foreground font-body">
                  Automatically log service hours with built-in CSU verification
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-10 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground font-body">
              Find projects that match your interests and passion
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
      <section id="featured-csps" className="py-12 bg-gradient-to-br from-secondary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
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

          {/* Local/Overseas Filter */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-muted/50 rounded-full p-0.5 gap-0.5">
              <button
                onClick={() => {
                  setSelectedType("local");
                  setCarouselIndex(0);
                }}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedType === "local"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                Local
              </button>
              <button
                onClick={() => {
                  setSelectedType("overseas");
                  setCarouselIndex(0);
                }}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedType === "overseas"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                Overseas
              </button>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Navigation Buttons - Desktop only */}
            {filteredFeaturedCSPs.length > 3 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-12 w-12 rounded-full shadow-lg hidden lg:flex"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-12 w-12 rounded-full shadow-lg hidden lg:flex"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            
            {/* Mobile/Tablet Grid - Below 992px */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:hidden">
              {filteredFeaturedCSPs.map((csp) => {
                const statusBadge = getStatusBadge(csp.status);
                const duration = (csp as any).duration || `${csp.serviceHours}h`;
                
                return (
                  <Card 
                    key={csp.id}
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full"
                  >
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

            {/* Desktop Carousel - 992px and above */}
            <div className="hidden lg:block relative py-6">
              <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
                <div className="relative h-[390px] flex items-center justify-center">
                  {filteredFeaturedCSPs.map((csp, idx) => {
                    const visibleIndices = getVisibleIndices();
                    const position = visibleIndices.indexOf(idx);
                    
                    // Only render cards that should be visible
                    if (position === -1) return null;
                    
                    const statusBadge = getStatusBadge(csp.status);
                    const duration = (csp as any).duration || `${csp.serviceHours}h`;
                    
                    // Calculate position: -1 (left), 0 (center), 1 (right)
                    const relativePosition = position - 1;
                    
                    return (
                      <Card 
                        key={csp.id}
                        className="absolute hover:shadow-lg cursor-pointer group flex flex-col w-[400px] h-[390px] transition-all duration-700 ease-in-out"
                        style={{
                          transform: `translateX(${(relativePosition + slideOffset) * 440}px)`,
                          opacity: 1,
                          zIndex: position === 1 ? 10 : 1
                        }}
                      >
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
              </div>
            </div>
            
            {/* Carousel Indicators - Desktop only */}
            {filteredFeaturedCSPs.length > 3 && (
              <div className="hidden lg:flex justify-center gap-2">
                {filteredFeaturedCSPs.map((_, idx) => (
                  <button
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx === carouselIndex 
                        ? 'w-8 bg-primary' 
                        : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    onClick={() => {
                      if (!isTransitioning) {
                        setIsTransitioning(true);
                        setCarouselIndex(idx);
                        setTimeout(() => setIsTransitioning(false), 700);
                      }
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
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
                  setSelectedType("local");
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
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of SMU students who are already making an impact in their communities. 
            Start your community service journey today!
          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/discover">
              <Button size="lg" variant="outline" className="text-black font-semibold">
                Discover CSPs
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
