import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "#client/hooks/use-auth";
import { toast } from "sonner";
import { fetchSavedProjects, fetchUnsaveProject } from "#client/api/student";

import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Loader2, Heart, MapPin, Calendar, Clock, Users, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "#client/components/ui/input";

// ────────────── Route Definition ──────────────
export const Route = createFileRoute("/favourites")({
  component: FavouritesPage,
});

// ────────────── Helper: Category Color ──────────────
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Community": "bg-orange-100 text-orange-700 hover:bg-orange-200",
    "Mentoring": "bg-blue-100 text-blue-700 hover:bg-blue-200",
    "Environment": "bg-green-100 text-green-700 hover:bg-green-200",
    "Elderly": "bg-purple-100 text-purple-700 hover:bg-purple-200",
    "Arts & Culture": "bg-pink-100 text-pink-700 hover:bg-pink-200",
    "Animal Welfare": "bg-rose-100 text-rose-700 hover:bg-rose-200",
    "Sports & Leisure": "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    "Coding": "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
  };
  return colors[category] || "bg-gray-100 text-gray-700 hover:bg-gray-200";
};

// ────────────── Helper: Format Date ──────────────
const formatDateRange = (startDate: string, endDate?: string) => {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
  };
  if (!endDate || startDate === endDate) return formatDate(startDate);
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

function formatScheduleFromFields(csp: any): string {
  const { timeStart, timeEnd, daysOfWeek } = csp;

  const to12h = (hhmmss?: string | null) => {
    if (!hhmmss) return null;
    const [hh, mm] = hhmmss.split(":");
    const d = new Date();
    d.setHours(Number(hh), Number(mm), 0, 0);
    return d.toLocaleTimeString("en-SG", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const start = to12h(timeStart);
  const end = to12h(timeEnd);
  const timePart = start && end ? `${start} – ${end}` : start || end || "";
  const daysPart = (daysOfWeek && daysOfWeek.length) ? daysOfWeek.join(", ") : "";

  return [timePart, daysPart].filter(Boolean).join(", ");
}


// ────────────── Component ──────────────
function FavouritesPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate({ from: "/favourites" });
  const [searchQuery, setSearchQuery] = useState("");

  const isStudent = user?.accountType === "student";

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["saved-projects"],
    queryFn: fetchSavedProjects,
    enabled: isLoggedIn && isStudent,
  });

  const allFavourites = data?.saved ?? [];

  // 🔹 Filter favourites based on search query
  const filterFavourites = (favourites: any[]) => {
    if (!searchQuery.trim()) return favourites;
    const query = searchQuery.toLowerCase();
    return favourites.filter((csp: any) => {
      return (
        csp.title?.toLowerCase().includes(query) ||
        csp.organisation?.toLowerCase().includes(query) ||
        csp.category?.toLowerCase().includes(query) ||
        csp.description?.toLowerCase().includes(query) ||
        csp.district?.toLowerCase().includes(query) ||
        csp.country?.toLowerCase().includes(query) ||
        csp.skills?.some((skill: string) => skill.toLowerCase().includes(query))
      );
    });
  };

  const favourites = filterFavourites(allFavourites);

  const handleUnsave = async (projectId: string) => {
    try {
      await fetchUnsaveProject(projectId);
      toast.success("Removed from favourites");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove from favourites");
    }
  };

  // ────────────── Loading/Error States ──────────────
  if (!isLoggedIn)
    return (
      <div className="p-12 text-center text-muted-foreground">
        <p className="text-lg font-body">Please log in to view your favourites.</p>
        <Button className="mt-4" onClick={() => (window.location.href = "/auth/login")}>
          Log In
        </Button>
      </div>
    );

  if (isLoading)
    return (
      <div className="p-12 text-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3" />
        Loading your saved projects…
      </div>
    );

  if (isError)
    return (
      <div className="p-12 text-center text-destructive">
        Failed to load favourites. Please try again later.
      </div>
    );

  // ────────────── No Favourites ──────────────
  if (allFavourites.length === 0)
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
        <Heart className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-heading text-lg font-semibold mb-2">No Favourites Yet</h3>
        <p className="text-muted-foreground font-body mb-6">
          You haven’t saved any CSPs yet. Start exploring and click the heart icon to add to favourites!
        </p>
        <Button onClick={() => navigate({ to: "/discover" })}>Browse CSPs</Button>
      </div>
    );

  // ────────────── Render Favourites ──────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                My Favourites
              </h1>
              <p className="text-muted-foreground font-body text-base sm:text-lg mt-2">
                Your saved community service projects
              </p>
            </div>
            <div className="relative w-full sm:w-1/3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search favourites..."
                className="pl-10 h-10 text-sm sm:text-base w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">

        {/* Grid View (reused Discover card layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((csp: any) => (
            <Card
              key={csp.id}
              className="hover:shadow-lg transition-shadow cursor-pointer group flex flex-col h-full"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="flex flex-wrap gap-1">
                    <Badge className={`text-xs ${getCategoryColor(csp.category)}`}>
                      {csp.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnsave(csp.projectId || csp.id);
                    }}
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500 transition-all" />
                  </Button>
                </div>
                <CardTitle className="font-heading text-lg group-hover:text-primary transition-colors">
                  {csp.title}
                </CardTitle>
                <CardDescription className="font-body">
                  {csp.organisation ?? "Unknown Organisation"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground font-body line-clamp-2">
                    {csp.description}
                  </p>

                  {/* Location + Time */}
                  <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1 flex-1 min-w-0">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="font-body truncate">
                        {csp.isRemote
                          ? "Remote"
                          : csp.type === "overseas"
                            ? csp.country || "—"
                            : csp.district || "—"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 flex-1 min-w-0">
                      <Clock className="h-4 w-4 flex-shrink-0 mr-1.5" />
                      <span
                        className="font-body text-xs sm:text-sm text-muted-foreground leading-tight line-clamp-2 break-words pl-0.5"
                      >
                        {formatScheduleFromFields(csp) || `${csp.serviceHours}h`}
                      </span>
                    </div>
                  </div>

                  {/* Dates + Volunteers */}
                  <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1 flex-1 min-w-0">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span className="font-body truncate">
                        {formatDateRange(csp.startDate, csp.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 flex-1 min-w-0">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span className="font-body">
                        {csp.currentVolunteers ?? 0}/{csp.maxVolunteers ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {csp.skills?.slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {csp.skills?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{csp.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <Link to="/csp/$projectID" params={{ projectID: csp.projectId || csp.id }}>
                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty Search State */}
        {searchQuery.trim() && favourites.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground font-body mb-4">
              No favourites match your search query "{searchQuery}"
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          </div>
        )}

        {/* Load More */}
        {!searchQuery.trim() && allFavourites.length > 6 && (
          <div className="text-center mt-8">
            <Button variant="outline">Load More Favourites</Button>
          </div>
        )}
      </div>
    </div>
  );
}
