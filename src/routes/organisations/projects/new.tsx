import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProjectCreateSchema,
  ProjectSkillTags,
  type ProjectCreateInput,
  type ProjectSkillTagValue,
} from "#shared/schemas/project";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "#client/components/ui/card";
import { Input } from "#client/components/ui/input";
import { Textarea } from "#client/components/ui/textarea";
import { Button } from "#client/components/ui/button";
import { Label } from "#client/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "#client/components/ui/select";
import { Badge } from "#client/components/ui/badge";
import { format } from "date-fns";

// --- IMPORTANT ---
// We extend the shared input *locally* so TS knows our new fields.
// This does NOT change your shared schema yet.
type ProjectExtraFields = {
  // “local/overseas” for discover.tsx
  project_type: "local" | "overseas";

  // For $cspId.tsx + discover.tsx
  description: string;
  requirements?: string;
  duration_text?: string;
  required_hours: number;

  application_deadline?: Date;

  // Multi images (we’ll still keep image_url for legacy preview)
  image_urls?: string[];

  // Optional: if you want to mark remote
  is_remote?: boolean;
};

// The actual form uses the original shape + extras
type FormInput = ProjectCreateInput & ProjectExtraFields;

// Your original enum for `type` is a category; keep as-is to satisfy types:
const CATEGORY_OPTIONS: ProjectCreateInput["type"][] = [
  "elderly",
  "environment",
  "education",
  "health",
  "other",
];

export const Route = createFileRoute("/organisations/projects/new")({
  component: NewProjectPage,
});

