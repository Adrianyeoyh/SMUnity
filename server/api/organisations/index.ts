// server/api/organisations/index.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { eq, desc } from "drizzle-orm";
// import { requireSession, assertRole, ok, created, badReq, notFound } from "../_utils/auth";

export const organisationsRoutes = new Hono();

export type OrgListItem = {
  id: string;
  slug: string;
  description: string | null;
  website: string | null;
  createdAt: string;
};

export type OrgDetail = OrgListItem & {
  createdBy: string;
};

organisationsRoutes.get("/", async (c) => {
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

  return ok<OrgListItem[]>(
    c,
    rows.map((r) => ({
      ...r,
      createdAt: (r.createdAt as any)?.toISOString?.() ?? String(r.createdAt),
    })),
  );
});

organisationsRoutes.get("/:id", async (c) => {
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

  if (!org) return notFound(c);
  return ok<OrgDetail>({
    ...org,
    createdAt: (org.createdAt as any)?.toISOString?.() ?? String(org.createdAt),
  } as OrgDetail);
});

// Admin: create
organisationsRoutes.post("/", async (c) => {
  const me = await requireSession(c);
  assertRole(me, ["admin"]);

  const body = (await c.req.json().catch(() => null)) as
    | { userId?: string; slug?: string; description?: string | null; website?: string | null }
    | null;
  if (!body?.slug || !body?.userId) return badReq(c, "Missing slug or userId");

  const [inserted] = await db
    .insert(schema.organisations)
    .values({
      userId: body.userId,
      slug: body.slug,
      description: body.description ?? null,
      website: body.website ?? null,
      createdBy: me.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: schema.organisations.userId });

  return created(c, { id: inserted.id });
});

// Admin or owner: update
organisationsRoutes.patch("/:id", async (c) => {
  const me = await requireSession(c);
  const id = String(c.req.param("id"));

  const [org] = await db
    .select({ userId: schema.organisations.userId })
    .from(schema.organisations)
    .where(eq(schema.organisations.userId, id))
    .limit(1);
  if (!org) return notFound(c);
  if (me.accountType !== "admin" && org.userId !== me.id) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const body = ((await c.req.json().catch(() => ({}))) ?? {}) as {
    slug?: string;
    description?: string | null;
    website?: string | null;
  };

  await db
    .update(schema.organisations)
    .set({
      slug: body.slug ?? undefined,
      description: body.description ?? undefined,
      website: body.website ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(schema.organisations.userId, id));

  return ok(c, { ok: true });
});

// Admin: delete
organisationsRoutes.delete("/:id", async (c) => {
  const me = await requireSession(c);
  assertRole(me, ["admin"]);
  const id = String(c.req.param("id"));
  await db.delete(schema.organisations).where(eq(schema.organisations.userId, id));
  return ok(c, { ok: true });
});
