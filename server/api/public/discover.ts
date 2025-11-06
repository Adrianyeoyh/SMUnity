// server/api/public/discover.ts
import { and, eq, gte, isNotNull, isNull, or, sql } from "drizzle-orm";

import { db } from "#server/drizzle/db";
import { user } from "#server/drizzle/schema/auth";
import * as schema from "#server/drizzle/schema/domain";
import { createApp } from "#server/factory";
import { ok } from "#server/helper";

const discover = createApp();

discover.get("/", async (c) => {
  try {
    const now = new Date();

    // ✅ Select projects only from non-suspended orgs
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
      .leftJoin(
        schema.organisations,
        eq(schema.projects.orgId, schema.organisations.userId),
      )
      .where(
        and(
          gte(schema.projects.applyBy, now),
          eq(schema.organisations.suspended, false),
        ),
      );

    // ✅ Fetch project membership counts
    const membershipCounts = await db
  .select({
    projId: schema.projMemberships.projId,
    count: sql<number>`COUNT(${schema.projMemberships.projId})`.as("count"),
  })
  .from(schema.projMemberships)
  .groupBy(schema.projMemberships.projId);

    const projectMemberMap = new Map(
      membershipCounts.map((m) => [m.projId, m.count]),
    );

    // ✅ Fetch organisation names
    const orgs = await db
      .select({
        userId: schema.organisations.userId,
        orgName: user.name,
      })
      .from(schema.organisations)
      .leftJoin(user, eq(schema.organisations.userId, user.id));

    const orgNameById = new Map(orgs.map((o) => [o.userId, o.orgName || ""]));

    // ✅ Build payload
    const payload = rows.map((r) => {
      const currentVolunteers = projectMemberMap.get(r.id) ?? 0;
      let status: "open" | "closing-soon" | "closed" | "full" = "open";

      if (r.applicationDeadline && r.applicationDeadline < now) status = "closed";
      else if (currentVolunteers >= (r.maxVolunteers ?? 0)) status = "full";

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
        currentVolunteers, // ✅ now real value
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
    // ✅ Fetch project only if organisation is NOT suspended
    const project = await db
      .select({
        id: schema.projects.id,
        title: schema.projects.title,
        orgUserId: schema.projects.orgId,
        location: schema.projects.district,
        country: schema.projects.country,
        category: schema.projects.category,
        type: schema.projects.type,
        startDate: schema.projects.startDate,
        endDate: schema.projects.endDate,
        requiredHours: schema.projects.requiredHours,
        slotsTotal: schema.projects.slotsTotal,
        isRemote: schema.projects.isRemote,
        applyBy: schema.projects.applyBy,
        description: schema.projects.description,
        aboutDo: schema.projects.aboutDo,
        aboutProvide: schema.projects.aboutProvide,
        requirements: schema.projects.requirements,
        skillTags: schema.projects.skillTags,
        projectTags: schema.projects.projectTags,
        imageUrl: schema.projects.imageUrl,
        repeatInterval: schema.projects.repeatInterval,
        repeatUnit: schema.projects.repeatUnit,
        daysOfWeek: schema.projects.daysOfWeek,
        timeStart: schema.projects.timeStart,
        timeEnd: schema.projects.timeEnd,
        orgName: user.name,
        orgEmail: user.email,
        orgDescription: schema.organisations.description,
        orgWebsite: schema.organisations.website,
        orgPhone: schema.organisations.phone,
      })
      .from(schema.projects)
      .leftJoin(
        schema.organisations,
        eq(schema.projects.orgId, schema.organisations.userId),
      )
      .leftJoin(user, eq(schema.organisations.userId, user.id))
      .where(
        and(
          eq(schema.projects.id, projectId),
          eq(schema.organisations.suspended, false), // 🚫 exclude suspended org projects
        ),
      )
      .limit(1);

    if (!project.length)
      return c.json({ error: "Project not found or unavailable" }, 404);

    const p = project[0];

    // ✅ Count active volunteers and applications
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
      id: p.id,
      title: p.title,
      organisation: p.orgName ?? "Unknown Organisation",
      location: p.location ?? "—",
      country: p.country ?? "—",
      category: p.category ?? "Community",
      type: p.type ?? "local",
      startDate: p.startDate,
      endDate: p.endDate,
      serviceHours: p.requiredHours ?? 0,
      maxVolunteers: p.slotsTotal ?? 0,
      currentVolunteers,
      currentApplications,
      isRemote: p.isRemote,
      status: "open",

      description: p.description ?? "",
      aboutDo: p.aboutDo ?? "",
      aboutProvide: p.aboutProvide ?? "",
      requirements: p.requirements ?? "",
      skills: p.skillTags ?? [],
      tags: p.projectTags ?? [],
      imageUrl: p.imageUrl ?? "",
      images: p.imageUrl ? [p.imageUrl] : [],

      repeatInterval: p.repeatInterval,
      repeatUnit: p.repeatUnit,
      daysOfWeek: p.daysOfWeek ?? [],
      timeStart: p.timeStart,
      timeEnd: p.timeEnd,

      organisationInfo: {
        name: p.orgName ?? "Unknown",
        description: p.orgDescription ?? "",
        website: p.orgWebsite ?? "",
        phone: p.orgPhone ?? "",
        email: p.orgEmail ?? "",
        isVerified: true,
      },

      applicationDeadline: p.applyBy,
      googleMaps: null, // if you have googleMaps in schema, include here
    };

    return ok(c, data);
  } catch (err) {
    console.error(" [csp] Error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export default discover;
