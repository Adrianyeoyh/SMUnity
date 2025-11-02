import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
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
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Globe,
  CalendarDays,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { createOrganisationProject } from "#client/api/organisations/listing";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { FormInput } from "#client/helper/index.ts";

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

function SectionCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{content}</p>
    </div>
  );
}

export const Route = createFileRoute("/organisations/preview-new")({
  component: PreviewPage,
});

function PreviewPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormInput | null>(null);
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
      toast.success("Project created successfully!");
      localStorage.removeItem("newListingFormData");
      localStorage.removeItem("newListingFormDraft");
      navigate({ to: "/organisations/dashboard" });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create project");
    },
  });

  if (!formData) {
    return null;
  }

  const handleSubmit = () => {
    m.mutate(formData);
  };

  const handleBack = () => {
    navigate({ to: "/organisations/new" });
  };

  // Format dates
  const startDate = formData.start_date ? new Date(formData.start_date) : null;
  const endDate = formData.end_date ? new Date(formData.end_date) : null;
  const deadline = formData.application_deadline ? new Date(formData.application_deadline) : null;

  console.log(formData.country)

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-6 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
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
            <h1 className="font-heading text-3xl font-bold text-foreground">{formData.title}</h1>
            <p className="text-muted-foreground font-body text-sm mt-2">
              {formData.project_type === "local" ? "Local" : "Overseas"} project
            </p>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Card className="border bg-card/60 shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="font-heading text-lg">Review Listing</CardTitle>
                <CardDescription className="font-body text-sm">
                  Review your listing before submitting
                </CardDescription>
              </div>
              {formData.google_maps && formData.project_type === "local" && (
                <a
                  href={formData.google_maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
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
            <p className="text-muted-foreground font-body leading-relaxed">{formData.description}</p>
          </CardContent>

          {/* Image and Key Info Grid */}
          <CardContent className="grid lg:grid-cols-3 gap-6 mb-4">
            {/* Left - Image (1/3 width) */}
            <div>
              {formData.image_url && (
                <div className="rounded-lg overflow-hidden border h-full flex items-center justify-center">
                  <img
                    src={formData.image_url}
                    alt={formData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            {/* Right - Key Info (2/3 width) */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-3">
              {/* First Row */}
              {(!formData.remote || formData.project_type === "overseas") && (
                <InfoRow
                  icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                  label={formData.project_type === "overseas" ? "Country" : "District"}
                  value={formData.project_type === "overseas" ? (formData.country || "—") : (formData.district || "—")}
                />
              )}
              <InfoRow
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                label="Period"
                value={
                  formData.repeat_interval === 0
                    ? (startDate ? format(startDate, "yyyy-MM-dd") : "—")
                    : (startDate && endDate
                        ? `${format(startDate, "yyyy-MM-dd")} – ${format(endDate, "yyyy-MM-dd")}`
                        : "—")
                }
              />
              
              {/* Second Row */}
              <InfoRow
                icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
                label="Apply By"
                value={deadline ? format(deadline, "yyyy-MM-dd") : "—"}
              />
              {formData.repeat_interval !== 0 && (
                <InfoRow
                  icon={<Users className="h-4 w-4 text-muted-foreground" />}
                  label="Slots"
                  value={`${formData.slots || 0}`}
                />
              )}
              
              {/* Third Row */}
              <InfoRow
                icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                label="Total Service Hours"
                value={`${formData.commitable_hours || 0} hrs`}
              />
              <InfoRow
                icon={<Globe className="h-4 w-4 text-muted-foreground" />}
                label="Mode"
                value={formData.remote ? "Remote" : "In-person"}
              />
              
              {/* Fourth Row - Schedule takes full width on small screens */}
              <div className="sm:col-span-2 rounded-lg border bg-muted/40 p-3">
                <p className="font-medium text-foreground">Schedule</p>
                <div className="mt-1 space-y-1">
                  {formData.repeat_interval !== 0 && (
                    <p className="text-sm text-muted-foreground">
                      Every {formData.repeat_interval} week{formData.repeat_interval && formData.repeat_interval > 1 ? "s" : ""}
                    </p>
                  )}
                  {formData.days_of_week && formData.days_of_week.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {formData.days_of_week.join(", ")}
                    </p>
                  )}
                  {formData.time_start && formData.time_end && (
                    <p className="text-sm text-muted-foreground">
                      {formData.time_start} – {formData.time_end}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          {/* What You'll Do, Requirements, What You'll Equip Students with */}
          <CardContent>
            <div className="space-y-3 mb-4">
              <SectionCard title="What Students will Do" content={formData.about_do || "—"} />
              <SectionCard title="Student Requirements" content={formData.requirements || "—"} />
              <SectionCard title="What You will Equip Students with" content={formData.about_provide || "—"} />
            </div>
          </CardContent>

          {/* Skills and Tags Row */}
          <CardContent className="grid md:grid-cols-2 gap-6 mb-4">
            {/* Left - Skills */}
            <div className="space-y-2">
              <p className="font-medium text-foreground">Skills Required</p>
              {formData.skill_tags && formData.skill_tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.skill_tags.map((skill: string) => (
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
                  Once you create this listing, you will no longer be able to modify it. 
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
