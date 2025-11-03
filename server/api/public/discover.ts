// server/api/public/discover.ts
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema/domain";
import { or, isNull, gte, and, isNotNull, sql,eq} from "drizzle-orm";
import { createApp } from "#server/factory";
import { ok } from "#server/helper";
import { user } from "#server/drizzle/schema/auth";

const discover = createApp();

discover.get("/", async (c) => {
  try {
    // console.log("📡 [discover] Fetching active projects...");

    const now = new Date(); // server time ok; your status calc already uses this

    const rows = await db
      .select({
        id: schema.projects.id,
        title: schema.projects.title,
        organisationUserId: schema.projects.orgId,
        location: schema.projects.district,
        country: schema.projects.country,
        category: schema.projects.category,
        type: schema.projects.type,
        startDate: schema.projects.startDate,
        endDate: schema.projects.endDate,
        serviceHours: schema.projects.requiredHours,
        maxVolunteers: schema.projects.slotsTotal,
        latitude: schema.projects.latitude,
        longitude: schema.projects.longitude,
        isRemote: schema.projects.isRemote,
        applicationDeadline: schema.projects.applyBy,
        description: schema.projects.description,
        skills: schema.projects.skillTags,
        tags: schema.projects.projectTags,

        // ⬇️ add these 3
        timeStart: schema.projects.timeStart,
        timeEnd: schema.projects.timeEnd,
        daysOfWeek: schema.projects.daysOfWeek,
      })
      .from(schema.projects)
      .where(gte(schema.projects.applyBy, now))


    // Fetch org display name from user table via organisations if you don't already have it joined here
    // Minimal additional join to map organisationUserId -> user.name:
    const orgs = await db
    .select({
        userId: schema.organisations.userId,
        orgName: user.name, // ✅ now valid
    })
    .from(schema.organisations)
    .leftJoin(user, eq(schema.organisations.userId, user.id));

    const orgNameById = new Map(orgs.map(o => [o.userId, o.orgName || ""]));

    const payload = rows.map((r) => {
      // compute currentVolunteers if you want; or 0 if you haven’t joined it here
      const currentVolunteers = 0; // keep as-is unless you want to count memberships here

      // status: keep your existing client code, or compute here if preferred
      let status: "open" | "closing-soon" | "closed" | "full" = "open";
      if (r.applicationDeadline && r.applicationDeadline < now) status = "closed";

      return {
        id: r.id,
        title: r.title,
        organisation: orgNameById.get(r.organisationUserId) ?? "",
        location: r.location ?? "—",
        country: r.country ?? "—",
        category: r.category ?? "Community",
        type: r.type ?? "local",
        startDate: r.startDate,
        endDate: r.endDate,
        duration: "", // UI will render from timeStart/timeEnd/daysOfWeek
        serviceHours: r.serviceHours ?? 0,
        maxVolunteers: r.maxVolunteers ?? 0,
        currentVolunteers,
        latitude: r.latitude,
        longitude: r.longitude,
        isRemote: !!r.isRemote,
        status,
        applicationDeadline: r.applicationDeadline,
        description: r.description ?? "",
        skills: r.skills ?? [],
        tags: r.tags ?? [],

        // ⬇️ pass through schedule fields
        timeStart: r.timeStart,      // e.g. "08:30:00" (drizzle pg time -> string)
        timeEnd: r.timeEnd,          // e.g. "13:30:00"
        daysOfWeek: r.daysOfWeek,    // e.g. ["Monday","Wednesday","Friday"]
      };
    });

    // console.log("✅ [discover] Found", payload.length, "projects");
    // console.log("✅ [discover] Payload ready", payload);
    return ok(c, payload);
  } catch (err) {
    console.error("🚨 [discover] Error loading projects:", err);
    return c.json({ error: "Failed to load projects" }, 500);
  }
});

discover.get("/:projectId", async (c) => {
  const projectId = c.req.param("projectId");
  // console.log("📡 [csp] Fetching project:", projectId);

  try {
    // 1️⃣ Fetch project with organisation info
    const project = await db.query.projects.findFirst({
      where: eq(schema.projects.id, projectId),
      with: {
        org: {
          with: {
            user: true, // includes user.name (organisation display name)
          },
        },
      },
    });

    if (!project) return c.json({ error: "Project not found" }, 404);

    // 2️⃣ Count current volunteers
    const members = await db
      .select()
      .from(schema.projMemberships)
      .where(eq(schema.projMemberships.projId, projectId));
    const currentVolunteers = members.length;

    // 2️⃣ Count ALL applications (regardless of status)
const applications = await db
  .select()
  .from(schema.applications)
  .where(eq(schema.applications.projectId, projectId));

const currentApplications = applications.length;


    // 3️⃣ Prepare clean payload
    const data = {
  id: project.id,
  title: project.title,
  organisation: project.org?.user?.name ?? "Unknown Organisation",
  location: project.district ?? "—",
  country: project.country ?? "—",
  category: project.category ?? "Community",
  type: project.type ?? "local",
  startDate: project.startDate,
  endDate: project.endDate,
  serviceHours: project.requiredHours ?? 0,
  maxVolunteers: project.slotsTotal ?? 0,
  currentVolunteers,
  currentApplications,
  isRemote: project.isRemote,
  status: "open",

  // Descriptive fields
  description: project.description ?? "",
  aboutDo: project.aboutDo ?? "",
  aboutProvide: project.aboutProvide ?? "",
  requirements: project.requirements ?? "",
  skills: project.skillTags ?? [],
  tags: project.projectTags ?? [],
  imageUrl: project.imageUrl ?? "",
  images: project.imageUrl ? [project.imageUrl] : [],

  // Scheduling / Duration fields
  repeatInterval: project.repeatInterval,
  repeatUnit: project.repeatUnit,
  daysOfWeek: project.daysOfWeek ?? [],
  timeStart: project.timeStart,
  timeEnd: project.timeEnd,

  // Organisation info
  organisationInfo: {
    name: project.org?.user?.name ?? "Unknown",
    description: project.org?.description ?? "",
    website: project.org?.website ?? "",
    phone: project.org?.phone ?? "",
    email: project.org?.user?.email ?? "", // ✅ added
    isVerified: true,
  },

  // Meta
  applicationDeadline: project.applyBy,
  googleMaps: project.googleMaps ?? null,
};

    // console.log("✅ [csp] Payload ready:", data);
    return ok(c, data);
  } catch (err) {
    console.error("🚨 [csp] Error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});



export default discover;
