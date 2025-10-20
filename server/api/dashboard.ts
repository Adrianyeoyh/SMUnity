// server/api/dashboard.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import { requireSession } from "./_utils/auth";

export const dashboardRoutes = new Hono();

dashboardRoutes.get("/", async (c) => {
  const session = await requireSession(c);

  if (session.accountType === "student") {
    const apps = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.applications)
      .where(eq(schema.applications.userId, session.id));
    const hours = await db
      .select({ count: sql<number>`coalesce(sum(${schema.timesheets.hours}),0)::int` })
      .from(schema.timesheets)
      .where(and(eq(schema.timesheets.userId, session.id), eq(schema.timesheets.verified, true)));
    return c.json({
      type: "student",
      applications: apps[0]?.count ?? 0,
      verifiedHours: hours[0]?.count ?? 0,
    });
  }

  if (session.accountType === "organisation") {
    const projects = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.projects)
      .where(eq(schema.projects.orgId, session.id));
    const applicants = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.applications)
      .innerJoin(schema.projects, eq(schema.applications.projectId, schema.projects.id))
      .where(eq(schema.projects.orgId, session.id));
    return c.json({
      type: "organisation",
      totalProjects: projects[0]?.count ?? 0,
      totalApplicants: applicants[0]?.count ?? 0,
    });
  }

  return c.json({ type: session.accountType });
});
