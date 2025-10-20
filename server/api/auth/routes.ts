// server/api/auth/routes.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { auth } from "#server/lib/auth";
import { and, eq, gt } from "drizzle-orm";
import { requireSession } from "../_utils/auth";

export const authRoutes = new Hono();

authRoutes.post("/invite", async c => {
  const session = await requireSession(c);
  if (session.accountType !== "admin") return c.json({ error: "Forbidden" }, 403);

  const { email }:{ email?: string } = await c.req.json().catch(() => ({}));
  if (!email) return c.json({ error: "Email is required" }, 400);

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.insert(schema.organiserInvites).values({
    email: email.toLowerCase(),
    token,
    approved: true,
    expiresAt,
    createdAt: new Date(),
  });

  return c.json({ ok: true, token, expiresAt });
});

authRoutes.get("/guard", async c => {
  const session = await requireSession(c);
  const email = session.email;

  if (session.accountType === "student") {
    if (!email.endsWith("@smu.edu.sg")) return c.json({ error: "Students must use SMU email" }, 403);
  }

  if (session.accountType === "organisation") {
    const invite = await db.query.organiserInvites.findFirst({
      where: (t, ops) => and(eq(t.email, email), eq(t.approved, true), gt(t.expiresAt, new Date())),
    });
    if (!invite) return c.json({ error: "Organisation account not invited/expired" }, 403);
  }

  return c.json({ ok: true });
});

authRoutes.on(["POST", "GET"], "/*", c => auth.handler(c.req.raw));
