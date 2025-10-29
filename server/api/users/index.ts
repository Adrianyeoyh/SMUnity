// server/api/users/index.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";

export const usersRoutes = new Hono();

async function buildMePayload(userId: string) {
  const [user] = await db.select().from(schema.user).where(eq(schema.user.id, userId)).limit(1);
  if (!user) return null;

  const [profile] = await db.select().from(schema.profiles).where(eq(schema.profiles.userId, userId)).limit(1);

  const apps = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.applications)
    .where(eq(schema.applications.userId, userId));
  const [{ count: applications }] = apps.length ? apps : [{ count: 0 }];

  const hours = await db
    .select({ count: sql<number>`coalesce(sum(${schema.timesheets.hours}),0)::int` })
    .from(schema.timesheets)
    .where(and(eq(schema.timesheets.userId, userId), eq(schema.timesheets.verified, true)));
  const [{ count: verifiedHours }] = hours.length ? hours : [{ count: 0 }];

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    accountType: user.accountType,
    image: user.image,
    profile: profile
      ? {
          phone: profile.phone,
          studentId: profile.studentId,
          entryYear: profile.entryYear,
          school: profile.school,
          skills: profile.skills ?? [],
          interests: profile.interests ?? [],
          csuCompletedAt: profile.csuCompletedAt,
        }
      : null,
    dashboard: {
      applications,
      verifiedHours,
    },
  };
}

usersRoutes.get("/me", async (c) => {
  const session = c.get("user");
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const payload = await buildMePayload(session.id);
  if (!payload) return c.json({ error: "Unauthorized" }, 401);

  return c.json(payload);
});

const updateSchema = z.object({
  phone: z.string().trim().min(5).max(50).nullable().optional(),
  school: z.string().trim().min(2).max(120).nullable().optional(),
  studentId: z
    .string()
    .trim()
    .min(4)
    .max(20)
    .regex(/^[A-Za-z0-9-]+$/, "Student ID should contain letters, numbers, or hyphens.")
    .nullable()
    .optional(),
  skills: z.array(z.string().trim().min(1)).optional(),
  interests: z.array(z.string().trim().min(1)).optional(),
});

usersRoutes.patch("/me", async (c) => {
  const session = c.get("user");
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid profile data" }, 400);
  }

  const { phone, school, studentId, skills, interests } = parsed.data;
  const normalizedStudentId =
    studentId === undefined ? undefined : studentId ? studentId.toUpperCase() : null;

  await db
    .insert(schema.profiles)
    .values({
      userId: session.id,
      phone: phone ?? null,
      school: school ?? null,
      studentId: normalizedStudentId ?? null,
      skills: skills ?? [],
      interests: interests ?? [],
    })
    .onConflictDoUpdate({
      target: schema.profiles.userId,
      set: {
        ...(phone !== undefined ? { phone } : {}),
        ...(school !== undefined ? { school } : {}),
        ...(normalizedStudentId !== undefined ? { studentId: normalizedStudentId } : {}),
        ...(skills !== undefined ? { skills } : {}),
        ...(interests !== undefined ? { interests } : {}),
      },
    });

  const payload = await buildMePayload(session.id);
  if (!payload) return c.json({ error: "Unauthorized" }, 401);

  return c.json(payload);
});
