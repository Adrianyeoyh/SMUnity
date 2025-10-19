// server/api/auth/routes.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { auth } from "#server/lib/auth";
import { and, eq, gt } from "drizzle-orm";

export const authRoutes = new Hono();

// Admin creates org invite
authRoutes.post("/invite", async c => {
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

// Login guard
authRoutes.get("/guard", async c => {
  const res = await auth.handler(
    new Request(c.req.url, { method: "GET", headers: c.req.raw.headers }),
  );
  const data:any = await res.clone().json().catch(() => ({}));
  const user = data.user ?? data.data?.user;
  if (!user?.email || !user?.accountType) return c.json({ error: "No user session" }, 401);

  const email = String(user.email).toLowerCase();

  if (user.accountType === "student") {
    const isSMU = email.endsWith("@smu.edu.sg");
    if (!isSMU) return c.json({ error: "Students must use SMU email" }, 403);

    // Must include a cohort/join year and be within 8 years of current year
    const yearMatch = email.match(/\.(\d{4})@smu\.edu\.sg$/);
    const year = yearMatch ? Number(yearMatch[1]) : undefined;
    const currentYear = new Date().getFullYear();
    if (!year || currentYear - year > 8) {
      return c.json({ error: "SMU student email year missing/invalid" }, 403);
    }
  }

  if (user.accountType === "organisation") {
    // org logins must have an active invite (or be provisioned)
    const invite = await db.query.organiserInvites.findFirst({
      where: (t, ops) => and(
        eq(t.email, email),
        eq(t.approved, true),
        gt(t.expiresAt, new Date())
      ),
    });
    if (!invite) return c.json({ error: "Organisation account not invited/expired" }, 403);
  }

  return c.json({ ok: true });
});

// Pass-through Better Auth
authRoutes.on(["POST", "GET"], "/*", c => auth.handler(c.req.raw));
