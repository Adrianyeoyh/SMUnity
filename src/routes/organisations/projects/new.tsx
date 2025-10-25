import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProjectCreateSchema,
  ProjectSkillTags,
  type ProjectCreateInput,
  type ProjectSkillTagValue,
  type ProjectTypeValue,
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
  } =
    useForm<ProjectCreateInput>({
      resolver: zodResolver(ProjectCreateSchema),
      defaultValues: {
        title: "",
        summary: "",
        type: "environment",
        location_text: "",
        skill_tags: [],
        image_url: "",
        start_date: undefined,
        end_date: undefined,
        slots_total: 10,
        about_provide: "",
        about_do: "",
        about_skills_required: "",
        csp_founded_year: "",
        csp_projects_completed: undefined,
        csp_volunteers_participated: undefined,
      },
    });

  const m = useMutation({
    mutationFn: async (payload: ProjectCreateInput) => {
      const res = await fetch("/api/leader/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create project");
      return res.json() as Promise<{ id: string; status: string }>;
    },
    onSuccess: (data) => {
      nav({ to: "/leader/dashboard" }); 
    },
  });

  const onSubmit = (data: ProjectCreateInput) => m.mutate(data);

  const title = watch("title");
  const summary = watch("summary");
  const type = watch("type");
  const loc = watch("location_text");
  const imageUrl = watch("image_url");
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <form className="lg:col-span-2 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
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
              <Textarea id="summary" rows={4} {...register("summary")} />
              {errors.summary && <p className="text-sm text-red-600">{errors.summary.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setValue("type", v as ProjectTypeValue)}
              >
                <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="elderly">Elderly</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="Animal Welfare">Animal Welfare</SelectItem>
                    <SelectItem value="coding">Coding</SelectItem>
                    <SelectItem value="Sports & Leisure">Sports & Leisure</SelectItem>
                    <SelectItem value="Arts & Culture">Arts & Culture</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>About Your CSP</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="about_provide">What we provide</Label>
                <Textarea
                  id="about_provide"
                  rows={4}
                  {...register("about_provide")}
                  aria-invalid={!!errors.about_provide}
                />
                {errors.about_provide && <p className="text-sm text-red-600">{errors.about_provide.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_do">What you'll do</Label>
                <Textarea
                  id="about_do"
                  rows={4}
                  {...register("about_do")}
                  aria-invalid={!!errors.about_do}
                />
                {errors.about_do && <p className="text-sm text-red-600">{errors.about_do.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_skills_required">Skills required</Label>
                <Textarea
                  id="about_skills_required"
                  rows={4}
                  {...register("about_skills_required")}
                  aria-invalid={!!errors.about_skills_required}
                />
                {errors.about_skills_required && <p className="text-sm text-red-600">{errors.about_skills_required.message}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="csp_founded_year">Founded in</Label>
                <Input
                  id="csp_founded_year"
                  type="number"
                  min={1900}
                  max={3000}
                  step={1}
                  placeholder="2015"
                  {...register("csp_founded_year")}
                  aria-invalid={!!errors.csp_founded_year}
                />
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
                  aria-invalid={!!errors.csp_projects_completed}
                />
                {errors.csp_projects_completed && (
                  <p className="text-sm text-red-600">{errors.csp_projects_completed.message}</p>
                )}
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
                  aria-invalid={!!errors.csp_volunteers_participated}
                />
                {errors.csp_volunteers_participated && (
                  <p className="text-sm text-red-600">{errors.csp_volunteers_participated.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

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

            <div className="space-y-2">
              <Label htmlFor="slots_total">Total slots</Label>
              <Input id="slots_total" type="number" min={1} {...register("slots_total", { valueAsNumber: true })} />
              {errors.slots_total && <p className="text-sm text-red-600">{errors.slots_total.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Media</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image_url">Feature image URL</Label>
              <Input
                id="image_url"
                type="url"
                placeholder="https://example.com/image.jpg"
                {...register("image_url")}
                aria-invalid={!!errors.image_url}
              />
              {errors.image_url && <p className="text-sm text-red-600">{errors.image_url.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Project Tags</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Choose the project tags that best describe this project.
            </p>
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
                            const next = isSelected
                              ? value.filter((s) => s !== skill)
                              : [...value, skill];
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
            <div><span className="font-medium">Type: </span>{type}</div>
            <div><span className="font-medium">Location: </span>{loc || "—"}</div>
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
              ) : (
                "—"
              )}
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
              ) : (
                "—"
              )}
            </div>
            <div><span className="font-medium">Dates: </span>
              {start ? format(start, "dd MMM yyyy") : "—"} – {end ? format(end, "dd MMM yyyy") : "—"}
            </div>
            <div><span className="font-medium">Slots: </span>{slots}</div>
            <div>
              <span className="font-medium">Summary: </span>
              <p className="mt-1 text-muted-foreground">{summary || "—"}</p>
            </div>
            <div>
              <span className="font-medium">What we provide</span>
              <p className="mt-1 text-muted-foreground">{aboutProvide || "—"}</p>
            </div>
            <div>
              <span className="font-medium">What you'll do</span>
              <p className="mt-1 text-muted-foreground">{aboutDo || "—"}</p>
            </div>
            <div>
              <span className="font-medium">Skills required</span>
              <p className="mt-1 text-muted-foreground">{aboutSkills || "—"}</p>
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
