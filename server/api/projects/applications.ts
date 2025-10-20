// server/api/projects/applications.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { and, eq, desc } from "drizzle-orm";
import { requireSession } from "../_utils/auth";

export const applicationsRoutes = new Hono();

applicationsRoutes.get("/", async (c) => {
  const session = await requireSession(c);

  const status = c.req.query("status") as typeof schema.applicationStatusEnum.enumValues[number] | undefined;
  const where = status
    ? and(eq(schema.applications.userId, session.id), eq(schema.applications.status, status))
    : eq(schema.applications.userId, session.id);

  const rows = await db
    .select({
      id: schema.applications.id,
      status: schema.applications.status,
      motivation: schema.applications.motivation,
      submittedAt: schema.applications.submittedAt,
      projectId: schema.projects.id,
      title: schema.projects.title,
    })
    .from(schema.applications)
    .innerJoin(schema.projects, eq(schema.applications.projectId, schema.projects.id))
    .where(where)
    .orderBy(desc(schema.applications.submittedAt));

  return c.json(rows.map(r => ({
    id: r.id,
    status: r.status,
    motivation: r.motivation,
    submittedAt: (r.submittedAt as any)?.toISOString?.() ?? String(r.submittedAt),
    project: { id: r.projectId, title: r.title },
  })));
});

applicationsRoutes.post("/", async (c) => {
  const session = await requireSession(c);
  if (session.accountType !== "student") return c.json({ error: "Forbidden" }, 403);

  const body = await c.req.json().catch(() => null as any);
  if (!body?.projectId) return c.json({ error: "Missing projectId" }, 400);

  const values: any = {
    projectId: Number(body.projectId),
    userId: session.id,
    motivation: body.motivation ?? null,
    sessionId: body.sessionId ? Number(body.sessionId) : null,
  };

  const [row] = await db.insert(schema.applications).values(values).returning({ id: schema.applications.id });
  return c.json({ id: row.id }, 201);
});

applicationsRoutes.post("/:id/withdraw", async (c) => {
  const session = await requireSession(c);

  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return c.json({ error: "Invalid id" }, 400);

  await db
    .update(schema.applications)
    .set({ status: "withdrawn" })
    .where(and(eq(schema.applications.id, id), eq(schema.applications.userId, session.id)));

  return c.json({ ok: true });
});
