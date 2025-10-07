import { createFileRoute } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Input } from "#client/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#client/components/ui/select";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Search,
  Filter,
  List,
  Map as MapIcon,
  Navigation
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/map")({
  component: MapView,
});

function MapView() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Mock data for demonstration
  const cspLocations = [
    {
      id: "1",
      title: "Teaching English to Underprivileged Children",
      organization: "Hope Foundation",
      location: "Tampines",
      category: "Education",
      startDate: "2024-02-15",
      serviceHours: 40,
      maxVolunteers: 15,
      currentVolunteers: 8,
      latitude: 1.3496,
      longitude: 103.9568,
      isRemote: false,
      description: "Help teach English to children from low-income families."
    },
    {
      id: "2",
      title: "Environmental Cleanup at East Coast Park",
      organization: "Green Singapore",
      location: "East Coast Park",
      category: "Environment",
      startDate: "2024-02-20",
      serviceHours: 8,
      maxVolunteers: 50,
      currentVolunteers: 23,
      latitude: 1.3048,
      longitude: 103.8318,
      isRemote: false,
      description: "Join us for a beach cleanup initiative."
    },
    {
      id: "3",
      title: "Virtual Mentoring Program",
      organization: "Youth Connect",
      location: "Remote",
      category: "Mentoring",
      startDate: "2024-03-01",
      serviceHours: 60,
      maxVolunteers: 25,
      currentVolunteers: 12,
      latitude: 1.2966,
      longitude: 103.7764,
      isRemote: true,
      description: "Provide virtual mentorship to at-risk youth."
    },
    {
      id: "4",
      title: "Community Garden Project",
      organization: "Green Thumbs",
      location: "Jurong West",
      category: "Environment",
      startDate: "2024-02-25",
      serviceHours: 20,
      maxVolunteers: 30,
      currentVolunteers: 15,
      latitude: 1.3396,
      longitude: 103.7068,
      isRemote: false,
      description: "Help maintain and develop community gardens."
    },
    {
      id: "5",
      title: "Senior Care Support",
      organization: "Golden Years",
      location: "Toa Payoh",
      category: "Healthcare",
      startDate: "2024-03-01",
      serviceHours: 30,
      maxVolunteers: 20,
      currentVolunteers: 7,
      latitude: 1.3329,
      longitude: 103.8483,
      isRemote: false,
      description: "Provide companionship and support to elderly residents."
    }
  ];

  const categories = [
    "all", "Education", "Environment", "Healthcare", "Mentoring", "Community"
  ];

  const filteredCSPs = selectedCategory === "all" 
    ? cspLocations 
    : cspLocations.filter(csp => csp.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                CSP Map View
              </h1>
              <p className="text-muted-foreground font-body">
                Discover community service projects near you
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
              >
                <MapIcon className="mr-2 h-4 w-4" />
                Map
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="mr-2 h-4 w-4" />
                List
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium font-body">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search CSPs..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium font-body">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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

                <div className="space-y-2">
                  <label className="text-sm font-medium font-body">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Enter location..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium font-body">Service Hours</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 hours</SelectItem>
                      <SelectItem value="11-30">11-30 hours</SelectItem>
                      <SelectItem value="31-50">31-50 hours</SelectItem>
                      <SelectItem value="50+">50+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-body">Total CSPs:</span>
                  <span className="font-medium font-body">{filteredCSPs.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-body">Available Spots:</span>
                  <span className="font-medium font-body">
                    {filteredCSPs.reduce((sum, csp) => sum + (csp.maxVolunteers - csp.currentVolunteers), 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-body">Remote CSPs:</span>
                  <span className="font-medium font-body">
                    {filteredCSPs.filter(csp => csp.isRemote).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map/List Content */}
          <div className="lg:col-span-3">
            {viewMode === "map" ? (
              <Card className="h-[600px]">
                <CardContent className="p-0 h-full">
                  <div className="h-full bg-muted/30 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <MapIcon className="h-16 w-16 text-muted-foreground mx-auto" />
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                          Interactive Map Coming Soon
                        </h3>
                        <p className="text-muted-foreground font-body">
                          We're working on integrating Google Maps to show CSP locations
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
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-heading text-xl font-semibold">
                    {filteredCSPs.length} CSPs Found
                  </h2>
                  <div className="text-sm text-muted-foreground font-body">
                    Showing {selectedCategory === "all" ? "all" : selectedCategory} projects
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCSPs.map((csp) => (
                    <Card key={csp.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {csp.category}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="font-body">{csp.location}</span>
                          </div>
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

                          <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
