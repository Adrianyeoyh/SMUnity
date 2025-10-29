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

export const Route = createFileRoute("/organisations/$projectIdTEST")({
  component: ListingApplicationsPage,
});

type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "confirmed"
  | "withdrawn"
  | "cancelled";

// --- Mock Data (mirrors backend schema) ---
const MOCK_PROJECTS = [
  {
    id: "proj-001",
    title: "Community Garden Mentors",
    orgName: "GreenHeart Society",
    orgWebsite: "https://greenheart.sg",
    orgPhone: "+65 9123 4567",
    district: "Bukit Gombak",
    googleMaps: "https://maps.google.com?q=Bukit+Gombak",
    description:
      "Help local families cultivate sustainable gardening practices and foster community bonding through green initiatives.",
    aboutProvide:
      "Training on gardening techniques, materials provided, and community support from experienced mentors.",
    aboutDo:
      "You’ll guide families in creating their own garden plots and educate them about eco-friendly practices.",
    requirements: "Interest in sustainability and community work. No prior experience needed.",
    skillTags: ["Mentorship", "Community", "Sustainability"],
    projectTags: ["Outdoor", "Family", "Green Living"],
    slotsTotal: 12,
    requiredHours: 20,
    startDate: "2025-04-05",
    endDate: "2025-06-15",
    applyBy: "2025-03-31",
    isRemote: false,
    type: "local",
    volunteerCount: 8,
  },
];

const MOCK_APPLICATIONS = [
  {
    id: "app-1045",
    applicantId: "serena-liang",
    applicant: "Serena Liang",
    email: "serena.liang@smu.edu.sg",
    submittedOn: "2025-03-04",
    status: "pending" as ApplicationStatus,
    motivation: "I love working with families and gardening.",
  },
  {
    id: "app-1046",
    applicantId: "jasper-teo",
    applicant: "Jasper Teo",
    email: "jasper.teo@smu.edu.sg",
    submittedOn: "2025-03-01",
    status: "accepted" as ApplicationStatus,
    motivation: "Have prior volunteering experience with outdoor projects.",
  },
];

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
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [isOpen, setIsOpen] = useState(true); // <-- Collapsible state

  const project = useMemo(() => MOCK_PROJECTS.find((p) => p.id === projectId) ?? null, [projectId]);
  const applications = useMemo(() => MOCK_APPLICATIONS, []);
  const visibleApplications = useMemo(
    () =>
      statusFilter === "all"
        ? applications
        : applications.filter((a) => a.status === statusFilter),
    [applications, statusFilter]
  );

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-6">
          <CardTitle>Project not found</CardTitle>
          <CardDescription>The project you’re looking for may have been removed.</CardDescription>
          <Button className="mt-4" onClick={() => navigate({ to: "/organisations/dashboard" })}>
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const fillPercentage = Math.round(
    (Math.min(project.volunteerCount, project.slotsTotal) / project.slotsTotal) * 100
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-6 space-y-3">
          <Button variant="ghost" className="w-fit px-0" onClick={() => navigate({ to: "/organisations/dashboard" })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Button>
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">{project.title}</h1>
            <p className="text-muted-foreground font-body text-sm">
              Organised by {project.orgName} ({project.type})
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
            </CardHeader>

            <CollapsibleContent>
              <CardContent className="grid gap-6 md:grid-cols-[2fr,1fr]">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.projectTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="capitalize">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-muted-foreground font-body leading-relaxed">{project.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <InfoRow icon={<MapPin className="h-4 w-4 text-muted-foreground" />} label="District" value={project.district} />
                    <InfoRow icon={<Calendar className="h-4 w-4 text-muted-foreground" />} label="Period" value={`${project.startDate} – ${project.endDate}`} />
                    <InfoRow icon={<Clock className="h-4 w-4 text-muted-foreground" />} label="Required Hours" value={`${project.requiredHours} hrs`} />
                    <InfoRow icon={<Users className="h-4 w-4 text-muted-foreground" />} label="Volunteers" value={`${project.volunteerCount} / ${project.slotsTotal}`} />
                    <InfoRow icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />} label="Apply By" value={project.applyBy} />
                    <InfoRow icon={<Globe className="h-4 w-4 text-muted-foreground" />} label="Mode" value={project.isRemote ? "Remote" : "In-person"} />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <SectionCard title="Organiser Details">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" /> {project.orgName}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4" />{" "}
                      <a href={project.orgWebsite} target="_blank" className="underline">
                        {project.orgWebsite}
                      </a>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" /> {project.orgPhone}
                    </p>
                  </SectionCard>

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
                        {visibleApplications.map((app) => {
                          const meta = STATUS_META[app.status];
                          return (
                            <TableRow key={app.id}>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm font-semibold">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    {app.applicant}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{app.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={meta.tone}>{meta.label}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <CalendarDays className="h-4 w-4" />
                                  {new Date(app.submittedOn).toLocaleDateString("en-GB")}
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
                                    params={{ applicantId: app.applicantId }}
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
