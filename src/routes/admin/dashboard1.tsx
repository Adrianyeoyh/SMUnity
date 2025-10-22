import { createFileRoute } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import { Button } from "#client/components/ui/button";
import { Badge } from "#client/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { ScrollArea } from "#client/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import {
  ShieldCheck,
  Users,
  ClipboardList,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Filter,
  Building2,
  AlertTriangle,
  ChevronRight,
  History,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

type CspStatus = "pending" | "approved" | "rejected" | "changes-requested";

type CspRecord = {
  id: string;
  title: string;
  organiser: string;
  category: string;
  submittedOn: string;
  volunteersNeeded: number;
  applications: number;
  status: CspStatus;
  contactEmail: string;
  contactPhone: string;
};

type ActivityRecord = {
  id: string;
  title: string;
  description: string;
  happenedAt: string;
  type: "approval" | "rejection" | "application" | "update";
};

const statusBadge: Record<CspStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  "changes-requested": "bg-blue-100 text-blue-800",
};

const statusLabel: Record<CspStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
  "changes-requested": "Changes requested",
};

const activityTone: Record<ActivityRecord["type"], { badge: string; icon: ComponentType<any>; iconWrapper: string }> = {
  approval: { badge: "bg-emerald-100 text-emerald-800", icon: CheckCircle2, iconWrapper: "bg-emerald-50 text-emerald-600" },
  rejection: { badge: "bg-rose-100 text-rose-800", icon: XCircle, iconWrapper: "bg-rose-50 text-rose-600" },
  application: { badge: "bg-sky-100 text-sky-800", icon: Users, iconWrapper: "bg-sky-50 text-sky-600" },
  update: { badge: "bg-purple-100 text-purple-800", icon: Activity, iconWrapper: "bg-purple-50 text-purple-600" },
};

const activityTabs = [
  { value: "all", label: "All" },
  { value: "approval", label: "Approvals" },
  { value: "application", label: "Applications" },
  { value: "update", label: "Updates" },
  { value: "rejection", label: "Rejections" },
] as const;

const initialCspQueue: CspRecord[] = [
  {
    id: "csp-401",
    title: "Bedok Rivervale Food Rescue",
    organiser: "Heartfull Kitchen",
    category: "Food Security",
    submittedOn: "2025-03-02",
    volunteersNeeded: 24,
    applications: 15,
    status: "pending",
    contactEmail: "heartfull@org.sg",
    contactPhone: "+65 9334 1122",
  },
  {
    id: "csp-402",
    title: "Bukit Merah Repair Cafe Mentors",
    organiser: "Repair Forward",
    category: "Sustainability",
    submittedOn: "2025-03-01",
    volunteersNeeded: 18,
    applications: 10,
    status: "changes-requested",
    contactEmail: "connect@repairforward.org",
    contactPhone: "+65 9456 7788",
  },
  {
    id: "csp-399",
    title: "Sunshine Seniors Befriending",
    organiser: "CareSMU",
    category: "Seniors",
    submittedOn: "2025-02-28",
    volunteersNeeded: 35,
    applications: 42,
    status: "approved",
    contactEmail: "hello@caresmu.com",
    contactPhone: "+65 8123 5678",
  },
  {
    id: "csp-395",
    title: "Community Coding Camp",
    organiser: "Bright Minds SG",
    category: "Education",
    submittedOn: "2025-02-25",
    volunteersNeeded: 20,
    applications: 8,
    status: "rejected",
    contactEmail: "team@brightminds.sg",
    contactPhone: "+65 8765 4432",
  },
];

const recentActivity: ActivityRecord[] = [
  {
    id: "act-1",
    title: "Approved Sunshine Seniors Befriending",
    description: "CSP is now live and visible to student volunteers.",
    happenedAt: "2 hours ago",
    type: "approval",
  },
  {
    id: "act-2",
    title: "Heartfull Kitchen submitted CSP",
    description: "Awaiting verification: Bedok Rivervale Food Rescue.",
    happenedAt: "5 hours ago",
    type: "application",
  },
  {
    id: "act-3",
    title: "Bright Minds SG resubmitted proposal",
    description: "Community Coding Camp provided updated risk assessment.",
    happenedAt: "Yesterday",
    type: "update",
  },
  {
    id: "act-4",
    title: "Rejected Urban Rooftop Farming",
    description: "Organiser notified with feedback on safety approvals.",
    happenedAt: "2 days ago",
    type: "rejection",
  },
];

