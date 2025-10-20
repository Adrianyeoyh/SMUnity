// server/api/admin/dashboard.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { count, eq } from "drizzle-orm";
import { assertRole, requireSession } from "#server/api/_utils/auth";

export const adminDashboardRoutes = new Hono();

export type AdminDashboardResponse = {
  totals: { students: number; organisations: number; projects: number };
  pendingOrgRequests: number;
};

// GET /api/admin/dashboard
adminDashboardRoutes.get("/", async c => {
  const user = await requireSession(c);
  assertRole(user, ["admin"]);

  const [[students], [orgs], [projects], [pending]] = await Promise.all([
    db.select({ total: count() }).from(schema.users).where(eq(schema.users.accountType, "student")),
    db.select({ total: count() }).from(schema.users).where(eq(schema.users.accountType, "organisation")),
    db.select({ total: count() }).from(schema.projects),
    db.select({ total: count() }).from(schema.organisationRequests).where(eq(schema.organisationRequests.status, "pending")),
  ]);

  const resp: AdminDashboardResponse = {
    totals: {
      students: students.total ?? 0,
      organisations: orgs.total ?? 0,
      projects: projects.total ?? 0,
    },
    pendingOrgRequests: pending.total ?? 0,
  };

  return c.json(resp);
});
