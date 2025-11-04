"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "#client/components/ui/button"
import { Checkbox } from "#client/components/ui/checkbox"
import { Input } from "#client/components/ui/input"
import { Textarea } from "#client/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "#client/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#client/components/ui/form"
import { Separator } from "#client/components/ui/separator"
import { createApplication } from "#client/api/projects/index.ts"
import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"

const FormSchema = z.object({
  // 1️⃣ Motivation
  motivation: z
    .string()
    .min(20, "Please write at least 20 characters")
    .max(800, "Keep it under 800 characters"),


  // 3️⃣ Experience
  experience: z.enum(["none", "some", "extensive"]).refine(
    (val) => ["none", "some", "extensive"].includes(val),
    { message: "Select your prior experience" }
  ),

  // 4️⃣ Skills
  skills: z
    .string()
    .max(160, "160 characters max")
    .transform((v) => (v?.trim() ? v.trim() : "")),

  // 5️⃣ Agreement
  agree: z.boolean().refine((val) => val === true, {
    message: "You must agree to the code of conduct"
  }),

  // 6️⃣ Schedule acknowledgement
  acknowledgeSchedule: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge the project schedule before applying"
  }),

  // 7️⃣ Additional comments
  comments: z
    .string()
    .max(500, "Maximum 500 characters")
    .optional(),
})

type FormValues = z.infer<typeof FormSchema>

export type ApplicationFormProps = {
  projectId: string
  onSubmitted?: (payload: {
    projectId: string
    data: FormValues
    submittedAt: string
  }) => void
}

export function ApplicationForm({ projectId, onSubmitted }: ApplicationFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const storageKey = `application-form-draft-${projectId}`;
  
  // Load saved form data from localStorage
  const getSavedFormData = (): Partial<FormValues> => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load saved form data:", error);
    }
    return {};
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      motivation: "",
      experience: "none",
      skills: "",
      agree: false,
      acknowledgeSchedule: false,
      comments: "",
      ...getSavedFormData(), // Load saved data if available
    },
  });

  const [submitting, setSubmitting] = React.useState(false)
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [serverSuccess, setServerSuccess] = React.useState<string | null>(null)

  // Save form data to localStorage on changes (debounced)
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      // Save to localStorage
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } catch (error) {
        console.error("Failed to save form data:", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, storageKey]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setServerError(null);
    setServerSuccess(null);

    try {
      const response = await createApplication({
        projectId,
        ...values,
      });

      toast.success(response.message || "Application submitted!");
      setServerSuccess(response.message);
      onSubmitted?.({
        projectId,
        data: values,
        submittedAt: new Date().toISOString(),
      });
      
      // Invalidate dashboard queries to refresh statistics
      queryClient.invalidateQueries({ queryKey: ["pending-applications"] });
      queryClient.invalidateQueries({ queryKey: ["all-applications"] });
      queryClient.invalidateQueries({ queryKey: ["student-applications"] });
      queryClient.invalidateQueries({ queryKey: ["ongoing-projects"] });
      queryClient.invalidateQueries({ queryKey: ["completed-projects"] });
      
      // Clear saved form data from localStorage on successful submission
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error("Failed to clear saved form data:", error);
      }
      
      form.reset();
      navigate({ to: `/csp/${projectId}` }); // <--- this line
    } catch (err: any) {
        console.error("❌ Application submission failed:", err);

        // Show a descriptive toast message
        const message =
          err?.message ||
          (err?.response?.error ? `Server Error: ${err.response.error}` : "Failed to apply");

        toast.error(message);
        setServerError(message);
      } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 1️⃣ Motivation */}
        <FormField
          control={form.control}
          name="motivation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why do you want to join?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your motivation, what you hope to learn, and how you plan to contribute"
                  className="min-h-28 text-sm sm:text-base"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tip: specific reasons + impact you want to make help reviewers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* 3️⃣ Experience */}
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prior volunteering experience</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid gap-2 sm:grid-cols-3"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="none" id="exp-none" />
                    <FormLabel htmlFor="exp-none" className="font-normal">None</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="some" id="exp-some" />
                    <FormLabel htmlFor="exp-some" className="font-normal">1–6 months</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="extensive" id="exp-ext" />
                    <FormLabel htmlFor="exp-ext" className="font-normal">6+ months</FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                This helps leaders plan onboarding and task complexity
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 4️⃣ Skills */}
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relevant skills or interests (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Design, Social Media, Tutoring, Fundraising"
                  className="text-sm sm:text-base"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Short comma-separated list is fine
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 5️⃣ Code of Conduct */}
        <FormField
          control={form.control}
          name="agree"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3 rounded-md border p-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                  <FormLabel>I agree to the community's code of conduct</FormLabel>
                <FormDescription>
                  Be respectful, reliable, and follow project guidelines.
                </FormDescription>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 6️⃣ Schedule Acknowledgement */}
        <FormField
          control={form.control}
          name="acknowledgeSchedule"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3 rounded-md border p-3 bg-muted/40">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                    I have read and acknowledge the project schedule                </FormLabel>
                <FormDescription>
                    I declare that I am available for the project's start/end dates, meeting days, and session times.
                </FormDescription>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 7️⃣ Additional Comments */}
        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional comments (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any other remarks or special requests you'd like to share with the organisers"
                  className="min-h-20 text-sm sm:text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        {serverSuccess && <p className="text-sm text-emerald-600">{serverSuccess}</p>}

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              form.reset();
              // Clear saved form data when resetting
              try {
                localStorage.removeItem(storageKey);
              } catch (error) {
                console.error("Failed to clear saved form data:", error);
              }
            }}
            disabled={submitting}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
