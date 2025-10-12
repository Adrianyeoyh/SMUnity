import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

import { env } from "./env.ts";
import { auth } from "./lib/auth.ts";

import { db } from "./drizzle/db.ts";
import * as schema from "./drizzle/schema";

const app = new Hono()
  .get("/health", (c) => {
    return c.json({
      status: "ok",
    });
  })
  .use(
    "/*",
    serveStatic({
      root: "./dist/static",
      index: "index.html",
      onNotFound: (path) => {
        console.log(path);
      },
    }),
  );

app
  .basePath("/api")
  .post("/auth/sign-up/email", async (c) => {
    const body = await c.req.json();
    const email = String(body?.email || "").toLowerCase();

    const isSMU = email.endsWith("@smu.edu.sg");
    if (!isSMU) {
      // Require a valid, approved, unexpired organiser invite
      // (uses your organiser_invites table)
      const now = new Date();
      const invite = await import("./drizzle/db").then(async ({ db }) => {
        const { organiserInvites } = await import("./drizzle/schema");
        // drizzle-orm query
        return db.query.organiserInvites.findFirst({
          where: (t, { and, eq, gt }) =>
            and(eq(t.email, email), eq(t.approved, true), gt(t.expiresAt, now)),
        });
      });

      if (!invite) {
        return c.json(
          { error: "Only SMU students can self-sign up. Non-SMU organisers must be invited by admins." },
          403,
        );
      }
    }

    // forward to Better Auth’s sign-up endpoint
    const proxied = new Request(c.req.url, {
      method: c.req.method,
      headers: c.req.raw.headers,
      body: JSON.stringify(body),
    });
    const res = await auth.handler(proxied);

    if (res.ok) {
  try {
    const cloned = res.clone();
    const json: any = await cloned.json().catch(() => ({}));
    const userId: string | undefined =
      json?.user?.id ?? json?.data?.user?.id;

    if (userId) {
      await db.insert(schema.profiles)
        .values({
          userId,
          role: isSMU ? "student" : "leader",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();
    }
  } catch (err) {
    console.error("Profile creation failed:", err);
  }
}

  return res;
  })
  // keep this AFTER the custom route
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

serve({
  port: 4001,
  fetch: app.fetch,
});

console.log(`App is running on port 4001`);
