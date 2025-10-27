// server/api/projects/index.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { and, desc, eq, ilike, inArray, sql } from "drizzle-orm";
// import { requireSession, ok, created, badReq } from "../_utils/auth";

export const projectsRoutes = new Hono();

type ProjectCard = {
  id: number;
  title: string;
  summary: string | null;
  organisation: { id: string; slug: string | null };
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  slotsTotal: number;
  slotsFilled: number;
  status: (typeof schema.projectStatusEnum.enumValues)[number];
  createdAt: string;
};

type ProjectDetail = {
  id: number;
  title: string;
  description: string;
  organisation: { id: string; slug: string | null };
  address: {
    location: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    postalCode: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  capacity: { slotsTotal: number; slotsFilled: number };
  status: (typeof schema.projectStatusEnum.enumValues)[number];
};

projectsRoutes.get("/", async (c) => {
  const q = c.req.query("q")?.trim();
  const categoryId = c.req.query("categoryId") ? Number(c.req.query("categoryId")) : undefined;
  const tagIds = c.req.queries("tagId")?.map(Number).filter((n) => !Number.isNaN(n)) ?? [];
  const status = (c.req.query("status") ?? "approved") as (typeof schema.projectStatusEnum.enumValues)[number];

  const conditions = [eq(schema.projects.status, status)];
  if (q) conditions.push(ilike(schema.projects.title, `%${q}%`));
  if (categoryId) conditions.push(eq(schema.projects.categoryId, categoryId));

  const baseSelect = {
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
  };

  const rows = tagIds.length
    ? await db
        .select(baseSelect)
        .from(schema.projects)
        .innerJoin(schema.organisations, eq(schema.organisations.userId, schema.projects.orgId))
        .innerJoin(schema.projectTags, eq(schema.projectTags.projectId, schema.projects.id))
        .where(and(...conditions, inArray(schema.projectTags.tagId, tagIds)))
        .orderBy(desc(schema.projects.createdAt))
    : await db
        .select(baseSelect)
        .from(schema.projects)
        .innerJoin(schema.organisations, eq(schema.organisations.userId, schema.projects.orgId))
        .where(and(...conditions))
        .orderBy(desc(schema.projects.createdAt));

  return ok<ProjectCard[]>(
    c,
    rows.map((r) => ({
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
      createdAt: (r.createdAt as any)?.toISOString?.() ?? String(r.createdAt),
    })),
  );
});

projectsRoutes.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return badReq(c, "Invalid id");

  const row = await db
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

  if (!row.length) return c.json({ error: "Not found" }, 404);
  const p = row[0];
  return ok<ProjectDetail>(c, {
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
  if (Number.isNaN(id)) return badReq(c, "Invalid id");

  const sessions = await db
    .select({
      id: schema.projectSessions.id,
      startsAt: schema.projectSessions.startsAt,
      endsAt: schema.projectSessions.endsAt,
      capacity: schema.projectSessions.capacity,
      locationNote: schema.projectSessions.locationNote,
    })
    .from(schema.projectSessions)
    .where(eq(schema.projectSessions.projectId, id))
    .orderBy(schema.projectSessions.startsAt);

  return ok(
    c,
    sessions.map((s) => ({
      id: s.id,
      startsAt: (s.startsAt as any)?.toISOString?.() ?? String(s.startsAt),
      endsAt: (s.endsAt as any)?.toISOString?.() ?? String(s.endsAt),
      capacity: s.capacity,
      locationNote: s.locationNote,
    })),
  );
});

// sessions student is accepted into (requires student)
projectsRoutes.get("/sessions/upcoming", async (c) => {
  const me = await requireSession(c);
  if (me.accountType !== "student") return c.json({ error: "Forbidden" }, 403);

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
    .where(and(eq(schema.applications.userId, me.id), eq(schema.applications.status, "accepted"), sql`${schema.projectSessions.startsAt} >= now()`));

  return ok(
    c,
    rows.map((r) => ({
      id: r.id,
      title: r.title,
      date: (r.startsAt as any)?.toISOString?.() ?? String(r.startsAt),
      time: (r.endsAt as any)?.toISOString?.() ?? String(r.endsAt),
      location: r.location,
    })),
  );
});

// create listing (org/admin)
projectsRoutes.post("/", async (c) => {
  const me = await requireSession(c);
  if (me.accountType !== "admin" && me.accountType !== "organisation") return c.json({ error: "Forbidden" }, 403);

  const body = (await c.req.json().catch(() => null)) as
    | {
        orgId?: string;
        title?: string;
        description?: string;
        summary?: string | null;
        categoryId?: number | null;
        location?: string | null;
        addressLine1?: string | null;
        addressLine2?: string | null;
        city?: string | null;
        postalCode?: string | null;
        latitude?: number | null;
        longitude?: number | null;
        slotsTotal?: number | null;
      }
    | null;

  if (!body?.orgId || !body?.title || !body?.description) {
    return badReq(c, "Missing required fields");
  }

  const [org] = await db.select().from(schema.organisations).where(eq(schema.organisations.userId, body.orgId)).limit(1);
  if (!org) return c.json({ error: "Organisation not found" }, 404);
  if (me.accountType === "organisation" && body.orgId !== me.id) return c.json({ error: "Not your organisation" }, 403);

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
      createdBy: me.id,
      status: me.accountType === "admin" ? "approved" : "pending",
    })
    .returning({ id: schema.projects.id });

  return created(c, { id: inserted.id });
});

// update (admin or owning org)
projectsRoutes.patch("/:id", async (c) => {
  const me = await requireSession(c);
  if (me.accountType !== "admin" && me.accountType !== "organisation") return c.json({ error: "Forbidden" }, 403);

  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return badReq(c, "Invalid id");

  const [p] = await db.select({ orgId: schema.projects.orgId }).from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
  if (!p) return c.json({ error: "Not found" }, 404);
  if (me.accountType === "organisation" && p.orgId !== me.id) return c.json({ error: "Not your organisation" }, 403);

  const body = ((await c.req.json().catch(() => ({}))) ?? {}) as Partial<{
    title: string;
    summary: string | null;
    description: string;
    status: (typeof schema.projectStatusEnum.enumValues)[number];
    slotsTotal: number;
  }>;

  if (me.accountType !== "admin") delete (body as any).status;

  await db.update(schema.projects).set(body).where(eq(schema.projects.id, id));
  return ok(c, { ok: true });
});

// delete (admin or owning org)
projectsRoutes.delete("/:id", async (c) => {
  const me = await requireSession(c);
  if (me.accountType !== "admin" && me.accountType !== "organisation") return c.json({ error: "Forbidden" }, 403);

  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return badReq(c, "Invalid id");

  const [p] = await db.select({ orgId: schema.projects.orgId }).from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
  if (!p) return c.json({ error: "Not found" }, 404);
  if (me.accountType === "organisation" && p.orgId !== me.id) return c.json({ error: "Not your organisation" }, 403);

  await db.delete(schema.projects).where(eq(schema.projects.id, id));
  return ok(c, { ok: true });
});
