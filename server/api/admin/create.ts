import { Hono } from "hono";
import { z } from "zod";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { hashPassword } from "better-auth/crypto";
import { sql, eq } from "drizzle-orm";
import { adminMiddleware } from "#server/middlewares/auth.ts";
import { createApp } from "#server/factory.ts";
import { error } from "console";

export const adminCreate = createApp()
// .use(adminMiddleware); 


function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const createOrgSchema = z.object({
  organiserName: z.string().min(1),
  organisationName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});


adminCreate.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const data = createOrgSchema.parse(body);

    const orgSlug = slugify(data.organisationName);
    const now = new Date();

    await db.transaction(async (tx) => {
      // 1️⃣ Create user
      await tx.insert(schema.user).values({
        id: orgSlug,
        name: data.organisationName,
        email: data.email,
        accountType: "organisation",
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      });

      // 2️⃣ Create account (credentials)
      await tx.insert(schema.account).values({
        id: orgSlug,
        accountId: orgSlug,
        userId: orgSlug,
        providerId: "credential",
        password: await hashPassword(data.password),
        createdAt: now,
        updatedAt: now,
      });

      // 3️⃣ Create organisation record
      await tx.insert(schema.organisations).values({
        userId: orgSlug,
        slug: orgSlug,
        createdBy: "admin",
        createdAt: now,
        updatedAt: now,
      });
    });

    return c.json({ success: true, message: "Organisation created successfully" }, 200);
  } catch (err) {
    console.error("❌ Error creating organisation:", err);
    return c.json({ success: false, error: err || "Unknown error" }, 500);
  }
})
