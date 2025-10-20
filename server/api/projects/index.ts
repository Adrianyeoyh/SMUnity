// server/api/projects/index.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { auth } from "#server/lib/auth";
import { and, desc, eq, ilike, inArray } from "drizzle-orm";

export const projectsRoutes = new Hono();

async function getSession(c: any) {
  const res = await auth.handler(new Request(c.req.url, { method: "GET", headers: c.req.raw.headers }));
  const data = await res.clone().json().catch(() => ({} as any));
  const user = (data as any).user ?? (data as any).data?.user;
  return user ? { userId: user.id, email: String(user.email).toLowerCase(), accountType: user.accountType as any } : null;
}

function isAdmin(t?: string) { return t === "admin"; }
function isOrg(t?: string) { return t === "organisation"; }

projectsRoutes.get("/", async (c) => {
  const q = c.req.query("q")?.trim();
  const categoryId = c.req.query("categoryId") ? Number(c.req.query("categoryId")) : undefined;
  const tagIds = c.req.queries("tagId")?.map(Number).filter((n) => !Number.isNaN(n)) ?? [];
  const status = (c.req.query("status") ?? "approved") as typeof schema.projectStatusEnum.enumValues[number];

  const conditions = [eq(schema.projects.status, status)];
  if (q) conditions.push(ilike(schema.projects.title, `%${q}%`));
  if (categoryId) conditions.push(eq(schema.projects.categoryId, categoryId));

  let rows;
  if (tagIds.length) {
    rows = await db
      .select({
        id: schema.projects.id,
        title: schema.projects.title,
        summary: schema.projects.summary,
        orgId: schema.projects.orgId,
        orgSlug: schema.organisations.slug,
        location: schema.projects.location,
        latitude: schema.projects.latitude,
        longitude: schema.projects.longitude,
        slotsTotal: schema.projects.slotsTotal,
        slotsFilled: schema.projects.slotsFilled,
        status: schema.projects.status,
        createdAt: schema.projects.createdAt,
      })
      .from(schema.projects)
      .innerJoin(schema.organisations, eq(schema.organisations.userId, schema.projects.orgId))
      .innerJoin(schema.projectTags, eq(schema.projectTags.projectId, schema.projects.id))
      .where(and(...conditions, inArray(schema.projectTags.tagId, tagIds)))
      .orderBy(desc(schema.projects.createdAt));
  } else {
    rows = await db
      .select({
        id: schema.projects.id,
        title: schema.projects.title,
        summary: schema.projects.summary,
        orgId: schema.projects.orgId,
        orgSlug: schema.organisations.slug,
        location: schema.projects.location,
        latitude: schema.projects.latitude,
        longitude: schema.projects.longitude,
        slotsTotal: schema.projects.slotsTotal,
        slotsFilled: schema.projects.slotsFilled,
        status: schema.projects.status,
        createdAt: schema.projects.createdAt,
      })
      .from(schema.projects)
      .innerJoin(schema.organisations, eq(schema.organisations.userId, schema.projects.orgId))
      .where(and(...conditions))
      .orderBy(desc(schema.projects.createdAt));
  }

  const payload = rows.map((r) => ({
    id: r.id,
    title: r.title,
    summary: r.summary,
    organisation: { id: r.orgId, slug: r.orgSlug },
    location: r.location,
    latitude: r.latitude,
    longitude: r.longitude,
    slotsTotal: r.slotsTotal,
    slotsFilled: r.slotsFilled,
    status: r.status,
    createdAt: (r.createdAt as any)?.toISOString?.() ?? new Date().toISOString(),
  }));

  return c.json(payload);
});

projectsRoutes.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return c.json({ error: "Invalid id" }, 400);

  const rows = await db
    .select({
      id: schema.projects.id,
      title: schema.projects.title,
      description: schema.projects.description,
      status: schema.projects.status,
      orgId: schema.projects.orgId,
      orgSlug: schema.organisations.slug,
      location: schema.projects.location,
      addressLine1: schema.projects.addressLine1,
      addressLine2: schema.projects.addressLine2,
      city: schema.projects.city,
      postalCode: schema.projects.postalCode,
      latitude: schema.projects.latitude,
      longitude: schema.projects.longitude,
      slotsTotal: schema.projects.slotsTotal,
      slotsFilled: schema.projects.slotsFilled,
    })
    .from(schema.projects)
    .innerJoin(schema.organisations, eq(schema.organisations.userId, schema.projects.orgId))
    .where(eq(schema.projects.id, id))
    .limit(1);

  if (!rows.length) return c.json({ error: "Not found" }, 404);
  const p = rows[0];
  return c.json({
    id: p.id,
    title: p.title,
    description: p.description,
    organisation: { id: p.orgId, slug: p.orgSlug },
    address: {
      location: p.location,
      addressLine1: p.addressLine1,
      addressLine2: p.addressLine2,
      city: p.city,
      postalCode: p.postalCode,
      latitude: p.latitude,
      longitude: p.longitude,
    },
    capacity: { slotsTotal: p.slotsTotal, slotsFilled: p.slotsFilled },
    status: p.status,
  });
});

