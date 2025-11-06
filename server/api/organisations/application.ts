import { and, desc, eq } from "drizzle-orm";
import z from "zod";

import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { createApp } from "#server/factory";
import { ok } from "#server/helper";
import { organisationMiddleware } from "#server/middlewares/auth";

const application = createApp();

const DecisionSchema = z.object({
  applicationId: z.number(),
  action: z.enum(["accept", "reject"]),
});

application.patch("/decision", async (c) => {
  try {
    const orgUser = c.get("user");
    if (!orgUser?.id) {
      console.error(" [Application Decision] Unauthenticated access");
      return c.json({ error: "Not authenticated" }, 401);
    }

    const body = await c.req.json();
    const parsed = DecisionSchema.safeParse(body);

    if (!parsed.success) {
      console.error(
        " [Application Decision] Invalid body:",
        parsed.error.flatten(),
      );
      return c.json({ error: "Invalid request body" }, 400);
    }

    const { applicationId, action } = parsed.data;

    const [application] = await db
      .select({
        id: schema.applications.id,
        status: schema.applications.status,
        projectId: schema.applications.projectId,
        orgId: schema.projects.orgId,
      })
      .from(schema.applications)
      .innerJoin(
        schema.projects,
        eq(schema.projects.id, schema.applications.projectId),
      )
      .where(eq(schema.applications.id, applicationId))
      .limit(1);

    if (!application) {
      console.warn(
        ` [Application Decision] Application ${applicationId} not found`,
      );
      return c.json({ error: "Application not found" }, 404);
    }

    if (application.orgId !== orgUser.id) {
      console.warn(
        ` [Application Decision] Org ${orgUser.id} tried to modify application not theirs`,
      );
      return c.json(
        { error: "You do not have permission to modify this application" },
        403,
      );
    }

    if (application.status !== "pending") {
      return c.json(
        { error: "This application has already been processed" },
        400,
      );
    }

    const newStatus = action === "accept" ? "accepted" : "rejected";

    await db
      .update(schema.applications)
      .set({
        status: newStatus,
        decidedAt: new Date(),
      })
      .where(eq(schema.applications.id, applicationId));

    return c.json({
      success: true,
      message: `Application ${action}ed successfully.`,
      newStatus,
    });
  } catch (err) {
    console.error(" [Application Decision] Unexpected error:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

application.get("/viewApplicant/:projectId/:applicantId", async (c) => {
  const { projectId, applicantId } = c.req.param();

  const [user] = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.id, applicantId))
    .limit(1);
  const [profile] = await db
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.userId, applicantId))
    .limit(1);

  const [application] = await db
    .select()
    .from(schema.applications)
    .where(
      and(
        eq(schema.applications.userId, applicantId),
        eq(schema.applications.projectId, projectId),
      ),
    )
    .limit(1);

  if (!application) {
    return c.json({ error: "Application not found" }, 404);
  }

  const history = await db
    .select({
      id: schema.applications.id,
      projectId: schema.applications.projectId,
      projectTitle: schema.projects.title,
      status: schema.applications.status,
      submittedAt: schema.applications.submittedAt,
    })
    .from(schema.applications)
    .leftJoin(
      schema.projects,
      eq(schema.projects.id, schema.applications.projectId),
    )
    .where(eq(schema.applications.userId, applicantId))
    .orderBy(desc(schema.applications.submittedAt));

  return ok(c, { user, profile, application, history });
});

export default application;
