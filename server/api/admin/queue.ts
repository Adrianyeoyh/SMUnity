// server/api/admin/queue.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import { organisationRequests, user, organisations, account } from "#server/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { adminMiddleware } from "#server/middlewares/auth";
import { createApp } from "#server/factory.ts";
import { hashPassword } from "better-auth/crypto";
import crypto from "crypto";
import { mailer } from "#server/lib/mailer.ts";
import { auth } from "#server/lib/auth.ts";
import { env } from "#server/env.ts";



export const queue = createApp();

// --- GET all organisation requests (for dashboard)
queue.get("/", async (c) => {
  const results = await db.select().from(organisationRequests).orderBy(desc(organisationRequests.createdAt));
  return c.json({ data: results });
});

// --- POST approve
// queue.post("/:id/approve", async (c) => {
//   const id = c.req.param("id");
//   const admin = c.get("user");

//   await db.update(organisationRequests)
//     .set({
//       status: "approved",
//       decidedBy: admin.id,
//       decidedAt: new Date(),
//     })
//     .where(eq(organisationRequests.id, id));

// // console.log("hit")

//   return c.json({ success: true });
// });

queue.post("/:id/approve", async (c) => {
  const id = c.req.param("id");
  const admin = c.get("user");

  try {
    // Step 1️⃣ - Fetch request
    const [req] = await db
      .select()
      .from(organisationRequests)
      .where(eq(organisationRequests.id, id));

    if (!req) return c.json({ error: "Request not found" }, 404);

    // Step 2️⃣ - Update status
    await db
      .update(organisationRequests)
      .set({
        status: "approved",
        decidedBy: admin.id,
        decidedAt: new Date(),
      })
      .where(eq(organisationRequests.id, id));

    // Step 3️⃣ - Generate password
    const randomPassword = crypto.randomBytes(8).toString("hex");

    // Step 4️⃣ - Create new user via Better-Auth
    const createResponse = await auth.handler(
    new Request(env.VITE_APP_URL + "/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
    email: req.requesterEmail,
    password: randomPassword,
    name: req.requesterName || req.orgName,
    }),
    })
    );

    if (!createResponse.ok) {
      console.error("Better-Auth user creation failed:", await createResponse.json());
      throw new Error("Failed to create Better-Auth user");
    }

    // Step 5️⃣ - Send confirmation email
    await mailer.sendMail({
      to: req.requesterEmail,
      subject: "Your SMUnity Organisation Request Has Been Approved",
      html: `
        <p>Dear ${req.requesterName || "Organisation"},</p>
        <p>Your organisation <b>${req.orgName}</b> has been approved on SMUnity!</p>
        <p>You can now log in and start creating your community service listings.</p>
        <p><b>Login Email:</b> ${req.requesterEmail}<br/>
        <b>Temporary Password:</b> ${randomPassword}</p>
        <p>We recommend changing your password after your first login.</p>
        <p>Best,<br/>SMUnity Admin Team</p>
      `,
    });

    return c.json({
      success: true,
      message: "Organisation approved and account created through Better-Auth.",
    });
  } catch (error) {
    console.error("Approval error:", error);
    return c.json({ error: "Failed to approve organisation request" }, 500);
  }
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
