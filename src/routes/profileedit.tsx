import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#client/components/ui/form";
import { Input } from "#client/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#client/components/ui/select";
import { Button } from "#client/components/ui/button";
import { Card, CardContent } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { useMe, useProfileSettings, useSaveProfileSettings, useUpdateProfile } from "#client/api/hooks";
import type { ProfileFormData } from "#client/api/types";
import { cn } from "#client/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/profileedit")({
  validateSearch: z.object({
    section: z.enum(["about", "skills", "avatar"]).optional(),
  }),
  component: ProfileEditRoute,
});

const facultyOptions = [
  "School of Accountancy (SOA)",
  "Lee Kong Chian School of Business (LKCSB)",
  "School of Computing and Information Systems (SCIS)",
  "School of Economics (SOE)",
  "School of Law (SOL)",
  "School of Social Sciences (SOSS)",
];

const skillOptions = [
  "Leadership",
  "Communication",
  "Project Management",
  "Teaching",
  "Event Planning",
  "Data Analysis",
  "Problem Solving",
  "Creativity",
  "Mentoring",
  "Teamwork",
];

const interestOptions = [
  "Education",
  "Environment",
  "Community Service",
  "Animal Welfare",
  "Sustainability",
  "Elderly Care",
  "Youth Mentorship",
  "Technology",
  "Fundraising",
  "Healthcare",
];

const createProfileSchema = (requireAbout: boolean, requireSkills: boolean, requireAvatar: boolean) =>
  z.object({
    avatarUrl: requireAvatar
      ? z
          .union([
            z.string().trim().url("Enter a valid image URL"),
            z.string().trim().length(0, "Enter a valid image URL"),
          ])
          .optional()
      : z.string().trim().optional(),
    studentId: requireAbout ? z.string().trim().min(1, "Student ID is required") : z.string().trim().optional(),
    phone: requireAbout ? z.string().trim().min(8, "Phone number must be at least 8 digits") : z.string().trim(),
    faculty: requireAbout ? z.string().trim().min(1, "Faculty is required") : z.string().trim(),
    skills: (requireSkills ? z.array(z.string()).min(1, "Select at least one skill") : z.array(z.string())).default([]),
    interests: (requireSkills ? z.array(z.string()).min(1, "Select at least one interest") : z.array(z.string())).default(
      [],
    ),
  });

type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>;

