// server/api/dashboard.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import { requireSession, ok } from "./_utils/auth";

export const dashboardRoutes = new Hono();

type StudentDashboard = { type: "student"; applications: number; verifiedHours: number };
type OrgDashboard = { type: "organisation"; totalProjects: number; totalApplicants: number };
type AdminDashboard = { type: "admin" };

dashboardRoutes.get("/", async (c) => {
  const me = await requireSession(c);

  if (me.accountType === "student") {
    const apps = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.applications)
      .where(eq(schema.applications.userId, me.id));
    const hours = await db
      .select({ count: sql<number>`coalesce(sum(${schema.timesheets.hours}),0)::int` })
      .from(schema.timesheets)
      .where(and(eq(schema.timesheets.userId, me.id), eq(schema.timesheets.verified, true)));
    return ok<StudentDashboard>(c, {
      type: "student",
      applications: apps[0]?.count ?? 0,
      verifiedHours: hours[0]?.count ?? 0,
    });
  }

  if (me.accountType === "organisation") {
    const projects = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.projects)
      .where(eq(schema.projects.orgId, me.id));
    const applicants = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.applications)
      .innerJoin(schema.projects, eq(schema.applications.projectId, schema.projects.id))
      .where(eq(schema.projects.orgId, me.id));
    return ok<OrgDashboard>(c, {
      type: "organisation",
      totalProjects: projects[0]?.count ?? 0,
      totalApplicants: applicants[0]?.count ?? 0,
    });
  }

  return ok<AdminDashboard>(c, { type: "admin" });
});
