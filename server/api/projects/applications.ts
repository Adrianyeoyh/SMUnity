// server/api/projects/applications.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { and, eq, desc } from "drizzle-orm";
// import { requireSession, assertRole, ok, created, badReq } from "../_utils/auth";
// import { applicationCreateSchema } from "../_utils/validators";

export const applicationsRoutes = new Hono();

export type MyApplicationCard = {
  id: number;
  status: (typeof schema.applicationStatusEnum.enumValues)[number];
  motivation: string | null;
  submittedAt: string;
  project: { id: number; title: string };
};

applicationsRoutes.get("/", async (c) => {
  const me = await requireSession(c);

  const status = c.req.query("status") as (typeof schema.applicationStatusEnum.enumValues)[number] | undefined;
  const where = status
    ? and(eq(schema.applications.userId, me.id), eq(schema.applications.status, status))
    : eq(schema.applications.userId, me.id);

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

  return ok<MyApplicationCard[]>(
    c,
    rows.map((r) => ({
      id: r.id,
      status: r.status,
      motivation: r.motivation,
      submittedAt: (r.submittedAt as any)?.toISOString?.() ?? String(r.submittedAt),
      project: { id: r.projectId, title: r.title },
    })),
  );
});

applicationsRoutes.post("/", async (c) => {
  const me = await requireSession(c);
  assertRole(me, ["student"]);

  const body = await c.req.json().catch(() => null);
  const parsed = applicationCreateSchema.safeParse(body);
  if (!parsed.success) return badReq(c, "Invalid body");

  const [row] = await db
    .insert(schema.applications)
    .values({
      projectId: parsed.data.projectId,
      userId: me.id,
      motivation: parsed.data.motivation ?? null,
      sessionId: parsed.data.sessionId ?? null,
    })
    .returning({ id: schema.applications.id });

  return created(c, { id: row.id });
});

// keep route semantics used in your docs
applicationsRoutes.post("/:id/withdraw", async (c) => {
  const me = await requireSession(c);
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return badReq(c, "Invalid id");

  await db
    .update(schema.applications)
    .set({ status: "withdrawn" })
    .where(and(eq(schema.applications.id, id), eq(schema.applications.userId, me.id)));

  return ok(c, { ok: true });
});
