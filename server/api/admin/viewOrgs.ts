// server/api/admin/viewOrgs.ts
import { desc, eq, sql } from "drizzle-orm";
import { db } from "#server/drizzle/db";
import { organisations, projects, user } from "#server/drizzle/schema";
import { createApp } from "#server/factory";

export const viewOrgs = createApp();


viewOrgs.get("/", async (c) => {
  try {
    // Subquery to count projects per organisation
    const projectCounts = db
      .select({
        orgId: projects.orgId,
        projectCount: sql<number>`COUNT(${projects.id})`.as("project_count"),
      })
      .from(projects)
      .groupBy(projects.orgId)
      .as("project_counts");

    const results = await db
      .select({
        id: organisations.userId,
        name: user.name,
        email: user.email,
        phone: organisations.phone,
        website: organisations.website,
        description: organisations.description,
        createdAt: organisations.createdAt,
        updatedAt: organisations.updatedAt,
        suspended: organisations.suspended,
        projectCount: projectCounts.projectCount,
      })
      .from(organisations)
      .leftJoin(user, eq(organisations.userId, user.id))
      .leftJoin(projectCounts, eq(organisations.userId, projectCounts.orgId))
      .orderBy(desc(organisations.createdAt));

    const data = results.map((r) => ({
      ...r,
      status: r.suspended ? "suspended" : "active",
      projects: r.projectCount ?? 0, 
    }));

    return c.json({ data });
  } catch (err) {
    console.error("Failed to fetch organisations:", err);
    return c.json({ error: "Failed to retrieve organisations" }, 500);
  }
});


viewOrgs.put("/:id/suspend", async (c) => {
  const id = c.req.param("id");
  try {
    const result = await db
      .update(organisations)
      .set({ suspended: true, updatedAt: new Date() })
      .where(eq(organisations.userId, id))
      .returning();

    if (result.length === 0)
      return c.json({ error: "Organisation not found" }, 404);

    return c.json({ success: true, message: "Organisation suspended" });
  } catch (err) {
    console.error("Suspend error:", err);
    return c.json({ error: "Failed to suspend organisation" }, 500);
  }
});


viewOrgs.put("/:id/reactivate", async (c) => {
  const id = c.req.param("id");
  try {
    const result = await db
      .update(organisations)
      .set({ suspended: false, updatedAt: new Date() })
      .where(eq(organisations.userId, id))
      .returning();

    if (result.length === 0)
      return c.json({ error: "Organisation not found" }, 404);

    return c.json({ success: true, message: "Organisation reactivated" });
  } catch (err) {
    console.error("Reactivate error:", err);
    return c.json({ error: "Failed to reactivate organisation" }, 500);
  }
});
