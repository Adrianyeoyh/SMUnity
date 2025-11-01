// server/api/dashboard/index.ts
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema/domain";
import { eq, and, gt, lt, sql, lte, gte, inArray  } from "drizzle-orm";
import { ok, badReq, forbidden, notFound } from "#server/helper/index.ts";
import { createApp } from "#server/factory.ts";
import { addDays, isAfter, isBefore, parseISO, format, startOfDay } from "date-fns";
// import { z } from "zod";

const dashboard = createApp();

// ---------- 1️⃣ Get Ongoing Projects ----------
dashboard.get("/ongoing-projects", async (c) => {
  try {
    const user = c.get("user");

    const projects = await db
      .select({
        id: schema.projects.id,
        title: schema.projects.title,
        startDate: schema.projects.startDate,
        endDate: schema.projects.endDate,
        orgId: schema.projects.orgId,
      })
      .from(schema.projMemberships)
      .innerJoin(schema.projects, eq(schema.projects.id, schema.projMemberships.projId))
      .where(
        and(
          eq(schema.projMemberships.userId, user.id),
          eq(schema.projMemberships.completed, false),
          lt(schema.projects.startDate, sql`NOW()`),  // project started
          gt(schema.projects.endDate, sql`NOW()`)     // project not yet ended
        )
      );

    return c.json(ok(c, { projects }));
  } catch (err) {
    console.error("❌ Ongoing projects error:", err);
    badReq(c,"Failed to load ongoing projects");
  }
});

// ---------- 2️⃣ Count Pending Applications ----------
dashboard.get("/pending-applications", async (c) => {
  try {
    const user = c.get("user");

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(schema.applications)
      .where(and(eq(schema.applications.userId, user.id), eq(schema.applications.status, "pending")));

    return c.json(ok(c,{ pendingCount: count }));
  } catch (err) {
    console.error("❌ Pending applications error:", err);
    return badReq(c,"Failed to load pending applications");
  }
});

// ---------- 3️⃣ Count Completed Projects ----------
dashboard.get("/completed-projects", async (c) => {
  try {
    const user = c.get("user");

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(schema.applications)
      .innerJoin(schema.projects, eq(schema.applications.projectId, schema.projects.id))
      .where(
        and(
          eq(schema.applications.userId, user.id),
          eq(schema.applications.status, "confirmed"),
          lt(schema.projects.endDate, sql`NOW()`) // project has ended
        )
      );

    return c.json(ok(c, { completedCount: count }));
  } catch (err) {
    console.error("❌ Completed projects error:", err);
    return badReq(c,"Failed to load completed projects");
  }
});

dashboard.get("/applications", async (c) => {
  try {
    const user = c.get("user");

    const applications = await db
      .select({
        id: schema.applications.id,
        projectId: schema.applications.projectId,
        status: schema.applications.status,
        motivation: schema.applications.motivation,
        submittedAt: schema.applications.submittedAt,
        decidedAt: schema.applications.decidedAt,
        projectTitle: schema.projects.title,
        projectOrg: schema.projects.orgId,
        projectEndDate: schema.projects.endDate,
      })
      .from(schema.applications)
      .innerJoin(schema.projects, eq(schema.applications.projectId, schema.projects.id))
      .where(eq(schema.applications.userId, user.id))
      .orderBy(sql`applications.submitted_at DESC`);

    return c.json(ok(c, { applications }));
  } catch (err) {
    console.error("❌ Error fetching user applications:", err);
    return badReq(c,"Failed to fetch user applications");
  }
});

dashboard.get("/upcoming-sessions", async (c) => {
  try {
    const user = c.get("user");
    if (!user?.id) return forbidden(c, "Not logged in");

    const today = startOfDay(new Date());
    const oneWeekLater = addDays(today, 7);

    // 1️⃣ Find all memberships of the user
    const memberships = await db
      .select({ projId: schema.projMemberships.projId })
      .from(schema.projMemberships)
      .where(eq(schema.projMemberships.userId, user.id));

    if (memberships.length === 0) return ok(c, { sessions: [] });

    const projectIds = memberships.map((m) => m.projId);

    // 2️⃣ Get all active projects within date range
    const projects = await db
      .select({
        id: schema.projects.id,
        title: schema.projects.title,
        district: schema.projects.district,
        startDate: schema.projects.startDate,
        endDate: schema.projects.endDate,
        daysOfWeek: schema.projects.daysOfWeek,
        timeStart: schema.projects.timeStart,
        timeEnd: schema.projects.timeEnd,
      })
      .from(schema.projects)
      .where(
        and(
            gte(schema.projects.endDate, today),
            lte(schema.projects.startDate, oneWeekLater),
            inArray(schema.projects.id, projectIds)
        )
      );

    // 3️⃣ Generate upcoming sessions
    const dayNameToIndex: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const sessions: any[] = [];

    for (const project of projects) {
      if (!project.daysOfWeek || project.daysOfWeek.length === 0) continue;

      if (!project.startDate || !project.endDate) continue;
        const projectStart = new Date(project.startDate);
        const projectEnd = new Date(project.endDate);

      for (let i = 0; i < 7; i++) {
        const date = addDays(today, i);
        const dayIndex = date.getDay();

        // Check if today’s weekday matches one of project.daysOfWeek
        const matches = project.daysOfWeek.some(
          (d) => dayNameToIndex[d] === dayIndex
        );

        if (matches) {
          // Only include if within project active window
          if (isAfter(date, projectEnd) || isBefore(date, projectStart)) continue;

          sessions.push({
            projectId: project.id,
            title: project.title,
            district: project.district,
            sessionDate: format(date, "yyyy-MM-dd"),
            dayOfWeek: Object.keys(dayNameToIndex).find((k) => dayNameToIndex[k] === dayIndex),
            timeStart: project.timeStart,
            timeEnd: project.timeEnd,
          });
        }
      }
    }

    // Sort sessions by date
    sessions.sort(
      (a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime()
    );

    return ok(c, { sessions });
  } catch (err) {
    console.error("❌ Error generating upcoming sessions:", err);
    return badReq(c, "Failed to generate upcoming sessions");
  }
});

export default dashboard