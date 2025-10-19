// server/api/projects/index.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { auth } from "#server/lib/auth";
import { and, desc, eq, ilike, inArray } from "drizzle-orm";

export const projectsRoutes = new Hono();

// --- helpers ---
async function getSession(c: any) {
  const res = await auth.handler(
    new Request(c.req.url, { method: "GET", headers: c.req.raw.headers }),
  );
  const data = (await res.clone().json().catch(() => ({}))) as {
    user?: { id: string; email: string };
    data?: { user?: { id: string; email: string } };
  };
  const user = data.user ?? data.data?.user;
  return user ? { userId: user.id, email: user.email.toLowerCase() } : null;
}
async function getAccountType(userId: string) {
  const p = await db.query.profiles.findFirst({
    where: (t, { eq }) => eq(t.userId, userId),
    columns: { accountType: true },
  });
  return (p?.accountType as "student" | "organisation" | "admin" | undefined) ?? null;
}
function isAdmin(t: string | null) { return t === "admin"; }
function isOrg(t: string | null) { return t === "organisation"; }

// Check if org user can manage a given organisationId
async function canManageOrg(userId: string, orgId: number): Promise<boolean> {
  const org = await db.query.organisations.findFirst({
    where: (t, { eq }) => eq(t.id, orgId),
    columns: { createdBy: true },
  });
  return !!org && org.createdBy === userId;
}

// -- TYPES --
type ProjectCard = {
  id: number;
  title: string;
  summary: string | null;
  organisation: { id: number; name: string };
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  slotsTotal: number;
  slotsFilled: number;
  status: "draft" | "pending" | "approved" | "closed" | "archived";
  createdAt: string; // ISO
};
type ProjectDetail = {
  id: number;
  title: string;
  description: string;
  organisation: { id: number; name: string };
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
  status: "draft" | "pending" | "approved" | "closed" | "archived";
};
type ProjectSessionRow = {
  id: number;
  startsAt: string; // ISO
  endsAt: string;   // ISO
  capacity: number | null;
  locationNote: string | null;
};

// ---------- PUBLIC: list projects (cards) ----------
projectsRoutes.get("/", async c => {
  const q = c.req.query("q")?.trim();
  const categoryId = c.req.query("categoryId") ? Number(c.req.query("categoryId")) : null;
  const tagIds = c.req.queries("tagId")?.map(Number).filter(n => !Number.isNaN(n)) ?? [];
  const status = c.req.query("status") ?? "approved"; // default public listing

  // base query
  let base = db
    .select({
      id: schema.projects.id,
      title: schema.projects.title,
      summary: schema.projects.summary,
      orgId: schema.projects.orgId,
      orgName: schema.organisations.name,
      location: schema.projects.location,
      latitude: schema.projects.latitude,
      longitude: schema.projects.longitude,
      slotsTotal: schema.projects.slotsTotal,
      slotsFilled: schema.projects.slotsFilled,
      status: schema.projects.status,
      createdAt: schema.projects.createdAt,
    })
    .from(schema.projects)
    .innerJoin(schema.organisations, eq(schema.organisations.id, schema.projects.orgId))
    .where(eq(schema.projects.status, status as any))
    .orderBy(desc(schema.projects.createdAt));

  if (q) {
    base = base.where(ilike(schema.projects.title, `%${q}%`));
  }
  if (categoryId) {
    base = base.where(eq(schema.projects.categoryId, categoryId));
  }
  if (tagIds.length > 0) {
    base = db
      .select({
        id: schema.projects.id,
        title: schema.projects.title,
        summary: schema.projects.summary,
        orgId: schema.projects.orgId,
        orgName: schema.organisations.name,
        location: schema.projects.location,
        latitude: schema.projects.latitude,
        longitude: schema.projects.longitude,
        slotsTotal: schema.projects.slotsTotal,
        slotsFilled: schema.projects.slotsFilled,
        status: schema.projects.status,
        createdAt: schema.projects.createdAt,
      })
      .from(schema.projects)
      .innerJoin(schema.organisations, eq(schema.organisations.id, schema.projects.orgId))
      .innerJoin(schema.projectTags, eq(schema.projectTags.projectId, schema.projects.id))
      .where(and(eq(schema.projects.status, status as any), inArray(schema.projectTags.tagId, tagIds)))
      .orderBy(desc(schema.projects.createdAt));
  }

  const rows = await base;
  const payload: ProjectCard[] = rows.map(r => ({
    id: r.id,
    title: r.title,
    summary: r.summary,
    organisation: { id: r.orgId, name: r.orgName },
    location: r.location,
    latitude: r.latitude,
    longitude: r.longitude,
    slotsTotal: r.slotsTotal,
    slotsFilled: r.slotsFilled,
    status: r.status as ProjectCard["status"],
    createdAt: r.createdAt?.toISOString() ?? new Date().toISOString(),
  }));
  return c.json<ProjectCard[]>(payload);
});

