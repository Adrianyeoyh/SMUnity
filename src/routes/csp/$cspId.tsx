import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Separator } from "#client/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "#client/components/ui/dialog";
import { Label } from "#client/components/ui/label";
import { Textarea } from "#client/components/ui/textarea";
import { Progress } from "#client/components/ui/progress";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Heart,
  Share2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  Send,
  Target,
  Award,
  Globe,
  Building2,
  Mail,
  Phone
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "#client/hooks/use-auth";
import { LoginModal } from "#client/components/loginModal";

export const Route = createFileRoute("/csp/$cspId")({
  component: CspDetail,
});

// Helper functions from discover page
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

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    "open": { label: "Open", className: "bg-green-500 hover:bg-green-600 text-white" },
    "closing-soon": { label: "Closing Soon", className: "bg-yellow-500 hover:bg-yellow-600 text-white" },
    "full": { label: "Full", className: "bg-gray-500 hover:bg-gray-600 text-white" },
    "closed": { label: "Closed", className: "bg-red-500 hover:bg-red-600 text-white" },
  };
  return statusConfig[status] || statusConfig["open"];
};

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

function CspDetail() {
const { isLoggedIn } = useAuth();
const [showLoginModal, setShowLoginModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [applicationData, setApplicationData] = useState({
    motivation: "",
    experience: "",
    availability: "",
    additionalNotes: ""
  });
  const sidebarButtonRef = useRef<HTMLDivElement>(null);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Application Successfully Submitted!", {
      description: "The CSP organisation will review your application and get back to you shortly.",
      className: "bg-green-50 border border-green-200 font-body",
      position: "top-right",
      style: {
        backgroundColor: "#f0fdf4",
        color: "#166534",
        border: "1px solid #bbf7d0",
      },
    });
    setShowApplicationDialog(false);
    setApplicationData({
      motivation: "",
      experience: "",
      availability: "",
      additionalNotes: ""
    });
  };

  // Check if sidebar button is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show floating button when sidebar button is NOT visible
        setShowFloatingButton(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '0px'
      }
    );

    if (sidebarButtonRef.current) {
      observer.observe(sidebarButtonRef.current);
    }

    return () => {
      if (sidebarButtonRef.current) {
        observer.unobserve(sidebarButtonRef.current);
      }
    };
  }, []);

  // Mock data - in real app, this would come from the route params and API
  const csp = {
    id: "1",
    title: "Project Candela",
    organization: "SMU Rotaract",
    location: "Kranji",
    category: "Community",
    type: "local",
    startDate: "2025-03-15",
    endDate: "2025-06-15",
    duration: "2h, Every Tuesday",
    applicationDeadline: "2025-02-28",
    serviceHours: 40,
    maxVolunteers: 15,
    currentVolunteers: 8,
    isRemote: false,
    status: "open",
    description: `Join us to challenge and debunk negative stereotypes surrounding foreign workers while raising awareness among Singaporeans about the experiences and contributions of migrant workers.

What You'll Do:
• Engage with migrant workers and hear their stories
• Organize awareness campaigns and events
• Create educational content for social media
• Facilitate dialogue sessions between communities
• Document stories and experiences

Requirements:
• Open-minded and culturally sensitive
• Strong communication skills
• Commitment to attend all sessions
• Passion for social justice

What We Provide:
• Comprehensive training and orientation
• Mentorship from experienced volunteers
• Certificate of completion
• Networking opportunities with social sector professionals`,
    requirements: "Open-minded, culturally sensitive, strong communication skills",
    skills: ["Communication", "Patience", "Teaching", "Empathy"],
    tags: ["Migrant", "Migrant Workers", "Community"],
    images: [
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800"
    ],
    organizationInfo: {
      name: "SMU Rotaract",
      description: "SMU Rotaract is a student-led community service organization dedicated to creating positive social impact through meaningful projects and initiatives.",
      website: "https://smurotaract.org",
      email: "rotaract@smu.edu.sg",
      phone: "+65 6828 0100",
      address: "Singapore Management University, 81 Victoria Street, Singapore 188065",
      isVerified: true,
      foundedYear: 2010,
      totalProjects: 45,
      totalVolunteers: 1200
    }
  };

  const statusBadge = getStatusBadge(csp.status);
  const isApplicationOpen = csp.status === "open" || csp.status === "closing-soon";
  const spotsLeft = csp.maxVolunteers - csp.currentVolunteers;
  const fillRate = Math.round((csp.currentVolunteers / csp.maxVolunteers) * 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Link 
          to="/discover" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="font-body">Back to Discover</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`text-xs ${getCategoryColor(csp.category)}`}>
                  {csp.category}
                </Badge>
                <Badge className={`text-xs ${statusBadge.className}`}>
                  {statusBadge.label}
                </Badge>
                {csp.type === "overseas" && (
                  <Badge variant="outline" className="text-xs">
                    <Globe className="mr-1 h-3 w-3" />
                    Overseas
                  </Badge>
                )}
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                    {csp.title}
                  </h1>
                  <div className="flex items-center gap-2 text-lg text-muted-foreground">
                    <Building2 className="h-5 w-5" />
                    <span className="font-body">{csp.organization}</span>
                    {csp.organizationInfo.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 flex-shrink-0">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleFavorite}
                    className={isFavorite ? "text-red-500 border-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="flex flex-col items-center text-center space-y-1">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground font-body">Location</span>
                  <span className="text-sm font-medium font-body">{csp.location}</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-1">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground font-body">Duration</span>
                  <span className="text-sm font-medium font-body">{csp.duration}</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-1">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground font-body">Start Date</span>
                  <span className="text-sm font-medium font-body">{formatDateRange(csp.startDate, csp.startDate)}</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-1">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground font-body">Service Hours</span>
                  <span className="text-sm font-medium font-body">{csp.serviceHours}h</span>
                </div>
              </div>
            </div>

            {/* Images Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {csp.images.map((image, index) => (
                <div key={index} className="aspect-video rounded-xl overflow-hidden bg-muted/50 border shadow-sm hover:shadow-md transition-shadow">
                  <img 
                    src={image} 
                    alt={`${csp.title} image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/800x450/e5e7eb/64748b?text=Project+Image+${index + 1}`;
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  About This Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none font-body text-foreground">
                  {csp.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                      {paragraph.split('\n').map((line, i) => {
                        // Bold section headings (lines ending with :)
                        const isSectionHeading = line.trim().endsWith(':') && !line.includes('•');
                        return (
                          <span key={i}>
                            {isSectionHeading ? <strong>{line}</strong> : line}
                            {i < paragraph.split('\n').length - 1 && <br />}
                          </span>
                        );
                      })}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills & Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">Skills & Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3 font-body flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Skills You'll Need:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {csp.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-sm py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2 font-body flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    Requirements:
                  </h4>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {csp.requirements}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Organization Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-heading text-xl">About {csp.organizationInfo.name}</CardTitle>
                    <CardDescription className="mt-1 font-body">
                      {csp.organizationInfo.isVerified && (
                        <span className="inline-flex items-center text-green-600 text-sm">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Verified Organization
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {csp.organizationInfo.description}
                  </p>

                  {/* Organization Stats */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary font-heading">{csp.organizationInfo.foundedYear}</div>
                      <div className="text-xs text-muted-foreground font-body">Founded</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary font-heading">{csp.organizationInfo.totalProjects}+</div>
                      <div className="text-xs text-muted-foreground font-body">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary font-heading">{csp.organizationInfo.totalVolunteers}+</div>
                      <div className="text-xs text-muted-foreground font-body">Volunteers</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-3 text-sm">
                    <h4 className="font-medium font-body">Contact Information:</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="font-body text-muted-foreground">{csp.organizationInfo.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <a href={`mailto:${csp.organizationInfo.email}`} className="font-body text-primary hover:text-primary/80">
                          {csp.organizationInfo.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <a href={`tel:${csp.organizationInfo.phone}`} className="font-body text-muted-foreground hover:text-foreground">
                          {csp.organizationInfo.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <a 
                          href={csp.organizationInfo.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-body text-primary hover:text-primary/80"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Project Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {csp.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Application Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Application</CardTitle>
                <CardDescription className="font-body">
                  {isApplicationOpen ? "Submit your application now" : "Applications are closed"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isApplicationOpen ? (
                  <>
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-body">Spots Filled</span>
                        <span className="font-medium font-body">{csp.currentVolunteers}/{csp.maxVolunteers}</span>
                      </div>
                      <Progress value={fillRate} className="h-2" />
                      <p className="text-xs text-muted-foreground font-body">
                        {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} remaining
                      </p>
                    </div>

                    <Separator />

                    {/* Key Dates */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-body">Application Deadline:</span>
                        <span className="font-medium font-body text-right">
                          {formatDateRange(csp.applicationDeadline, csp.applicationDeadline)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-body">Project Period:</span>
                        <span className="font-medium font-body text-right">
                          {formatDateRange(csp.startDate, csp.endDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-body">Time Commitment:</span>
                        <span className="font-medium font-body text-right">{csp.duration}</span>
                      </div>
                    </div>

                    <Separator />

                    {/* CSU Module Reminder */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-blue-900 font-body">
                          Complete CSU module on eLearn before applying
                        </p>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div ref={sidebarButtonRef}>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => {
                          if (!isLoggedIn) {
                            // User not logged in → show login modal
                            setShowLoginModal(true);
                          } else {
                            // User logged in → open application form
                            setShowApplicationDialog(true);
                          }
                        }}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Apply for this CSP
                      </Button>


                      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
                        
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="font-heading text-2xl">Apply for {csp.title}</DialogTitle>
                          <DialogDescription className="font-body">
                            Tell us why you'd be a great fit for this community service project
                          </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleApplicationSubmit} className="space-y-6 mt-4">
                          {/* CSU Module Reminder */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-heading font-semibold text-yellow-900 mb-1">
                                Important: Complete CSU Module First
                              </h4>
                              <p className="text-sm text-yellow-800 font-body">
                                Before applying, ensure you've completed the Community Service Unit (CSU) module on eLearn.
                              </p>
                            </div>
                          </div>

                          {/* Application Form */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="motivation" className="font-body font-medium">
                                Why do you want to join this CSP? *
                              </Label>
                              <Textarea
                                id="motivation"
                                placeholder="Share your motivation and what draws you to this project..."
                                className="min-h-[120px] font-body"
                                value={applicationData.motivation}
                                onChange={(e) => setApplicationData({...applicationData, motivation: e.target.value})}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="experience" className="font-body font-medium">
                                Relevant Experience
                              </Label>
                              <Textarea
                                id="experience"
                                placeholder="Describe any relevant experience or skills you have..."
                                className="min-h-[100px] font-body"
                                value={applicationData.experience}
                                onChange={(e) => setApplicationData({...applicationData, experience: e.target.value})}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="availability" className="font-body font-medium">
                                Availability *
                              </Label>
                              <Textarea
                                id="availability"
                                placeholder="When are you available? Please mention specific days/times..."
                                className="min-h-[80px] font-body"
                                value={applicationData.availability}
                                onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="notes" className="font-body font-medium">
                                Additional Notes
                              </Label>
                              <Textarea
                                id="notes"
                                placeholder="Any other information you'd like to share..."
                                className="min-h-[80px] font-body"
                                value={applicationData.additionalNotes}
                                onChange={(e) => setApplicationData({...applicationData, additionalNotes: e.target.value})}
                              />
                            </div>
                          </div>

                          {/* Submit Buttons */}
                          <div className="flex gap-3 pt-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => setShowApplicationDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              className="flex-1"
                              disabled={!applicationData.motivation || !applicationData.availability}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Submit Application
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-3 py-6">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="font-medium text-foreground font-body mb-1">
                        Applications Closed
                      </p>
                      <p className="text-sm text-muted-foreground font-body">
                        The application deadline has passed
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Project Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-body">Current Applicants</span>
                  <span className="font-medium font-body">{csp.currentVolunteers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-body">Total Capacity</span>
                  <span className="font-medium font-body">{csp.maxVolunteers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-body">Fill Rate</span>
                  <span className="font-medium font-body">{fillRate}%</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-body">Total Service Hours</span>
                  <span className="font-medium font-body">{csp.serviceHours}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-body">Project Type</span>
                  <Badge variant="outline" className="text-xs">
                    {csp.type === "overseas" ? "Overseas" : "Local"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Additional Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground font-body">
                  Have questions about this CSP? Get in touch with the organization directly.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <a href={`mailto:${csp.organizationInfo.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <a href={csp.organizationInfo.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Website
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Floating Apply Button - Only when sidebar button not visible */}
        {isApplicationOpen && showFloatingButton && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
              <DialogTrigger asChild>
                <Button size="lg" className="shadow-2xl hover:shadow-xl transition-shadow">
                  <Send className="mr-2 h-5 w-5" />
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl">Apply for {csp.title}</DialogTitle>
                  <DialogDescription className="font-body">
                    Tell us why you'd be a great fit for this community service project
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleApplicationSubmit} className="space-y-6 mt-4">
                  {/* CSU Module Reminder */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-heading font-semibold text-yellow-900 mb-1">
                        Important: Complete CSU Module First
                      </h4>
                      <p className="text-sm text-yellow-800 font-body">
                        Before applying, ensure you've completed the Community Service Unit (CSU) module on eLearn.
                      </p>
                    </div>
                  </div>

                  {/* Application Form */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="motivation-float" className="font-body font-medium">
                        Why do you want to join this CSP? *
                      </Label>
                      <Textarea
                        id="motivation-float"
                        placeholder="Share your motivation and what draws you to this project..."
                        className="min-h-[120px] font-body"
                        value={applicationData.motivation}
                        onChange={(e) => setApplicationData({...applicationData, motivation: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience-float" className="font-body font-medium">
                        Relevant Experience
                      </Label>
                      <Textarea
                        id="experience-float"
                        placeholder="Describe any relevant experience or skills you have..."
                        className="min-h-[100px] font-body"
                        value={applicationData.experience}
                        onChange={(e) => setApplicationData({...applicationData, experience: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability-float" className="font-body font-medium">
                        Availability *
                      </Label>
                      <Textarea
                        id="availability-float"
                        placeholder="When are you available? Please mention specific days/times..."
                        className="min-h-[80px] font-body"
                        value={applicationData.availability}
                        onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes-float" className="font-body font-medium">
                        Additional Notes
                      </Label>
                      <Textarea
                        id="notes-float"
                        placeholder="Any other information you'd like to share..."
                        className="min-h-[80px] font-body"
                        value={applicationData.additionalNotes}
                        onChange={(e) => setApplicationData({...applicationData, additionalNotes: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowApplicationDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={!applicationData.motivation || !applicationData.availability}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit Application
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      <LoginModal
      open={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      redirectTo={`/csp/${csp.id}`}
    />
    </div>
  );
}
