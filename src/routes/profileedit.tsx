import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
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
import { useProfileSettings, useSaveProfileSettings } from "#client/api/hooks";
import type { ProfileFormData } from "#client/api/types";
import { cn } from "#client/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/profileedit")({
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

const profileSchema = z.object({
  phone: z.string().trim().min(8, "Phone number must be at least 8 digits"),
  faculty: z.string().trim().min(1, "Faculty is required"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfileEditRoute() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProfileSettings();
  const saveProfile = useSaveProfileSettings();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: "",
      faculty: "",
      skills: [],
      interests: [],
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        phone: data.phone ?? "",
        faculty: data.faculty ?? "",
        skills: data.skills ?? [],
        interests: data.interests ?? [],
      });
    }
  }, [data, form]);

  const selectedSkills = form.watch("skills");
  const selectedInterests = form.watch("interests");

  const toggleChip = (field: "skills" | "interests", value: string) => {
    const current = field === "skills" ? selectedSkills : selectedInterests;
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    form.setValue(field, next, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const onSubmit = async (values: ProfileFormValues) => {
    const payload: ProfileFormData = {
      phone: values.phone.trim(),
      faculty: values.faculty,
      skills: values.skills,
      interests: values.interests,
    };
    try {
      await saveProfile.mutateAsync(payload);
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
              <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                  <section className="space-y-6">
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

                  <div className="h-16" aria-hidden="true" />

                  <div className="sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 py-4">
                    <div className="container mx-auto px-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                      <Button variant="ghost" asChild disabled={saveProfile.isPending}>
                        <Link to="/profile">Cancel</Link>
                      </Button>
                      <Button type="submit" disabled={saveProfile.isPending}>
                        {saveProfile.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save changes
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

