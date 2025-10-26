// server/api/admin/queue.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import { organisationRequests, user } from "#server/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { adminMiddleware } from "#server/middlewares/auth";
import { createApp } from "#server/factory.ts";

export const queue = createApp();

// --- GET all organisation requests (for dashboard)
queue.get("/", async (c) => {
  const results = await db.select().from(organisationRequests).orderBy(desc(organisationRequests.createdAt));
  return c.json({ data: results });
});

// --- POST approve
queue.post("/:id/approve", async (c) => {
  const id = c.req.param("id");
  const admin = c.get("user");

  await db.update(organisationRequests)
    .set({
      status: "approved",
      decidedBy: admin.id,
      decidedAt: new Date(),
    })
    .where(eq(organisationRequests.id, id));

  return c.json({ success: true });
});

// --- POST reject
queue.post("/:id/reject", async (c) => {
  const id = c.req.param("id");
  const admin = c.get("user");

  await db.update(organisationRequests)
    .set({
      status: "rejected",
      decidedBy: admin.id,
      decidedAt: new Date(),
    })
    .where(eq(organisationRequests.id, id));

  return c.json({ success: true });
});
