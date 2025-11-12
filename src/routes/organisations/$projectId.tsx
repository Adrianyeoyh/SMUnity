import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { decideApplication } from "#client/api/organisations/application.ts";
import { fetchListingById } from "#client/api/organisations/listing.ts";
import { Badge } from "#client/components/ui/badge";
import { Button } from "#client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#client/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#client/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#client/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "#client/components/ui/tabs";

export const Route = createFileRoute("/organisations/$projectId")({
  component: ListingApplicationsPage,
});

type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "confirmed"
  | "withdrawn";
// | "cancelled";

const STATUS_TABS: Array<{ value: ApplicationStatus | "all"; label: string }> =
  [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "confirmed", label: "Confirmed" },
    { value: "withdrawn", label: "Withdrawn" },
    // { value: "cancelled", label: "Cancelled" },
  ];

const STATUS_META: Record<ApplicationStatus, { tone: string; label: string }> =
  {
    pending: { tone: "bg-amber-100 text-amber-800", label: "Pending review" },
    accepted: { tone: "bg-emerald-100 text-emerald-800", label: "Accepted" },
    rejected: { tone: "bg-rose-100 text-rose-800", label: "Rejected" },
    confirmed: { tone: "bg-purple-100 text-purple-800", label: "Confirmed" },
    withdrawn: { tone: "bg-gray-100 text-gray-700", label: "Withdrawn" },
    // cancelled: { tone: "bg-gray-100 text-gray-700", label: "Cancelled" },
  };

const MOTIVATION_PREVIEW_LENGTH = 120;

const getMotivationPreview = (text?: string | null) => {
  if (!text) return "—";
  const trimmed = text.trim();
  if (trimmed.length <= MOTIVATION_PREVIEW_LENGTH) return trimmed;
  return `${trimmed.slice(0, MOTIVATION_PREVIEW_LENGTH).trimEnd()}…`;
};

// Helper to format time to HH:MM (remove seconds)
const formatTime = (time?: string | null) => {
  if (!time) return "";
  // If time is in HH:MM:SS format, remove seconds
  if (time.includes(":") && time.split(":").length === 3) {
    return time.substring(0, 5);
  }
  return time;
};

