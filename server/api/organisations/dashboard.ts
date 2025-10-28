import { createApp } from "#server/factory.ts";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema/domain";
import { eq, sql, inArray, and } from "drizzle-orm";

const dashboard = createApp()

dashboard.get("/", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    // Fetch all project IDs belonging to this organisation
    const orgProjects = await db
      .select({ id: schema.projects.id })
      .from(schema.projects)
      .where(eq(schema.projects.orgId, user.id!)); // ✅ non-null assertion

    const projectIds = orgProjects.map((p) => p.id);
    if (projectIds.length === 0) {
      return c.json({
        listings: 0,
        totalApplications: 0,
        pending: 0,
        confirmed: 0,
      });
    }

    const listings = orgProjects.length;

    const totalApps = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.applications)
      .where(inArray(schema.applications.projectId, projectIds));

    const pending = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.applications)
      .where(
        and(
          inArray(schema.applications.projectId, projectIds),
          eq(schema.applications.status, "pending"),
        ),
      );

    const confirmed = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.applications)
      .where(
        and(
          inArray(schema.applications.projectId, projectIds),
          eq(schema.applications.status, "confirmed"),
        ),
      );

    return c.json({
      listings,
      totalApplications: totalApps[0].count,
      pending: pending[0].count,
      confirmed: confirmed[0].count,
    });
})


export default dashboard;