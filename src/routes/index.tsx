import { createFileRoute } from "@tanstack/react-router";
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
  Filter,
  Star,
  ArrowRight,
  BookOpen,
  Target,
  Users2
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Mock data for demonstration
  const featuredCSPs = [
    {
      id: "1",
      title: "Teaching English to Underprivileged Children",
      organization: "Hope Foundation",
      location: "Tampines",
      category: "Education",
      startDate: "2024-02-15",
      endDate: "2024-05-15",
      serviceHours: 40,
      maxVolunteers: 15,
      currentVolunteers: 8,
      isRemote: false,
      description: "Help teach English to children from low-income families. No prior teaching experience required.",
      skills: ["Communication", "Patience", "Teaching"],
      tags: ["Education", "Children", "Community"]
    },
    {
      id: "2", 
      title: "Environmental Cleanup at East Coast Park",
      organization: "Green Singapore",
      location: "East Coast Park",
      category: "Environment",
      startDate: "2024-02-20",
      endDate: "2024-02-20",
      serviceHours: 8,
      maxVolunteers: 50,
      currentVolunteers: 23,
      isRemote: false,
      description: "Join us for a beach cleanup initiative to keep Singapore's coastline clean and beautiful.",
      skills: ["Teamwork", "Physical Activity"],
      tags: ["Environment", "Beach", "Cleanup"]
    },
    {
      id: "3",
      title: "Virtual Mentoring Program",
      organization: "Youth Connect",
      location: "Remote",
      category: "Mentoring",
      startDate: "2024-03-01",
      endDate: "2024-08-31",
      serviceHours: 60,
      maxVolunteers: 25,
      currentVolunteers: 12,
      isRemote: true,
      description: "Provide virtual mentorship to at-risk youth through online sessions and activities.",
      skills: ["Mentoring", "Communication", "Leadership"],
      tags: ["Mentoring", "Youth", "Virtual"]
    }
  ];

  const categories = [
    "Education", "Environment", "Healthcare", "Mentoring", "Community", "Arts & Culture"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
              Find Your Perfect
              <span className="text-primary"> Community Service</span>
              <br />
              Project
            </h1>
            <p className="text-xl text-muted-foreground font-body mb-8 max-w-2xl mx-auto">
              Connect with meaningful volunteer opportunities that align with your interests, 
              schedule, and SMU graduation requirements. Make a difference in your community today.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for CSPs, organizations, or skills..."
                  className="pl-12 pr-4 py-4 text-lg h-14 rounded-xl border-2 focus:border-primary"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6">
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
                <div className="text-3xl font-bold text-accent font-heading">2,500+</div>
                <div className="text-muted-foreground font-body">Students Helped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary font-heading">50+</div>
                <div className="text-muted-foreground font-body">Partner Organizations</div>
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
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary/5 hover:border-primary transition-colors"
              >
                <div className="text-2xl">
                  {category === "Education" && <BookOpen className="h-6 w-6" />}
                  {category === "Environment" && <Target className="h-6 w-6" />}
                  {category === "Healthcare" && <Heart className="h-6 w-6" />}
                  {category === "Mentoring" && <Users2 className="h-6 w-6" />}
                  {category === "Community" && <Users className="h-6 w-6" />}
                  {category === "Arts & Culture" && <Star className="h-6 w-6" />}
                </div>
                <span className="text-sm font-medium">{category}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured CSPs Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                Featured CSPs
              </h2>
              <p className="text-muted-foreground font-body">
                Discover popular and trending community service projects
              </p>
            </div>
            <Button variant="outline" className="hidden md:flex">
              View All CSPs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCSPs.map((csp) => (
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
                        <span>{csp.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{csp.serviceHours}h</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(csp.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{csp.currentVolunteers}/{csp.maxVolunteers}</span>
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
                          +{csp.skills.length - 2} more
                        </Badge>
                      )}
                    </div>

                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button variant="outline">
              View All CSPs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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
            Start your community service journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-primary">
              Browse All CSPs
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Create Organization
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
