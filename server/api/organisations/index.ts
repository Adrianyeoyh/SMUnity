// server/api/organisations/index.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { and, eq, desc } from "drizzle-orm";
import { auth } from "#server/lib/auth";

export const organisationsRoutes = new Hono();

async function getSession(c: any) {
  const res = await auth.handler(
    new Request(c.req.url, { method: "GET", headers: c.req.raw.headers }),
  );
  const data:any = await res.clone().json().catch(() => ({} as any));
  const user = data.user ?? data.data?.user;
  return user ? { id: user.id, email: user.email, accountType: user.accountType } : null;
}
function isAdmin(type?: string) { return type === "admin"; }

// ---------- GET /api/organisations ----------
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

// ---------- GET /api/organisations/:id ----------
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

// ---------- POST /api/organisations ----------
organisationsRoutes.post("/", async c => {
  const session = await getSession(c);
  if (!session || !isAdmin(session.accountType))
    return c.json({ error: "Forbidden" }, 403);

  const body = await c.req.json().catch(() => null as any);
  if (!body?.slug || !body?.userId)
    return c.json({ error: "Missing slug or userId" }, 400);

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

// ---------- PATCH /api/organisations/:id ----------
organisationsRoutes.patch("/:id", async c => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const id = String(c.req.param("id"));
  const [org] = await db
    .select({ createdBy: schema.organisations.createdBy })
    .from(schema.organisations)
    .where(eq(schema.organisations.userId, id))
    .limit(1);

  if (!org) return c.json({ error: "Not found" }, 404);
  if (!isAdmin(session.accountType) && org.createdBy !== session.id)
    return c.json({ error: "Forbidden" }, 403);

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

// ---------- DELETE /api/organisations/:id ----------
organisationsRoutes.delete("/:id", async c => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  if (!isAdmin(session.accountType)) return c.json({ error: "Forbidden" }, 403);

  const id = String(c.req.param("id"));
  await db.delete(schema.organisations).where(eq(schema.organisations.userId, id));
  return c.json({ ok: true });
});
