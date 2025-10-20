// server/api/organisations/index.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { requireSession } from "../_utils/auth";

export const organisationsRoutes = new Hono();
function isAdmin(type?: string) { return type === "admin"; }

organisationsRoutes.get("/", async c => {
  const rows = await db
    .select({
      id: schema.organisations.userId,
      slug: schema.organisations.slug,
      description: schema.organisations.description,
      website: schema.organisations.website,
      createdAt: schema.organisations.createdAt,
    })
    .from(schema.organisations)
    .orderBy(desc(schema.organisations.createdAt));
  return c.json(rows);
});

organisationsRoutes.get("/:id", async c => {
  const id = String(c.req.param("id"));
  const [org] = await db
    .select({
      id: schema.organisations.userId,
      slug: schema.organisations.slug,
      description: schema.organisations.description,
      website: schema.organisations.website,
      createdBy: schema.organisations.createdBy,
      createdAt: schema.organisations.createdAt,
    })
    .from(schema.organisations)
    .where(eq(schema.organisations.userId, id))
    .limit(1);
  if (!org) return c.json({ error: "Not found" }, 404);
  return c.json(org);
});

organisationsRoutes.post("/", async c => {
  const session = await requireSession(c);
  if (!isAdmin(session.accountType)) return c.json({ error: "Forbidden" }, 403);

  const body = await c.req.json().catch(() => null as any);
  if (!body?.slug || !body?.userId) return c.json({ error: "Missing slug or userId" }, 400);

  const [inserted] = await db
    .insert(schema.organisations)
    .values({
      userId: body.userId,
      slug: body.slug,
      description: body.description ?? null,
      website: body.website ?? null,
      createdBy: session.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: schema.organisations.userId });
  return c.json({ id: inserted.id }, 201);
});

organisationsRoutes.patch("/:id", async c => {
  const session = await requireSession(c);
  const id = String(c.req.param("id"));

  const [org] = await db
    .select({ userId: schema.organisations.userId })
    .from(schema.organisations)
    .where(eq(schema.organisations.userId, id))
    .limit(1);
  if (!org) return c.json({ error: "Not found" }, 404);
  if (!isAdmin(session.accountType) && org.userId !== session.id) return c.json({ error: "Forbidden" }, 403);

  const body = await c.req.json().catch(() => ({}));
  await db
    .update(schema.organisations)
    .set({
      slug: body.slug ?? undefined,
      description: body.description ?? undefined,
      website: body.website ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(schema.organisations.userId, id));

  return c.json({ ok: true });
});

organisationsRoutes.delete("/:id", async c => {
  const session = await requireSession(c);
  if (!isAdmin(session.accountType)) return c.json({ error: "Forbidden" }, 403);
  const id = String(c.req.param("id"));
  await db.delete(schema.organisations).where(eq(schema.organisations.userId, id));
  return c.json({ ok: true });
});
