// server/api/admin/dashboard.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { sql } from "drizzle-orm";
import { requireSession, assertRole, ok } from "../_utils/auth";

export const adminDashboardRoutes = new Hono();

export type AdminDashboardResponse = {
  totals: {
    users: number;
    students: number;
    organisations: number;
    projects: number;
  };
  pendingOrgRequests: number;
};

adminDashboardRoutes.get("/", async (c) => {
  const me = await requireSession(c);
  assertRole(me, ["admin"]);

  const usersCount = await db.select({ c: sql<number>`count(*)::int` }).from(schema.users);
  const studentsCount = await db.select({ c: sql<number>`count(*)::int` }).from(schema.users).where(sql`account_type = 'student'`);
  const orgsCount = await db.select({ c: sql<number>`count(*)::int` }).from(schema.organisations);
  const projectsCount = await db.select({ c: sql<number>`count(*)::int` }).from(schema.projects);
  const pendingReq = await db.select({ c: sql<number>`count(*)::int` }).from(schema.organisationRequests).where(sql`status = 'pending'`);

  return ok<AdminDashboardResponse>(c, {
    totals: {
      users: usersCount[0]?.c ?? 0,
      students: studentsCount[0]?.c ?? 0,
      organisations: orgsCount[0]?.c ?? 0,
      projects: projectsCount[0]?.c ?? 0,
    },
    pendingOrgRequests: pendingReq[0]?.c ?? 0,
  });
});
