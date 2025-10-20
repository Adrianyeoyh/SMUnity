// server/api/organisations/requests.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { and, desc, eq } from "drizzle-orm";
import { assertRole, requireSession } from "#server/api/_utils/auth";

export const orgRequestsRoutes = new Hono();

export type CreateOrgRequestPayload = {
  requesterEmail: string;
  requesterName?: string | null;
  orgName: string;
  orgDescription?: string | null;
  website?: string | null;
};
export type CreateOrgRequestResponse = { ok: true; id: number };

// Public: POST /api/organisations/requests
orgRequestsRoutes.post("/", async c => {
  let requestedByUserId: string | null = null;
  // allow anonymous submission, but attach user id when authenticated
  try {
    const user = await requireSession(c);
    requestedByUserId = user.id;
  } catch (_) {}

  const body: CreateOrgRequestPayload = await c.req.json();

  const [ins] = await db.insert(schema.organisationRequests).values({
    requestedByUserId,
    requesterEmail: body.requesterEmail.toLowerCase(),
    requesterName: body.requesterName ?? null,
    orgName: body.orgName,
    orgDescription: body.orgDescription ?? null,
    website: body.website ?? null,
    status: "pending",
  }).returning({ id: schema.organisationRequests.id });

  return c.json<CreateOrgRequestResponse>({ ok: true, id: ins.id });
});

export type AdminOrgRequestItem = {
  id: number;
  requesterEmail: string;
  orgName: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

// Admin: GET /api/organisations/requests
orgRequestsRoutes.get("/", async c => {
  const user = await requireSession(c);
  assertRole(user, ["admin"]);

  const rows = await db.select({
    id: schema.organisationRequests.id,
    requesterEmail: schema.organisationRequests.requesterEmail,
    orgName: schema.organisationRequests.orgName,
    status: schema.organisationRequests.status,
    createdAt: schema.organisationRequests.createdAt,
  }).from(schema.organisationRequests).orderBy(desc(schema.organisationRequests.createdAt));

  const list: AdminOrgRequestItem[] = rows.map(r => ({
    id: r.id,
    requesterEmail: r.requesterEmail,
    orgName: r.orgName,
    status: r.status,
    createdAt: r.createdAt!.toISOString(),
  }));

  return c.json(list);
});

export type DecidePayload = { approve: boolean; note?: string | null };
export type DecideResponse = { ok: true };

// Admin: POST /api/organisations/requests/:id/decide
orgRequestsRoutes.post("/:id/decide", async c => {
  const user = await requireSession(c);
  assertRole(user, ["admin"]);

  const id = Number(c.req.param("id"));
  const body: DecidePayload = await c.req.json();

  await db.update(schema.organisationRequests).set({
    status: body.approve ? "approved" : "rejected",
    decidedBy: user.id,
    decidedAt: new Date(),
  }).where(eq(schema.organisationRequests.id, id));

  return c.json<DecideResponse>({ ok: true });
});
