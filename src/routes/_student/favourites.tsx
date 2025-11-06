import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  Clock,
  Heart,
  Loader2,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { fetchSavedProjects, fetchUnsaveProject } from "#client/api/student";
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
import { useAuth } from "#client/hooks/use-auth";

// ────────────── Route Definition ──────────────
export const Route = createFileRoute("/_student/favourites")({
  component: FavouritesPage,
});

// ────────────── Helper: Category Color ──────────────
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Community: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    Mentoring: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    Environment: "bg-green-100 text-green-700 hover:bg-green-200",
    Elderly: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    "Arts & Culture": "bg-pink-100 text-pink-700 hover:bg-pink-200",
    "Animal Welfare": "bg-rose-100 text-rose-700 hover:bg-rose-200",
    "Sports & Leisure": "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    Coding: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
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
    return d.toLocaleTimeString("en-SG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const start = to12h(timeStart);
  const end = to12h(timeEnd);
  const timePart = start && end ? `${start} – ${end}` : start || end || "";
  const daysPart = daysOfWeek && daysOfWeek.length ? daysOfWeek.join(", ") : "";

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
      <div className="text-muted-foreground p-12 text-center">
        <p className="font-body text-lg">
          Please log in to view your favourites.
        </p>
        <Button
          className="mt-4"
          onClick={() => (window.location.href = "/auth/login")}
        >
          Log In
        </Button>
      </div>
    );

  if (isLoading)
    return (
      <div className="text-muted-foreground p-12 text-center">
        <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
        Loading your saved projects…
      </div>
    );

  if (isError)
    return (
      <div className="text-destructive p-12 text-center">
        Failed to load favourites. Please try again later.
      </div>
    );

  // ────────────── No Favourites ──────────────
  if (allFavourites.length === 0)
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <Heart className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="font-heading mb-2 text-lg font-semibold">
          No Favourites Yet
        </h3>
        <p className="text-muted-foreground font-body mb-6">
          You haven’t saved any CSPs yet. Start exploring and click the heart
          icon to add to favourites!
        </p>
        <Button onClick={() => navigate({ to: "/discover" })}>
          Browse CSPs
        </Button>
      </div>
    );

  // ────────────── Render Favourites ──────────────
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="font-heading text-foreground text-2xl font-bold sm:text-3xl md:text-4xl">
                My Favourites
              </h1>
              <p className="text-muted-foreground font-body mt-2 text-base sm:text-lg">
                Your saved community service projects
              </p>
            </div>
            <div className="relative w-full sm:w-1/3">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="search"
                placeholder="Search favourites..."
                className="h-10 w-full pl-10 text-sm sm:text-base"
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 overflow-hidden">
          {favourites.map((csp: any) => (
            <Card
              key={csp.id}
              className="group flex h-full cursor-pointer flex-col transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      className={`text-xs ${getCategoryColor(csp.category)}`}
                    >
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
                <CardTitle className="font-heading group-hover:text-primary text-lg transition-colors block truncate overflow-hidden text-ellipsis">
                  {csp.title}
                </CardTitle>
                <CardDescription className="font-body">
                  {csp.organisation ?? "Unknown Organisation"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                <div className="space-y-3">
                  <p className="text-muted-foreground font-body line-clamp-2 text-sm">
                    {csp.description}
                  </p>

                  {/* Location + Time */}
                  <div className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
                    <div className="flex min-w-0 flex-1 items-center space-x-1">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="font-body truncate">
                        {csp.isRemote
                          ? "Remote"
                          : csp.type === "overseas"
                            ? csp.country || "—"
                            : csp.district || "—"}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 items-center space-x-1">
                      <Clock className="mr-1.5 h-4 w-4 flex-shrink-0" />
                      <span className="font-body text-muted-foreground line-clamp-2 pl-0.5 text-xs leading-tight break-words sm:text-sm">
                        {formatScheduleFromFields(csp) ||
                          `${csp.serviceHours}h`}
                      </span>
                    </div>
                  </div>

                  {/* Dates + Volunteers */}
                  <div className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
                    <div className="flex min-w-0 flex-1 items-center space-x-1">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span className="font-body truncate">
                        {formatDateRange(csp.startDate, csp.endDate)}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 items-center space-x-1">
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

                <Link
                  to="/csp/$projectID"
                  params={{ projectID: csp.projectId || csp.id }}
                >
                  <Button className="group-hover:bg-primary group-hover:text-primary-foreground w-full transition-colors">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty Search State */}
        {searchQuery.trim() && favourites.length === 0 && (
          <div className="py-12 text-center">
            <Search className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="font-heading mb-2 text-lg font-semibold">
              No results found
            </h3>
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
          <div className="mt-8 text-center">
            <Button variant="outline">Load More Favourites</Button>
          </div>
        )}
      </div>
    </div>
  );
}
