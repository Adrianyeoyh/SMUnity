// =============================================
// server/api/projects/manage-applications.ts (Org/Admin only)
// =============================================
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { requireSession, assertRole, notFound, ok, badReq, forbidden } from "../_utils/auth";
import { z } from "zod";

export const manageApplicationsRoutes = new Hono();

// GET /api/projects/applications/manage?projectId=123&status=pending
manageApplicationsRoutes.get("/", async (c) => {
  const session = await requireSession(c);
  assertRole(session, ["organisation", "admin"]);

  const projectId = Number(c.req.query("projectId"));
  if (!projectId) return badReq(c, "projectId is required");

  // Ensure ownership unless admin
  if (session.accountType !== "admin") {
    const owns = await db
      .select({ id: schema.projects.id })
      .from(schema.projects)
      .where(and(eq(schema.projects.id, projectId), eq(schema.projects.orgId, session.id)))
      .limit(1);
    if (!owns.length) return notFound(c, "Project not found or not yours");
  }

  const st = c.req.query("status") as "pending" | "accepted" | "rejected" | "waitlisted" | "cancelled" | undefined;

  const rows = await db
    .select({
      id: schema.applications.id,
      status: schema.applications.status,
      motivation: schema.applications.motivation,
      submittedAt: schema.applications.submittedAt,
      userId: schema.applications.userId,
      applicantEmail: schema.user.email,
    })
    .from(schema.applications)
    .innerJoin(schema.user, eq(schema.user.id, schema.applications.userId))
    .where(and(
      eq(schema.applications.projectId, projectId),
      st ? eq(schema.applications.status, st) : sql`TRUE`
    ));

  return ok(c, rows.map(r => ({
    id: r.id,
    status: r.status,
    motivation: r.motivation,
    submittedAt: (r.submittedAt as any)?.toISOString?.() ?? String(r.submittedAt),
    applicant: { id: r.userId, email: r.applicantEmail },
  })));
});

// POST /api/projects/applications/manage/decide
// Body: { ids: number[], status: "accepted" | "rejected" | "waitlisted" | "cancelled" }
manageApplicationsRoutes.post("/decide", async (c) => {
  const session = await requireSession(c);
  assertRole(session, ["organisation", "admin"]);

  const body = await c.req.json().catch(() => null);
  const parsed = z.object({
    ids: z.array(z.coerce.number().int().positive()).min(1),
    status: z.enum(["accepted","rejected","waitlisted","cancelled"]),
  }).safeParse(body);
  if (!parsed.success) return badReq(c, "Invalid body");

  // Guard: Only update applications for your project(s) unless admin
  if (session.accountType !== "admin") {
    const rows = await db
      .select({ id: schema.applications.id })
      .from(schema.applications)
      .innerJoin(schema.projects, eq(schema.projects.id, schema.applications.projectId))
      .where(and(
        inArray(schema.applications.id, parsed.data.ids),
        eq(schema.projects.orgId, session.id)
      ));
    if (rows.length !== parsed.data.ids.length) return badReq(c, "One or more applications not permitted");
  }

  await db
    .update(schema.applications)
    .set({ status: parsed.data.status, decidedAt: new Date() })
    .where(inArray(schema.applications.id, parsed.data.ids));

  return ok(c, { updated: parsed.data.ids.length });
});
