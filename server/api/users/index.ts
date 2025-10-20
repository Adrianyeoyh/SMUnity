// server/api/users/index.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { requireSession } from "#server/api/_utils/auth";

export const usersRoutes = new Hono();

export type MeResponse = {
  id: string;
  email: string;
  accountType: "student" | "organisation" | "admin";
  profile: {
    displayName: string | null;
    phone: string | null;
    school: string | null;
    entryYear: number | null;
    studentId: string | null;
  } | null;
  dashboard?: {
    totalHours: number;
    activeApplications: number;
    completedProjects: number;
  };
};

// GET /api/users/me
usersRoutes.get("/me", async c => {
  const user = await requireSession(c);

  const [p] = await db.select({
    displayName: schema.profiles.displayName,
    phone: schema.profiles.phone,
    school: schema.profiles.school,
    entryYear: schema.profiles.entryYear,
    studentId: schema.profiles.studentId,
  }).from(schema.profiles).where(eq(schema.profiles.userId, user.id));

  let dashboard: MeResponse["dashboard"] | undefined;

  if (user.accountType === "student") {
    // minimal numbers for student dashboard header
    const [{ countActive }] = await db.execute<{ countActive: number }>(/* sql */`
      select count(*)::int as "countActive"
      from applications a
      where a.user_id = ${user.id}
        and a.status in ('pending','accepted')
    `);
    const [{ totalHours }] = await db.execute<{ totalHours: number }>(/* sql */`
      select coalesce(sum(hours),0)::int as "totalHours"
      from timesheets t
      where t.user_id = ${user.id}
    `);
    const [{ completedProjects }] = await db.execute<{ completedProjects: number }>(/* sql */`
      select count(distinct project_id)::int as "completedProjects"
      from timesheets t
      where t.user_id = ${user.id} and t.verified = true
    `);

    dashboard = {
      totalHours,
      activeApplications: countActive,
      completedProjects,
    };
  }

  const resp: MeResponse = {
    id: user.id,
    email: user.email,
    accountType: user.accountType,
    profile: p ?? null,
    dashboard,
  };

  return c.json(resp);
});
