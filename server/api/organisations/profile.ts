// server/api/organisations/profile.ts
import { createApp } from "#server/factory.ts";
import { db } from "#server/drizzle/db.ts";
import * as schema from "#server/drizzle/schema";
import { eq } from "drizzle-orm";
import { authMiddleware, organisationMiddleware } from "#server/middlewares/auth.ts";
import { ok } from "#server/helper/index.ts";
import z from "zod";

const profile = createApp()
  .use(authMiddleware)
  .use(organisationMiddleware);

// ✅ GET /api/organisations/profile
profile.get("/", async (c) => {
  const user = c.get("user");
  if (!user?.email) return c.json({ error: "Unauthorized" }, 401);

  // Find organisation request linked to this user’s email
  const org = await db.query.organisationRequests.findFirst({
    where: eq(schema.organisationRequests.requesterEmail, user.email),
  });

  if (!org) {
    return c.json({ error: "Organisation request not found for this user." }, 404);
  }

  return ok(c, {
    id: org.id,
    organisationName: org.orgName,
    contactPerson: org.requesterName,
    email: org.requesterEmail,
    phone: org.phone,
    website: org.website,
    description: org.orgDescription,
    status: org.status,
    createdAt: org.createdAt,
  });
});

// ✅ PATCH /api/organisations/profile
const UpdateSchema = z.object({
  organisationName: z.string().trim().min(1),
  contactPerson: z.string().trim().min(1),
  phone: z.string().trim().min(8),
  website: z.string().trim().optional().nullable(),
  description: z.string().trim().min(1),
});

profile.patch("/", async (c) => {
  const user = c.get("user");
  if (!user?.email) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "Invalid data" }, 400);

  // Update the record in organisation_requests
  const [updated] = await db
    .update(schema.organisationRequests)
    .set({
      orgName: parsed.data.organisationName,
      requesterName: parsed.data.contactPerson,
      phone: parsed.data.phone,
      website: parsed.data.website ?? "",
      orgDescription: parsed.data.description,
      status: "pending", // optional — or keep as existing org.status
    })
    .where(eq(schema.organisationRequests.requesterEmail, user.email))
    .returning();

  if (!updated) {
    return c.json({ error: "Failed to update organisation profile." }, 500);
  }

  return ok(c, {
    id: updated.id,
    organisationName: updated.orgName,
    contactPerson: updated.requesterName,
    email: updated.requesterEmail,
    phone: updated.phone,
    website: updated.website,
    description: updated.orgDescription,
    status: updated.status,
    createdAt: updated.createdAt,
  });
});

export default profile;
