// server/api/dashboard.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { auth } from "#server/lib/auth";
import { eq, and, sql } from "drizzle-orm";

export const dashboardRoutes = new Hono();

dashboardRoutes.get("/", async c => {
  const res = await auth.handler(
    new Request(c.req.url, { method: "GET", headers: c.req.raw.headers }),
  );
  const data = await res.clone().json().catch(() => ({} as any));
  const user = data.user ?? data.data?.user;
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  if (user.accountType === "student") {
    // count applications and hours
    const apps = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.applications)
      .where(eq(schema.applications.userId, user.id));

    const hours = await db
      .select({ count: sql<number>`coalesce(sum(${schema.timesheets.hours}),0)::int` })
      .from(schema.timesheets)
      .where(and(eq(schema.timesheets.userId, user.id), eq(schema.timesheets.verified, true)));

    return c.json({
      type: "student",
      applications: apps[0]?.count ?? 0,
      verifiedHours: hours[0]?.count ?? 0,
    });
  }

  if (user.accountType === "organisation") {
    const projects = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.projects)
      .where(eq(schema.projects.orgId, user.id));
    const applicants = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.applications)
      .innerJoin(schema.projects, eq(schema.applications.projectId, schema.projects.id))
      .where(eq(schema.projects.orgId, user.id));

    return c.json({
      type: "organisation",
      totalProjects: projects[0]?.count ?? 0,
      totalApplicants: applicants[0]?.count ?? 0,
    });
  }

  return c.json({ type: user.accountType });
});
