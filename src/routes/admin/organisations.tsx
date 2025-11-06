import type { OrganisationRecord } from "#client/api/admin/viewOrgs";
import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Globe, Mail, Phone, Search } from "lucide-react";
import { toast } from "sonner";

import {
  fetchAdminOrganisations,
  reactivateOrganisation,
  suspendOrganisation,
} from "#client/api/admin/viewOrgs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#client/components/ui/alert-dialog";
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
  DialogHeader,
  DialogTitle,
} from "#client/components/ui/dialog";
import { Input } from "#client/components/ui/input";
import { ScrollArea } from "#client/components/ui/scroll-area";
import { Separator } from "#client/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "#client/components/ui/tabs";

// import {
//   fetchAdminOrganisations,
//   reactivateOrganisation,
//   suspendOrganisation,
// } from "#client/api/admin/viewOrgs";

export const Route = createFileRoute("/admin/organisations")({
  component: AdminOrganisationsPage,
});

type StatusTab = "all" | "active" | "suspended";

const statusBadge: Record<
  Exclude<OrganisationRecord["status"], never>,
  string
> = {
  active: "bg-emerald-100 text-emerald-800",
  // pending: "bg-amber-100 text-amber-800",
  suspended: "bg-gray-100 text-gray-800",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toISOString().split("T")[0];
  } catch {
    return iso;
  }
}

