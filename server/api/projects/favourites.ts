// server/api/projects/favourites.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { and, desc, eq } from "drizzle-orm";
import { requireSession } from "../_utils/auth";

export const favouritesRoutes = new Hono();

export type favouriteItem = { id: number; title: string; location: string | null; savedAt: string };

// GET /api/projects/favourites
favouritesRoutes.get("/", async c => {
  const user = await requireSession(c);

  const rows = await db.select({
    savedAt: schema.savedProjects.savedAt,
    projectId: schema.projects.id,
    title: schema.projects.title,
    location: schema.projects.location,
  })
    .from(schema.savedProjects)
    .innerJoin(schema.projects, eq(schema.savedProjects.projectId, schema.projects.id))
    .where(eq(schema.savedProjects.userId, user.id))
    .orderBy(desc(schema.savedProjects.savedAt));

  const list: favouriteItem[] = rows.map(r => ({
    id: r.projectId,
    title: r.title,
    location: r.location,
    savedAt: r.savedAt?.toISOString() ?? new Date().toISOString(),
  }));

  return c.json(list);
});

export type TogglefavouritePayload = { projectId: number };
export type TogglefavouriteResponse = { added?: true; removed?: true };

// POST /api/projects/favourites
favouritesRoutes.post("/", async c => {
  const user = await requireSession(c);
  const body: TogglefavouritePayload = await c.req.json();

  const existing = await db.query.savedProjects.findFirst({
    where: (t, ops) => and(eq(t.userId, user.id), eq(t.projectId, body.projectId)),
  });

  if (existing) {
    await db.delete(schema.savedProjects).where(
      and(eq(schema.savedProjects.userId, user.id), eq(schema.savedProjects.projectId, body.projectId))
    );
    return c.json<TogglefavouriteResponse>({ removed: true });
  }

  await db.insert(schema.savedProjects).values({ projectId: body.projectId, userId: user.id });
  return c.json<TogglefavouriteResponse>({ added: true });
});
