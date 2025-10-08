import { createFileRoute } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Separator } from "#client/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "#client/components/ui/dialog";
import { Label } from "#client/components/ui/label";
import { Textarea } from "#client/components/ui/textarea";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Heart,
  Share2,
  BookOpen,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  Send
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/csp/$cspId")({
  component: CspDetail,
});

function CspDetail() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [applicationData, setApplicationData] = useState({
    motivation: "",
    experience: "",
    availability: "",
    additionalNotes: ""
  });

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
    // In real app, this would submit to API
    toast.success("Application submitted!", {
      description: "You'll receive an email confirmation shortly.",
    });
    setShowApplicationDialog(false);
    setApplicationData({
      motivation: "",
      experience: "",
      availability: "",
      additionalNotes: ""
    });
  };
  // Mock data - in real app, this would come from the route params and API
  const csp = {
    id: "1",
    title: "Teaching English to Underprivileged Children",
    organization: "Hope Foundation",
    location: "Tampines Community Centre",
    category: "Education",
    startDate: "2024-02-15",
    endDate: "2024-05-15",
    applicationDeadline: "2024-02-10",
    serviceHours: 40,
    maxVolunteers: 15,
    currentVolunteers: 8,
    isRemote: false,
    isApproved: true,
    isActive: true,
    description: `Join us in making a meaningful difference in the lives of underprivileged children by teaching them English. This community service project aims to provide quality English education to children from low-income families who may not have access to proper educational resources.

Our program runs for 3 months, with weekly sessions every Saturday from 9 AM to 12 PM. Volunteers will work in small groups of 3-4 children, providing personalized attention and support.

**What you'll be doing:**
- Conduct English lessons for children aged 8-12
- Create engaging learning activities and games
- Help with homework and reading comprehension
- Provide emotional support and encouragement
- Track student progress and provide feedback

**Requirements:**
- No prior teaching experience required
- Patience and enthusiasm for working with children
- Good communication skills in English
- Commitment to attend all sessions
- Background check required (we'll help you with this)

**What we provide:**
- Training session before starting
- Teaching materials and resources
- Certificate of completion
- Letter of recommendation (upon request)
- Transportation allowance`,
    requirements: "No prior teaching experience required. Good communication skills and patience with children.",
    skills: ["Communication", "Patience", "Teaching", "Leadership", "Creativity"],
    tags: ["Education", "Children", "Community", "Teaching", "Volunteer"],
    images: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
      "https://images.unsplash.com/photo-1522202178048-de1118704c4f?w=800",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800"
    ],
    organizationInfo: {
      name: "Hope Foundation",
      description: "A non-profit organization dedicated to providing educational opportunities for underprivileged children in Singapore.",
      website: "https://hopefoundation.sg",
      email: "volunteer@hopefoundation.sg",
      phone: "+65 6123 4567",
      address: "123 Tampines Street 11, Singapore 521123",
      isVerified: true
    }
  };

  const isApplicationOpen = new Date(csp.applicationDeadline) > new Date();
  const spotsLeft = csp.maxVolunteers - csp.currentVolunteers;
  const acceptanceRate = Math.round((csp.currentVolunteers / csp.maxVolunteers) * 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to CSPs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    {csp.category}
                  </Badge>
                  <h1 className="font-heading text-3xl font-bold text-foreground">
                    {csp.title}
                  </h1>
                  <p className="text-lg text-muted-foreground font-body">
                    by {csp.organization}
                  </p>
                </div>
              <div className="flex space-x-2">
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

              {/* Key Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body">{csp.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body">{new Date(csp.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body">{csp.serviceHours} hours</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body">{csp.currentVolunteers}/{csp.maxVolunteers} volunteers</span>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {csp.images.map((image, index) => (
                <div key={index} className="aspect-video rounded-lg overflow-hidden bg-muted/50 border">
                  <img 
                    src={image} 
                    alt={`${csp.title} image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src = `https://placehold.co/800x450/e5e7eb/64748b?text=CSP+Image+${index + 1}`;
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">About This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none font-body">
                  {csp.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Required */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Skills & Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 font-body">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {csp.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 font-body">Requirements:</h4>
                    <p className="text-sm text-muted-foreground font-body">
                      {csp.requirements}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">About {csp.organizationInfo.name}</CardTitle>
                {csp.organizationInfo.isVerified && (
                  <Badge variant="secondary" className="w-fit">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified Organization
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground font-body">
                    {csp.organizationInfo.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-body">{csp.organizationInfo.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-body">{csp.organizationInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-body">{csp.organizationInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={csp.organizationInfo.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 font-body"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Apply Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isApplicationOpen ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-body">Spots Available:</span>
                        <span className="font-medium font-body">{spotsLeft} left</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-body">Application Deadline:</span>
                        <span className="font-medium font-body">
                          {new Date(csp.applicationDeadline).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-body">Acceptance Rate:</span>
                        <span className="font-medium font-body">{acceptanceRate}%</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-body">
                          Complete the CSU module on eLearn before applying
                        </span>
                      </div>
                    </div>

                    <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                          Apply for this CSP
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
                            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                              <h4 className="font-heading font-semibold text-yellow-900 mb-1">
                                Important: Complete CSU Module First
                              </h4>
                              <p className="text-sm text-yellow-800 font-body">
                                Before applying, make sure you've completed the Community Service Unit (CSU) module on eLearn. 
                                This is required for all CSP applications.
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

                          {/* Submit Button */}
                          <div className="flex space-x-3 pt-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => setIsApplicationOpen(false)}
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
                  </>
                ) : (
                  <div className="text-center space-y-3">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground font-body">
                      Application deadline has passed
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground font-body">Start Date</div>
                    <div className="font-medium font-body">
                      {new Date(csp.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground font-body">End Date</div>
                    <div className="font-medium font-body">
                      {new Date(csp.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground font-body">Service Hours</div>
                    <div className="font-medium font-body">{csp.serviceHours} hours</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground font-body">Location</div>
                    <div className="font-medium font-body">
                      {csp.isRemote ? "Remote" : csp.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Tags</CardTitle>
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
        </div>
      </div>
    </div>
  );
}