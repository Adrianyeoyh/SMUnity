import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "#client/components/ui/command";
import { useMe, useProfileSettings, useSaveProfileSettings, useUpdateProfile } from "#client/api/hooks";
import type { ProfileFormData } from "#client/api/types";
import { toast } from "sonner";
import { Loader2, Plus, X, ImageIcon } from "lucide-react";
import { SKILL_CHOICES, TAG_CHOICES } from "../helper";

export const Route = createFileRoute("/profileedit")({
  validateSearch: z.object({
    section: z.enum(["about", "skills", "avatar"]).optional(),
  }),
  component: ProfileEditRoute,
});

const facultyOptions = [
  "College of Integrative Studies (CIS)",
  "School of Accountancy (SOA)",
  "Lee Kong Chian School of Business (LKCSB)",
  "School of Computing and Information Systems (SCIS)",
  "School of Economics (SOE)",
  "Yong Pung How School of Law (SOL)",
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
    skills: requireSkills ? z.array(z.string()).min(1, "Select at least one skill") : z.array(z.string()),
    interests: requireSkills ? z.array(z.string()).min(1, "Select at least one interest") : z.array(z.string()),
  });

type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>;

// Skills Selector Component
function SkillsSelector({ value, onChange, options }: { value: string[]; onChange: (skills: string[]) => void; options: string[] }) {
  const selectedSkills = value || [];
  const availableSkills = options.filter(skill => !selectedSkills.includes(skill));
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSkills = availableSkills.filter(skill =>
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isCustomSkill = searchQuery.trim() && 
    !availableSkills.includes(searchQuery.trim()) && 
    !selectedSkills.includes(searchQuery.trim());

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !selectedSkills.includes(skill.trim())) {
      onChange([...selectedSkills, skill.trim()]);
      setSearchQuery("");
      setOpen(false);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    onChange(selectedSkills.filter((s: string) => s !== skill));
  };

  // Handle escape key and click outside
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchQuery("");
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="space-y-3">
      {/* Add Skill button or searchable dropdown */}
      {!open ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      ) : (
        <div ref={containerRef} className="relative w-full">
          <Command className="rounded-lg border border-input bg-background shadow-md">
            <CommandInput
              placeholder="Search skills or type to add custom..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="absolute top-full left-0 right-0 z-50 mt-1 max-h-[200px] overflow-y-auto rounded-md border bg-popover shadow-md">
              {filteredSkills.length > 0 && (
                <CommandGroup heading="Available Skills">
                  {filteredSkills.map((skill) => (
                    <CommandItem
                      key={skill}
                      onSelect={() => handleAddSkill(skill)}
                    >
                      {skill}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {isCustomSkill && (
                <CommandGroup heading="Custom Skill">
                  <CommandItem
                    onSelect={() => handleAddSkill(searchQuery.trim())}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add &quot;{searchQuery.trim()}&quot;
                  </CommandItem>
                </CommandGroup>
              )}
              <CommandEmpty>
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {searchQuery.trim() ? "No matching skills found." : "Start typing to search or add a custom skill."}
                </div>
              </CommandEmpty>
            </CommandList>
          </Command>
        </div>
      )}
      
      {/* Selected skills as badges */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill: string) => (
            <Badge
              key={skill}
              variant="default"
              className="flex items-center gap-2 px-3 h-8 text-sm bg-emerald-500"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:bg-emerald-600 rounded-full p-0.5 -mr-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// Interests Selector Component
function InterestsSelector({ value, onChange, options }: { value: string[]; onChange: (interests: string[]) => void; options: string[] }) {
  const selectedInterests = value || [];
  const availableInterests = options.filter(interest => !selectedInterests.includes(interest));
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredInterests = availableInterests.filter(interest =>
    interest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isCustomInterest = searchQuery.trim() && 
    !availableInterests.includes(searchQuery.trim()) && 
    !selectedInterests.includes(searchQuery.trim());

  const handleAddInterest = (interest: string) => {
    if (interest.trim() && !selectedInterests.includes(interest.trim())) {
      onChange([...selectedInterests, interest.trim()]);
      setSearchQuery("");
      setOpen(false);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    onChange(selectedInterests.filter((s: string) => s !== interest));
  };

  // Handle escape key and click outside
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchQuery("");
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="space-y-3">
      {/* Add Interest button or searchable dropdown */}
      {!open ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Interest
        </Button>
      ) : (
        <div ref={containerRef} className="relative w-full">
          <Command className="rounded-lg border border-input bg-background shadow-md">
            <CommandInput
              placeholder="Search interests or type to add custom..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="absolute top-full left-0 right-0 z-50 mt-1 max-h-[200px] overflow-y-auto rounded-md border bg-popover shadow-md">
              {filteredInterests.length > 0 && (
                <CommandGroup heading="Available Interests">
                  {filteredInterests.map((interest) => (
                    <CommandItem
                      key={interest}
                      onSelect={() => handleAddInterest(interest)}
                    >
                      {interest}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {isCustomInterest && (
                <CommandGroup heading="Custom Interest">
                  <CommandItem
                    onSelect={() => handleAddInterest(searchQuery.trim())}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add &quot;{searchQuery.trim()}&quot;
                  </CommandItem>
                </CommandGroup>
              )}
              <CommandEmpty>
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {searchQuery.trim() ? "No matching interests found." : "Start typing to search or add a custom interest."}
                </div>
              </CommandEmpty>
            </CommandList>
          </Command>
        </div>
      )}
      
      {/* Selected interests as badges */}
      {selectedInterests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedInterests.map((interest: string) => (
            <Badge
              key={interest}
              variant="default"
              className="flex items-center gap-2 px-3 h-8 text-sm bg-sky-500"
            >
              <span>{interest}</span>
              <button
                type="button"
                onClick={() => handleRemoveInterest(interest)}
                className="hover:bg-sky-600 rounded-full p-0.5 -mr-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

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
          ? "Upload or link a new profile picture"
          : "Make changes to your profile details";
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

  const avatarUrlValue = form.watch("avatarUrl");


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
          <CardContent className="pt-1">
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
                      <section className="space-y-6">
                        <FormField
                          control={form.control}
                          name="avatarUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Profile Picture URL</FormLabel>
                              <FormControl>
                                <Input type="url" placeholder="https://example.com/avatar.jpg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Preview */}
                        <div className="space-y-2">
                          <FormLabel>Preview</FormLabel>
                          <div className="border rounded-lg p-4 bg-muted/20 min-h-[200px] flex items-center justify-center">
                            {avatarUrlValue ? (
                              <img 
                                src={avatarUrlValue} 
                                alt="Profile preview" 
                                className="max-w-full max-h-[300px] object-contain rounded"
                              />
                            ) : (
                              <div className="text-center text-muted-foreground">
                                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No image uploaded</p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              Recommended: Square image at least 200×200px
                            </p>
                            {avatarUrlValue && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  form.setValue("avatarUrl", "", { shouldDirty: true, shouldTouch: true });
                                }}
                              >
                                Remove Photo
                              </Button>
                            )}
                          </div>
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
                                <SelectTrigger aria-label="Select faculty" className="w-full sm:w-1/2 md:w-1/3 overflow-hidden truncate">
                                  <SelectValue placeholder="Select your faculty" className="truncate" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px] max-w-[var(--radix-select-trigger-width)]" position="popper">
                                  {facultyOptions.map((option) => (
                                    <SelectItem key={option} value={option} className="whitespace-normal">
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
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skills</FormLabel>
                              <SkillsSelector
                                value={field.value || []}
                                onChange={(skills) => field.onChange(skills)}
                                options={SKILL_CHOICES}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </section>

                      <section className="space-y-4">
                        <FormField
                          control={form.control}
                          name="interests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Interests</FormLabel>
                              <InterestsSelector
                                value={field.value || []}
                                onChange={(interests) => field.onChange(interests)}
                                options={TAG_CHOICES}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </section>
                    </>
                  )}

                    <div className="h-5" aria-hidden="true" />

                    <div className="sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 py-4">
                      <div className="container mx-auto px-4 flex flex-col gap-3 sm:flex-row sm:justify-end sm:items-center">
                        <Button variant="ghost" asChild disabled={isSubmitting}>
                          <Link to="/profile">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="text-white">
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