function NewProjectPage() {
  const nav = useNavigate();
  const skillOptions = ProjectSkillTags.options;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(ProjectCreateSchema) as any, // still validates base fields
    defaultValues: {
      // --- original, from ProjectCreateInput ---
      title: "",
      summary: "",
      type: "environment", // <- this is your CATEGORY enum; keep!
      location_text: "",
      skill_tags: [],
      image_url: "", // legacy single image
      start_date: undefined,
      end_date: undefined,
      slots_total: 10,
      about_provide: "",
      about_do: "",
      about_skills_required: "",
      csp_founded_year: "",
      csp_projects_completed: undefined,
      csp_volunteers_participated: undefined,

      // --- new extras (local only) ---
      project_type: "local",
      description: "",
      requirements: "",
      duration_text: "",
      required_hours: 0,
      application_deadline: undefined,
      image_urls: [],
      is_remote: false,
    },
  });

  // On submit, we send the original payload PLUS a meta blob with new fields.
  const m = useMutation({
    mutationFn: async (data: FormInput) => {
      // Split into legacy payload + extras
      const legacyPayload: ProjectCreateInput = {
        title: data.title,
        summary: data.summary,
        type: data.type, // (category)
        location_text: data.location_text,
        skill_tags: data.skill_tags,
        image_url: data.image_url,
        start_date: data.start_date,
        end_date: data.end_date,
        slots_total: data.slots_total,
        about_provide: data.about_provide,
        about_do: data.about_do,
        about_skills_required: data.about_skills_required,
        csp_founded_year: data.csp_founded_year,
        csp_projects_completed: data.csp_projects_completed,
        csp_volunteers_participated: data.csp_volunteers_participated,
      };

      // Extras packaged safely (DB can store in a JSONB column, e.g. projects.meta)
      const meta = {
        project_type: data.project_type,
        description: data.description,
        requirements: data.requirements,
        duration_text: data.duration_text,
        required_hours: data.required_hours,
        application_deadline: data.application_deadline ?? null,
        image_urls: data.image_urls ?? [],
        is_remote: data.is_remote ?? false,
      };

      const res = await fetch("/api/leader/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Sending both keeps today working; backend can ignore meta if not ready
        body: JSON.stringify({ ...legacyPayload, meta }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      return res.json() as Promise<{ id: string; status: string }>;
    },
    onSuccess: () => {
      nav({ to: "/leader/dashboard" });
    },
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => m.mutate(data);

  // --- Live preview watches ---
  const title = watch("title");
  const summary = watch("summary");
  const category = watch("type");
  const projectType = watch("project_type");
  const loc = watch("location_text");
  const imageUrl = watch("image_url");
  const imageUrls = watch("image_urls");
  const selectedSkills = watch("skill_tags");
  const start = watch("start_date");
  const end = watch("end_date");
  const slots = watch("slots_total");
  const aboutProvide = watch("about_provide");
  const aboutDo = watch("about_do");
  const aboutSkills = watch("about_skills_required");
  const foundedYear = watch("csp_founded_year");
  const projectsCompleted = watch("csp_projects_completed");
  const volunteersParticipated = watch("csp_volunteers_participated");
  const description = watch("description");
  const requirements = watch("requirements");
  const durationText = watch("duration_text");
  const requiredHours = watch("required_hours");
  const deadline = watch("application_deadline");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <form className="lg:col-span-2 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* BASIC INFO */}
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} aria-invalid={!!errors.title} />
              {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Short summary</Label>
              <Textarea id="summary" rows={3} {...register("summary")} />
              {errors.summary && <p className="text-sm text-red-600">{errors.summary.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => setValue("type", v as FormInput["type"])}
                >
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {CATEGORY_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Project Type</Label>
                <Select
                  value={projectType}
                  onValueChange={(v) => setValue("project_type", v as FormInput["project_type"])}
                >
                  <SelectTrigger><SelectValue placeholder="Local or Overseas" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="overseas">Overseas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ABOUT PROJECT */}
        <Card>
          <CardHeader><CardTitle>About This Project</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea id="description" rows={6} {...register("description")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (optional)</Label>
              <Textarea id="requirements" rows={3} {...register("requirements")} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="duration_text">Duration</Label>
                <Input id="duration_text" placeholder="e.g. 2h, Every Wednesday" {...register("duration_text")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="required_hours">Service Hours</Label>
                <Input id="required_hours" type="number" min={0} {...register("required_hours", { valueAsNumber: true })} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LOGISTICS */}
        <Card>
          <CardHeader><CardTitle>Logistics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location_text">Location</Label>
              <Input id="location_text" {...register("location_text")} />
              {errors.location_text && <p className="text-sm text-red-600">{errors.location_text.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start date</Label>
                <Input
                  id="start_date"
                  type="date"
                  onChange={(e) => setValue("start_date", e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End date</Label>
                <Input
                  id="end_date"
                  type="date"
                  onChange={(e) => setValue("end_date", e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="application_deadline">Application deadline</Label>
                <Input
                  id="application_deadline"
                  type="date"
                  onChange={(e) => setValue("application_deadline", e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slots_total">Total slots</Label>
                <Input id="slots_total" type="number" min={1} {...register("slots_total", { valueAsNumber: true })} />
                {errors.slots_total && <p className="text-sm text-red-600">{errors.slots_total.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MEDIA */}
        <Card>
          <CardHeader><CardTitle>Media</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image_url">Feature image URL (legacy)</Label>
              <Input
                id="image_url"
                type="url"
                placeholder="https://example.com/image.jpg"
                {...register("image_url")}
                aria-invalid={!!errors.image_url}
              />
              {errors.image_url && <p className="text-sm text-red-600">{errors.image_url.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_urls">Additional image URLs (one per line)</Label>
              <Textarea
                id="image_urls"
                rows={3}
                placeholder="https://example.com/1.jpg&#10;https://example.com/2.jpg"
                {...register("image_urls", {
                  setValueAs: (v) =>
                    typeof v === "string"
                      ? v
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : Array.isArray(v)
                      ? v
                      : [],
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* TAGS */}
        <Card>
          <CardHeader><CardTitle>Project Tags</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Choose the tags that best describe this project.</p>
            <Controller
              control={control}
              name="skill_tags"
              render={({ field }) => {
                const value: ProjectSkillTagValue[] = field.value ?? [];
                return (
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((skill) => {
                      const isSelected = value.includes(skill);
                      return (
                        <Button
                          key={skill}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const next = isSelected ? value.filter((s) => s !== skill) : [...value, skill];
                            field.onChange(next);
                          }}
                          onBlur={field.onBlur}
                          aria-pressed={isSelected}
                        >
                          {skill}
                        </Button>
                      );
                    })}
                  </div>
                );
              }}
            />
            {errors.skill_tags && <p className="text-sm text-red-600">{errors.skill_tags.message}</p>}
          </CardContent>
        </Card>

        {/* ORG SNAPSHOT (unchanged) */}
        <Card>
          <CardHeader><CardTitle>About Your CSP</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="about_provide">What we provide</Label>
                <Textarea id="about_provide" rows={3} {...register("about_provide")} aria-invalid={!!errors.about_provide} />
                {errors.about_provide && <p className="text-sm text-red-600">{errors.about_provide.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_do">What you'll do</Label>
                <Textarea id="about_do" rows={3} {...register("about_do")} aria-invalid={!!errors.about_do} />
                {errors.about_do && <p className="text-sm text-red-600">{errors.about_do.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_skills_required">Skills required</Label>
                <Textarea id="about_skills_required" rows={3} {...register("about_skills_required")} aria-invalid={!!errors.about_skills_required} />
                {errors.about_skills_required && <p className="text-sm text-red-600">{errors.about_skills_required.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="csp_founded_year">Founded in</Label>
                <Input id="csp_founded_year" type="number" min={1900} max={3000} step={1} placeholder="2015" {...register("csp_founded_year")} />
                {errors.csp_founded_year && <p className="text-sm text-red-600">{errors.csp_founded_year.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="csp_projects_completed">Projects completed</Label>
                <Input
                  id="csp_projects_completed"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="12"
                  {...register("csp_projects_completed", {
                    setValueAs: (value) => {
                      if (value === "" || value === null) return undefined;
                      const parsed = Number(value);
                      return Number.isNaN(parsed) ? undefined : parsed;
                    },
                  })}
                />
                {errors.csp_projects_completed && <p className="text-sm text-red-600">{errors.csp_projects_completed.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="csp_volunteers_participated">Volunteers participated</Label>
                <Input
                  id="csp_volunteers_participated"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="250"
                  {...register("csp_volunteers_participated", {
                    setValueAs: (value) => {
                      if (value === "" || value === null) return undefined;
                      const parsed = Number(value);
                      return Number.isNaN(parsed) ? undefined : parsed;
                    },
                  })}
                />
                {errors.csp_volunteers_participated && <p className="text-sm text-red-600">{errors.csp_volunteers_participated.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 mb-8">
          <Button type="button" variant="ghost" onClick={() => history.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting || m.isPending}>
            {m.isPending ? "Creating…" : "Create listing"}
          </Button>
        </div>
      </form>

      {/* Live preview */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="font-medium">Title: </span>{title || "—"}</div>
            <div><span className="font-medium">Category: </span>{category}</div>
            <div><span className="font-medium">Project Type: </span>{projectType}</div>
            <div><span className="font-medium">Location: </span>{loc || "—"}</div>
            <div><span className="font-medium">Duration: </span>{durationText || "—"}</div>
            <div><span className="font-medium">Service Hours: </span>{requiredHours || 0}h</div>
            <div><span className="font-medium">Application Deadline: </span>{deadline ? format(deadline, "dd MMM yyyy") : "—"}</div>
            <div><span className="font-medium">Dates: </span>
              {start ? format(start, "dd MMM yyyy") : "—"} – {end ? format(end, "dd MMM yyyy") : "—"}
            </div>
            <div><span className="font-medium">Slots: </span>{slots}</div>
            <div>
              <span className="font-medium">Summary: </span>
              <p className="mt-1 text-muted-foreground">{summary || "—"}</p>
            </div>
            <div>
              <span className="font-medium">Description</span>
              <p className="mt-1 text-muted-foreground">{description || "—"}</p>
            </div>
            <div>
              <span className="font-medium">Requirements</span>
              <p className="mt-1 text-muted-foreground">{requirements || "—"}</p>
            </div>
            <div>
              <span className="font-medium">Skill tags: </span>
              {selectedSkills?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : ("—")}
            </div>
            <div>
              <span className="font-medium">Feature image: </span>
              {imageUrl ? (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Project feature preview"
                    className="w-full h-40 object-cover rounded-md border"
                  />
                </div>
              ) : ("—")}
            </div>
            <div>
              <span className="font-medium">Additional images:</span>
              <div className="mt-2 space-y-2">
                {(imageUrls ?? []).length ? (
                  (imageUrls ?? []).map((url, i) => (
                    <img
                      key={`${url}-${i}`}
                      src={url}
                      alt={`Project image ${i + 1}`}
                      className="w-full h-28 object-cover rounded-md border"
                    />
                  ))
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
            </div>
            <div>
              <span className="font-medium">CSP snapshot</span>
              <div className="mt-1 space-y-1 text-muted-foreground">
                <div>Founded in: {foundedYear || "—"}</div>
                <div>Projects completed: {typeof projectsCompleted === "number" ? projectsCompleted : "—"}</div>
                <div>Volunteers participated: {typeof volunteersParticipated === "number" ? volunteersParticipated : "—"}</div>
              </div>
            </div>
            <div className="pt-2 text-xs text-muted-foreground">
              Status will be <span className="font-medium">pending_review</span> until an admin approves it.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
