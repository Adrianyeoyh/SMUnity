// server/api/organisations/requests.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { requireSession, assertRole, ok, created, badReq, notFound } from "../_utils/auth";
import { z } from "zod";

export const organisationRequestsRoutes = new Hono();

const RequestCreate = z.object({
  requesterEmail: z.string().email(),
  requesterName: z.string().min(1).nullish(),
  orgName: z.string().min(2),
  orgDescription: z.string().nullish(),
  website: z.string().url().nullish(),
});

organisationRequestsRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = RequestCreate.safeParse(body);
  if (!parsed.success) return badReq(c, "Missing or invalid fields");

  const [ins] = await db
    .insert(schema.organisationRequests)
    .values({
      requesterEmail: parsed.data.requesterEmail.toLowerCase(),
      requesterName: parsed.data.requesterName ?? null,
      orgName: parsed.data.orgName,
      orgDescription: parsed.data.orgDescription ?? null,
      website: parsed.data.website ?? null,
    })
    .returning({ id: schema.organisationRequests.id });

  return created(c, { id: ins.id });
});

organisationRequestsRoutes.get("/", async (c) => {
  const me = await requireSession(c);
  assertRole(me, ["admin"]);

  const rows = await db
    .select()
    .from(schema.organisationRequests)
    .orderBy(desc(schema.organisationRequests.createdAt));

  return ok(c, rows);
});

organisationRequestsRoutes.post("/:id/decide", async (c) => {
  const me = await requireSession(c);
  assertRole(me, ["admin"]);

  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return badReq(c, "Invalid id");

  const body = (await c.req.json().catch(() => null)) as { approve?: boolean } | null;
  if (!body) return badReq(c, "Missing body");
  const approve = !!body.approve;

  // ensure it exists
  const existing = await db
    .select({ id: schema.organisationRequests.id })
    .from(schema.organisationRequests)
    .where(eq(schema.organisationRequests.id, id))
    .limit(1);
  if (!existing.length) return notFound(c);

  await db
    .update(schema.organisationRequests)
    .set({ status: approve ? "approved" : "rejected", decidedBy: me.id, decidedAt: new Date() })
    .where(eq(schema.organisationRequests.id, id));

  if (approve) {
    // emit an organiser invite token (7 days)
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
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

  return ok(c, { ok: true });
});
