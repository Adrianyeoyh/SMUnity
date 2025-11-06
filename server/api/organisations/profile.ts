import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { createApp } from "#server/factory";
import { ok } from "#server/helper";
import { organisationMiddleware } from "#server/middlewares/auth";

const profile = createApp().use(organisationMiddleware);

profile.get("/", async (c) => {
  const user = c.get("user");
  if (!user?.id) return c.json({ error: "Unauthorized" }, 401);

  const org = await db.query.organisations.findFirst({
    where: eq(schema.organisations.userId, user.id),
    with: {
      user: {
        columns: { id: true, name: true, email: true, image: true },
      },
    },
  });

  if (!org) {
    return c.json({ error: "Organisation profile not found" }, 404);
  }

  return ok(c, {
    id: org.userId,
    name: org.user.name,
    email: org.user.email,
    slug: org.slug,
    phone: org.phone,
    website: org.website,
    description: org.description,
    createdBy: org.createdBy,
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
  });
});

const UpdateSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().min(8),
  website: z.string().trim().optional().nullable(),
  description: z.string().trim().min(1),
  slug: z.string().trim().min(2).optional(),
});

profile.patch("/", async (c) => {
  const user = c.get("user");
  if (!user?.id) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "Invalid data" }, 400);

  const [updatedOrg] = await db
    .update(schema.organisations)
    .set({
      slug: parsed.data.slug ?? undefined,
      phone: parsed.data.phone,
      website: parsed.data.website ?? "",
      description: parsed.data.description,
      updatedAt: new Date(),
    })
    .where(eq(schema.organisations.userId, user.id))
    .returning();

  await db
    .update(schema.user)
    .set({ name: parsed.data.name, updatedAt: new Date() })
    .where(eq(schema.user.id, user.id));

  if (!updatedOrg) {
    return c.json({ error: "Failed to update organisation profile." }, 500);
  }

  return ok(c, {
    id: updatedOrg.userId,
    name: parsed.data.name,
    slug: updatedOrg.slug,
    phone: updatedOrg.phone,
    website: updatedOrg.website,
    description: updatedOrg.description,
    updatedAt: updatedOrg.updatedAt,
  });
});

export default profile;
