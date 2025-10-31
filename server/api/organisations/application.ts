import { db } from "#server/drizzle/db.ts";
import { createApp } from "#server/factory.ts";
import { organisationMiddleware } from "#server/middlewares/auth.ts";
import * as schema from "#server/drizzle/schema";
import z from "zod";
import { eq } from "drizzle-orm";

const application = createApp().use(organisationMiddleware);

const DecisionSchema = z.object({
  applicationId: z.number(),
  action: z.enum(["accept", "reject"]),
});

application.patch("/decision", async (c) => {
  try {
    const orgUser = c.get("user");
    if (!orgUser?.id) {
      console.error("❌ [Application Decision] Unauthenticated access");
      return c.json({ error: "Not authenticated" }, 401);
    }

    const body = await c.req.json();
    const parsed = DecisionSchema.safeParse(body);

    if (!parsed.success) {
      console.error("❌ [Application Decision] Invalid body:", parsed.error.flatten());
      return c.json({ error: "Invalid request body" }, 400);
    }

    const { applicationId, action } = parsed.data;

    // ✅ Fetch application with project + org relationship
    const [application] = await db
      .select({
        id: schema.applications.id,
        status: schema.applications.status,
        projectId: schema.applications.projectId,
        orgId: schema.projects.orgId,
      })
      .from(schema.applications)
      .innerJoin(schema.projects, eq(schema.projects.id, schema.applications.projectId))
      .where(eq(schema.applications.id, applicationId))
      .limit(1);

    if (!application) {
      console.warn(`⚠️ [Application Decision] Application ${applicationId} not found`);
      return c.json({ error: "Application not found" }, 404);
    }

    // ✅ Ensure that the org owns this project
    if (application.orgId !== orgUser.id) {
      console.warn(`⚠️ [Application Decision] Org ${orgUser.id} tried to modify application not theirs`);
      return c.json({ error: "You do not have permission to modify this application" }, 403);
    }

    // ✅ Prevent double decisions
    if (application.status !== "pending") {
      return c.json({ error: "This application has already been processed" }, 400);
    }

    // ✅ Determine new status
    const newStatus = action === "accept" ? "accepted" : "rejected";

    // ✅ Update the application
    await db
      .update(schema.applications)
      .set({
        status: newStatus,
        decidedAt: new Date(),
      })
      .where(eq(schema.applications.id, applicationId));

    console.log(`✅ [Application Decision] Org ${orgUser.id} ${action}ed application ${applicationId}`);

    return c.json({
      success: true,
      message: `Application ${action}ed successfully.`,
      newStatus,
    });
  } catch (err) {
    console.error("💥 [Application Decision] Unexpected error:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default application;