projectsRoutes.get("/:id/sessions", async (c) => {
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return c.json({ error: "Invalid id" }, 400);

  const sessions = await db
    .select({
      id: schema.projectSessions.id,
      startsAt: schema.projectSessions.startsAt,
      endsAt: schema.projectSessions.endsAt,
      capacity: schema.projectSessions.capacity,
      locationNote: schema.projectSessions.locationNote,
    })
    .from(schema.projectSessions)
    .where(eq(schema.projectSessions.projectId, id));

  return c.json(
    sessions.map((s) => ({
      id: s.id,
      startsAt: (s.startsAt as any)?.toISOString?.() ?? String(s.startsAt),
      endsAt: (s.endsAt as any)?.toISOString?.() ?? String(s.endsAt),
      capacity: s.capacity,
      locationNote: s.locationNote,
    })),
  );
});

projectsRoutes.get("/sessions/upcoming", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  if (session.accountType !== "student") return c.json({ error: "Forbidden" }, 403);

  const rows = await db
    .select({
      id: schema.projectSessions.id,
      startsAt: schema.projectSessions.startsAt,
      endsAt: schema.projectSessions.endsAt,
      title: schema.projects.title,
      location: schema.projects.location,
    })
    .from(schema.projectSessions)
    .innerJoin(schema.projects, eq(schema.projectSessions.projectId, schema.projects.id))
    .innerJoin(schema.applications, eq(schema.applications.projectId, schema.projects.id))
    .where(and(eq(schema.applications.userId, session.userId), eq(schema.applications.status, "accepted")));

  return c.json(
    rows.map((r) => ({
      id: r.id,
      title: r.title,
      date: (r.startsAt as any)?.toISOString?.() ?? String(r.startsAt),
      time: (r.endsAt as any)?.toISOString?.() ?? String(r.endsAt),
      location: r.location,
    })),
  );
});

projectsRoutes.post("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  if (!isAdmin(session.accountType) && !isOrg(session.accountType)) return c.json({ error: "Forbidden" }, 403);

  const body = await c.req.json().catch(() => null as any);
  if (!body?.orgId || !body?.title || !body?.description) return c.json({ error: "Missing required fields" }, 400);

  const org = await db.select().from(schema.organisations).where(eq(schema.organisations.userId, body.orgId)).limit(1);
  if (!org.length) return c.json({ error: "Organisation not found" }, 404);

  const [inserted] = await db
    .insert(schema.projects)
    .values({
      orgId: body.orgId,
      title: body.title,
      summary: body.summary ?? null,
      description: body.description,
      categoryId: body.categoryId ?? null,
      location: body.location ?? null,
      addressLine1: body.addressLine1 ?? null,
      addressLine2: body.addressLine2 ?? null,
      city: body.city ?? null,
      postalCode: body.postalCode ?? null,
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      slotsTotal: body.slotsTotal ?? 0,
      createdBy: session.userId,
      status: isAdmin(session.accountType) ? "approved" : "pending",
    })
    .returning({ id: schema.projects.id });

  return c.json({ id: inserted.id }, 201);
});

projectsRoutes.patch("/:id", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  if (!isAdmin(session.accountType) && !isOrg(session.accountType)) return c.json({ error: "Forbidden" }, 403);

  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return c.json({ error: "Invalid id" }, 400);

  const [p] = await db.select({ orgId: schema.projects.orgId }).from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
  if (!p) return c.json({ error: "Not found" }, 404);

  if (isOrg(session.accountType)) {
    const ok = p.orgId === session.userId;
    if (!ok) return c.json({ error: "Not your organisation" }, 403);
  }

  const body = (await c.req.json().catch(() => ({}))) as Partial<{
    title: string;
    summary: string | null;
    description: string;
    status: "draft" | "pending" | "approved" | "closed" | "archived";
    slotsTotal: number;
  }>;

  if (!isAdmin(session.accountType)) delete (body as any).status;

  await db.update(schema.projects).set(body).where(eq(schema.projects.id, id));
  return c.json({ ok: true });
});

projectsRoutes.delete("/:id", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  if (!isAdmin(session.accountType) && !isOrg(session.accountType)) return c.json({ error: "Forbidden" }, 403);

  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return c.json({ error: "Invalid id" }, 400);

  const [p] = await db.select({ orgId: schema.projects.orgId }).from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
  if (!p) return c.json({ error: "Not found" }, 404);
  if (isOrg(session.accountType) && p.orgId !== session.userId) return c.json({ error: "Not your organisation" }, 403);

  await db.delete(schema.projects).where(eq(schema.projects.id, id));
  return c.json({ ok: true });
});
