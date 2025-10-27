// =============================================
// server/api/timesheets/index.ts
// =============================================
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { and, eq } from "drizzle-orm";
// import { requireSession, assertRole, ok, created, badReq, notFound, forbidden } from "../_utils/auth";
// import { timesheetCreateSchema, timesheetVerifySchema } from "../_utils/validators";

export const timesheetsRoutes = new Hono();

export type TimesheetLite = {
  id: number;
  projectId: number;
  sessionId: number | null;
  date: string;
  hours: number;
  description: string | null;
  verified: boolean;
  verifiedBy: string | null;
};

// GET /api/timesheets (current user's)
// Auth: student | organisation | admin (returns only own items unless admin+?userId=)
timesheetsRoutes.get("/", async (c) => {
  const session = await requireSession(c);
  const qUserId = c.req.query("userId");
  const targetUserId = session.accountType === "admin" && qUserId ? qUserId : session.id;

  const rows = await db
    .select({
      id: schema.timesheets.id,
      projectId: schema.timesheets.projectId,
      sessionId: schema.timesheets.sessionId,
      date: schema.timesheets.date,
      hours: schema.timesheets.hours,
      description: schema.timesheets.description,
      verified: schema.timesheets.verified,
      verifiedBy: schema.timesheets.verifiedBy,
    })
    .from(schema.timesheets)
    .where(eq(schema.timesheets.userId, targetUserId))
    .orderBy(schema.timesheets.date);

  return ok(c, rows.map(r => ({
    id: r.id,
    projectId: r.projectId,
    sessionId: r.sessionId,
    date: (r.date as any)?.toISOString?.() ?? String(r.date),
    hours: r.hours,
    description: r.description,
    verified: r.verified,
    verifiedBy: r.verifiedBy ?? null,
  }) as TimesheetLite));
});

// POST /api/timesheets
// Auth: student (log own hours)
timesheetsRoutes.post("/", async (c) => {
  const session = await requireSession(c);
  assertRole(session, ["student"]);

  const body = await c.req.json().catch(() => null);
  const parsed = timesheetCreateSchema.safeParse(body);
  if (!parsed.success) return badReq(c, "Invalid body");

  const [ins] = await db
    .insert(schema.timesheets)
    .values({
      projectId: parsed.data.projectId,
      userId: session.id,
      sessionId: parsed.data.sessionId ?? null,
      date: parsed.data.date,
      hours: parsed.data.hours,
      description: parsed.data.description ?? null,
    })
    .returning({ id: schema.timesheets.id });

  return created(c, { id: ins.id });
});

// PATCH /api/timesheets/:id/verify { verified: true|false }
// Auth: organisation (owner of the project) or admin
timesheetsRoutes.patch("/:id/verify", async (c) => {
  const session = await requireSession(c);
  assertRole(session, ["organisation", "admin"]);
  const id = Number(c.req.param("id"));
  if (!id) return badReq(c, "Invalid id");

  const body = await c.req.json().catch(() => null);
  const parsed = timesheetVerifySchema.safeParse(body);
  if (!parsed.success) return badReq(c, "Invalid body");

  // Load TS + ensure org owns the project
  const [ts] = await db
    .select({ projectId: schema.timesheets.projectId })
    .from(schema.timesheets)
    .where(eq(schema.timesheets.id, id))
    .limit(1);
  if (!ts) return notFound(c);

  if (session.accountType !== "admin") {
    const owns = await db
      .select({ id: schema.projects.id })
      .from(schema.projects)
      .where(and(eq(schema.projects.id, ts.projectId), eq(schema.projects.orgId, session.id)))
      .limit(1);
    if (!owns.length) return forbidden(c);
  }

  await db
    .update(schema.timesheets)
    .set({
      verified: parsed.data.verified,
      verifiedBy: session.id,
      verifiedAt: new Date(),
    })
    .where(eq(schema.timesheets.id, id));

  return ok(c, { ok: true });
});
