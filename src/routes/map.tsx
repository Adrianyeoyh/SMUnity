import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  Clock,
  Filter,
  List,
  Map as MapIcon,
  MapPin,
  Navigation,
  Search,
  Users,
} from "lucide-react";

import { Badge } from "#client/components/ui/badge";
import { Button } from "#client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#client/components/ui/card";
import { Input } from "#client/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#client/components/ui/select";

export const Route = createFileRoute("/map")({
  component: MapView,
});

function MapView() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const cspLocations = [
    {
      id: "1",
      title: "Teaching English to Underprivileged Children",
      organisation: "Hope Foundation",
      location: "Tampines",
      category: "Education",
      startDate: "2024-02-15",
      serviceHours: 40,
      maxVolunteers: 15,
      currentVolunteers: 8,
      latitude: 1.3496,
      longitude: 103.9568,
      isRemote: false,
      description: "Help teach English to children from low-income families.",
    },
    {
      id: "2",
      title: "Environmental Cleanup at East Coast Park",
      organisation: "Green Singapore",
      location: "East Coast Park",
      category: "Environment",
      startDate: "2024-02-20",
      serviceHours: 8,
      maxVolunteers: 50,
      currentVolunteers: 23,
      latitude: 1.3048,
      longitude: 103.8318,
      isRemote: false,
      description: "Join us for a beach cleanup initiative.",
    },
    {
      id: "3",
      title: "Virtual Mentoring Program",
      organisation: "Youth Connect",
      location: "Remote",
      category: "Mentoring",
      startDate: "2024-03-01",
      serviceHours: 60,
      maxVolunteers: 25,
      currentVolunteers: 12,
      latitude: 1.2966,
      longitude: 103.7764,
      isRemote: true,
      description: "Provide virtual mentorship to at-risk youth.",
    },
    {
      id: "4",
      title: "Community Garden Project",
      organisation: "Green Thumbs",
      location: "Jurong West",
      category: "Environment",
      startDate: "2024-02-25",
      serviceHours: 20,
      maxVolunteers: 30,
      currentVolunteers: 15,
      latitude: 1.3396,
      longitude: 103.7068,
      isRemote: false,
      description: "Help maintain and develop community gardens.",
    },
    {
      id: "5",
      title: "Senior Care Support",
      organisation: "Golden Years",
      location: "Toa Payoh",
      category: "Healthcare",
      startDate: "2024-03-01",
      serviceHours: 30,
      maxVolunteers: 20,
      currentVolunteers: 7,
      latitude: 1.3329,
      longitude: 103.8483,
      isRemote: false,
      description: "Provide companionship and support to elderly residents.",
    },
  ];

  const categories = [
    "all",
    "Education",
    "Environment",
    "Healthcare",
    "Mentoring",
    "Community",
  ];

  const filteredCSPs =
    selectedCategory === "all"
      ? cspLocations
      : cspLocations.filter((csp) => csp.category === selectedCategory);

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-background/95 border-b backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h1 className="font-heading text-foreground text-2xl font-bold">
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="space-y-4 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="font-body text-sm font-medium">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input placeholder="Search CSPs..." className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-body text-sm font-medium">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
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
                  <label className="font-body text-sm font-medium">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input placeholder="Enter location..." className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-body text-sm font-medium">
                    Service Hours
                  </label>
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
                <CardTitle className="font-heading text-lg">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-body">
                    Total CSPs:
                  </span>
                  <span className="font-body font-medium">
                    {filteredCSPs.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-body">
                    Available Spots:
                  </span>
                  <span className="font-body font-medium">
                    {filteredCSPs.reduce(
                      (sum, csp) =>
                        sum + (csp.maxVolunteers - csp.currentVolunteers),
                      0,
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-body">
                    Remote CSPs:
                  </span>
                  <span className="font-body font-medium">
                    {filteredCSPs.filter((csp) => csp.isRemote).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map/List Content */}
          <div className="lg:col-span-3">
            {viewMode === "map" ? (
              <Card className="h-[600px]">
                <CardContent className="h-full p-0">
                  <div className="bg-muted/30 flex h-full items-center justify-center">
                    <div className="space-y-4 text-center">
                      <MapIcon className="text-muted-foreground mx-auto h-16 w-16" />
                      <div>
                        <h3 className="font-heading text-foreground mb-2 text-lg font-semibold">
                          Interactive Map Coming Soon
                        </h3>
                        <p className="text-muted-foreground font-body">
                          We're working on integrating Google Maps to show CSP
                          locations
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
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-semibold">
                    {filteredCSPs.length} CSPs Found
                  </h2>
                  <div className="text-muted-foreground font-body text-sm">
                    Showing{" "}
                    {selectedCategory === "all" ? "all" : selectedCategory}{" "}
                    projects
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredCSPs.map((csp) => (
                    <Card
                      key={csp.id}
                      className="group cursor-pointer transition-shadow hover:shadow-lg"
                    >
                      <CardHeader>
                        <div className="mb-2 flex items-start justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {csp.category}
                          </Badge>
                          <div className="text-muted-foreground flex items-center space-x-1 text-xs">
                            <MapPin className="h-3 w-3" />
                            <span className="font-body">{csp.location}</span>
                          </div>
                        </div>
                        <CardTitle className="font-heading group-hover:text-primary text-lg transition-colors">
                          {csp.title}
                        </CardTitle>
                        <CardDescription className="font-body">
                          {csp.organisation}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-muted-foreground font-body line-clamp-2 text-sm">
                            {csp.description}
                          </p>

                          <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span className="font-body">
                                {new Date(csp.startDate).toLocaleDateString(
                                  "en-GB",
                                )}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span className="font-body">
                                {csp.serviceHours}h
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span className="font-body">
                                {csp.currentVolunteers}/{csp.maxVolunteers}
                              </span>
                            </div>
                          </div>

                          <Button className="group-hover:bg-primary group-hover:text-primary-foreground w-full transition-colors">
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
