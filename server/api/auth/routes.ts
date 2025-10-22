// server/api/auth/routes.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { auth } from "#server/lib/auth";
import { and, eq, gt } from "drizzle-orm";
import { requireSession, assertRole, badReq, ok } from "../_utils/auth";

export const authRoutes = new Hono();

// Admin can create organiser invite tokens
authRoutes.post("/invite", async (c) => {
  const me = await requireSession(c);
  assertRole(me, ["admin"]);

  const { email } = (await c.req.json().catch(() => ({}))) as { email?: string };
  if (!email) return badReq(c, "Email is required");

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.insert(schema.organiserInvites).values({
    email: email.toLowerCase(),
    token,
    approved: true,
    expiresAt,
    createdAt: new Date(),
  });

  return ok(c, { ok: true, token, expiresAt });
});

// Checks role-specific constraints for currently logged-in user
authRoutes.get("/guard", async (c) => {
  const me = await requireSession(c);
  const email = me.email;

  if (me.accountType === "student") {
    if (!email.endsWith("@smu.edu.sg")) {
      return c.json({ error: "Students must use SMU email" }, 403);
    }
  }

  if (me.accountType === "organisation") {
    const invite = await db.query.organiserInvites.findFirst({
      where: (t, ops) => and(eq(t.email, email), eq(t.approved, true), gt(t.expiresAt, new Date())),
    });
    if (!invite) return c.json({ error: "Organisation account not invited/expired" }, 403);
  }

  return ok(c, { ok: true });
});

// proxy through to BetterAuth
authRoutes.on(["POST", "GET"], "/*", (c) => auth.handler(c.req.raw));
