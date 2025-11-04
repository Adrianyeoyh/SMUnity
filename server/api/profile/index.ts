import { Hono } from "hono";
import { z } from "zod";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { eq } from "drizzle-orm";
import { au } from "node_modules/better-auth/dist/shared/better-auth.jwa4Tx7v";
import { authenticatedMiddleware } from "#server/middlewares/auth.js";

const profileSchema = z.object({
  phone: z.string().trim().min(8),
  faculty: z.string().trim().min(1),
  skills: z.array(z.string().trim().min(1)).min(1),
  interests: z.array(z.string().trim().min(1)).min(1),
});

export const profileRoutes = new Hono().use(authenticatedMiddleware);

profileRoutes.get("/", async (c) => {
  const session = c.get("user");
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const [profile] = await db
    .select({
      phone: schema.profiles.phone,
      faculty: schema.profiles.school,
      skills: schema.profiles.skills,
      interests: schema.profiles.interests,
    })
    .from(schema.profiles)
    .where(eq(schema.profiles.userId, session.id))
    .limit(1);

  return c.json({
    phone: profile?.phone ?? "",
    faculty: profile?.faculty ?? "",
    skills: profile?.skills ?? [],
    interests: profile?.interests ?? [],
  });
});

profileRoutes.put("/", async (c) => {
  const session = c.get("user");
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid profile data" }, 400);
  }

  const { phone, faculty, skills, interests } = parsed.data;

  await db
    .insert(schema.profiles)
    .values({
      userId: session.id,
      phone: phone.trim(),
      school: faculty.trim(),
      skills,
      interests,
    })
    .onConflictDoUpdate({
      target: schema.profiles.userId,
      set: {
        phone: phone.trim(),
        school: faculty.trim(),
        skills,
        interests,
      },
    });

  return c.json({ ok: true });
});
