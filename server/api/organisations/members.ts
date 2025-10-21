// =============================================
// server/api/organisations/members.ts (Org/Admin)
// =============================================
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { requireSession, assertRole, ok, badReq, notFound, forbidden, created } from "../_utils/auth";
import { z } from "zod";

export const orgMembersRoutes = new Hono();

// GET /api/organisations/members/:orgId
orgMembersRoutes.get("/:orgId", async (c) => {
  const session = await requireSession(c);
  assertRole(session, ["organisation", "admin"]);

  const orgId = c.req.param("orgId");
  if (!orgId) return badReq(c, "orgId required");

  if (session.accountType !== "admin" && session.id !== orgId) return forbidden(c);

  const rows = await db
    .select({
      userId: schema.orgMemberships.userId,
      roleLabel: schema.orgMemberships.roleLabel,
      acceptedAt: schema.orgMemberships.acceptedAt,
      email: schema.users.email,
    })
    .from(schema.orgMemberships)
    .innerJoin(schema.users, eq(schema.users.id, schema.orgMemberships.userId))
    .where(eq(schema.orgMemberships.orgId, orgId));

  return ok(c, rows.map(r => ({ userId: r.userId, email: r.email, roleLabel: r.roleLabel, acceptedAt: r.acceptedAt })));
});

// POST /api/organisations/members (add)
// Body: { orgId: string, userId: string, roleLabel?: string }
orgMembersRoutes.post("/", async (c) => {
  const session = await requireSession(c);
  assertRole(session, ["organisation", "admin"]);

  const body = await c.req.json().catch(() => null);
  const parsed = z.object({ orgId: z.string().min(1), userId: z.string().min(1), roleLabel: z.string().max(50).optional() }).safeParse(body);
  if (!parsed.success) return badReq(c, "Invalid body");

  const { orgId, userId, roleLabel } = parsed.data;

  if (session.accountType !== "admin" && session.id !== orgId) return forbidden(c);

  // ensure user exists
  const [u] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.id, userId)).limit(1);
  if (!u) return notFound(c, "User not found");

  await db.insert(schema.orgMemberships).values({ orgId, userId, roleLabel: roleLabel ?? null }).onConflictDoNothing();
  return created(c, { ok: true });
});

// DELETE /api/organisations/members (remove)
// Body: { orgId: string, userId: string }
orgMembersRoutes.delete("/", async (c) => {
  const session = await requireSession(c);
  assertRole(session, ["organisation", "admin"]);

  const body = await c.req.json().catch(() => null);
  const parsed = z.object({ orgId: z.string().min(1), userId: z.string().min(1) }).safeParse(body);
  if (!parsed.success) return badReq(c, "Invalid body");
  const { orgId, userId } = parsed.data;

  if (session.accountType !== "admin" && session.id !== orgId) return forbidden(c);

  await db.delete(schema.orgMemberships).where(and(eq(schema.orgMemberships.orgId, orgId), eq(schema.orgMemberships.userId, userId)));
  return ok(c, { ok: true });
});
