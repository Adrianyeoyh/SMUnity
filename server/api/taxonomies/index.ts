// =============================================
// server/api/taxonomies/index.ts (Public)
// =============================================
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { desc } from "drizzle-orm";

export const taxonomiesRoutes = new Hono();

export type CategoryLite = { id: number; name: string; slug: string };
export type TagLite = { id: number; name: string; slug: string };

// GET /api/taxonomies/categories
taxonomiesRoutes.get("/categories", async (c) => {
  const rows = await db
    .select({ id: schema.categories.id, name: schema.categories.name, slug: schema.categories.slug })
    .from(schema.categories)
    .orderBy(desc(schema.categories.id));
  return c.json<CategoryLite[]>(rows);
});

// GET /api/taxonomies/tags
taxonomiesRoutes.get("/tags", async (c) => {
  const rows = await db
    .select({ id: schema.tags.id, name: schema.tags.name, slug: schema.tags.slug })
    .from(schema.tags)
    .orderBy(desc(schema.tags.id));
  return c.json<TagLite[]>(rows);
});
