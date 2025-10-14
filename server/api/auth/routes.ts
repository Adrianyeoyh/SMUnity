import { Hono } from "hono";
import { auth } from "#server/lib/auth";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { and, eq, gt } from "drizzle-orm";

export const authRoutes = new Hono();

// /api/auth/invite
authRoutes.post("/invite", async c => {
  const { email } = await c.req.json().catch(() => ({}));
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

// /api/auth/guard
authRoutes.get("/guard", async c => {
  const res = await auth.handler(
    new Request(c.req.url, { method: "GET", headers: c.req.raw.headers }),
  );
  const data:any = await res.clone().json().catch(() => ({}));
  const user = data.user ?? data.data?.user;
  if (!user?.email) return c.json({ error: "No user session" }, 401);

  const email = user.email.toLowerCase();
  const isSMU = email.endsWith("@smu.edu.sg");
  if (!isSMU) {
    const invite = await db.query.organiserInvites.findFirst({
      where: (t, { and, eq, gt }) =>
        and(eq(t.email, email), eq(t.approved, true), gt(t.expiresAt, new Date())),
    });
    if (!invite)
      return c.json({ error: "External account requires admin invitation" }, 403);
  }
  return c.json({ ok: true });
});

// pass-through for Better Auth
authRoutes.on(["POST", "GET"], "/*", c => auth.handler(c.req.raw));
