import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "#client/components/ui/card";
import { Input } from "#client/components/ui/input";
import { Textarea } from "#client/components/ui/textarea";
import { Button } from "#client/components/ui/button";
import { Label } from "#client/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#client/components/ui/select";
import { Badge } from "#client/components/ui/badge";
import { format } from "date-fns";

// ---------- Constants ----------

interface ProjectCreateInput {
  title: string;
  summary: string;
  type: string;
  location_text: string;
  skill_tags: string[];
  image_url?: string;
  start_date?: Date;
  end_date?: Date;
  slots_total: number;
  about_provide?: string;
  about_do?: string;
  about_skills_required?: string;
  csp_founded_year?: string;
  csp_projects_completed?: number;
  csp_volunteers_participated?: number;
}

// ---------- Constants ----------

const CATEGORY_OPTIONS = [
  "Teaching",
  "Mentoring",
  "Fundraising",
  "Event Planning",
  "Healthcare Support",
  "Environmental Action",
  "Logistics",
  "Community Outreach",
  "Administrative Support",
  "Creative Media",
];

const DISTRICTS = [
  "Admiralty","Aljunied","Amber","Alexandra","Ang Mo Kio","Balestier","Bedok",
  "Bendemeer","Bidadari","Bishan","Boon Keng","Boon Lay","Boat Quay","Bukit Batok",
  "Bukit Merah","Bukit Panjang","Bukit Timah","Buona Vista","Bugis","Clementi",
  "Clementi Park","Choa Chu Kang","Changi","City Hall","Dakota","Dover","Dunearn",
  "Dunman","Eunos","Farrer Park","Flora Drive","Fort Canning","Frankel","Geylang",
  "Harbourfront","Hillview","Holland","Hougang","Joo Chiat","Jurong East",
  "Jurong West","Kaki Bukit","Kallang","Katong","Kembangan","Keppel","Kovan",
  "Kranji","Lim Chu Kang","Little India","Lentor","Lorong Ah Soo","Loyang",
  "MacPherson","Mandai","Marine Parade","Marina Downtown","Meyer","Newton",
  "Novena","Orchard","Pasir Panjang","Pasir Ris","Paya Lebar Central","Potong Pasir",
  "Punggol","Queenstown","Raffles Place","River Valley","Rochor","Seletar",
  "Seletar Hill","Sembawang","Sengkang","Sengkang West","Sentosa","Serangoon",
  "Shenton Way","Siglap","Somerset","Springleaf","Sungei Gedong","Suntec City",
  "Tanah Merah","Tampines","Tanglin","Telok Blangah","Telok Kurau","Thomson",
  "Tengah","Tiong Bahru","Toa Payoh","Ubi","Ulu Pandan","Upper Aljunied",
  "Upper Bukit Timah","Upper Changi","Upper East Coast","Watten","West Coast",
  "Woodlands","Yishun",
];

const SKILL_CHOICES = [
  "Communication", "Patience", "Teaching", "Empathy", "Creativity", "Program Design",
];

const TAG_CHOICES = [
  "Children", "Kids", "Less Privileged", "Art", "School", "Education",
];

// ---------- Extended FormInput ----------

// ---------- Types ----------
type FormInput = ProjectCreateInput & {
  // discover.tsx + $cspId.tsx extras
  project_type: "local" | "overseas";
  description: string;
  requirements?: string;               // kept here (About section)
  required_hours: number;
  application_deadline?: Date;
  image_urls?: string[];
  is_remote?: boolean;

  // new meta fields
  district?: string;                   // single-select
  google_maps_url?: string;            // url to map / place
  skills_needed: string[];             // array from clickable buttons
  project_tags: string[];              // array from clickable buttons

  // Google Calendar–style recurrence stored in meta.schedule
  repeat_interval?: number;                     // default 1
  repeat_unit?: "day" | "week" | "month" | "year";
  days_of_week?: string[];                      // only for week unit
  time_start?: string;                          // "HH:MM"
  time_end?: string;                            // "HH:MM"
};

export const Route = createFileRoute("/organisations/projects/new")({
  component: NewProjectPage,
});

