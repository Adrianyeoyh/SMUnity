// server/api/users/index.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { auth } from "#server/lib/auth";
import { eq, sql } from "drizzle-orm";


export const usersRoutes = new Hono();

usersRoutes.get("/me", async (c) => {
  const res = await auth.handler(
    new Request(c.req.url, { method: "GET", headers: c.req.raw.headers }),
  );
  const data = await res.clone().json().catch(() => ({} as any));
  const u = (data as any).user ?? (data as any).data?.user;
  if (!u?.id) return c.json({ error: "Unauthorized" }, 401);

  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, u.id)).limit(1);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const [profile] = await db.select().from(schema.profiles).where(eq(schema.profiles.userId, u.id)).limit(1);

  const [{ count: projectsApplied } = { count: 0 }] = await db.execute(
  sql`select count(*)::int as count from ${schema.applications} where ${schema.applications.userId} = ${u.id}`
  ) as any;

  const [{ count: completedHours } = { count: 0 }] = await db.execute(
  sql`select coalesce(sum(${schema.timesheets.hours}),0)::int as count 
       from ${schema.timesheets} 
       where ${schema.timesheets.userId} = ${u.id} 
       and ${schema.timesheets.verified} = true`
) as any;

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
      applications: Number(projectsApplied ?? 0),
      verifiedHours: Number(completedHours ?? 0),
    },
  };

  return c.json(payload);
});
