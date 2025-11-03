import { db } from "#server/drizzle/db.ts";
import { createApp } from "#server/factory.ts";
import * as schema from "#server/drizzle/schema";
import { studentMiddleware } from "#server/middlewares/auth.ts";
import z from "zod";
import { eq, count, and } from "drizzle-orm";


const projects = createApp().use(studentMiddleware);

const ApplicationSchema = z.object({
  projectId: z.string().uuid(),
  motivation: z.string().min(20),
  experience: z.enum(["none", "some", "extensive"]),
  skills: z.string().optional(),
  comments: z.string().optional(),
  acknowledgeSchedule: z.boolean(),
  agree: z.boolean(),
});

projects.post("/apply", async (c) => {
  try {
    const user = c.get("user");
    if (!user?.id) {
      console.error("❌ [Apply] Not authenticated user tried to submit.");
      return c.json({ error: "Not authenticated." }, 401);
    }

    const body = await c.req.json();
    const parsed = ApplicationSchema.safeParse(body);
    if (!parsed.success) {
      console.error("❌ [Apply] Invalid form data:", parsed.error.flatten());
      return c.json({ error: "Invalid form data", details: parsed.error.flatten() }, 400);
    }

    const { projectId, ...data } = parsed.data;

    // ✅ Step 1: Fetch project details including application deadline
    const [project] = await db
      .select({
        id: schema.projects.id,
        slotsTotal: schema.projects.slotsTotal,
        applyBy: schema.projects.applyBy,
      })
      .from(schema.projects)
      .where(eq(schema.projects.id, projectId))
      .limit(1);

    if (!project) {
      console.error("❌ [Apply] Project not found:", projectId);
      return c.json({ error: "Project not found." }, 404);
    }

    // ✅ Step 2: Check if deadline has passed
    if (project.applyBy) {
      const now = new Date();
      const deadline = new Date(project.applyBy);

      if (now > deadline) {
        console.warn(
          `⚠️ [Apply] User ${user.id} tried to apply after deadline (${deadline.toISOString()})`
        );
        return c.json(
          { error: "The application deadline for this project has passed." },
          400
        );
      }
    }

    // ✅ Step 3: Check capacity
    const [{ count: currentCount }] = await db
      .select({ count: count() })
      .from(schema.projMemberships)
      .where(eq(schema.projMemberships.projId, projectId));

    if (currentCount >= project.slotsTotal) {
      console.warn(`⚠️ [Apply] Project ${projectId} is full.`);
      return c.json({ error: "This project has reached its full capacity." }, 400);
    }

    const existing = await db
      .select()
      .from(schema.applications)
      .where(
        and(
          eq(schema.applications.projectId, projectId),
          eq(schema.applications.userId, user.id)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      console.warn(`⚠️ [Apply] User ${user.id} already applied for project ${projectId}`);
      return c.json({ error: "You have already applied to this project" }, 400);
    }

    // ✅ Step 5: Insert new application
    await db.insert(schema.applications).values({
      projectId,
      userId: user.id,
      status: "pending",
      motivation: data.motivation,
      experience: data.experience,
      skills: data.skills ?? null,
      comments: data.comments ?? null,
      acknowledgeSchedule: data.acknowledgeSchedule,
      agree: data.agree,
    });

    console.log(`✅ [Apply] User ${user.id} successfully applied for project ${projectId}.`);
    return c.json({ success: true, message: "Application submitted successfully!" }, 200);
  } catch (err) {
    console.error("💥 [Apply] Unexpected server error:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});





export default projects;