function ProfileEditRoute() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/profileedit" });
  const activeSection = search.section;
  const showAbout = !activeSection || activeSection === "about";
  const showSkills = !activeSection || activeSection === "skills";
  const showAvatar = !activeSection || activeSection === "avatar";
  const { data, isLoading, isError } = useProfileSettings();
  const { data: meData } = useMe();
  const sectionHeading =
    activeSection === "skills"
      ? "Edit Skills & Interests"
      : activeSection === "about"
        ? "Edit About & Contact"
        : activeSection === "avatar"
          ? "Update Profile Picture"
          : "Edit Profile";
  const sectionDescription =
    activeSection === "skills"
      ? "Select the skills and interests used to personalise recommendations."
      : activeSection === "about"
        ? "Update your particulars."
        : activeSection === "avatar"
          ? "Upload or link a new profile picture."
          : "Make changes to your profile details.";
  const validationSchema = useMemo(
    () => createProfileSchema(showAbout, showSkills, showAvatar),
    [showAbout, showSkills, showAvatar],
  );
  const saveProfile = useSaveProfileSettings();
  const updateProfile = useUpdateProfile();
  const isSubmitting = saveProfile.isPending || updateProfile.isPending;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      avatarUrl: "",
      studentId: "",
      phone: "",
      faculty: "",
      skills: [],
      interests: [],
    },
  });

  useEffect(() => {
    if (!data && !meData) return;
    const storedAvatar =
      typeof window !== "undefined" ? window.localStorage.getItem("profileAvatarUrl") ?? undefined : undefined;
    form.reset({
      avatarUrl: storedAvatar ?? meData?.image ?? "",
      studentId: data?.studentId ?? "",
      phone: data?.phone ?? "",
      faculty: data?.faculty ?? "",
      skills: data?.skills ?? [],
      interests: data?.interests ?? [],
    });
  }, [data, meData, form]);

  const selectedSkills = form.watch("skills");
  const selectedInterests = form.watch("interests");
  const avatarUrlValue = form.watch("avatarUrl");

  const toggleChip = (field: "skills" | "interests", value: string) => {
    const current = field === "skills" ? selectedSkills : selectedInterests;
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    form.setValue(field, next, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const onSubmit = async (values: ProfileFormValues) => {
    const trimmedStudentId = values.studentId ? values.studentId.trim() : undefined;
    try {
      if (showAvatar) {
        const trimmedAvatar = values.avatarUrl?.trim();
        if (typeof window !== "undefined") {
          if (trimmedAvatar) {
            window.localStorage.setItem("profileAvatarUrl", trimmedAvatar);
          } else {
            window.localStorage.removeItem("profileAvatarUrl");
          }
        }
      }
      if (showSkills) {
        const payload: ProfileFormData = {
          phone: values.phone.trim(),
          faculty: values.faculty,
          skills: values.skills ?? [],
          interests: values.interests ?? [],
        };
        await saveProfile.mutateAsync(payload);
      }
      if (showAbout) {
        await updateProfile.mutateAsync({
          studentId: trimmedStudentId ?? null,
          phone: values.phone.trim(),
          school: values.faculty,
        });
      }
      toast.success("Profile updated");
      navigate({ to: "/profile" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile.";
      toast.error(message, { className: "bg-destructive text-destructive-foreground" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <nav aria-label="Breadcrumb">
          <ol className="text-sm text-muted-foreground flex items-center gap-2">
            <li className="flex items-center gap-2">
              <Link to="/profile" className="hover:text-foreground transition-colors">
                Profile
              </Link>
              <span aria-hidden="true">/</span>
            </li>
            <li aria-current="page" className="text-foreground font-medium">
              Edit
            </li>
          </ol>
        </nav>

        <Card className="shadow-sm border border-border/60">
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading profile…</span>
              </div>
            ) : isError ? (
              <p className="text-sm text-destructive">
                We couldn&apos;t load your profile details. Please try again later.
              </p>
            ) : (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h1 className="text-xl font-semibold text-foreground">{sectionHeading}</h1>
                  <p className="text-sm text-muted-foreground">{sectionDescription}</p>
                </div>

                <Form {...form}>
                  <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                    {showAvatar && (
                      <section className="space-y-4">
                        <FormField
                          control={form.control}
                          name="avatarUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Profile picture</FormLabel>
                              <FormDescription>
                                Paste an image URL to use as your profile picture. Leave empty to use the default avatar.
                                The override is saved to this browser only.
                              </FormDescription>
                              <FormControl>
                                <Input type="url" placeholder="https://example.com/avatar.jpg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-20 w-20 overflow-hidden rounded-full border bg-muted">
                              {avatarUrlValue ? (
                                <img
                                  src={avatarUrlValue}
                                  alt="Profile preview"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                  No preview
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Recommended: square image at least 200×200px.
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={!avatarUrlValue}
                            onClick={() => form.setValue("avatarUrl", "", { shouldDirty: true, shouldTouch: true })}
                          >
                            Remove photo
                          </Button>
                        </div>
                      </section>
                    )}
                    {showAbout && (
                      <section className="space-y-6">
                        <FormField
                          control={form.control}
                          name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student ID</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. 12345678" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone number</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                inputMode="tel"
                                autoComplete="tel"
                                placeholder="9123 4567"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="faculty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Faculty</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={(value) => field.onChange(value)}
                              >
                                <SelectTrigger aria-label="Select faculty">
                                  <SelectValue placeholder="Select your faculty" />
                                </SelectTrigger>
                                <SelectContent>
                                  {facultyOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                  )}

                  {showSkills && (
                    <>
                      <section className="space-y-4">
                        <FormField
                          control={form.control}
                          name="skills"
                          render={() => (
                            <FormItem>
                              <FormLabel>Skills</FormLabel>
                              <div className="flex flex-wrap gap-2">
                                {skillOptions.map((skill) => {
                                  const active = selectedSkills.includes(skill);
                                  return (
                                    <Badge
                                      key={skill}
                                      asChild
                                      className={cn(
                                        "cursor-pointer rounded-full border px-4 py-2",
                                        active
                                          ? "bg-emerald-500 text-white border-transparent"
                                          : "bg-background text-emerald-700 border-emerald-300 hover:bg-emerald-50",
                                      )}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => toggleChip("skills", skill)}
                                      >
                                        {skill}
                                      </button>
                                    </Badge>
                                  );
                                })}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </section>

                      <section className="space-y-4">
                        <FormField
                          control={form.control}
                          name="interests"
                          render={() => (
                            <FormItem>
                              <FormLabel>Interests</FormLabel>
                              <div className="flex flex-wrap gap-2">
                                {interestOptions.map((interest) => {
                                  const active = selectedInterests.includes(interest);
                                  return (
                                    <Badge
                                      key={interest}
                                      asChild
                                      className={cn(
                                        "cursor-pointer rounded-full border px-4 py-2",
                                        active
                                          ? "bg-sky-500 text-white border-transparent"
                                          : "bg-background text-sky-700 border-sky-300 hover:bg-sky-50",
                                      )}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => toggleChip("interests", interest)}
                                      >
                                        {interest}
                                      </button>
                                    </Badge>
                                  );
                                })}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </section>
                    </>
                  )}

                    <div className="h-16" aria-hidden="true" />

                    <div className="sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 py-4">
                      <div className="container mx-auto px-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                        <Button variant="ghost" asChild disabled={isSubmitting}>
                          <Link to="/profile">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Save changes
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
