// server/api/organisations/index.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { and, desc, eq } from "drizzle-orm";
import { assertRole, requireSession } from "../_utils/auth";

export const organisationsRoutes = new Hono();

export type OrgDetail = {
  id: number;
  name: string;
  description: string | null;
  website: string | null;
  email: string | null;
};

// Public: GET /api/organisations/:id
organisationsRoutes.get("/:id", async c => {
  const id = Number(c.req.param("id"));
  const [org] = await db.select({
    id: schema.organisations.id,
    name: schema.organisations.name,
    description: schema.organisations.description,
    website: schema.organisations.website,
    email: schema.organisations.email,
  }).from(schema.organisations).where(eq(schema.organisations.id, id));

  if (!org) return c.json({ error: "Not found" }, 404);
  const resp: OrgDetail = {
    id: org.id,
    name: org.name,
    description: org.description,
    website: org.website,
    email: org.email,
  };
  return c.json(resp);
});

export type CreateOrgPayload = {
  userId: string; // the org login's users.id (already created via invite/password flow)
  name: string;
  slug: string;
  description?: string | null;
  email?: string | null;
  website?: string | null;
};
export type CreateOrgResponse = { ok: true; id: number };

// Admin: POST /api/organisations
organisationsRoutes.post("/", async c => {
  const user = await requireSession(c);
  assertRole(user, ["admin"]);

  const body: CreateOrgPayload = await c.req.json();

  const [ins] = await db.insert(schema.organisations).values({
    userId: body.userId,
    name: body.name,
    slug: body.slug,
    description: body.description ?? null,
    email: body.email ?? null,
    website: body.website ?? null,
    createdBy: user.id,
  }).returning({ id: schema.organisations.id });

  return c.json<CreateOrgResponse>({ ok: true, id: ins.id });
});

export type OrgProjectItem = { id: number; title: string; status: string; createdAt: string };

// Org/Admin: GET /api/organisations/:id/projects (org portal list)
organisationsRoutes.get("/:id/projects", async c => {
  const user = await requireSession(c);
  assertRole(user, ["organisation", "admin"]);

  const id = Number(c.req.param("id"));

  const rows = await db.select({
    id: schema.projects.id,
    title: schema.projects.title,
    status: schema.projects.status,
    createdAt: schema.projects.createdAt,
  }).from(schema.projects)
    .where(eq(schema.projects.orgId, id))
    .orderBy(desc(schema.projects.createdAt));

  const list: OrgProjectItem[] = rows.map(r => ({
    id: r.id, title: r.title, status: r.status, createdAt: r.createdAt!.toISOString(),
  }));

  return c.json(list);
});
