// server/api/projects/applications.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { and, desc, eq } from "drizzle-orm";
import { assertRole, requireSession } from "../_utils/auth";

export const applicationsRoutes = new Hono();

export type MyApplication = {
  id: number;
  status: "pending" | "accepted" | "rejected" | "waitlisted" | "withdrawn" | "cancelled";
  project: { id: number; title: string };
  submittedAt: string;
};

// GET /api/projects/applications  (student only)
applicationsRoutes.get("/", async c => {
  const user = await requireSession(c);
  assertRole(user, ["student"]);

  const apps = await db.select({
    id: schema.applications.id,
    status: schema.applications.status,
    submittedAt: schema.applications.submittedAt,
    projectId: schema.projects.id,
    projectTitle: schema.projects.title,
  }).from(schema.applications)
    .leftJoin(schema.projects, eq(schema.projects.id, schema.applications.projectId))
    .where(eq(schema.applications.userId, user.id))
    .orderBy(desc(schema.applications.submittedAt));

  const list: MyApplication[] = apps.map(a => ({
    id: a.id,
    status: a.status,
    submittedAt: a.submittedAt?.toISOString() ?? new Date().toISOString(),
    project: { id: a.projectId!, title: a.projectTitle! },
  }));

  return c.json(list);
});

export type ApplyPayload = { projectId: number; sessionId?: number | null; motivation?: string };
export type ApplyResponse = { ok: true; id: number };

// POST /api/projects/applications  (student only)
applicationsRoutes.post("/", async c => {
  const user = await requireSession(c);
  assertRole(user, ["student"]);

  const body: ApplyPayload = await c.req.json();

  const [ins] = await db.insert(schema.applications).values({
    projectId: body.projectId,
    sessionId: body.sessionId ?? null,
    userId: user.id,
    motivation: body.motivation ?? null,
  }).returning({ id: schema.applications.id });

  return c.json<ApplyResponse>({ ok: true, id: ins.id });
});