function AdminOrganisationsPage() {
  const [records, setRecords] = useState<OrganisationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<StatusTab>("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<OrganisationRecord | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmOrg, setConfirmOrg] = useState<OrganisationRecord | null>(null);
  const [confirmAction, setConfirmAction] = useState<"suspend" | "reactivate">(
    "suspend",
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchAdminOrganisations();
        if (mounted) setRecords(data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load organisations");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [tab, search]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [page]);

  // Ensure description is available after hot reloads: refetch if missing when opening modal
  useEffect(() => {
    if (!open || !selected || selected.description) return;
    (async () => {
      try {
        const fresh = await fetchAdminOrganisations();
        const found = fresh.find((o) => o.id === selected.id);
        if (found) {
          setSelected(found);
          // also refresh the main list cache so future opens have description
          setRecords((prev) => {
            const map = new Map(prev.map((r) => [r.id, r]));
            map.set(found.id, found);
            return Array.from(map.values());
          });
        }
      } catch {}
    })();
  }, [open, selected]);

  const handleSuspend = async (org: OrganisationRecord) => {
    if (org.status !== "active") return;
    try {
      setBusyId(org.id);
      await suspendOrganisation(org.id);
      setRecords((prev) =>
        prev.map((r) => (r.id === org.id ? { ...r, status: "suspended" } : r)),
      );
      setSelected((prev) =>
        prev && prev.id === org.id ? { ...prev, status: "suspended" } : prev,
      );
      toast.success("Organisation suspended", {
        description: `${org.name} has been suspended and can no longer create or manage projects`,
      });
    } catch (error) {
      toast.error("Failed to suspend organisation");
    } finally {
      setBusyId(null);
    }
  };

  const handleReactivate = async (org: OrganisationRecord) => {
    if (org.status !== "suspended") return;
    try {
      setBusyId(org.id);
      await reactivateOrganisation(org.id);
      setRecords((prev) =>
        prev.map((r) => (r.id === org.id ? { ...r, status: "active" } : r)),
      );
      setSelected((prev) =>
        prev && prev.id === org.id ? { ...prev, status: "active" } : prev,
      );
      toast.success("Organisation reactivated", {
        description: `${org.name} can now create and manage projects again`,
      });
    } catch (error) {
      toast.error("Failed to reactivate organisation");
    } finally {
      setBusyId(null);
    }
  };

  // status tabs count
  const statusCounts = useMemo(() => {
    return {
      all: records.length,
      active: records.filter((o) => o.status === "active").length,
      suspended: records.filter((o) => o.status === "suspended").length,
    };
  }, [records]);

  const filtered = useMemo(() => {
    let list = records;
    if (tab !== "all") list = list.filter((r) => r.status === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.phone?.toLowerCase().includes(q) ?? false),
      );
    }
    const statusOrder: Record<string, number> = {
      active: 0,
      suspended: 1,
      // pending: 2,
    };
    return list.sort((a, b) => {
      const sA = statusOrder[a.status] ?? 99;
      const sB = statusOrder[b.status] ?? 99;
      if (sA !== sB) return sA - sB;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [records, tab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const current = filtered.slice(start, start + pageSize);

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-heading text-foreground mb-2 text-3xl font-bold md:text-4xl">
                All Organisations
              </h1>
              <p className="text-muted-foreground font-body text-lg">
                Browse and manage all registered organisations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6 pb-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-[640px] xl:max-w-[840px]">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search organisations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="py-2 pr-4 pl-10"
            />
          </div>
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as StatusTab)}
            className="w-full md:w-auto"
          >
            <TabsList className="flex w-full gap-2 overflow-x-auto px-1 whitespace-nowrap md:w-auto">
              <TabsTrigger value="all" className="font-body shrink-0">
                All ({statusCounts.all})
              </TabsTrigger>
              <TabsTrigger value="active" className="font-body shrink-0">
                Active ({statusCounts.active})
              </TabsTrigger>
              <TabsTrigger value="suspended" className="font-body shrink-0">
                Suspended ({statusCounts.suspended})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Separator className="my-6" />

        {error && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="font-heading">Failed to load</CardTitle>
              <CardDescription className="font-body">{error}</CardDescription>
            </CardHeader>
          </Card>
        )}

        <ScrollArea ref={scrollRef}>
          <div className="space-y-4">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="bg-muted h-5 w-40 rounded" />
                    <div className="bg-muted mt-2 h-4 w-56 rounded" />
                  </CardHeader>
                </Card>
              ))}

            {!loading &&
              current.map((org) => (
                <Card
                  key={org.id}
                  className="group border-border/60 hover:border-primary/40 cursor-pointer rounded-xl border bg-white shadow-sm transition hover:shadow-md"
                  onClick={() => {
                    setSelected(org);
                    setOpen(true);
                  }}
                >
                  <CardHeader className="py-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="font-heading text-foreground group-hover:text-primary flex items-center gap-2 text-base transition-colors md:text-lg">
                          <span>{org.name}</span>
                          {["active", "suspended"].includes(org.status) && (
                            <Badge
                              className={`${statusBadge[org.status]} font-body capitalize`}
                            >
                              {org.status}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="font-body flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Created on: {formatDate(org.createdAt)} ·{" "}
                            {org.projects} projects
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {org.status === "active" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmOrg(org);
                              setConfirmAction("suspend");
                              setConfirmOpen(true);
                            }}
                            disabled={busyId === org.id}
                          >
                            {busyId === org.id ? "Suspending..." : "Suspend"}
                          </Button>
                        )}
                        {org.status === "suspended" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmOrg(org);
                              setConfirmAction("reactivate");
                              setConfirmOpen(true);
                            }}
                            disabled={busyId === org.id}
                          >
                            {busyId === org.id
                              ? "Reactivating..."
                              : "Reactivate"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-1 pb-2">
                    <div className="mt-0 flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between md:gap-2">
                      <div className="text-muted-foreground font-body flex flex-wrap gap-x-3 gap-y-1 text-xs md:text-sm">
                        <a
                          href={`mailto:${org.email}`}
                          className="hover:text-primary inline-flex items-center gap-1"
                        >
                          <Mail className="h-4 w-4" /> {org.email}
                        </a>
                        {org.phone && (
                          <a
                            href={`tel:${org.phone}`}
                            className="hover:text-primary inline-flex items-center gap-1"
                          >
                            <Phone className="h-4 w-4" /> {org.phone}
                          </a>
                        )}
                        {org.website && (
                          <a
                            href={org.website}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-primary inline-flex items-center gap-1"
                          >
                            <Globe className="h-4 w-4" /> {org.website}
                          </a>
                        )}
                      </div>
                      {/* actions moved to header */}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </ScrollArea>

        {!loading &&
          (() => {
            const end =
              filtered.length === 0
                ? 0
                : Math.min(start + pageSize, filtered.length);
            const begin = filtered.length === 0 ? 1 : start + 1;
            if (filtered.length > 0 && totalPages > 1) {
              return (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-muted-foreground font-body text-sm">
                    Showing {begin}-{end} of {filtered.length}{" "}
                    {filtered.length === 1 ? "result" : "results"}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              );
            }
            return (
              <div className="mt-6 flex items-center justify-center">
                <div className="text-muted-foreground font-body text-sm">
                  Showing {begin}-{end} of {filtered.length}{" "}
                  {filtered.length === 1 ? "result" : "results"}
                </div>
              </div>
            );
          })()}
      </div>

      {/* Expanded view modal */}
      <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
        <DialogContent
          className="pt-8 sm:max-w-[560px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading flex items-center justify-between text-2xl">
                  {selected.name}
                  <span
                    className={`rounded-md px-2 py-1 text-xs ${statusBadge[selected.status]}`}
                  >
                    {selected.status.charAt(0).toUpperCase() +
                      selected.status.slice(1)}
                  </span>
                </DialogTitle>
                <DialogDescription className="font-body flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created on: {formatDate(selected.createdAt)} ·{" "}
                    {selected.projects} projects
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="font-body space-y-3 text-sm">
                {selected.description && (
                  <div>
                    <div className="text-muted-foreground mb-1">
                      Description
                    </div>
                    <p className="text-foreground leading-relaxed">
                      {selected.description}
                    </p>
                  </div>
                )}
                <div>
                  <div className="text-muted-foreground">Contact</div>
                  <div className="mt-1 flex flex-col gap-1">
                    <a
                      href={`mailto:${selected.email}`}
                      className="hover:text-primary inline-flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" /> {selected.email}
                    </a>
                    {selected.phone && (
                      <a
                        href={`tel:${selected.phone}`}
                        className="hover:text-primary inline-flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" /> {selected.phone}
                      </a>
                    )}
                    {selected.website && (
                      <a
                        href={selected.website}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary inline-flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4" /> {selected.website}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end pt-2">
                  {selected.status === "active" ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setConfirmOrg(selected);
                        setConfirmAction("suspend");
                        setConfirmOpen(true);
                      }}
                      disabled={busyId === selected.id}
                    >
                      {busyId === selected.id ? "Suspending..." : "Suspend"}
                    </Button>
                  ) : selected.status === "suspended" ? (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        setConfirmOrg(selected);
                        setConfirmAction("reactivate");
                        setConfirmOpen(true);
                      }}
                      disabled={busyId === selected.id}
                    >
                      {busyId === selected.id
                        ? "Reactivating..."
                        : "Reactivate"}
                    </Button>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Suspend confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">
              {confirmAction === "suspend"
                ? "Suspend Organisation?"
                : "Reactivate Organisation?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              {confirmAction === "suspend"
                ? `This will prevent ${confirmOrg?.name ?? "this organisation"} from creating or managing projects until reactivated.`
                : `This will allow ${confirmOrg?.name ?? "this organisation"} to create and manage projects again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!confirmOrg) return;
                if (confirmAction === "suspend")
                  await handleSuspend(confirmOrg);
                else await handleReactivate(confirmOrg);
                setConfirmOpen(false);
                setConfirmOrg(null);
              }}
              disabled={!!busyId}
              className={
                confirmAction === "suspend"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {busyId
                ? confirmAction === "suspend"
                  ? "Suspending..."
                  : "Reactivating..."
                : confirmAction === "suspend"
                  ? "Confirm Suspend"
                  : "Confirm Reactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
