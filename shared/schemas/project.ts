import { z } from "zod";

// export const ProjectType = z.enum(["elderly", "environment", "education", "health", "other"]);
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

// export type ProjectTypeValue = z.infer<typeof ProjectType>;
export type ProjectSkillTagValue = z.infer<typeof ProjectSkillTags>;
