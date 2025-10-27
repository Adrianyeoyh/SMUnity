import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
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
  "Bishan","Boon Lay","Bukit Batok","Bukit Merah","Bukit Timah","Buona Vista","Bugis",
  "Clementi","Choa Chu Kang","City Hall","Eunos","Farrer Park","Geylang","Harbourfront",
  "Holland","Hougang","Jurong East","Jurong West","Katong","Kovan","MacPherson","Mandai",
  "Marine Parade","Novena","Orchard","Pasir Ris","Pasir Panjang","Punggol","Queenstown",
  "Sembawang","Sengkang","Serangoon","Siglap","Tampines","Tiong Bahru","Toa Payoh",
  "Woodlands","Yishun",
];

const SKILL_CHOICES = [
  "Communication", "Patience", "Teaching", "Empathy", "Creativity", "Program Design",
];

const TAG_CHOICES = [
  "Children", "Kids", "Less Privileged", "Art", "School", "Education",
];

// ---------- Types ----------
type FormInput = {
  title: string;
  summary: string;
  category: string;
  project_type: "local" | "overseas";

  description: string;
  about_provide: string;
  about_do: string;
  requirements: string;
  skill_tags: string[];

  district: string;
  google_maps: string;
  location_text: string;
  remote: boolean;

  repeat_interval: number;
  repeat_unit: "day" | "week" | "month" | "year";
  days_of_week: string[];
  time_start: string;
  time_end: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
  application_deadline?: Date;

  commitable_hours: number;
  slots: number;

  image_url: string;
  project_tags: [];
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
      category: CATEGORY_OPTIONS[0],
      project_type: "local",

      description: "",
      about_provide: "",
      about_do: "",
      requirements: "",
      skill_tags: [],

      district: "",
      google_maps: "",
      location_text: "",
      remote: false,

      repeat_interval: 1,
      repeat_unit: "week",
      days_of_week: [],
      time_start: "",
      time_end: "",
      start_date: undefined,
      end_date: undefined,
      application_deadline: undefined,

      commitable_hours: 40,
      slots: 10,

      image_url: "",
      project_tags: [],
    },
  });

  // ---------- API mutation ----------
  const m = useMutation({
    mutationFn: async (data: FormInput) => {
      const payload = {
        title: data.title,
        summary: data.summary,
        category: data.category,
        project_type: data.project_type,
        description: data.description,
        about_provide: data.about_provide,
        about_do: data.about_do,
        requirements: data.requirements,
        skill_tags: data.skill_tags,
        district: data.district,
        google_maps: data.google_maps,
        location_text: data.location_text,
        remote: data.remote,
        repeat_interval: data.repeat_interval,
        repeat_unit: data.repeat_unit,
        days_of_week: data.days_of_week,
        time_start: data.time_start,
        time_end: data.time_end,
        start_date: data.start_date,
        end_date: data.end_date,
        application_deadline: data.application_deadline,
        commitable_hours: data.commitable_hours,
        slots: data.slots,
        image_url: data.image_url,
        project_tags: data.project_tags
      };

      const res = await fetch("/api/organisations/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
    onSuccess: () => nav({ to: "/leader/dashboard" }),
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => m.mutate(data);

  // ---------- watchers ----------
  const title = watch("title");
  const summary = watch("summary");
  const category = watch("category");
  const projectType = watch("project_type");
  const district = watch("district");
  const googleMaps = watch("google_maps");
  const imageUrl = watch("image_url");
  const selectedSkills = watch("skill_tags");
  const start = watch("start_date");
  const end = watch("end_date");
  const slots = watch("slots");
  const description = watch("description");
  const aboutDo = watch("about_do");
  const requirements = watch("requirements");
  const aboutProvide = watch("about_provide");
  const deadline = watch("application_deadline");
  const hours = watch("commitable_hours");
  const repeatInterval = watch("repeat_interval");
  const repeatUnit = watch("repeat_unit");
  const daysOfWeek = watch("days_of_week");
  const timeStart = watch("time_start");
  const timeEnd = watch("time_end");
  const isRemote = watch("remote");
  const projectTags = watch("project_tags");

  // ---------- UI ----------
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <form className="lg:col-span-2 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* BASIC INFO */}
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Short summary</Label>
              <Textarea id="summary" rows={3} {...register("summary")} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => setValue("category", v)}
                >
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Project Type</Label>
                <Select
                  value={projectType}
                  onValueChange={(v) => setValue("project_type", v as "local" | "overseas")}
                >
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="overseas">Overseas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ABOUT */}
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
          <CardHeader><CardTitle>Skills Required</CardTitle></CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="skill_tags"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {SKILL_CHOICES.map((skill) => {
                    const selected = field.value.includes(skill);
                    return (
                      <Button
                        key={skill}
                        type="button"
                        variant={selected ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const next = selected
                            ? field.value.filter((s) => s !== skill)
                            : [...field.value, skill];
                          field.onChange(next);
                        }}
                      >
                        {skill}
                      </Button>
                    );
                  })}
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* SKILLS */}
        <Card>
          <CardHeader><CardTitle>Location</CardTitle></CardHeader>
          <CardContent>
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
                  <Label htmlFor="google_maps">Google Maps URL</Label>
                  <Input
                    id="google_maps"
                    type="url"
                    placeholder="https://maps.google.com/..."
                    {...register("google_maps")}
                    disabled={isRemote}
                  />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input
                    id="remote"
                    type="checkbox"
                    {...register("remote")}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setValue("remote", checked);
                      if (checked) {
                        setValue("district", "Remote");
                        setValue("google_maps", "");
                      } else {
                        setValue("district", "");
                      }
                    }}
                  />
                  <Label htmlFor="remote" className="cursor-pointer">Remote?</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ---------- LOGISTICS & SCHEDULE (merged) ---------- */}
        <Card>
          <CardHeader><CardTitle>Listing Schedule</CardTitle></CardHeader>
          <CardContent className="space-y-6">

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
                <Label htmlFor="slots">Total slots</Label>
                <Input id="slots" type="number" min={1} {...register("slots", { valueAsNumber: true })} />
                {errors.slots && <p className="text-sm text-red-600">{errors.slots.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="commitable_hours">Total service hours</Label>
                <Input id="commitable_hours" type="number" min={0} {...register("commitable_hours", { valueAsNumber: true })} />
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

            {/* <div className="space-y-2">
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
            </div> */}
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
            <div><span className="font-medium">Summary: </span><p className="mt-1 text-muted-foreground">{summary || "—"}</p></div>
            <div><span className="font-medium">Project Type: </span>{projectType}</div>
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
            <div><span className="font-medium">District: </span>{district || "—"}{isRemote ? " • Remote" : ""}</div>
            {googleMaps ? (
              <div className="truncate">
                <span className="font-medium">Google Maps: </span>
                <a className="text-blue-600 underline" href={googleMaps} target="_blank" rel="noreferrer">
                  {googleMaps}
                </a>
              </div>
            ) : null}
            <div><span className="font-medium">Schedule: </span>
              {`Every ${repeatInterval} ${repeatUnit}${repeatInterval && repeatInterval > 1 ? "s" : ""}`}
              {daysOfWeek.length ? ` • ${daysOfWeek.join(", ")}` : ""}
              {(timeStart || timeEnd) ? ` • ${timeStart || "?"}–${timeEnd || "?"}` : ""}
            </div>
            <div><span className="font-medium">Dates: </span>
              {start ? format(start, "dd MMM yyyy") : "—"} to {end ? format(end, "dd MMM yyyy") : "—"}
            </div>
            <div><span className="font-medium">Application Deadline: </span>{deadline ? format(deadline, "dd MMM yyyy") : "—"}</div>
            <div><span className="font-medium">Service Hours: </span>{hours || 0}h</div>
            <div><span className="font-medium">Slots: </span>{slots}</div>



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

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
