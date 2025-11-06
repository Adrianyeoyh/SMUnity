// server/api/projects/saved.ts
// import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { createApp } from "#server/factory";
import { badReq, forbidden, ok } from "#server/helper";
import { authMiddleware } from "#server/middlewares/auth"; // adjust if you use different middleware

const savedProjectsRoute = createApp();

savedProjectsRoute.post("/", async (c) => {
  const user = c.get("user");
  if (!user?.id) return forbidden(c, "Not authenticated");

  const body = await c.req.json();
  const parsed = z
    .object({
      projectId: z.string().uuid("Invalid projectId"),
    })
    .safeParse(body);

  if (!parsed.success)
    return badReq(c, "Invalid request body", parsed.error.flatten());

  const { projectId } = parsed.data;

  const existing = await db
    .select()
    .from(schema.savedProjects)
    .where(
      and(
        eq(schema.savedProjects.projectId, projectId),
        eq(schema.savedProjects.userId, user.id),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    return badReq(c, "Project already saved");
  }

  await db.insert(schema.savedProjects).values({
    projectId,
    userId: user.id,
    savedAt: new Date(),
  });

  return ok(c, { message: "Project saved successfully" });
});

savedProjectsRoute.delete("/", async (c) => {
  const user = c.get("user");
  if (!user?.id) return forbidden(c, "Not authenticated");

  const body = await c.req.json();
  const parsed = z
    .object({
      projectId: z.string().uuid("Invalid projectId"),
    })
    .safeParse(body);

  if (!parsed.success)
    return badReq(c, "Invalid request body", parsed.error.flatten());

  const { projectId } = parsed.data;

  await db
    .delete(schema.savedProjects)
    .where(
      and(
        eq(schema.savedProjects.projectId, projectId),
        eq(schema.savedProjects.userId, user.id),
      ),
    );

  return ok(c, { message: "Project unsaved successfully" });
});
savedProjectsRoute.get("/list", async (c) => {
  const userCtx = c.get("user");
  if (!userCtx?.id) return forbidden(c, "Not authenticated");

  const saved = await db
    .select({
      projectId: schema.savedProjects.projectId,
      savedAt: schema.savedProjects.savedAt,

      // ─ Project fields
      id: schema.projects.id,
      title: schema.projects.title,
      description: schema.projects.description,
      category: schema.projects.category,
      district: schema.projects.district,
      country: schema.projects.country,
      type: schema.projects.type,
      startDate: schema.projects.startDate,
      endDate: schema.projects.endDate,
      serviceHours: schema.projects.requiredHours,
      maxVolunteers: schema.projects.slotsTotal,
      latitude: schema.projects.latitude,
      longitude: schema.projects.longitude,
      isRemote: schema.projects.isRemote,
      applicationDeadline: schema.projects.applyBy,
      skills: schema.projects.skillTags,
      tags: schema.projects.projectTags,
      timeStart: schema.projects.timeStart,
      timeEnd: schema.projects.timeEnd,
      daysOfWeek: schema.projects.daysOfWeek,

      // ─ Org name (comes from user table)
      organisationName: schema.user.name,
    })
    .from(schema.savedProjects)
    .innerJoin(
      schema.projects,
      eq(schema.projects.id, schema.savedProjects.projectId),
    )
    .innerJoin(
      schema.organisations,
      eq(schema.projects.orgId, schema.organisations.userId),
    )
    .innerJoin(schema.user, eq(schema.organisations.userId, schema.user.id))
    .where(eq(schema.savedProjects.userId, userCtx.id));

  const now = new Date();

  const formatted = saved.map((r) => {
    let status: "open" | "closing-soon" | "closed" | "full" = "open";
    if (r.applicationDeadline && r.applicationDeadline < now) status = "closed";

    return {
      id: r.projectId,
      title: r.title,
      organisation: r.organisationName ?? "—",
      district: r.district ?? "—",
      country: r.country ?? "—",
      category: r.category ?? "Community",
      type: r.type ?? "local",
      startDate: r.startDate,
      endDate: r.endDate,
      serviceHours: r.serviceHours ?? 0,
      maxVolunteers: r.maxVolunteers ?? 0,
      currentVolunteers: 0,
      latitude: r.latitude,
      longitude: r.longitude,
      isRemote: !!r.isRemote,
      status,
      applicationDeadline: r.applicationDeadline,
      description: r.description ?? "",
      skills: r.skills ?? [],
      tags: r.tags ?? [],
      timeStart: r.timeStart,
      timeEnd: r.timeEnd,
      daysOfWeek: r.daysOfWeek,
      savedAt: r.savedAt,
    };
  });

  console.log(saved);

  return ok(c, { saved: formatted });
});

export default savedProjectsRoute;
