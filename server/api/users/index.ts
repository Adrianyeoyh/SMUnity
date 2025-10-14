// server/api/users/index.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import { auth } from "#server/lib/auth";
import * as schema from "#server/drizzle/schema";
import { eq } from "drizzle-orm";

const router = new Hono();

router.get("/me", async (c) => {
  const res = await auth.handler(
    new Request(c.req.url, { method: "GET", headers: c.req.raw.headers }),
  );
  const data: any = await res.clone().json().catch(() => ({}));
  const sessionUser = data?.user ?? data?.data?.user;

  if (!sessionUser?.id) return c.json({ user: null, profile: null });

  const me = await db
    .select()
    .from(schema.user)
    .leftJoin(schema.profiles, eq(schema.profiles.userId, schema.user.id))
    .where(eq(schema.user.id, sessionUser.id))
    .limit(1);

  const row = me[0];
  return c.json({
    user: {
      id: sessionUser.id,
      email: sessionUser.email,
      name: sessionUser.name,
    },
    profile: row?.profiles
      ? { role: row.profiles.role, displayName: row.profiles.displayName }
      : null,
  });
});

export default router;
