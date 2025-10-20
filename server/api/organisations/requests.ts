// server/api/organisations/requests.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { requireSession } from "../_utils/auth";

export const organisationRequestsRoutes = new Hono();

function isAdmin(t?: string) { return t === "admin"; }

organisationRequestsRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => null as any);
  if (!body?.requesterEmail || !body?.orgName) return c.json({ error: "Missing required fields" }, 400);

  const [ins] = await db
    .insert(schema.organisationRequests)
    .values({
      requesterEmail: String(body.requesterEmail).toLowerCase(),
      requesterName: body.requesterName ?? null,
      orgName: body.orgName,
      orgDescription: body.orgDescription ?? null,
      website: body.website ?? null,
    })
    .returning({ id: schema.organisationRequests.id });

  return c.json({ id: ins.id }, 201);
});

organisationRequestsRoutes.get("/", async (c) => {
  const session = await requireSession(c);
  if (!isAdmin(session.accountType)) return c.json({ error: "Forbidden" }, 403);
  const rows = await db.select().from(schema.organisationRequests).orderBy(desc(schema.organisationRequests.createdAt));
  return c.json(rows);
});

organisationRequestsRoutes.post("/:id/decide", async (c) => {
  const session = await requireSession(c);
  if (!isAdmin(session.accountType)) return c.json({ error: "Forbidden" }, 403);
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return c.json({ error: "Invalid id" }, 400);

  const body = await c.req.json().catch(() => null as any);
  const approve = !!body?.approve;

  await db
    .update(schema.organisationRequests)
    .set({ status: approve ? "approved" : "rejected", decidedBy: session.id, decidedAt: new Date() })
    .where(eq(schema.organisationRequests.id, id));

  if (approve) {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const [{ requesterEmail }] = await db
      .select({ requesterEmail: schema.organisationRequests.requesterEmail })
      .from(schema.organisationRequests)
      .where(eq(schema.organisationRequests.id, id))
      .limit(1);
    await db.insert(schema.organiserInvites).values({
      email: requesterEmail.toLowerCase(),
      token,
      approved: true,
      expiresAt,
      createdAt: new Date(),
    });
  }

  return c.json({ ok: true });
});
