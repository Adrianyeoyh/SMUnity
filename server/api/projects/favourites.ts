// server/api/projects/favourites.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { and, eq, desc } from "drizzle-orm";
import { requireSession, ok, badReq } from "../_utils/auth";
import { favouriteToggleSchema } from "../_utils/validators";

export const favouritesRoutes = new Hono();

export type FavouriteCard = { id: number; title: string; location: string | null; savedAt: string };

favouritesRoutes.get("/", async (c) => {
  const me = await requireSession(c);

  const rows = await db
    .select({
      projectId: schema.savedProjects.projectId,
      title: schema.projects.title,
      location: schema.projects.location,
      savedAt: schema.savedProjects.savedAt,
    })
    .from(schema.savedProjects)
    .innerJoin(schema.projects, eq(schema.savedProjects.projectId, schema.projects.id))
    .where(eq(schema.savedProjects.userId, me.id))
    .orderBy(desc(schema.savedProjects.savedAt));

  return ok<FavouriteCard[]>(
    c,
    rows.map((r) => ({
      id: r.projectId,
      title: r.title,
      location: r.location,
      savedAt: (r.savedAt as any)?.toISOString?.() ?? String(r.savedAt),
    })),
  );
});

// toggle
favouritesRoutes.post("/", async (c) => {
  const me = await requireSession(c);
  const body = await c.req.json().catch(() => null);
  const parsed = favouriteToggleSchema.safeParse(body);
  if (!parsed.success) return badReq(c, "Missing projectId");

  const projectId = parsed.data.projectId;

  const existing = await db
    .select()
    .from(schema.savedProjects)
    .where(and(eq(schema.savedProjects.projectId, projectId), eq(schema.savedProjects.userId, me.id)))
    .limit(1);

  if (existing.length) {
    await db.delete(schema.savedProjects).where(and(eq(schema.savedProjects.projectId, projectId), eq(schema.savedProjects.userId, me.id)));
    return c.json({ removed: true });
  } else {
    await db.insert(schema.savedProjects).values({ projectId, userId: me.id });
    return c.json({ added: true });
  }
});

// explicit delete (idempotent)
favouritesRoutes.delete("/", async (c) => {
  const me = await requireSession(c);
  const projectId = Number(c.req.query("projectId"));
  if (!projectId) return badReq(c, "Missing projectId");
  await db.delete(schema.savedProjects).where(and(eq(schema.savedProjects.projectId, projectId), eq(schema.savedProjects.userId, me.id)));
  return ok(c, { ok: true });
});
