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
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { useQuery } from "@tanstack/react-query";
import { fetchListingById } from "#client/api/organisations/listing.ts";
import { format } from "date-fns";

export const Route = createFileRoute("/organisations/$projectId")({
  component: ListingApplicationsPage,
});

type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "confirmed"
  | "withdrawn"
  | "cancelled";

const STATUS_TABS: Array<{ value: ApplicationStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "confirmed", label: "Confirmed" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_META: Record<ApplicationStatus, { tone: string; label: string }> = {
  pending: { tone: "bg-amber-100 text-amber-800", label: "Pending review" },
  accepted: { tone: "bg-emerald-100 text-emerald-800", label: "Accepted" },
  rejected: { tone: "bg-rose-100 text-rose-800", label: "Rejected" },
  confirmed: { tone: "bg-purple-100 text-purple-800", label: "Confirmed" },
  withdrawn: { tone: "bg-gray-100 text-gray-700", label: "Withdrawn" },
  cancelled: { tone: "bg-gray-100 text-gray-700", label: "Cancelled" },
};

function ListingApplicationsPage() {
    const { projectId } = Route.useParams();
  const navigate = useNavigate({ from: "/organisations/$projectId" });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["listing", projectId],
    queryFn: fetchListingById,
  });

  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [isOpen, setIsOpen] = useState(false);

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

  const fillPercentage = useMemo(() => {
    if (!project) return 0;
    return Math.round(
      (Math.min(project.volunteerCount ?? 0, project.slotsTotal ?? 0) / (project.slotsTotal || 1)) *
        100
    );
  }, [project]);

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
          <Button variant="ghost" className="w-fit px-0" onClick={() => navigate({ to: "/organisations/dashboard" })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">{project.title}</h1>
            <p className="text-muted-foreground font-body text-sm">
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
                  Overview and key information for this listing.
                </CardDescription>
              </div>
              <div className="flex flex-row items-center gap-4">
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
                  <Link to="/organisations/preview/$projectPreview" params={{ projectPreview: project.id }}>
                    Preview Listing
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CollapsibleContent>
              <CardContent className="grid gap-6 md:grid-cols-[2fr,1fr]">
                {/* Left Column */}
                
                  <div className="flex flex-wrap gap-2">
                    {(project.projectTags ?? []).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="capitalize">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-muted-foreground font-body leading-relaxed">{project.description}</p>

                <div className="grid grid-cols-2 gap-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-0">
                    <InfoRow icon={<MapPin className="h-4 w-4 text-muted-foreground" />} label="District" value={project.district} />
                    <InfoRow icon={<Calendar className="h-4 w-4 text-muted-foreground" />} label="Period" value={`${format(new Date(project.startDate), "yyyy-MM-dd")} – ${format(new Date(project.endDate), "yyyy-MM-dd")}`} />
                    <InfoRow icon={<Clock className="h-4 w-4 text-muted-foreground" />} label="Required Hours" value={`${project.requiredHours} hrs`} />
                    <InfoRow icon={<Users className="h-4 w-4 text-muted-foreground" />} label="Volunteers" value={`${project.volunteerCount} / ${project.slotsTotal}`} />
                    <InfoRow icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />} label="Apply By" value={format(new Date(project.applyBy), "yyyy-MM-dd")} />
                    <InfoRow icon={<Globe className="h-4 w-4 text-muted-foreground" />} label="Mode" value={project.isRemote ? "Remote" : "In-person"} />
                  </div>
                  <div className="grid grid-cols-1">
                    <SectionCard title="Organiser Details">
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" /> {project.orgName}
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4" />{" "}
                        <a href={project.org.website} target="_blank" className="underline">
                          {project.org.website}
                        </a>
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" /> {project.org.phone}
                      </p>
                    </SectionCard>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  {/* <SectionCard title="Organiser Details">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" /> {project.orgName}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4" />{" "}
                      <a href={project.org.website} target="_blank" className="underline">
                        {project.org.website}
                      </a>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" /> {project.org.phone}
                    </p>
                  </SectionCard> */}

                  <SectionCard title="What we provide" content={project.aboutProvide} />
                  <SectionCard title="What you’ll do" content={project.aboutDo} />
                  <SectionCard title="Requirements" content={project.requirements} />
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
              Filter and review all volunteer submissions for this project.
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
                    <p>No applicants for this filter yet.</p>
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
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link
                                    to="/applicants/$applicantId"
                                    params={{ applicantId: app.userId }}
                                  >
                                    View Profile
                                  </Link>
                                </Button>
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
