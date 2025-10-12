// server/index.ts
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { env } from "#server/env.ts";
import { auth } from "#server/lib/auth.ts";
import { db } from "#server/drizzle/db.ts";
import * as schema from "./drizzle/schema";
import { eq, and, gt } from "drizzle-orm";

const app = new Hono();

// ---------- Base / Static ----------
app
  .get("/health", (c) => c.json({ status: "ok" }))
  .use(
    "/*",
    serveStatic({
      root: "./dist/static",
      index: "index.html",
      onNotFound: (path) => console.log("[Static not found]", path),
    }),
  );

// ---------- Runtime Env ----------
app
  .basePath("/api")
  .get("/runtime.js", (c) =>
    c.text(
      `
        window.__env = ${JSON.stringify(
          Object.fromEntries(Object.entries(env).filter(([k]) => k.startsWith("VITE_"))),
          null,
          2,
        )}
      `.trim(),
      200,
      { "Content-Type": "application/javascript" },
    ),
  );

// ---------- Admin: create invite ----------
app.post("/api/auth/invite", async (c) => {
  // TODO: authenticate admin before allowing this (check session or admin token)
  const body = await c.req.json().catch(() => ({}));
  const email = String(body.email || "").toLowerCase();

  if (!email) {
    return c.json({ error: "Email is required" }, 400);
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  try {
    await db.insert(schema.organiserInvites).values({
      email,
      token,
      approved: true,
      expiresAt,
      createdAt: new Date(),
    });
    console.log(`[Invite] Created for ${email}`);
    return c.json({ ok: true, token, expiresAt });
  } catch (err) {
    console.error("[Invite creation failed]", err);
    return c.json({ error: "Failed to create invite" }, 500);
  }
});

// ---------- Optional: guard endpoint ----------
// ---------- Optional: guard endpoint ----------
app.get("/api/auth/guard", async (c) => {
  const res = await auth.handler(
    new Request(c.req.url, { method: "GET", headers: c.req.raw.headers }),
  );

  const clone = res.clone();
  type BetterAuthResponse = {
    user?: { id: string; email: string; name?: string | null };
    data?: { user?: { id: string; email: string; name?: string | null } };
  };

  const data = (await clone.json().catch(() => ({}))) as BetterAuthResponse;
  const user = data.user ?? data.data?.user;

  if (!user?.email) return c.json({ error: "No user session" }, 401);

  const email = user.email.toLowerCase();
  const isSMU = email.endsWith("@smu.edu.sg");

  if (!isSMU) {
    const invite = await db.query.organiserInvites.findFirst({
      where: (t, { and, eq, gt }) =>
        and(eq(t.email, email), eq(t.approved, true), gt(t.expiresAt, new Date())),
    });
    if (!invite) {
      console.log(`[Guard] Rejected ${email} (no invite)`);
      return c.json(
        { error: "External account requires admin invitation" },
        403,
      );
    }
  }

  console.log(`[Guard] Verified ${email}`);
  return c.json({ ok: true });
});

// ---------- Better Auth handler (core) ----------
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// ---------- Start server ----------
serve({ port: 4001, fetch: app.fetch });
console.log(`App is running on port 4001`);
