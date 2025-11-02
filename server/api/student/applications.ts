// server/api/student/applications.ts
import { createApp } from "#server/factory.ts";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema/";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { ok, badReq, notFound } from "#server/helper/index.ts";


const applications = createApp()

// ----------------------
// ✅ Confirm Application
// ----------------------
applications.post("/confirm", async (c) => {
  const user = c.get("user");
  if (!user?.id) return badReq(c, "Not authenticated");

  const body = await c.req.json().catch(() => ({}));
  const schemaCheck = z.object({ applicationId: z.number() }).safeParse(body);
  if (!schemaCheck.success) return badReq(c, "Invalid body");

  const { applicationId } = schemaCheck.data;

  // 1️⃣ Find application
  const [app] = await db
    .select({
      id: schema.applications.id,
      userId: schema.applications.userId,
      projectId: schema.applications.projectId,
      status: schema.applications.status,
    })
    .from(schema.applications)
    .where(eq(schema.applications.id, applicationId))
    .limit(1);

  if (!app) return notFound(c, "Application not found");
  if (app.userId !== user.id) return badReq(c, "You cannot modify another user’s application");

  // 2️⃣ Ensure it’s in accepted state
  if (app.status !== "accepted") {
    return badReq(c, "Application is not in an approvable state");
  }

  // 3️⃣ Update application → confirmed
  await db
    .update(schema.applications)
    .set({ status: "confirmed", decidedAt: new Date() })
    .where(eq(schema.applications.id, applicationId));

  // 4️⃣ Add to project_memberships if not already
  const existingMembership = await db
    .select()
    .from(schema.projMemberships)
    .where(
      and(
        eq(schema.projMemberships.projId, app.projectId),
        eq(schema.projMemberships.userId, user.id)
      )
    )
    .limit(1);

  if (!existingMembership.length) {
    await db.insert(schema.projMemberships).values({
      projId: app.projectId,
      userId: user.id,
      acceptedAt: new Date(),
    });
  }

  return ok(c, { message: "Application confirmed successfully." });
});

// ----------------------
// ❌ Withdraw Application
// ----------------------
applications.post("/withdraw", async (c) => {
  const user = c.get("user");
  if (!user?.id) return badReq(c, "Not authenticated");

  const body = await c.req.json().catch(() => ({}));
  const schemaCheck = z.object({ applicationId: z.number() }).safeParse(body);
  if (!schemaCheck.success) return badReq(c, "Invalid body");

  const { applicationId } = schemaCheck.data;

  const [app] = await db
    .select({
      id: schema.applications.id,
      userId: schema.applications.userId,
      projectId: schema.applications.projectId,
      status: schema.applications.status,
    })
    .from(schema.applications)
    .where(eq(schema.applications.id, applicationId))
    .limit(1);

  if (!app) return notFound(c, "Application not found");
  if (app.userId !== user.id) return badReq(c, "Unauthorized");

  // Only pending or accepted can withdraw
  if (!["pending", "accepted", "approved"].includes(app.status))
    return badReq(c, "Cannot withdraw after confirmation or rejection");

  await db
    .update(schema.applications)
    .set({ status: "withdrawn", decidedAt: new Date() })
    .where(eq(schema.applications.id, applicationId));

  return ok(c, { message: "Application withdrawn successfully." });
});

// ----------------------
// 📜 Get All Applications
// ----------------------
applications.get("/list", async (c) => {
  const user = c.get("user");
  if (!user?.id) return badReq(c, "Not authenticated");

  const apps = await db
    .select({
      id: schema.applications.id,
      status: schema.applications.status,
      submittedAt: schema.applications.submittedAt,
      motivation: schema.applications.motivation,
      experience: schema.applications.experience,
      skills: schema.applications.skills,
      comments: schema.applications.comments,

      projectId: schema.projects.id,
      projectTitle: schema.projects.title,
      orgId: schema.projects.orgId,
      startDate: schema.projects.startDate,
      endDate: schema.projects.endDate,

      // ✅ Add these
      type: schema.projects.type,
      country: schema.projects.country,
      district: schema.projects.district,
      isRemote: schema.projects.isRemote,

      requiredHours: schema.projects.requiredHours,
    })

    .from(schema.applications)
    .innerJoin(schema.projects, eq(schema.applications.projectId, schema.projects.id))
    .where(eq(schema.applications.userId, user.id))
    .orderBy(schema.applications.submittedAt);

  return ok(c, { applications: apps });
});

export default applications;
