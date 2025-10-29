import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#client/components/ui/table";
import { Badge } from "#client/components/ui/badge";
import { Skeleton } from "#client/components/ui/skeleton";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Mail,
  User,
  CalendarDays,
} from "lucide-react";

export const Route = createFileRoute("/organisations/listingapplications/$projectId")({
  component: ListingApplicationsPage,
});

type ApplicationStatus = "pending" | "accepted" | "rejected" | "confirmed" | "withdrawn" | "cancelled";

type Listing = {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  slots: number;
  applications: number;
  status: string;
  highlights: string[];
};

type ListingApplication = {
  id: string;
  applicant: string;
  applicantId: string;
  email: string;
  submittedOn: string;
  status: ApplicationStatus;
  motivation?: string;
};

const LISTINGS: Listing[] = [
  {
    id: "csp-001",
    title: "Community Garden Mentors",
    location: "Bukit Gombak",
    startDate: "2025-04-05",
    endDate: "2025-06-15",
    slots: 12,
    applications: 8,
    status: "Open",
    highlights: ["Weekends", "Outdoor", "Families"],
  },
  {
    id: "csp-002",
    title: "Digital Literacy Buddies",
    location: "Queenstown",
    startDate: "2025-03-30",
    endDate: "2025-05-20",
    slots: 20,
    applications: 15,
    status: "Shortlisting",
    highlights: ["Weeknights", "Indoor", "Elderly"],
  },
  {
    id: "csp-003",
    title: "North Bridge Homework Club",
    location: "North Bridge Rd",
    startDate: "2025-04-10",
    endDate: "2025-07-30",
    slots: 18,
    applications: 11,
    status: "Open",
    highlights: ["After school", "Mentoring"],
  },
];

const APPLICATIONS: Record<string, ListingApplication[]> = {
  "csp-001": [
    {
      id: "app-1045",
      applicantId: "serena-liang",
      applicant: "Serena Liang",
      email: "serena.liang@smu.edu.sg",
      submittedOn: "2025-03-04",
      status: "pending",
      motivation: "I love working with families and gardening.",
    },
    {
      id: "app-1050",
      applicantId: "jasper-teo",
      applicant: "Jasper Teo",
      email: "jasper.teo@smu.edu.sg",
      submittedOn: "2025-03-01",
      status: "accepted",
    },
    {
      id: "app-1051",
      applicantId: "lim-wei",
      applicant: "Lim Wei",
      email: "lim.wei@smu.edu.sg",
      submittedOn: "2025-02-28",
      status: "withdrawn",
    },
  ],
  "csp-002": [
    {
      id: "app-1046",
      applicantId: "daniel-ong",
      applicant: "Daniel Ong",
      email: "daniel.ong@smu.edu.sg",
      submittedOn: "2025-03-03",
      status: "confirmed",
    },
    {
      id: "app-1048",
      applicantId: "priya-nair",
      applicant: "Priya Nair",
      email: "priya.nair@smu.edu.sg",
      submittedOn: "2025-03-02",
      status: "pending",
      motivation: "Keen to mentor elderly with technology.",
    },
    {
      id: "app-1052",
      applicantId: "sarah-ong",
      applicant: "Sarah Ong",
      email: "sarah.ong@smu.edu.sg",
      submittedOn: "2025-02-25",
      status: "rejected",
    },
  ],
  "csp-003": [
    {
      id: "app-1047",
      applicantId: "micah-koh",
      applicant: "Micah Koh",
      email: "micah.koh@smu.edu.sg",
      submittedOn: "2025-03-02",
      status: "confirmed",
    },
    {
      id: "app-1053",
      applicantId: "andrea-tan",
      applicant: "Andrea Tan",
      email: "andrea.tan@smu.edu.sg",
      submittedOn: "2025-02-28",
      status: "pending",
    },
  ],
};

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
  withdrawn: { tone: "bg-neutral-200 text-neutral-700", label: "Withdrawn" },
  cancelled: { tone: "bg-neutral-200 text-neutral-700", label: "Cancelled" },
};

function ListingApplicationsPage() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate({ from: "/organisations/listingapplications/$projectId" });
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");

  const listing = useMemo(() => LISTINGS.find((item) => item.id === projectId) ?? null, [projectId]);
  const allApplications = useMemo(() => APPLICATIONS[projectId] ?? [], [projectId]);
  const visibleApplications = useMemo(
    () =>
      statusFilter === "all"
        ? allApplications
        : allApplications.filter((application) => application.status === statusFilter),
    [allApplications, statusFilter],
  );

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-10">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Listing not found</CardTitle>
              <CardDescription className="font-body">
                The listing you are looking for could not be located. It may have been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate({ to: "/organisations/dashboard" })}>Return to dashboard</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-6 space-y-3">
          <Button
            variant="ghost"
            className="w-fit px-0"
            onClick={() => navigate({ to: "/organisations/dashboard" })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Button>
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-semibold text-foreground">{listing.title}</h1>
            <p className="text-muted-foreground font-body">Manage applicants for this listing.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="font-heading text-lg">Listing overview</CardTitle>
            <CardDescription className="font-body text-sm">
              Snapshot of key details and current application counts.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <InfoRow icon={<MapPin className="h-4 w-4 text-muted-foreground" />} label="Location" value={listing.location} />
            <InfoRow
              icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
              label="Timeline"
              value={`${listing.startDate} – ${listing.endDate}`}
            />
            <InfoRow
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              label="Slots"
              value={`${listing.applications} of ${listing.slots} filled`}
            />
            <InfoRow
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              label="Status"
              value={listing.status}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Applications</CardTitle>
            <CardDescription className="font-body text-sm">
              Filter applicants by status and take the next action.
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
              <TabsList className="flex h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
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
                {!allApplications ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : visibleApplications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40 py-12 text-center text-muted-foreground">
                    <Users className="h-10 w-10" />
                    <p>No applicants for this filter yet.</p>
                  </div>
                ) : (
                  <div className="rounded-xl border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[25%]">Applicant</TableHead>
                          <TableHead className="w-[20%]">Status</TableHead>
                          <TableHead className="w-[20%]">Submitted</TableHead>
                          <TableHead className="w-[25%]">Motivation</TableHead>
                          <TableHead className="w-[10%]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visibleApplications.map((application) => {
                          const meta = STATUS_META[application.status];
                          return (
                            <TableRow key={application.id}>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    {application.applicant}
                                  </div>
                                  <p className="text-xs text-muted-foreground">#{application.id}</p>
                                  <p className="text-xs text-muted-foreground">{application.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={meta.tone}>{meta.label}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <CalendarDays className="h-4 w-4" />
                                  {new Date(application.submittedOn).toLocaleDateString("en-GB")}
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {application.motivation ?? "—"}
                                </p>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to="/applicants/$applicantId" params={{ applicantId: application.applicantId }}>
                                    View profile
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

