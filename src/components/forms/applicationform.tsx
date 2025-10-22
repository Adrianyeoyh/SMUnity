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

const days = [
  "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
] as const

const FormSchema = z.object({
  // 1) motivation
  motivation: z
    .string()
    .min(20, "Please write at least 20 characters.")
    .max(800, "Keep it under 800 characters."),

  // 2) availability (checkbox group)
  availability: z
    .array(z.enum(days))
    .min(1, "Pick at least one day you’re available."),

  // 3) experience (radio)
  experience: z.enum(["none", "some", "extensive"]).refine(
    (val) => ["none", "some", "extensive"].includes(val),
    { message: "Select your prior experience." }
  ),

  // 4) skills (short text)
  skills: z
    .string()
    .max(160, "160 characters max.")
    .transform((v) => (v?.trim() ? v.trim() : "")),

  // 5) agreement (checkbox)
  agree: z.boolean().refine((val) => val === true, {
    message: "You must agree to the code of conduct."
  }),
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
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      motivation: "",
      availability: [],
      experience: "none",
      skills: "",
      agree: false,
    },
  })

  const [submitting, setSubmitting] = React.useState(false)
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [serverSuccess, setServerSuccess] = React.useState<string | null>(null)

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    setServerError(null)
    setServerSuccess(null)
    const payload = {
      projectId,
      data: values,
      submittedAt: new Date().toISOString(),
    }

    try {
      // TODO: replace with your real endpoint
      // Example POST:
      // const res = await fetch("/api/applications", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // })
      // if (!res.ok) throw new Error(await res.text())

      // simulate success:
      await new Promise((r) => setTimeout(r, 600))
      setServerSuccess("Application submitted! We’ll be in touch soon.")
      onSubmitted?.(payload)
      form.reset()
    } catch (err: any) {
      setServerError(err?.message ?? "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 1) Motivation */}
        <FormField
          control={form.control}
          name="motivation"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Why do you want to join?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your motivation, what you hope to learn, and how you plan to contribute."
                  className="min-h-28"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tip: specific reasons + impact you want to make help reviewers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* 2) Availability (Checkbox group) */}
        <FormField
          control={form.control}
          name="availability"
          render={() => (
            <FormItem>
              <FormLabel>Which days are you available?</FormLabel>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {days.map((d) => (
                  <FormField
                    key={d}
                    control={form.control}
                    name="availability"
                    render={({ field }: { field: any }) => {
                      const checked = field.value?.includes(d)
                      return (
                        <FormItem className="flex items-center space-x-2 space-y-0 rounded-md border p-3">
                          <FormControl>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(v: any) => {
                                const isChecked = Boolean(v)
                                if (isChecked) field.onChange([...(field.value ?? []), d])
                                else field.onChange((field.value ?? []).filter((x: typeof days[number]) => x !== d))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{d}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormDescription>
                Pick at least one. You can update this later with the leader if needed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* 3) Experience (Radio group) */}
        <FormField
          control={form.control}
          name="experience"
          render={({ field }: { field: any }) => (
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
                This helps leaders plan onboarding and task complexity.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 4) Skills */}
        <FormField
          control={form.control}
          name="skills"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Relevant skills or interests (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., design, social media, tutoring, fundraising"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Short comma-separated list is fine.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 5) Agreement */}
        <FormField
          control={form.control}
          name="agree"
          render={({ field }: { field: any }) => (
            <FormItem className="flex items-start gap-3 rounded-md border p-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I agree to the community code of conduct</FormLabel>
                <FormDescription>
                  Be respectful, reliable, and follow project guidelines.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}
        {serverSuccess && (
          <p className="text-sm text-emerald-600">{serverSuccess}</p>
        )}

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit application"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => form.reset()}
            disabled={submitting}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  )
}
