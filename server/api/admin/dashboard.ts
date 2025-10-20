// server/api/admin/dashboard.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { auth } from "#server/lib/auth";

export const adminDashboardRoutes = new Hono();

async function getSession(c: any) {
  const res = await auth.handler(new Request(c.req.url, { method: "GET", headers: c.req.raw.headers }));
  const data = await res.clone().json().catch(() => ({} as any));
  const user = (data as any).user ?? (data as any).data?.user;
  return user ? { userId: user.id, accountType: user.accountType as any } : null;
}

adminDashboardRoutes.get("/", async (c) => {
  const session = await getSession(c);
  if (!session || session.accountType !== "admin") return c.json({ error: "Forbidden" }, 403);

  const totalUsers = await db.execute(`select count(*)::int as c from users`) as any;
  const totalStudents = await db.execute(`select count(*)::int as c from users where account_type = 'student'`) as any;
  const totalOrgs = await db.execute(`select count(*)::int as c from organisations`) as any;
  const totalProjects = await db.execute(`select count(*)::int as c from projects`) as any;
  const pendingOrgReq = await db.execute(`select count(*)::int as c from organisation_requests where status = 'pending'`) as any;

  const n = (x: any) => Number((x?.rows?.[0]?.c) ?? 0);
  return c.json({
    totals: {
      users: n(totalUsers),
      students: n(totalStudents),
      organisations: n(totalOrgs),
      projects: n(totalProjects),
    },
    pendingOrgRequests: n(pendingOrgReq),
  });
});