function NewProjectPage() {
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    defaultValues: {
      title: "",
      summary: "",
      type: CATEGORY_OPTIONS[0],
      location_text: "",
      skill_tags: [],
      image_url: "",
      start_date: undefined,
      end_date: undefined,
      slots_total: 10,
      description: "",
      about_do: "",
      requirements: "",
      about_provide: "",
      about_skills_required: "",
      csp_founded_year: "",
      csp_projects_completed: undefined,
      csp_volunteers_participated: undefined,
      project_type: "local",
      required_hours: 0,
      application_deadline: undefined,
      image_urls: [],
      is_remote: false,
      district: "",
      google_maps_url: "",
      skills_needed: [],
      project_tags: [],
      repeat_interval: 1,
      repeat_unit: "week",
      days_of_week: [],
      time_start: "",
      time_end: "",
    },
  });

  const m = useMutation({
    mutationFn: async (data: FormInput) => {
      // keep existing API working
      const legacyPayload = {
        title: data.title,
        summary: data.summary,
        type: data.type,
        // legacy: store the selected district into location_text for now
        location_text: data.district || data.location_text || "",
        skill_tags: data.skill_tags ?? [],
        image_url: data.image_url,
        start_date: data.start_date,
        end_date: data.end_date,
        slots_total: data.slots_total,
        // about fields kept here for now (still part of base)
        about_provide: data.about_provide,
        about_do: data.about_do,
        about_skills_required: data.about_skills_required ?? "",
        csp_founded_year: data.csp_founded_year ?? "",
        csp_projects_completed: data.csp_projects_completed,
        csp_volunteers_participated: data.csp_volunteers_participated,
      };

      // extras go to meta (store as JSONB on backend)
      const meta = {
        project_type: data.project_type,
        description: data.description,
        requirements: data.requirements,
        required_hours: data.required_hours,
        application_deadline: data.application_deadline,
        image_urls: data.image_urls ?? [],
        is_remote: data.is_remote ?? false,
        district: data.district || "",
        google_maps_url: data.google_maps_url || "",
        skills_needed: data.skills_needed ?? [],
        project_tags: data.project_tags ?? [],
        schedule: {
          repeat_interval: data.repeat_interval ?? 1,
          repeat_unit: data.repeat_unit ?? "week",
          days_of_week: data.days_of_week ?? [],
          time_start: data.time_start || null,
          time_end: data.time_end || null,
        },
      };

      const res = await fetch("/api/leader/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...legacyPayload, meta }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      return res.json() as Promise<{ id: string; status: string }>;
    },
    onSuccess: () => nav({ to: "/leader/dashboard" }),
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => m.mutate(data);

  // ---------- watches for preview ----------
  const title = watch("title");
  const summary = watch("summary");
  const category = watch("type");
  const projectType = watch("project_type");
  const district = watch("district");
  const googleMapsUrl = watch("google_maps_url");
  const imageUrl = watch("image_url");
  const imageUrls = watch("image_urls");
  const selectedSkills = watch("skills_needed");
  const start = watch("start_date");
  const end = watch("end_date");
  const slots = watch("slots_total");
  const description = watch("description");
  const aboutDo = watch("about_do");
  const requirements = watch("requirements");
  const aboutProvide = watch("about_provide");
  const deadline = watch("application_deadline");
  const requiredHours = watch("required_hours");
  const repeatInterval = watch("repeat_interval");
  const repeatUnit = watch("repeat_unit");
  const daysOfWeek = watch("days_of_week") || [];
  const timeStart = watch("time_start");
  const timeEnd = watch("time_end");
  const isRemote = watch("is_remote");
  const projectTags = watch("project_tags") || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <form className="lg:col-span-2 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ---------- BASIC INFORMATION ---------- */}
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

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => setValue("type", v as FormInput["type"])}
                >
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
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

        {/* ---------- ABOUT THIS PROJECT ---------- */}
        <Card>
          <CardHeader><CardTitle>About This Project</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea id="description" rows={6} {...register("description")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about_do">What you’ll do</Label>
              <Textarea id="about_do" rows={4} {...register("about_do")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea id="requirements" rows={4} {...register("requirements")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about_provide">What we provide</Label>
              <Textarea id="about_provide" rows={4} {...register("about_provide")} />
            </div>
          </CardContent>
        </Card>

        {/* ---------- SKILLS & REQUIREMENTS ---------- */}
        <Card>
          <CardHeader><CardTitle>Skills & Requirements</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Select the skills volunteers will need.</p>
            <Controller
              control={control}
              name="skills_needed"
              render={({ field }) => {
                const value: string[] = field.value ?? [];
                return (
                  <div className="flex flex-wrap gap-2">
                    {SKILL_CHOICES.map((skill) => {
                      const selected = value.includes(skill);
                      return (
                        <Button
                          key={skill}
                          type="button"
                          variant={selected ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const next = selected ? value.filter((s) => s !== skill) : [...value, skill];
                            field.onChange(next);
                          }}
                          onBlur={field.onBlur}
                          aria-pressed={selected}
                        >
                          {skill}
                        </Button>
                      );
                    })}
                  </div>
                );
              }}
            />
          </CardContent>
        </Card>

        {/* ---------- LOGISTICS & SCHEDULE (merged) ---------- */}
        <Card>
          <CardHeader><CardTitle>Logistics & Schedule</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* DISTRICT SELECT */}
              <div className="space-y-2">
                <Label>District</Label>
                <Controller
                  control={control}
                  name="district"
                  render={({ field }) => (
                    <Select
                      value={isRemote ? "Remote" : field.value || ""}
                      onValueChange={(v) => field.onChange(v)}
                      disabled={isRemote}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a district" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISTRICTS.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* GOOGLE MAPS + REMOTE TOGGLE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="google_maps_url">Google Maps URL</Label>
                  <Input
                    id="google_maps_url"
                    type="url"
                    placeholder="https://maps.google.com/..."
                    {...register("google_maps_url")}
                    disabled={isRemote}
                  />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input
                    id="is_remote"
                    type="checkbox"
                    {...register("is_remote")}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setValue("is_remote", checked);
                      if (checked) {
                        setValue("district", "Remote");
                        setValue("google_maps_url", "");
                      } else {
                        setValue("district", "");
                      }
                    }}
                  />
                  <Label htmlFor="is_remote" className="cursor-pointer">Remote?</Label>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="application_deadline">Application deadline</Label>
                <Input
                  id="application_deadline"
                  type="date"
                  onChange={(e) => setValue("application_deadline", e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
            </div>


            {/* Repeats: Every [interval] [unit] */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Label className="font-medium w-32">Repeats every</Label>
              <div className="flex gap-2 flex-1">
                <Input
                  type="number"
                  min={1}
                  step={1}
                  className="w-20"
                  {...register("repeat_interval", { valueAsNumber: true })}
                />
                <Select
                  value={watch("repeat_unit")}
                  onValueChange={(v) => setValue("repeat_unit", v as FormInput["repeat_unit"])}
                >
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder="Unit" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day(s)</SelectItem>
                    <SelectItem value="week">Week(s)</SelectItem>
                    <SelectItem value="month">Month(s)</SelectItem>
                    <SelectItem value="year">Year(s)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Choose days if weekly */}
            {watch("repeat_unit") === "week" && (
              <div className="space-y-2">
                <Label>On days</Label>
                <Controller
                  control={control}
                  name="days_of_week"
                  render={({ field }) => {
                    const value = field.value ?? [];
                    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
                    return (
                      <div className="flex flex-wrap gap-2">
                        {days.map((d) => {
                          const on = value.includes(d);
                          return (
                            <Button
                              key={d}
                              type="button"
                              variant={on ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                const next = on ? value.filter(x => x !== d) : [...value, d];
                                field.onChange(next);
                              }}
                              aria-pressed={on}
                            >
                              {d.slice(0,3)}
                            </Button>
                          );
                        })}
                      </div>
                    );
                  }}
                />
              </div>
            )}

            {/* Time window */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time_start">Start time</Label>
                <Input id="time_start" type="time" step={300} {...register("time_start")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_end">End time</Label>
                <Input id="time_end" type="time" step={300} {...register("time_end")} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slots_total">Total slots</Label>
                <Input id="slots_total" type="number" min={1} {...register("slots_total", { valueAsNumber: true })} />
                {errors.slots_total && <p className="text-sm text-red-600">{errors.slots_total.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="required_hours">Total service hours</Label>
                <Input id="required_hours" type="number" min={0} {...register("required_hours", { valueAsNumber: true })} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ---------- MEDIA ---------- */}
        <Card>
          <CardHeader><CardTitle>Media</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image_url">Feature image URL (legacy)</Label>
              <Input id="image_url" type="url" placeholder="https://example.com/cover.jpg" {...register("image_url")} aria-invalid={!!errors.image_url} />
              {errors.image_url && <p className="text-sm text-red-600">{errors.image_url.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_urls">Additional image URLs (one per line)</Label>
              <Textarea
                id="image_urls"
                rows={3}
                placeholder={"https://example.com/1.jpg\nhttps://example.com/2.jpg"}
                {...register("image_urls", {
                  setValueAs: (v) =>
                    typeof v === "string"
                      ? v.split("\n").map((s) => s.trim()).filter(Boolean)
                      : Array.isArray(v)
                      ? v
                      : [],
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* ---------- PROJECT TAGS ---------- */}
        <Card>
          <CardHeader><CardTitle>Project Tags</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Choose the tags that best describe this project.</p>
            <Controller
              control={control}
              name="project_tags"
              render={({ field }) => {
                const value: string[] = field.value ?? [];
                return (
                  <div className="flex flex-wrap gap-2">
                    {TAG_CHOICES.map((tag) => {
                      const selected = value.includes(tag);
                      return (
                        <Button
                          key={tag}
                          type="button"
                          variant={selected ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const next = selected ? value.filter((s) => s !== tag) : [...value, tag];
                            field.onChange(next);
                          }}
                          onBlur={field.onBlur}
                          aria-pressed={selected}
                        >
                          {tag}
                        </Button>
                      );
                    })}
                  </div>
                );
              }}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 mb-8">
          <Button type="button" variant="ghost" onClick={() => history.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting || m.isPending}>
            {m.isPending ? "Creating…" : "Create listing"}
          </Button>
        </div>
      </form>

      {/* ---------- PREVIEW ---------- */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="font-medium">Title: </span>{title || "—"}</div>
            <div><span className="font-medium">Category: </span>{category}</div>
            <div><span className="font-medium">Project Type: </span>{projectType}</div>
            <div><span className="font-medium">District: </span>{district || "—"}{isRemote ? " • Remote" : ""}</div>
            {googleMapsUrl ? (
              <div className="truncate">
                <span className="font-medium">Google Maps: </span>
                <a className="text-blue-600 underline" href={googleMapsUrl} target="_blank" rel="noreferrer">
                  {googleMapsUrl}
                </a>
              </div>
            ) : null}
            <div><span className="font-medium">Schedule: </span>
              {`Every ${repeatInterval} ${repeatUnit}${repeatInterval && repeatInterval > 1 ? "s" : ""}`}
              {daysOfWeek.length ? ` • ${daysOfWeek.join(", ")}` : ""}
              {(timeStart || timeEnd) ? ` • ${timeStart || "?"}–${timeEnd || "?"}` : ""}
            </div>
            <div><span className="font-medium">Dates: </span>
              {start ? format(start, "dd MMM yyyy") : "—"} – {end ? format(end, "dd MMM yyyy") : "—"}
            </div>
            <div><span className="font-medium">Application Deadline: </span>{deadline ? format(deadline, "dd MMM yyyy") : "—"}</div>
            <div><span className="font-medium">Service Hours: </span>{requiredHours || 0}h</div>
            <div><span className="font-medium">Slots: </span>{slots}</div>

            <div><span className="font-medium">Summary: </span><p className="mt-1 text-muted-foreground">{summary || "—"}</p></div>

            <div><span className="font-medium">Detailed Description</span><p className="mt-1 text-muted-foreground">{description || "—"}</p></div>
            <div><span className="font-medium">What you’ll do</span><p className="mt-1 text-muted-foreground">{aboutDo || "—"}</p></div>
            <div><span className="font-medium">Requirements</span><p className="mt-1 text-muted-foreground">{requirements || "—"}</p></div>
            <div><span className="font-medium">What we provide</span><p className="mt-1 text-muted-foreground">{aboutProvide || "—"}</p></div>

            <div>
              <span className="font-medium">Skills you’ll need: </span>
              {selectedSkills?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSkills.map((s) => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
              ) : "—"}
            </div>

            <div>
              <span className="font-medium">Project tags: </span>
              {projectTags.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {projectTags.map((t) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
              ) : "—"}
            </div>

            <div>
              <span className="font-medium">Feature image: </span>
              {imageUrl ? (
                <div className="mt-2">
                  <img src={imageUrl} alt="Project feature preview" className="w-full h-40 object-cover rounded-md border" />
                </div>
              ) : "—"}
            </div>

            <div>
              <span className="font-medium">Additional images:</span>
              <div className="mt-2 space-y-2">
                {(imageUrls ?? []).length ? (
                  (imageUrls ?? []).map((url, i) => (
                    <img key={`${url}-${i}`} src={url} alt={`Project image ${i + 1}`} className="w-full h-28 object-cover rounded-md border" />
                  ))
                ) : <span className="text-muted-foreground">—</span>}
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
