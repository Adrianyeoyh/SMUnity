import { createFileRoute } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Separator } from "#client/components/ui/separator";
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
  ArrowLeft
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/csp/$cspId")({
  component: CspDetail,
});

function CspDetail() {
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
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
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
                <div key={index} className="aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${csp.title} image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
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

                    <Button className="w-full" size="lg">
                      Apply for this CSP
                    </Button>
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