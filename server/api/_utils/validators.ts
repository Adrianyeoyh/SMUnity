// import { z } from "zod";

// export const idParam = z.object({ id: z.coerce.number().int().positive() });
// export const uuidParam = z.object({ id: z.string().min(1) });

// export const projectCreateSchema = z.object({
//   orgId: z.string().min(1),
//   title: z.string().min(1).max(255),
//   summary: z.string().max(500).nullish(),
//   description: z.string().min(1),
//   categoryId: z.coerce.number().int().positive().optional(),
//   location: z.string().max(255).nullish(),
//   addressLine1: z.string().max(255).nullish(),
//   addressLine2: z.string().max(255).nullish(),
//   city: z.string().max(120).nullish(),
//   postalCode: z.string().max(20).nullish(),
//   latitude: z.coerce.number().optional(),
//   longitude: z.coerce.number().optional(),
//   slotsTotal: z.coerce.number().int().nonnegative().default(0),
// });

// export const applicationCreateSchema = z.object({
//   projectId: z.coerce.number().int().positive(),
//   sessionId: z.coerce.number().int().positive().optional(),
//   motivation: z.string().max(5000).nullish(),
// });

// export const favouriteToggleSchema = z.object({ projectId: z.coerce.number().int().positive() });

// export const orgCreateSchema = z.object({
//   userId: z.string().min(1),
//   slug: z.string().min(3).max(160),
//   description: z.string().nullish(),
//   website: z.string().url().nullish(),
// });

// export const orgRequestSchema = z.object({
//   requesterEmail: z.string().email(),
//   requesterName: z.string().min(1).nullish(),
//   orgName: z.string().min(2),
//   orgDescription: z.string().nullish(),
//   website: z.string().url().nullish(),
// });

// export const timesheetCreateSchema = z.object({
//   projectId: z.coerce.number().int().positive(),
//   sessionId: z.coerce.number().int().positive().optional(),
//   date: z.coerce.date(),
//   hours: z.coerce.number().int().positive().max(24),
//   description: z.string().max(300).nullish(),
// });

// export const timesheetVerifySchema = z.object({
//   verified: z.boolean(),
// });

// export const listQuery = z.object({
//   q: z.string().trim().nullish(),
//   categoryId: z.coerce.number().int().positive().optional(),
//   tagId: z.array(z.coerce.number().int().positive()).optional(),
//   status: z.enum(["draft","pending","approved","closed","archived"]).optional(),
// });
