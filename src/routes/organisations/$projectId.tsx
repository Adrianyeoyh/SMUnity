import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { Button } from "#client/components/ui/button";
import { Badge } from "#client/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#client/components/ui/table";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Globe,
  Clock,
  Phone,
  Building2,
  CalendarDays,
  User,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { useQuery } from "@tanstack/react-query";
import { fetchListingById } from "#client/api/organisations/listing.ts";
import { format } from "date-fns";
import { decideApplication } from "#client/api/organisations/application.ts";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#client/components/ui/dialog";

export const Route = createFileRoute("/organisations/$projectId")({
  component: ListingApplicationsPage,
});

type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "confirmed"
  | "withdrawn"
  // | "cancelled";

const STATUS_TABS: Array<{ value: ApplicationStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "confirmed", label: "Confirmed" },
  { value: "withdrawn", label: "Withdrawn" },
  // { value: "cancelled", label: "Cancelled" },
];

const STATUS_META: Record<ApplicationStatus, { tone: string; label: string }> = {
  pending: { tone: "bg-amber-100 text-amber-800", label: "Pending review" },
  accepted: { tone: "bg-emerald-100 text-emerald-800", label: "Accepted" },
  rejected: { tone: "bg-rose-100 text-rose-800", label: "Rejected" },
  confirmed: { tone: "bg-purple-100 text-purple-800", label: "Confirmed" },
  withdrawn: { tone: "bg-gray-100 text-gray-700", label: "Withdrawn" },
  // cancelled: { tone: "bg-gray-100 text-gray-700", label: "Cancelled" },
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

  const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ["listing", projectId],
  queryFn: fetchListingById,
});


  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [decisionType, setDecisionType] = useState<"accept" | "reject" | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleDecision(applicationId: number, action: "accept" | "reject") {
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
    [applications, statusFilter]
  );


  // ✅ Render conditionally *after* all hooks
  if (isLoading)
    return <div className="p-8 text-muted-foreground text-lg">Loading project data...</div>;

  if (isError || !data)
    return <div className="p-8 text-red-500 text-lg">Failed to load project details.</div>;

  if (!project)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-6">
          <CardTitle>Project not found</CardTitle>
          <CardDescription>
            The project you’re looking for may have been removed.
          </CardDescription>
          <Button className="mt-4" onClick={() => navigate({ to: "/organisations/dashboard" })}>
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-6 space-y-3">
          <button
            onClick={() => navigate({ to: "/organisations/dashboard" })}
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="font-body">Back to Dashboard</span>
          </button>
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">{project.title}</h1>
            <p className="text-muted-foreground font-body text-sm mt-2">
              Organised by {project.orgName ?? "Unknown Organisation"} ({project.type})
            </p>
          </div>
        </div>
      </div>

      {/* Collapsible Project Overview */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <Card className="border bg-card/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-heading text-lg">Project Overview</CardTitle>
                <CardDescription className="font-body text-sm">
                  Overview and key information for this listing
                </CardDescription>
              </div>
              <div className="flex flex-row items-center gap-4">
                {project.googleMaps && project.type === "local" && (
                  <a
                    href={project.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <MapPin className="h-4 w-4" />
                    View on Maps
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
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
                  <Link to="/csp/$projectID" params={{ projectID: project.id }} search={{ from: "preview", applicantProjectId: undefined, applicantId: undefined }}>
                    Preview Listing
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CollapsibleContent>
              {/* Project Description */}
              <CardContent className="mb-4">
                <p className="text-muted-foreground font-body leading-relaxed">{project.description}</p>
              </CardContent>

              {/* Image and Key Info Grid */}
              <CardContent className="grid lg:grid-cols-3 gap-6 mb-4">
                {/* Left - Image (1/3 width) */}
                <div>
                  {project.imageUrl && (
                    <div className="rounded-lg overflow-hidden border h-full flex items-center justify-center">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                {/* Right - Key Info (2/3 width) */}
                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-3">
                  {/* First Row */}
                  {/* Location */}
                  {!project.isRemote && (
                    <InfoRow
                      icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                      label={project.type === "overseas" ? "Country" : "District"}
                      value={
                        project.type === "overseas"
                          ? project.country || "—"
                          : project.district || "—"
                      }
                    />
                  )}
                  <InfoRow icon={<Calendar className="h-4 w-4 text-muted-foreground" />} label="Period" value={
                    project.repeatInterval === 0
                      ? format(new Date(project.startDate), "yyyy-MM-dd")
                      : `${format(new Date(project.startDate), "yyyy-MM-dd")} – ${format(new Date(project.endDate), "yyyy-MM-dd")}`
                  } />
                  
                  {/* Second Row */}
                  <InfoRow icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />} label="Apply By" value={format(new Date(project.applyBy), "yyyy-MM-dd")} />
                  {project.repeatInterval !== 0 && (
                    <InfoRow icon={<Users className="h-4 w-4 text-muted-foreground" />} label="Slots" value={`${project.slotsTotal}`} />
                  )}
                  
                  {/* Third Row */}
                  <InfoRow icon={<Clock className="h-4 w-4 text-muted-foreground" />} label="Total Service Hours" value={`${project.requiredHours} hrs`} />
                  <InfoRow icon={<Globe className="h-4 w-4 text-muted-foreground" />} label="Mode" value={project.isRemote ? "Remote" : "In-person"} />
                  
                  {/* Fourth Row - Schedule takes full width on small screens */}
                  <div className="sm:col-span-2 rounded-lg border bg-muted/40 p-3">
                    <p className="font-medium text-foreground">Schedule</p>
                    <div className="mt-1 space-y-1">
                      {project.repeatInterval !== 0 && (
                        <p className="text-sm text-muted-foreground">
                          Every {project.repeatInterval} week{project.repeatInterval && project.repeatInterval > 1 ? "s" : ""}
                        </p>
                      )}
                      {project.daysOfWeek && project.daysOfWeek.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {project.daysOfWeek.join(", ")}
                        </p>
                      )}
                      {project.timeStart && project.timeEnd && (
                        <p className="text-sm text-muted-foreground">
                          {formatTime(project.timeStart)} – {formatTime(project.timeEnd)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* What You'll Do, Requirements, What You'll Equip Students with */}
              <CardContent>
                <div className="space-y-3 mb-4">
                  <SectionCard title="What Students will Do" content={project.aboutDo || "—"} />
                  <SectionCard title="Student Requirements" content={project.requirements || "—"} />
                  <SectionCard title="What You will Equip Students with" content={project.aboutProvide || "—"} />
                </div>
              </CardContent>

              {/* Skills and Tags Row */}
              <CardContent className="grid md:grid-cols-2 gap-6 mb-4">
                {/* Left - Skills */}
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Skills Required</p>
                  {project.skillTags && project.skillTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.skillTags.map((skill: string) => (
                        <Badge key={skill} variant="default" className="capitalize">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">—</p>
                  )}
                </div>

                {/* Right - Tags */}
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Project Tags</p>
                  {project.projectTags && project.projectTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                      {project.projectTags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="capitalize">
                        {tag}
                      </Badge>
                    ))}
                </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">—</p>
                  )}
                </div>
              </CardContent>

              {/* Organiser Details */}
              <CardContent>
                <div className="bg-muted/40 rounded-lg p-4">
                  <SectionCard title="Organiser Details">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" /> {project.orgName || "—"}
                    </p>
                    {project.org.website ? (
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />{" "}
                        <a href={project.org.website} target="_blank" rel="noopener noreferrer" className="underline">
                        {project.org.website}
                      </a>
                    </p>
                    ) : (
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4" /> —
                      </p>
                    )}
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
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
              onValueChange={(value) => setStatusFilter(value as ApplicationStatus | "all")}
              className="space-y-4"
            >
              <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
                {STATUS_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-full border bg-background px-3 py-1.5 text-sm font-medium data-[state=active]:border-primary data-[state=active]:bg-primary/10"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={statusFilter} className="space-y-3">
                {visibleApplications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40 py-12 text-center text-muted-foreground">
                    <Users className="h-10 w-10" />
                    <p>No applicants for this filter yet</p>
                  </div>
                ) : (
                  <div className="rounded-xl border">
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
                        {visibleApplications.map((app: any) => {
                          const meta = STATUS_META[app.status as ApplicationStatus];
                          return (
                            <TableRow key={app.id}>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm font-semibold">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    {app.applicant?.name ?? "Unknown"}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {app.applicant?.email ?? ""}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={meta.tone}>{meta.label}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <CalendarDays className="h-4 w-4" />
                                  {new Date(app.submittedAt).toLocaleDateString("en-GB")}
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {app.motivation ?? "—"}
                                </p>
                              </TableCell>
                              <TableCell className="text-right flex gap-2 justify-end">
                                {/* View Profile */}
                                <Button variant="outline" size="sm" asChild>
                                  <Link
                                    to="/organisations/applicant/$projectId/$applicantId"
                                    params={{ applicantId: app.userId, projectId: project.id }}
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
              {decisionType === "accept" ? "Confirm Acceptance" : "Confirm Rejection"}
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
              className={decisionType === "accept" ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}
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

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
      <span>{icon}</span>
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="font-body text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, content, children }: { title: string; content?: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <p className="font-medium text-foreground">{title}</p>
      {content ? <p className="text-sm text-muted-foreground mt-1">{content}</p> : children}
    </div>
  );
}
