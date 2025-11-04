import { createApp } from "#server/factory";
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

dashboard.get("/listings", async (c) => {
  const org = c.get("user");
  if (!org) return c.json({ error: "Unauthorized" }, 401);

  const listings = await db
    .select({
      id: schema.projects.id,
      title: schema.projects.title,
      summary: schema.projects.summary,
      district: schema.projects.district,
      country: schema.projects.country,
      googleMaps: schema.projects.googleMaps,
      startDate: schema.projects.startDate,
      endDate: schema.projects.endDate,
      applyBy: schema.projects.applyBy,
      slotsTotal: schema.projects.slotsTotal,
      projectTags: schema.projects.projectTags,
      skillTags: schema.projects.skillTags,
      isRemote: schema.projects.isRemote,
      repeatInterval: schema.projects.repeatInterval,
      type: schema.projects.type,
      volunteerCount: sql<number>`COUNT(${schema.projMemberships.userId})`.as("volunteerCount"),

      // derive the status dynamically using SQL CASE
      status: sql<string>`
        CASE
          WHEN ${schema.projects.applyBy} > NOW() THEN 'open'
          WHEN ${schema.projects.applyBy} <= NOW() AND ${schema.projects.startDate} > NOW() THEN 'shortlisting'
          WHEN ${schema.projects.startDate} <= NOW() AND ${schema.projects.endDate} >= NOW() THEN 'ongoing'
          ELSE 'archived'
        END
      `.as("status"),
    })
    .from(schema.projects)
    .leftJoin(schema.projMemberships, eq(schema.projects.id, schema.projMemberships.projId))
    .where(eq(schema.projects.orgId, org.id))
    .groupBy(
      schema.projects.id,
      schema.projects.title,
      schema.projects.summary,
      schema.projects.district,
      schema.projects.googleMaps,
      schema.projects.startDate,
      schema.projects.endDate,
      schema.projects.applyBy,
      schema.projects.slotsTotal,
      schema.projects.projectTags,
      schema.projects.skillTags,
      schema.projects.isRemote,
      schema.projects.repeatInterval,
      schema.projects.type,
    )
    .orderBy(sql`${schema.projects.createdAt} DESC`);
  // console.log("Listings fetched:", listings);
  return c.json({ listings });
});


export default dashboard;