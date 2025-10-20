// server/api/dashboard.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { eq, and, count, sql, desc } from "drizzle-orm";
import { requireSession, assertRole } from "#server/api/_utils/auth";

export const dashboardRoutes = new Hono();

/**
 * GET /api/dashboard/overview
 * -> Returns summary stats for the student dashboard
 */
dashboardRoutes.get("/overview", async (c) => {
  try {
    const user = await requireSession(c);
    assertRole(user, ["student"]);

    // total verified hours
    const totalHours = await db
      .select({ total: sql<number>`COALESCE(SUM(${schema.timesheets.hours}), 0)` })
      .from(schema.timesheets)
      .where(and(eq(schema.timesheets.userId, user.id), eq(schema.timesheets.verified, true)))
      .then((rows) => rows[0]?.total ?? 0);

    // completed projects (count of distinct projects with verified hours)
    const completedProjects = await db
      .select({ count: count() })
      .from(schema.timesheets)
      .where(and(eq(schema.timesheets.userId, user.id), eq(schema.timesheets.verified, true)))
      .then((r) => r[0].count ?? 0);

    // active (accepted) applications
    const activeApplications = await db
      .select({ count: count() })
      .from(schema.applications)
      .where(and(eq(schema.applications.userId, user.id), eq(schema.applications.status, "accepted")))
      .then((r) => r[0].count ?? 0);

    return c.json({
      name: user.email.split("@")[0].replace(".", " "),
      email: user.email,
      totalHours,
      requiredHours: 80,
      completedProjects,
      activeApplications,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, err.status ?? 500);
  }
});

/**
 * GET /api/dashboard/ongoing
 * -> Lists ongoing CSPs student is participating in
 */
dashboardRoutes.get("/ongoing", async (c) => {
  try {
    const user = await requireSession(c);
    assertRole(user, ["student"]);

    const ongoing = await db
      .select({
        id: schema.projects.id,
        title: schema.projects.title,
        organisation: schema.organisations.name,
        location: schema.projects.location,
        nextSession: sql<string>`MIN(${schema.projectSessions.startsAt})`,
        hoursCompleted: sql<number>`COALESCE(SUM(${schema.timesheets.hours}), 0)`,
        totalHours: sql<number>`40`, // placeholder (could come from project metadata later)
      })
      .from(schema.applications)
      .innerJoin(schema.projects, eq(schema.applications.projectId, schema.projects.id))
      .innerJoin(schema.organisations, eq(schema.projects.orgId, schema.organisations.id))
      .leftJoin(schema.projectSessions, eq(schema.projectSessions.projectId, schema.projects.id))
      .leftJoin(schema.timesheets, eq(schema.timesheets.projectId, schema.projects.id))
      .where(and(eq(schema.applications.userId, user.id), eq(schema.applications.status, "accepted")))
      .groupBy(schema.projects.id, schema.organisations.name, schema.projects.location)
      .orderBy(desc(schema.projects.createdAt))
      .limit(4);

    return c.json(ongoing);
  } catch (err: any) {
    return c.json({ error: err.message }, err.status ?? 500);
  }
});

/**
 * GET /api/dashboard/applications
 * -> Returns list of pending or accepted applications
 */
dashboardRoutes.get("/applications", async (c) => {
  try {
    const user = await requireSession(c);
    assertRole(user, ["student"]);

    const apps = await db
      .select({
        id: schema.applications.id,
        title: schema.projects.title,
        organisation: schema.organisations.name,
        status: schema.applications.status,
        appliedDate: schema.applications.submittedAt,
      })
      .from(schema.applications)
      .innerJoin(schema.projects, eq(schema.applications.projectId, schema.projects.id))
      .innerJoin(schema.organisations, eq(schema.projects.orgId, schema.organisations.id))
      .where(eq(schema.applications.userId, user.id))
      .orderBy(desc(schema.applications.submittedAt))
      .limit(5);

    return c.json(apps);
  } catch (err: any) {
    return c.json({ error: err.message }, err.status ?? 500);
  }
});

/**
 * GET /api/dashboard/sessions
 * -> Returns upcoming CSP sessions
 */
dashboardRoutes.get("/sessions", async (c) => {
  try {
    const user = await requireSession(c);
    assertRole(user, ["student"]);

    const now = new Date();
    const sessions = await db
      .select({
        id: schema.projectSessions.id,
        title: schema.projects.title,
        date: schema.projectSessions.startsAt,
        time: schema.projectSessions.endsAt,
        location: schema.projects.location,
      })
      .from(schema.applications)
      .innerJoin(schema.projects, eq(schema.applications.projectId, schema.projects.id))
      .innerJoin(schema.projectSessions, eq(schema.projectSessions.projectId, schema.projects.id))
      .where(
        and(
          eq(schema.applications.userId, user.id),
          eq(schema.applications.status, "accepted"),
          sql`${schema.projectSessions.startsAt} > ${now}`
        ),
      )
      .orderBy(schema.projectSessions.startsAt)
      .limit(5);

    return c.json(sessions);
  } catch (err: any) {
    return c.json({ error: err.message }, err.status ?? 500);
  }
});
