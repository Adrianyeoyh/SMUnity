import { createFileRoute } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Heart,
  ArrowRight,
  Filter,
  Search
} from "lucide-react";

export const Route = createFileRoute("/favourites")({
  component: favourites,
});

function favourites() {
  // Mock data for demonstration
  const favouriteCSPs = [
    {
      id: "1",
      title: "Teaching English to Underprivileged Children",
      organisation: "Hope Foundation",
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
      tags: ["Education", "Children", "Community"],
      favouritedDate: "2024-01-10"
    },
    {
      id: "2",
      title: "Environmental Cleanup at East Coast Park",
      organisation: "Green Singapore",
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
      tags: ["Environment", "Beach", "Cleanup"],
      favouritedDate: "2024-01-15"
    },
    {
      id: "3",
      title: "Virtual Mentoring Program",
      organisation: "Youth Connect",
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
      tags: ["Mentoring", "Youth", "Virtual"],
      favouritedDate: "2024-01-20"
    }
  ];

  const categories = [
    "all", "Education", "Environment", "Healthcare", "Mentoring", "Community"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              My Favourites
            </h1>
            <p className="text-muted-foreground font-body">
              CSPs you've saved for later
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "all" ? "default" : "outline"}
              size="sm"
              className="text-xs"
            >
              {category === "all" ? "All Categories" : category}
            </Button>
          ))}
        </div>

        {/* favourites Grid */}
        {favouriteCSPs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favouriteCSPs.map((csp) => (
              <Card key={csp.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {csp.category}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                  <CardTitle className="font-heading text-lg group-hover:text-primary transition-colors">
                    {csp.title}
                  </CardTitle>
                  <CardDescription className="font-body">
                    {csp.organisation}
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
                        <span className="font-body">{new Date(csp.startDate).toLocaleDateString("en-GB")}</span>
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
                          +{csp.skills.length - 2} more
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground font-body">
                      favourited on {new Date(csp.favouritedDate).toLocaleDateString("en-GB")}
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Apply Now
                      </Button>
                      <Button variant="outline" size="icon">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">No Favourites Yet</h3>
            <p className="text-muted-foreground font-body mb-4">
              Start exploring CSPs and add them to your favourites by clicking the heart icon
            </p>
            <Button>
              Browse CSPs
            </Button>
          </div>
        )}

        {/* Load More */}
        {favouriteCSPs.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load More Favourites
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