export const Route = createFileRoute("/admin/dashboard1")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [cspQueue, setCspQueue] = useState<CspRecord[]>(initialCspQueue);
  const [tabValue, setTabValue] = useState<"all" | CspStatus>("all");
  const [activityFilter, setActivityFilter] = useState<"all" | ActivityRecord["type"]>("all");

  const stats = useMemo(() => {
    const totals = cspQueue.reduce(
      (acc, csp) => {
        acc.total += 1;
        acc.applications += csp.applications;
        if (csp.status === "pending") acc.pending += 1;
        if (csp.status === "approved") acc.approved += 1;
        if (csp.status === "rejected") acc.rejected += 1;
        if (csp.status === "changes-requested") acc.changesRequested += 1;
        return acc;
      },
      {
        total: 0,
        applications: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        changesRequested: 0,
      },
    );

    const volunteers = cspQueue.reduce((sum, csp) => sum + csp.volunteersNeeded, 0);

    return {
      totalCSPs: totals.total,
      totalApplications: totals.applications,
      totalVolunteersRequired: volunteers,
      pending: totals.pending,
      approved: totals.approved,
      rejected: totals.rejected,
      changesRequested: totals.changesRequested,
    };
  }, [cspQueue]);

  const filteredQueue = useMemo(() => {
    if (tabValue === "all") return cspQueue;
    return cspQueue.filter((csp) => csp.status === tabValue);
  }, [cspQueue, tabValue]);

  const displayedActivity = useMemo(
    () => (activityFilter === "all" ? recentActivity : recentActivity.filter((item) => item.type === activityFilter)),
    [activityFilter],
  );

  const handleStatusChange = (id: string, status: CspStatus) => {
    setCspQueue((prev) =>
      prev.map((csp) => (csp.id === id ? { ...csp, status } : csp)),
    );

    const label = statusLabel[status];
    const notify =
      status === "rejected" ? toast.error : status === "changes-requested" ? toast.info : toast.success;

    notify(label, {
      description: "Organiser has been notified of this decision.",
    });
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-10 space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground font-body">
              Monitor platform performance, verify CSP submissions, and stay on top of recent activity.
            </p>
          </div>
          <Button className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Add new CSP
          </Button>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">Total CSP listings</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold text-foreground">{stats.totalCSPs}</p>
              <p className="text-xs font-body text-muted-foreground">{stats.approved} approved · {stats.pending} pending</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">Applications logged</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold text-foreground">{stats.totalApplications}</p>
              <p className="text-xs font-body text-muted-foreground">Across all pending & live CSPs</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">Volunteers needed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold text-foreground">{stats.totalVolunteersRequired}</p>
              <p className="text-xs font-body text-muted-foreground">Target sign-ups requested by organisers</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">Review queue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold text-foreground">{stats.pending + stats.changesRequested}</p>
              <p className="text-xs font-body text-muted-foreground">
                {stats.pending} awaiting decision · {stats.changesRequested} awaiting organiser updates
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3 md:justify-between">
                <div>
                  <CardTitle className="font-heading text-xl">CSP approval queue</CardTitle>
                  <CardDescription className="font-body">
                    Review pending submissions and confirm organiser readiness before listings go live.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="inline-flex items-center gap-2 md:ml-auto">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
              <Tabs value={tabValue} onValueChange={(value) => setTabValue(value as typeof tabValue)} className="w-full">
                <TabsList className="flex w-full flex-wrap justify-start gap-2">
                  <TabsTrigger value="all" className="font-body">All</TabsTrigger>
                  <TabsTrigger value="pending" className="font-body">Pending</TabsTrigger>
                  <TabsTrigger value="approved" className="font-body">Approved</TabsTrigger>
                  <TabsTrigger value="changes-requested" className="font-body">Changes requested</TabsTrigger>
                  <TabsTrigger value="rejected" className="font-body">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[480px] overflow-x-hidden pr-2">
                <div className="space-y-4">
                  {filteredQueue.map((csp) => (
                    <div
                      key={csp.id}
                      className="rounded-xl border border-border/60 bg-background/80 p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-heading text-lg font-semibold text-foreground">{csp.title}</h3>
                            <Badge className={`${statusBadge[csp.status]} font-body`}>{statusLabel[csp.status]}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-body">
                            {csp.organiser} · {csp.category}
                          </p>
                          <div className="flex flex-wrap gap-4 text-xs font-body text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-4 w-4" /> Submitted {csp.submittedOn}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-4 w-4" /> Needs {csp.volunteersNeeded} volunteers
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground font-body">
                            <span className="inline-flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {csp.contactEmail}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {csp.contactPhone}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-start gap-2 md:items-end">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleStatusChange(csp.id, "approved")}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(csp.id, "changes-requested")}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Request changes
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusChange(csp.id, "rejected")}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredQueue.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 py-12 text-center">
                      <h4 className="font-heading text-lg text-foreground">No CSPs in this view</h4>
                      <p className="text-sm text-muted-foreground font-body">
                        Switch to another filter to manage different parts of the pipeline.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Recent activity</CardTitle>
                <CardDescription className="font-body">
                  Latest updates across approvals, organiser submissions, and system actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={activityFilter}
                  onValueChange={(value) => setActivityFilter(value as typeof activityFilter)}
                  className="space-y-4"
                >
                  <TabsList className="flex w-full flex-wrap justify-start gap-2">
                    {activityTabs.map((tab) => (
                      <TabsTrigger key={tab.value} value={tab.value} className="font-body">
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {activityTabs.map((tab) => {
                    const data =
                      tab.value === "all"
                        ? recentActivity
                        : recentActivity.filter((item) => item.type === tab.value);
                    return (
                      <TabsContent key={tab.value} value={tab.value}>
                        <ScrollArea className="max-h-[360px] overflow-x-hidden pr-2">
                          <div className="space-y-4">
                            {data.map((activity) => {
                              const tone = activityTone[activity.type];
                              const Icon = tone.icon;
                              return (
                                <div
                                  key={activity.id}
                                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/90 p-4 shadow-sm transition hover:border-primary/20 hover:shadow-md"
                                >
                                  <div className={`mt-1 rounded-full p-2 ${tone.iconWrapper}`}>
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <h3 className="font-heading text-base font-semibold text-foreground leading-tight">
                                        {activity.title}
                                      </h3>
                                      <Badge className={`px-2 py-0.5 text-[10px] font-semibold tracking-wide ${tone.badge}`}>
                                        {activity.type.toUpperCase()}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-body leading-relaxed">
                                      {activity.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground/80 font-body">{activity.happenedAt}</p>
                                  </div>
                                </div>
                              );
                            })}

                            {data.length === 0 && (
                              <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 py-10 text-center">
                                <h4 className="font-heading text-sm font-semibold text-foreground">Nothing to show here</h4>
                                <p className="text-xs text-muted-foreground font-body">
                                  Switch to a different filter to see more updates.
                                </p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Approved CSP portfolio</CardTitle>
            <CardDescription className="font-body">
              Snapshot of campaigns visible to students, sorted by latest approvals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {cspQueue
                .filter((csp) => csp.status === "approved")
                .map((csp) => (
                  <div key={csp.id} className="rounded-xl border bg-background/80 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-semibold text-foreground">{csp.title}</h3>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground font-body">{csp.organiser}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-body">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {csp.volunteersNeeded} volunteers
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ClipboardList className="h-4 w-4" />
                        {csp.applications} applications
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <History className="h-4 w-4" />
                        Approved recently
                      </span>
                    </div>
                  </div>
                ))}

              {cspQueue.filter((csp) => csp.status === "approved").length === 0 && (
                <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 py-12 text-center">
                  <h4 className="font-heading text-lg text-foreground">No approved CSPs yet</h4>
                  <p className="text-sm text-muted-foreground font-body">
                    Once you approve a submission, it will appear here for quick visibility.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
