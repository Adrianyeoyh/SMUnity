// server/api/users/index.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
// import { requireSession } from "../_utils/auth";

export const usersRoutes = new Hono();

usersRoutes.get("/me", async (c) => {
  const session = await requireSession(c);

  const [user] = await db.select().from(schema.user).where(eq(schema.user.id, session.id)).limit(1);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const [profile] = await db.select().from(schema.profiles).where(eq(schema.profiles.userId, session.id)).limit(1);

  const apps = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.applications)
    .where(eq(schema.applications.userId, session.id));
  const [{ count: applications }] = apps.length ? apps : [{ count: 0 }];

  const hours = await db
    .select({ count: sql<number>`coalesce(sum(${schema.timesheets.hours}),0)::int` })
    .from(schema.timesheets)
    .where(and(eq(schema.timesheets.userId, session.id), eq(schema.timesheets.verified, true)));
  const [{ count: verifiedHours }] = hours.length ? hours : [{ count: 0 }];

  const payload = {
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

  return c.json(payload);
});
