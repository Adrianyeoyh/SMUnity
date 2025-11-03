import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Separator } from "#client/components/ui/separator";
import { fetchSavedProjects, fetchSaveProject, fetchUnsaveProject, fetchMyApplications } from "#client/api/student";

import { Progress } from "#client/components/ui/progress";
import { 
  MapPin, 
  Calendar, 
  Clock, 
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
  Phone,
  Map
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "#client/hooks/use-auth";
import { LoginModal } from "#client/components/loginModal";
import { fetchCspById } from "#client/api/public/discover.ts";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/csp/$projectID")({
  component: CspDetail,
  validateSearch: (search: Record<string, unknown>) => ({
    from: (search.from as string) || undefined,
  }),
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


const formatTimeCommitment = (
  daysOfWeek?: string[] | null,
  timeStart?: string | null,
  timeEnd?: string | null
) => {
  const days = daysOfWeek?.length ? daysOfWeek.join(", ") : "—";

  const to12h = (time?: string | null) => {
    if (!time) return null;
    const [h, m] = time.split(":");
    const d = new Date();
    d.setHours(Number(h), Number(m));
    return d.toLocaleTimeString("en-SG", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const start = to12h(timeStart);
  const end = to12h(timeEnd);
  const timeRange = start && end ? `${start} – ${end}` : start || end || "";
  return days !== "—" && timeRange ? `${days}, ${timeRange}` : days || timeRange || "N/A";
};


function CspDetail() {
  const { isLoggedIn, user } = useAuth();
  const isStudent = user?.accountType === "student";
  const navigate = useNavigate();
  const search = useSearch({ from: "/csp/$projectID" });

const [showLoginModal, setShowLoginModal] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showGlitter, setShowGlitter] = useState(false);
  const [hasSeenCSUReminder, setHasSeenCSUReminder] = useState(false);
  const sidebarButtonRef = useRef<HTMLDivElement>(null);

  const { projectID } = Route.useParams();

  const { data: csp, isLoading, isError } = useQuery({
    queryKey: ["csp-detail", projectID],
    queryFn: () => fetchCspById(projectID),
  });

  console.log(isLoggedIn,user?.accountType);

  const handleFavourite = async () => {
  try {
    if (!isLoggedIn) {
      toast.error("Please log in to save CSPs");
      return;
    }
    if (!isStudent) {
      toast.error("Only students can save CSPs");
      return;
    }

    const wasFavourite = isFavourite;
    
    if (isFavourite) {
      await fetchUnsaveProject(csp.id);
      toast.success("Removed from favourites");
    } else {
      await fetchSaveProject(csp.id);
      toast.success("Added to favourites");
      // Trigger glitter animation when adding to favourites
      if (!wasFavourite) {
        setShowGlitter(true);
        setTimeout(() => setShowGlitter(false), 600);
      }
    }

    setIsFavourite(!isFavourite);
    refetchSaved();
  } catch (err) {
    console.error(err);
    toast.error("Failed to update favourites");
  }
};

const { data: savedData = { saved: [] }, refetch: refetchSaved } = useQuery({
  queryKey: ["saved-projects"],
  queryFn: fetchSavedProjects,
  enabled: !!user && isStudent, // wait until user is defined
  staleTime: 60000, // optional
});

// Fetch user's applications to check if they've already applied
const { data: applicationsData } = useQuery({
  queryKey: ["student-applications"],
  queryFn: fetchMyApplications,
  enabled: !!user && isStudent, // only fetch if user is logged in and is a student
  staleTime: 60000,
});


const savedIds = useMemo(
  () => new Set(savedData?.saved?.map((s: any) => s.projectId || s.id)),
  [savedData?.saved?.length]
);

useEffect(() => {
  if (csp?.id) {
    setIsFavourite(savedIds.has(csp.id));
  }
}, [csp?.id, savedIds]);

useEffect(() => {
  if (isLoggedIn && isStudent) {
    refetchSaved?.();
  }
}, [isLoggedIn, isStudent]);


  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  // Check if sidebar button is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show floating button when sidebar button is NOT visible
        const shouldShow = !entry.isIntersecting;
        setShowFloatingButton(shouldShow);
        // Track if CSU reminder has been shown at least once
        if (shouldShow && !hasSeenCSUReminder) {
          setHasSeenCSUReminder(true);
        }
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
  }, [hasSeenCSUReminder]);


  if (isLoading)
    return <div className="p-12 text-center text-muted-foreground">Loading project details...</div>;

  if (isError || !csp)
    return <div className="p-12 text-center text-destructive">Failed to load project details.</div>;

  const now = new Date();
  const deadline = csp.applicationDeadline ? new Date(csp.applicationDeadline) : null;
  const isDeadlinePassed = deadline ? now > deadline : false;

  const statusBadge = getStatusBadge(csp.status);
  const isApplicationOpen =
  (csp.status === "open" || csp.status === "closing-soon") && !isDeadlinePassed;
  const spotsLeft = csp.maxVolunteers - csp.currentVolunteers;
  const fillRate = Math.round((csp.currentVolunteers / csp.maxVolunteers) * 100);
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-6 xl:px-8 2xl:px-10 py-8">
        {/* Back Button */}
        <button 
          onClick={() => {
            if (search.from === "preview") {
              // Go back to the organisation project overview page
              navigate({ to: "/organisations/$projectId", params: { projectId: projectID } });
            } else {
              // Navigate directly to discover page to avoid routing to apply form
              navigate({ to: "/discover" });
            }
          }}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="font-body">
            {search.from === "preview" 
              ? `Back to ${csp?.title || "Project"} Overview`
              : "Back to Discover CSPs"}
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`text-xs ${getCategoryColor(csp.category)}`}>
                    {csp.category}
                  </Badge>
                  <Badge className={`text-xs ${statusBadge.className}`}>
                    {statusBadge.label}
                  </Badge>
                  {csp.type === "overseas" ? (
                    <Badge variant="outline" className="text-xs">
                      <Globe className="mr-1 h-3 w-3" />
                      Overseas
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      <Map className="mr-1 h-3 w-3" />
                      Local
                    </Badge>
                  )}
                </div>
                {csp.googleMaps && csp.type === "local" && (
                  <a
                    href={csp.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1 flex-shrink-0"
                  >
                    <MapPin className="h-4 w-4" />
                    View on Maps
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                    {csp.title}
                  </h1>
                  <div className="flex items-center gap-2 text-lg text-muted-foreground">
                    <Building2 className="h-5 w-5" />
                    <span className="font-body">{csp.organisation}</span>
                    {csp.organisationInfo.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 flex-shrink-0 items-start">
                  {isLoggedIn && isStudent && (
                    <div className="relative">
                  <Button 
                        variant="ghost"
                    size="icon"
                        onClick={handleFavourite}
                        className="h-8 w-8 flex-shrink-0 border relative"
                  >
                        <Heart
                          className={`h-5 w-5 transition-all ${
                            isFavourite
                              ? "fill-red-500 text-red-500"
                              : "text-black hover:text-black"
                          }`}
                        />
                        {showGlitter && (
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
                                  style={{
                                    left: '50%',
                                    top: '50%',
                                    '--tx': `${tx}px`,
                                    '--ty': `${ty}px`,
                                    animationDelay: `${i * 0.05}s`,
                                  } as React.CSSProperties}
                                />
                              );
                            })}
                          </>
                        )}
                  </Button>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleShare}
                    className="h-8 w-8"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="flex flex-col items-center text-center space-y-1">
                  <MapPin className="h-5 w-5 text-primary" />
  <span className="text-xs text-muted-foreground font-body">
    {csp.isRemote
      ? "Mode"
      : csp.type === "overseas"
        ? "Country"
        : "District"}
  </span>
  <span className="text-sm font-medium font-body">
    {csp.isRemote
      ? "Remote"
      : csp.type === "overseas"
        ? csp.country || "—"
        : csp.location || "—"}
  </span>
                </div>
                <div className="flex flex-col items-center text-center space-y-1">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground font-body">Duration</span>
                  <span className="text-sm font-medium font-body">
                    {csp.repeatInterval && csp.repeatInterval > 0 ? `${csp.repeatInterval} time(s) a week` : csp.repeatInterval === 0 ? "One-time" : "—"}
                  </span>
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

            {/* Image */}
            <div className="w-full">
              {(csp.images ?? [csp.imageUrl]).filter(Boolean).map((image, index) => (
                <div
                  key={index}
                  className="aspect-video rounded-xl overflow-hidden bg-muted/50 border shadow-sm hover:shadow-md transition-shadow"
                >
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
              <CardContent className="space-y-6 break-words whitespace-pre-wrap">
                {/* General description */}
                {csp.description && (
                  <div>
                    <h3 className="font-heading text-lg mb-2">Overview</h3>
                    <p className="text-sm font-body text-muted-foreground leading-relaxed whitespace-pre-line">
                      {csp.description}
                    </p>
                  </div>
                )}

                {/* What you'll do */}
                {csp.aboutDo && (
                  <div>
                    <h3 className="font-heading text-lg mb-2">What You’ll Do</h3>
                    <p className="text-sm font-body text-muted-foreground leading-relaxed whitespace-pre-line">
                      {csp.aboutDo}
                    </p>
                  </div>
                )}

                {/* What we provide */}
                {csp.aboutProvide && (
                  <div>
                    <h3 className="font-heading text-lg mb-2">What We Provide</h3>
                    <p className="text-sm font-body text-muted-foreground leading-relaxed whitespace-pre-line">
                      {csp.aboutProvide}
                    </p>
                  </div>
                )}

              </CardContent>
            </Card>


            {/* Skills & Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">Skills & Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4  break-words whitespace-pre-wrap">
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
                    <div className="space-y-3 text-sm min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                        <span className="text-muted-foreground font-body">Application Deadline:</span>
                        <span className="font-medium font-body sm:text-right">
                          {csp.applicationDeadline
                            ? formatDateRange(csp.applicationDeadline, csp.applicationDeadline)
                            : "—"}

                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                        <span className="text-muted-foreground font-body">Project Period:</span>
                        <span className="font-medium font-body sm:text-right">
                          {formatDateRange(csp.startDate, csp.endDate)}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline sm:gap-2 text-sm font-body">
                <span className="text-muted-foreground sm:min-w-[120px]">Time Commitment:</span>
                <span className="font-medium text-foreground break-words min-w-0 sm:text-right">
                  {formatTimeCommitment(csp.daysOfWeek, csp.timeStart, csp.timeEnd)}
                </span>
              </div>
                    </div>

                    <Separator />

                    {/* CSU Module Reminder */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                      <p className="text-xs text-yellow-900 font-body">
                          Complete CSU module on eLearn before applying
                        </p>
                    </div>

                    {/* Apply Button */}
                    <div ref={sidebarButtonRef}>

                      
                      <Button
                        size="lg"
                        className="w-full shadow-2xl hover:shadow-xl transition-shadow"
                        disabled={
                          isDeadlinePassed ||
                          (!isLoggedIn && !user) ||
                          (isLoggedIn && user?.accountType !== "student")
                        }
                        onClick={async () => {
                          if (isDeadlinePassed) {
                            toast.error("The application deadline has passed.");
                            return;
                          }

                          if (!isLoggedIn) {
                            setShowLoginModal(true);
                            return;
                          }

                          if (user?.accountType !== "student") {
                            toast.error("Only student accounts can apply for CSPs.");
                            return;
                          }

                          // Check if user has already applied to this project
                          const applications = applicationsData?.applications ?? [];
                          const hasAlreadyApplied = applications.some(
                            (app: any) => app.projectId === csp.id || app.project?.id === csp.id
                          );

                          if (hasAlreadyApplied) {
                            toast.error("You have already applied to this project");
                            return;
                          }

                            window.location.href = `/csp/${csp.id}/apply`;
                        }}
                      >
                        <Send className="mr-2 h-5 w-5" />
                        {isDeadlinePassed
                          ? "Applications Closed"
                          : !isLoggedIn
                            ? "Log in to Apply"
                            : user?.accountType !== "student"
                              ? "Only Students Can Apply"
                              : "Apply Now"}
                      </Button>



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
                  <span className="font-medium font-body">{csp.currentApplications}</span>
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
                  Have questions about this CSP? Get in touch with the organisation directly.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <a href={`mailto:${csp.organisationInfo.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <a href={csp.organisationInfo.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Website
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Floating Apply Button - Only when sidebar button not visible and CSU reminder hasn't been shown */}
        {isApplicationOpen && showFloatingButton && !hasSeenCSUReminder && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* CSU Module Reminder */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-md max-w-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-xs text-yellow-800 font-body">
                    Complete CSU module on eLearn before applying.
                  </p>
              </div>
            </div>

          </div>
        )}

        <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        redirectTo={`/csp/${csp.id}`}
      />

      </div>
    </div>
)}