function ListingApplicationsPage() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate({ from: "/organisations/$projectId" });

  // Scroll to top when navigating to a project detail page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [projectId]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["listing", projectId],
    queryFn: fetchListingById,
  });

  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [decisionType, setDecisionType] = useState<"accept" | "reject" | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleDecision(
    applicationId: number,
    action: "accept" | "reject",
  ) {
    try {
      const res = await decideApplication(applicationId, action);
      toast.success(res.message || `Application ${action}ed.`);
      setConfirmOpen(false);
      // Refresh application data
      await refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update application");
    }
  }

  // ✅ Always define hooks before conditionally rendering
  const project = data?.project;
  const applications = data?.applications ?? [];

  const visibleApplications = useMemo(
    () =>
      statusFilter === "all"
        ? applications
        : applications.filter((a: any) => a.status === statusFilter),
    [applications, statusFilter],
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(visibleApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplications = visibleApplications.slice(startIndex, endIndex);

  // ✅ Render conditionally *after* all hooks
  if (isLoading)
    return (
      <div className="text-muted-foreground p-8 text-lg">
        Loading project data...
      </div>
    );

  if (isError || !data)
    return (
      <div className="p-8 text-lg text-red-500">
        Failed to load project details.
      </div>
    );

  if (!project)
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Card className="p-6">
          <CardTitle>Project not found</CardTitle>
          <CardDescription>
            The project you’re looking for may have been removed.
          </CardDescription>
          <Button
            className="mt-4"
            onClick={() => navigate({ to: "/organisations/dashboard" })}
          >
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );

  return (
    <div className="bg-background min-h-screen">
      {/* Top Navigation */}
      <div className="bg-background border-b">
        <div className="container mx-auto space-y-3 px-4 py-6">
          <button
            onClick={() => navigate({ to: "/organisations/dashboard" })}
            className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="font-body">Back to Dashboard</span>
          </button>
          <div>
            <h1 className="font-heading text-foreground text-3xl font-bold break-all">
              {project.title}
            </h1>
            <p className="text-muted-foreground font-body mt-2 text-sm">
              Organised by {project.orgName ?? "Unknown Organisation"} (
              {project.type})
            </p>
          </div>
        </div>
      </div>

      {/* Collapsible Project Overview */}
      <div className="container mx-auto space-y-8 px-4 py-8">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <Card className="bg-card/60 border shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="font-heading text-lg">
                  Project Overview
                </CardTitle>
                <CardDescription className="font-body text-sm">
                  Overview and key information for this listing
                </CardDescription>
              </div>
              <div className="flex flex-wrap md:flex-row items-center gap-4">
                {project.googleMaps && project.type === "local" && (
                  <a
                    href={project.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
                  >
                    <MapPin className="h-4 w-4" />
                    View on Maps
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Show Details
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
                <Button className="">
                  <Link to="/csp/$projectID" params={{ projectID: project.id }}>
                    Preview Listing
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CollapsibleContent>
              {/* Project Description */}
              <CardContent className="mb-4">
                <p className="text-muted-foreground font-body leading-relaxed break-all">
                  {project.description}
                </p>
              </CardContent>

              {/* Image and Key Info Grid */}
              <CardContent className="mb-4 grid gap-6 lg:grid-cols-3">
                {/* Left - Image (1/3 width) */}
                <div>
                  {project.imageUrl && (
                    <div className="flex h-full items-center justify-center overflow-hidden rounded-lg border">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Right - Key Info (2/3 width) */}
                <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
                  {/* First Row */}
                  {/* Location */}
                  {!project.isRemote && (
                    <InfoRow
                      icon={
                        <MapPin className="text-muted-foreground h-4 w-4" />
                      }
                      label={
                        project.type === "overseas" ? "Country" : "District"
                      }
                      value={
                        project.type === "overseas"
                          ? project.country || "—"
                          : project.district || "—"
                      }
                    />
                  )}
                  <InfoRow
                    icon={
                      <Calendar className="text-muted-foreground h-4 w-4" />
                    }
                    label="Period"
                    value={
                      project.repeatInterval === 0
                        ? format(new Date(project.startDate), "dd-MM-yyyy")
                        : `${format(new Date(project.startDate), "dd-MM-yyyy")} – ${format(new Date(project.endDate), "dd-MM-yyyy")}`
                    }
                  />

                  {/* Second Row */}
                  <InfoRow
                    icon={
                      <CalendarDays className="text-muted-foreground h-4 w-4" />
                    }
                    label="Apply By"
                    value={format(new Date(project.applyBy), "dd-MM-yyyy")}
                  />
                  {project.repeatInterval !== 0 && (
                    <InfoRow
                      icon={<Users className="text-muted-foreground h-4 w-4" />}
                      label="Slots"
                      value={`${project.slotsTotal}`}
                    />
                  )}

                  {/* Third Row */}
                  <InfoRow
                    icon={<Clock className="text-muted-foreground h-4 w-4" />}
                    label="Total Service Hours"
                    value={`${project.requiredHours} hrs`}
                  />
                  <InfoRow
                    icon={<Globe className="text-muted-foreground h-4 w-4" />}
                    label="Mode"
                    value={project.isRemote ? "Remote" : "In-person"}
                  />

                  {/* Fourth Row - Schedule takes full width on small screens */}
                  <div className="bg-muted/40 rounded-lg border p-3 sm:col-span-2">
                    <p className="text-foreground font-medium">Schedule</p>
                    <div className="mt-1 space-y-1">
                      {project.repeatInterval !== 0 && (
                        <p className="text-muted-foreground text-sm">
                          Every {project.repeatInterval} week
                          {project.repeatInterval && project.repeatInterval > 1
                            ? "s"
                            : ""}
                        </p>
                      )}
                      {project.daysOfWeek && project.daysOfWeek.length > 0 && (
                        <p className="text-muted-foreground text-sm">
                          {project.daysOfWeek.join(", ")}
                        </p>
                      )}
                      {project.timeStart && project.timeEnd && (
                        <p className="text-muted-foreground text-sm">
                          {formatTime(project.timeStart)} –{" "}
                          {formatTime(project.timeEnd)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* What You'll Do, Requirements, What You'll Equip Students with */}
              <CardContent>
                <div className="mb-4 space-y-3 break-all">
                  <SectionCard
                    title="What Students will Do"
                    content={project.aboutDo || "—"}
                  />
                  <SectionCard
                    title="Student Requirements"
                    content={project.requirements || "—"}
                  />
                  <SectionCard
                    title="What You will Equip Students with"
                    content={project.aboutProvide || "—"}
                  />
                </div>
              </CardContent>

              {/* Skills and Tags Row */}
              <CardContent className="mb-4 grid gap-6 md:grid-cols-2">
                {/* Left - Skills */}
                <div className="space-y-2">
                  <p className="text-foreground font-medium">Skills Required</p>
                  {project.skillTags && project.skillTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.skillTags.map((skill: string) => (
                        <Badge
                          key={skill}
                          variant="default"
                          className="capitalize"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">—</p>
                  )}
                </div>

                {/* Right - Tags */}
                <div className="space-y-2">
                  <p className="text-foreground font-medium">Project Tags</p>
                  {project.projectTags && project.projectTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.projectTags.map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="capitalize"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">—</p>
                  )}
                </div>
              </CardContent>

              {/* Organiser Details */}
              <CardContent>
                <div className="bg-muted/40 rounded-lg p-4">
                  <SectionCard title="Organiser Details">
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4" /> {project.orgName || "—"}
                    </p>
                    {project.org.website ? (
                      <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4" />{" "}
                        <a
                          href={project.org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {project.org.website}
                        </a>
                      </p>
                    ) : (
                      <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4" /> —
                      </p>
                    )}
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" /> {project.org.phone || "—"}
                    </p>
                  </SectionCard>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Applications</CardTitle>
            <CardDescription className="font-body text-sm">
              Filter and review all volunteer submissions for this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as ApplicationStatus | "all")
              }
              className="space-y-4"
            >
              <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
                {STATUS_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="bg-background data-[state=active]:border-primary data-[state=active]:bg-primary/10 rounded-full border px-3 py-1.5 text-sm font-medium"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={statusFilter} className="space-y-3">
                {visibleApplications.length === 0 ? (
                  <div className="border-muted-foreground/30 bg-muted/40 text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-12 text-center">
                    <Users className="h-10 w-10" />
                    <p>No applicants for this filter yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      className="max-h-[600px] overflow-x-hidden overflow-y-auto rounded-xl border"
                      style={{
                        overscrollBehavior: "contain",
                      }}
                      onWheel={(e) => {
                        const target = e.currentTarget;
                        const { scrollTop, scrollHeight, clientHeight } =
                          target;
                        const isAtTop = scrollTop === 0;
                        const isAtBottom =
                          scrollTop + clientHeight >= scrollHeight - 1;

                        // Prevent page scroll if we can scroll within the container
                        if (
                          (e.deltaY < 0 && !isAtTop) ||
                          (e.deltaY > 0 && !isAtBottom)
                        ) {
                          e.stopPropagation();
                          e.preventDefault();
                          // Manually scroll the container
                          target.scrollTop += e.deltaY;
                        }
                      }}
                    >
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Motivation</TableHead>
                            <TableHead />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedApplications.map((app: any) => {
                            const meta =
                              STATUS_META[app.status as ApplicationStatus];
                            return (
                              <TableRow key={app.id}>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                      <User className="text-muted-foreground h-4 w-4" />
                                      {app.applicant?.name ?? "Unknown"}
                                    </div>
                                    <p className="text-muted-foreground text-xs">
                                      {app.applicant?.email ?? ""}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={meta.tone}>
                                    {meta.label}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                                    <CalendarDays className="h-4 w-4" />
                                    {new Date(
                                      app.submittedAt,
                                    ).toLocaleDateString("en-GB")}
                                  </div>
                                </TableCell>
                                <TableCell className="align-top">
                                  <p
                                    className="text-muted-foreground max-w-[280px] truncate text-sm"
                                    title={app.motivation || undefined}
                                  >
                                    {getMotivationPreview(app.motivation)}
                                  </p>
                                </TableCell>
                                <TableCell className="flex justify-end gap-2 text-right">
                                  {/* View Profile */}
                                  <Button variant="outline" size="sm" asChild>
                                    <Link
                                      to="/organisations/applicant/$projectId/$applicantId"
                                      params={{
                                        applicantId: app.userId,
                                        projectId: project.id,
                                      }}
                                    >
                                      View
                                    </Link>
                                  </Button>

                                  {/* Only show Accept/Reject if pending */}
                                  {app.status === "pending" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="default"
                                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                                        onClick={() => {
                                          setSelectedApp(app);
                                          setDecisionType("accept");
                                          setConfirmOpen(true);
                                        }}
                                      >
                                        Accept
                                      </Button>

                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => {
                                          setSelectedApp(app);
                                          setDecisionType("reject");
                                          setConfirmOpen(true);
                                        }}
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    {visibleApplications.length > 0 && (
                      <div className="flex flex-col items-center gap-4">
                        <p className="text-muted-foreground font-body text-sm">
                          Showing {startIndex + 1}-
                          {Math.min(endIndex, visibleApplications.length)} of{" "}
                          {visibleApplications.length}{" "}
                          {visibleApplications.length === 1
                            ? "result"
                            : "results"}
                        </p>

                        {totalPages > 1 && (
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage(Math.max(1, currentPage - 1))
                              }
                              disabled={currentPage === 1}
                            >
                              Previous
                            </Button>

                            <div className="flex items-center gap-1">
                              {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1,
                              ).map((page) => (
                                <Button
                                  key={page}
                                  variant={
                                    page === currentPage ? "default" : "outline"
                                  }
                                  size="sm"
                                  onClick={() => setCurrentPage(page)}
                                  className="h-8 w-8 p-0"
                                >
                                  {page}
                                </Button>
                              ))}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage(
                                  Math.min(totalPages, currentPage + 1),
                                )
                              }
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {decisionType === "accept"
                ? "Confirm Acceptance"
                : "Confirm Rejection"}
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <p>Are you sure you want to {decisionType} this application?</p>
              <p>
                <span className="font-body">Applicant: </span>
                <span className="font-medium">
                  {selectedApp?.applicant?.name ?? "Unknown"}
                </span>
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={decisionType === "accept" ? "default" : "destructive"}
              className={
                decisionType === "accept"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : ""
              }
              onClick={() => handleDecision(selectedApp.id, decisionType!)}
            >
              {decisionType === "accept" ? "Accept" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-muted/30 text-muted-foreground flex items-center gap-3 rounded-lg border px-3 py-2 text-sm">
      <span>{icon}</span>
      <div>
        <p className="text-foreground font-medium">{label}</p>
        <p className="font-body text-muted-foreground text-sm">{value}</p>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  content,
  children,
}: {
  title: string;
  content?: string;
  children?: ReactNode;
}) {
  return (
    <div className="bg-muted/40 rounded-lg border p-3">
      <p className="text-foreground font-medium">{title}</p>
      {content ? (
        <p className="text-muted-foreground mt-1 text-sm">{content}</p>
      ) : (
        children
      )}
    </div>
  );
}