// ---------- PUBLIC: project detail (minimal) ----------
projectsRoutes.get("/:id", async c => {
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return c.json<{ error: string }>({ error: "Invalid id" }, 400);

  const row = await db
    .select({
      id: schema.projects.id,
      title: schema.projects.title,
      description: schema.projects.description,
      status: schema.projects.status,
      orgId: schema.projects.orgId,
      orgName: schema.organisations.name,
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
    .innerJoin(schema.organisations, eq(schema.organisations.id, schema.projects.orgId))
    .where(eq(schema.projects.id, id))
    .limit(1);

  if (row.length === 0) return c.json<{ error: string }>({ error: "Not found" }, 404);

  const p = row[0];
  const payload: ProjectDetail = {
    id: p.id,
    title: p.title,
    description: p.description,
    organisation: { id: p.orgId, name: p.orgName },
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
    status: p.status as ProjectDetail["status"],
  };
  return c.json<ProjectDetail>(payload);
});

// ---------- PUBLIC: project sessions (by project) ----------
projectsRoutes.get("/:id/sessions", async c => {
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return c.json<{ error: string }>({ error: "Invalid id" }, 400);

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

  const payload: ProjectSessionRow[] = sessions.map(s => ({
    id: s.id,
    startsAt: s.startsAt.toISOString(),
    endsAt: s.endsAt.toISOString(),
    capacity: s.capacity,
    locationNote: s.locationNote,
  }));
  return c.json<ProjectSessionRow[]>(payload);
});

// ---------- STUDENT: upcoming accepted sessions ----------
projectsRoutes.get("/sessions/upcoming", async c => {
  const session = await getSession(c);
  if (!session) return c.json<{ error: string }>({ error: "Unauthorized" }, 401);

  const type = await getAccountType(session.userId);
  if (type !== "student") return c.json<{ error: string }>({ error: "Forbidden" }, 403);

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

  const payload = rows.map(r => ({
    id: r.id,
    title: r.title,
    date: r.startsAt.toISOString(),
    time: r.endsAt.toISOString(),
    location: r.location,
  })) as { id: number; title: string; date: string; time: string; location: string | null }[];

  return c.json(payload);
});

// ---------- ORG/ADMIN: create project (listing) ----------
projectsRoutes.post("/", async c => {
  const session = await getSession(c);
  if (!session) return c.json<{ error: string }>({ error: "Unauthorized" }, 401);
  const type = await getAccountType(session.userId);
  if (!isAdmin(type) && !isOrg(type)) return c.json<{ error: string }>({ error: "Forbidden" }, 403);

  const body = (await c.req.json().catch(() => null)) as null | {
    orgId: number;
    title: string;
    summary?: string;
    description: string;
    categoryId?: number | null;
    location?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    postalCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    slotsTotal?: number;
  };
  if (!body || !body.orgId || !body.title || !body.description) {
    return c.json<{ error: string }>({ error: "Missing required fields" }, 400);
  }

  if (isOrg(type)) {
    const ok = await canManageOrg(session.userId, body.orgId);
    if (!ok) return c.json<{ error: string }>({ error: "Not your organisation" }, 403);
  }

  const inserted = await db
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
      status: isAdmin(type) ? "approved" : "pending",
    })
    .returning({ id: schema.projects.id });

  return c.json<{ id: number }>({ id: inserted[0].id }, 201);
});

// ---------- ORG/ADMIN: update project ----------
projectsRoutes.patch("/:id", async c => {
  const session = await getSession(c);
  if (!session) return c.json<{ error: string }>({ error: "Unauthorized" }, 401);
  const type = await getAccountType(session.userId);
  if (!isAdmin(type) && !isOrg(type)) return c.json<{ error: string }>({ error: "Forbidden" }, 403);

  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return c.json<{ error: string }>({ error: "Invalid id" }, 400);

  const proj = await db.query.projects.findFirst({
    where: (t, { eq }) => eq(t.id, id),
    columns: { orgId: true },
  });
  if (!proj) return c.json<{ error: string }>({ error: "Not found" }, 404);
  if (!isAdmin(type)) {
    const ok = await canManageOrg(session.userId, proj.orgId);
    if (!ok) return c.json<{ error: string }>({ error: "Not your organisation" }, 403);
  }

  const body = (await c.req.json().catch(() => ({}))) as Partial<{
    title: string;
    summary: string | null;
    description: string;
    status: "draft" | "pending" | "approved" | "closed" | "archived";
    slotsTotal: number;
  }>;

  // Non-admins cannot self-approve
  if (!isAdmin(type)) delete body.status;

  await db.update(schema.projects).set(body).where(eq(schema.projects.id, id));
  return c.json<{ ok: true }>({ ok: true });
});

// ---------- ADMIN/ORG: delete project ----------
projectsRoutes.delete("/:id", async c => {
  const session = await getSession(c);
  if (!session) return c.json<{ error: string }>({ error: "Unauthorized" }, 401);
  const type = await getAccountType(session.userId);
  if (!isAdmin(type) && !isOrg(type)) return c.json<{ error: string }>({ error: "Forbidden" }, 403);

  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return c.json<{ error: string }>({ error: "Invalid id" }, 400);

  const proj = await db.query.projects.findFirst({
    where: (t, { eq }) => eq(t.id, id),
    columns: { orgId: true },
  });
  if (!proj) return c.json<{ error: string }>({ error: "Not found" }, 404);

  if (!isAdmin(type)) {
    const ok = await canManageOrg(session.userId, proj.orgId);
    if (!ok) return c.json<{ error: string }>({ error: "Not your organisation" }, 403);
  }

  await db.delete(schema.projects).where(eq(schema.projects.id, id));
  return c.json<{ ok: true }>({ ok: true });
});
