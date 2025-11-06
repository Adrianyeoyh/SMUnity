import { and, eq, lt } from "drizzle-orm";

import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { createApp } from "#server/factory";
import { forbidden, ok } from "#server/helper";

const profile = createApp();

profile.get("/completed", async (c) => {
  const user = c.get("user");
  if (!user?.id) return forbidden(c, "Not authenticated");

  const now = new Date();

  const rows = await db
    .select({
      id: schema.projects.id,
      title: schema.projects.title,
      orgId: schema.projects.orgId,
      endDate: schema.projects.endDate,
      requiredHours: schema.projects.requiredHours,
      description: schema.projects.description,
    })
    .from(schema.projMemberships)
    .innerJoin(
      schema.projects,
      eq(schema.projMemberships.projId, schema.projects.id),
    )
    .where(
      and(
        eq(schema.projMemberships.userId, user.id),
        lt(schema.projects.endDate, now),
      ),
    );

  const orgs = await db
    .select({
      userId: schema.organisations.userId,
      name: schema.user.name,
    })
    .from(schema.organisations)
    .leftJoin(schema.user, eq(schema.organisations.userId, schema.user.id));

  const orgNameMap = new Map(
    orgs.map((o) => [o.userId, o.name || "Unknown Organisation"]),
  );

  const payload = rows.map((r) => ({
    id: r.id,
    title: r.title,
    organisation: orgNameMap.get(r.orgId) ?? "Unknown Organisation",
    completedDate: r.endDate?.toISOString(),
    serviceHours: r.requiredHours ?? 0,
  }));

  return ok(c, payload);
});

export default profile;
