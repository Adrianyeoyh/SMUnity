// server/api/projects/favourites.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { auth } from "#server/lib/auth";
import { and, eq, desc } from "drizzle-orm";

export const favouritesRoutes = new Hono();

async function getSession(c: any) {
  const res = await auth.handler(new Request(c.req.url, { method: "GET", headers: c.req.raw.headers }));
  const data = await res.clone().json().catch(() => ({} as any));
  const user = (data as any).user ?? (data as any).data?.user;
  return user ? { userId: user.id } : null;
}

favouritesRoutes.get("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const rows = await db
    .select({
      projectId: schema.savedProjects.projectId,
      title: schema.projects.title,
      location: schema.projects.location,
      savedAt: schema.savedProjects.savedAt,
    })
    .from(schema.savedProjects)
    .innerJoin(schema.projects, eq(schema.savedProjects.projectId, schema.projects.id))
    .where(eq(schema.savedProjects.userId, session.userId))
    .orderBy(desc(schema.savedProjects.savedAt));

  return c.json(
    rows.map((r) => ({
      id: r.projectId,
      title: r.title,
      location: r.location,
      savedAt: (r.savedAt as any)?.toISOString?.() ?? String(r.savedAt),
    })),
  );
});

favouritesRoutes.post("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json().catch(() => null as any);
  const projectId = Number(body?.projectId);
  if (!projectId) return c.json({ error: "Missing projectId" }, 400);

  const existing = await db
    .select()
    .from(schema.savedProjects)
    .where(and(eq(schema.savedProjects.projectId, projectId), eq(schema.savedProjects.userId, session.userId)))
    .limit(1);

  if (existing.length) {
    await db.delete(schema.savedProjects).where(and(eq(schema.savedProjects.projectId, projectId), eq(schema.savedProjects.userId, session.userId)));
    return c.json({ removed: true });
  } else {
    await db.insert(schema.savedProjects).values({ projectId, userId: session.userId });
    return c.json({ added: true });
  }
});

favouritesRoutes.delete("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  const projectId = Number(c.req.query("projectId"));
  if (!projectId) return c.json({ error: "Missing projectId" }, 400);
  await db.delete(schema.savedProjects).where(and(eq(schema.savedProjects.projectId, projectId), eq(schema.savedProjects.userId, session.userId)));
  return c.json({ ok: true });
});
