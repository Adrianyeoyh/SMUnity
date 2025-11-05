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

    const now = new Date(); 

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

        timeStart: schema.projects.timeStart,
        timeEnd: schema.projects.timeEnd,
        daysOfWeek: schema.projects.daysOfWeek,
      })
      .from(schema.projects)
      .where(gte(schema.projects.applyBy, now))


    const orgs = await db
    .select({
        userId: schema.organisations.userId,
        orgName: user.name, 
    })
    .from(schema.organisations)
    .leftJoin(user, eq(schema.organisations.userId, user.id));

    const orgNameById = new Map(orgs.map(o => [o.userId, o.orgName || ""]));

    const payload = rows.map((r) => {
      const currentVolunteers = 0; 

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
        duration: "", 
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

        timeStart: r.timeStart,      
        timeEnd: r.timeEnd,          
        daysOfWeek: r.daysOfWeek,    
      };
    });

    return ok(c, payload);
  } catch (err) {
    console.error(" [discover] Error loading projects:", err);
    return c.json({ error: "Failed to load projects" }, 500);
  }
});

discover.get("/:projectId", async (c) => {
  const projectId = c.req.param("projectId");

  try {
    const project = await db.query.projects.findFirst({
      where: eq(schema.projects.id, projectId),
      with: {
        org: {
          with: {
            user: true, 
          },
        },
      },
    });

    if (!project) return c.json({ error: "Project not found" }, 404);

    const members = await db
      .select()
      .from(schema.projMemberships)
      .where(eq(schema.projMemberships.projId, projectId));
    const currentVolunteers = members.length;


const applications = await db
  .select()
  .from(schema.applications)
  .where(eq(schema.applications.projectId, projectId));

const currentApplications = applications.length;


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

  description: project.description ?? "",
  aboutDo: project.aboutDo ?? "",
  aboutProvide: project.aboutProvide ?? "",
  requirements: project.requirements ?? "",
  skills: project.skillTags ?? [],
  tags: project.projectTags ?? [],
  imageUrl: project.imageUrl ?? "",
  images: project.imageUrl ? [project.imageUrl] : [],

  repeatInterval: project.repeatInterval,
  repeatUnit: project.repeatUnit,
  daysOfWeek: project.daysOfWeek ?? [],
  timeStart: project.timeStart,
  timeEnd: project.timeEnd,

  organisationInfo: {
    name: project.org?.user?.name ?? "Unknown",
    description: project.org?.description ?? "",
    website: project.org?.website ?? "",
    phone: project.org?.phone ?? "",
    email: project.org?.user?.email ?? "",
    isVerified: true,
  },

  applicationDeadline: project.applyBy,
  googleMaps: project.googleMaps ?? null,
};

    return ok(c, data);
  } catch (err) {
    console.error(" [csp] Error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});



export default discover;
