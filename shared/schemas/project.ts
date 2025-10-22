import { z } from "zod";

export const ProjectType = z.enum(["elderly", "environment", "education", "health", "other"]);
export const ProjectSkillTags = z.enum([
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
]);

export const ProjectCreateSchema = z
  .object({
    title: z
      .string({ required_error: "Title is required" })
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(120, "Title must be at most 120 characters"),
    summary: z
      .string({ required_error: "Summary is required" })
      .trim()
      .min(10, "Summary must be at least 10 characters")
      .max(1000, "Summary must be at most 1000 characters"),
    type: ProjectType,
    location_text: z
      .string({ required_error: "Location is required" })
      .trim()
      .min(2, "Location must be at least 2 characters")
      .max(200, "Location must be at most 200 characters"),
    skill_tags: z
      .array(ProjectSkillTags, {
        invalid_type_error: "Please select skills from the list provided",
      })
      .min(1, "Select at least one skill that describes this project")
      .max(8, "Select up to 8 skills"),
    image_url: z
      .string()
      .trim()
      .url("Please provide a valid image URL")
      .optional()
      .or(z.literal("")),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
    slots_total: z
      .number({ required_error: "Total slots is required", invalid_type_error: "Total slots must be a number" })
      .int("Total slots must be a whole number")
      .min(1, "At least one slot is required")
      .max(9999, "Total slots must be less than 10,000"),
    about_provide: z
      .string({ required_error: "Describe what your CSP provides" })
      .trim()
      .min(10, "Use at least 10 characters to describe what you provide"),
    about_do: z
      .string({ required_error: "Describe what volunteers will do" })
      .trim()
      .min(10, "Use at least 10 characters to describe the volunteer tasks"),
    about_skills_required: z
      .string({ required_error: "Describe the skills required" })
      .trim()
      .min(10, "Use at least 10 characters to describe the skills needed"),
    csp_founded_year: z
      .string({ required_error: "Tell us when the CSP was founded" })
      .trim()
      .regex(/^\d{4}$/, "Enter a 4-digit year"),
    csp_projects_completed: z
      .number({ required_error: "How many projects have been completed?" })
      .int("Enter a whole number")
      .min(0, "Project count cannot be negative"),
    csp_volunteers_participated: z
      .number({ required_error: "How many volunteers have taken part?" })
      .int("Enter a whole number")
      .min(0, "Volunteer count cannot be negative"),
  })
  .refine(
    (data) => {
      if (!data.start_date || !data.end_date) return true;
      return data.end_date >= data.start_date;
    },
    {
      path: ["end_date"],
      message: "End date cannot be before start date",
    },
  );

export type ProjectCreateInput = z.infer<typeof ProjectCreateSchema>;
export type ProjectTypeValue = z.infer<typeof ProjectType>;
export type ProjectSkillTagValue = z.infer<typeof ProjectSkillTags>;
