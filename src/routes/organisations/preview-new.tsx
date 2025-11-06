import type { FormInput } from "#client/helper/index.ts";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { createOrganisationProject } from "#client/api/organisations/listing";
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

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
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

function SectionCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-muted/40 rounded-lg border p-3">
      <p className="text-foreground font-medium">{title}</p>
      <p className="text-muted-foreground mt-1 text-sm break-words overflow-wrap-anywhere whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}

export const Route = createFileRoute("/organisations/preview-new")({
  component: PreviewPage,
});

function PreviewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormInput | null>(null);
  console.log(formData);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Get form data from localStorage
    const data = localStorage.getItem("newListingFormData");
    if (data) {
      setFormData(JSON.parse(data));
    } else {
      // No data, redirect back to form
      navigate({ to: "/organisations/new" });
    }
  }, [navigate]);

  const m = useMutation({
    mutationFn: createOrganisationProject,
    onSuccess: () => {
      // Clear localStorage first
      localStorage.removeItem("newListingFormData");
      localStorage.removeItem("newListingFormDraft");

      // Invalidate queries to refresh dashboard data (don't wait for it)
      queryClient.invalidateQueries({ queryKey: ["org-listings"] });
      queryClient.invalidateQueries({ queryKey: ["org-dashboard"] });

      // Navigate immediately - use window.location as fallback if navigate doesn't work
      navigate({ to: "/organisations/dashboard", replace: true });

      // Show success toast after navigation starts
      toast.success("Project created successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create project");
    },
  });

  if (!formData) {
    return null;
  }

  const handleSubmit = () => {
    setOpen(false);
    m.mutate(formData);
  };

  const handleBack = () => {
    navigate({ to: "/organisations/new" });
  };

  // Format dates
  const startDate = formData.start_date ? new Date(formData.start_date) : null;
  const endDate = formData.end_date ? new Date(formData.end_date) : null;
  const deadline = formData.application_deadline
    ? new Date(formData.application_deadline)
    : null;

  // console.log(formData.country)

  return (
    <div className="bg-background min-h-screen">
      {/* Top Navigation */}
      <div className="bg-background border-b">
        <div className="container mx-auto space-y-3 px-4 py-6">
          <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
            <button
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground inline-flex items-center transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
            <span>/</span>
            <button
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Create New Listing
            </button>
            <span>/</span>
            <span className="text-foreground">Preview</span>
          </div>
          <div>
            <h1 className="font-heading text-foreground text-3xl font-bold">
              {formData.title}
            </h1>
            <p className="text-muted-foreground font-body mt-2 text-sm">
              {formData.project_type === "local" ? "Local" : "Overseas"} project
            </p>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="container mx-auto space-y-8 px-4 py-8">
        <Card className="bg-card/60 border shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="font-heading text-lg">
                  Review Listing
                </CardTitle>
                <CardDescription className="font-body text-sm">
                  Review your listing before submitting
                </CardDescription>
              </div>
              {formData.google_maps && formData.project_type === "local" && (
                <a
                  href={formData.google_maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
                >
                  <MapPin className="h-4 w-4" />
                  View on Maps
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </CardHeader>

          {/* Project Description */}
          <CardContent className="mb-4">
            <p className="text-muted-foreground font-body leading-relaxed break-all">
              {formData.description}
            </p>
          </CardContent>

          {/* Image and Key Info Grid */}
          <CardContent className="mb-4 grid gap-6 lg:grid-cols-3">
            {/* Left - Image (1/3 width) */}
            <div>
              {formData.image_url && (
                <div className="flex h-full items-center justify-center overflow-hidden rounded-lg border">
                  <img
                    src={formData.image_url}
                    alt={formData.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Right - Key Info (2/3 width) */}
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
              {/* First Row */}
              {(!formData.remote || formData.project_type === "overseas") && (
                <InfoRow
                  icon={<MapPin className="text-muted-foreground h-4 w-4" />}
                  label={
                    formData.project_type === "overseas"
                      ? "Country"
                      : "District"
                  }
                  value={
                    formData.project_type === "overseas"
                      ? formData.country || "—"
                      : formData.district || "—"
                  }
                />
              )}
              <InfoRow
                icon={<Calendar className="text-muted-foreground h-4 w-4" />}
                label="Period"
                value={
                  formData.repeat_interval === 0
                    ? startDate
                      ? format(startDate, "dd-MM-yyyy")
                      : "—"
                    : startDate && endDate
                      ? `${format(startDate, "dd-MM-yyyy")} – ${format(endDate, "dd-MM-yyyy")}`
                      : "—"
                }
              />

              {/* Second Row */}
              <InfoRow
                icon={
                  <CalendarDays className="text-muted-foreground h-4 w-4" />
                }
                label="Apply By"
                value={deadline ? format(deadline, "dd-MM-yyyy") : "—"}
              />
              {formData.repeat_interval !== 0 && (
                <InfoRow
                  icon={<Users className="text-muted-foreground h-4 w-4" />}
                  label="Slots"
                  value={`${formData.slots || 0}`}
                />
              )}

              {/* Third Row */}
              <InfoRow
                icon={<Clock className="text-muted-foreground h-4 w-4" />}
                label="Total Service Hours"
                value={`${formData.commitable_hours || 0} hrs`}
              />
              <InfoRow
                icon={<Globe className="text-muted-foreground h-4 w-4" />}
                label="Mode"
                value={formData.remote ? "Remote" : "In-person"}
              />

              {/* Fourth Row - Schedule takes full width on small screens */}
              <div className="bg-muted/40 rounded-lg border p-3 sm:col-span-2">
                <p className="text-foreground font-medium">Schedule</p>
                <div className="mt-1 space-y-1">
                  {formData.repeat_interval !== 0 && (
                    <p className="text-muted-foreground text-sm">
                      Every {formData.repeat_interval} week
                      {formData.repeat_interval && formData.repeat_interval > 1
                        ? "s"
                        : ""}
                    </p>
                  )}
                  {formData.days_of_week &&
                    formData.days_of_week.length > 0 && (
                      <p className="text-muted-foreground text-sm">
                        {formData.days_of_week.join(", ")}
                      </p>
                    )}
                  {formData.time_start && formData.time_end && (
                    <p className="text-muted-foreground text-sm">
                      {formData.time_start} – {formData.time_end}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          {/* What You'll Do, Requirements, What You'll Equip Students with */}
          <CardContent>
            <div className="mb-4 space-y-3">
              <SectionCard
                title="What Students will Do"
                content={formData.about_do || "—"}
              />
              <SectionCard
                title="Student Requirements"
                content={formData.requirements || "—"}
              />
              <SectionCard
                title="What You will Equip Students with"
                content={formData.about_provide || "—"}
              />
            </div>
          </CardContent>

          {/* Skills and Tags Row */}
          <CardContent className="mb-4 grid gap-6 md:grid-cols-2">
            {/* Left - Skills */}
            <div className="space-y-2">
              <p className="text-foreground font-medium">Skills Required</p>
              {formData.skill_tags && formData.skill_tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.skill_tags.map((skill: string) => (
                    <Badge key={skill} variant="default" className="capitalize">
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
              <div className="flex flex-wrap gap-2">
                {formData.project_tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={handleBack}>
            Back to Edit
          </Button>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <Button onClick={() => setOpen(true)} disabled={m.isPending}>
              {m.isPending ? "Creating..." : "Confirm"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Listing Creation?</AlertDialogTitle>
                <AlertDialogDescription>
                  Once you create this listing, you will no longer be able to
                  modify it.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>
                  Confirm & Create
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
