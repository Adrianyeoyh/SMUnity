// server/api/organisations/listing.ts
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { createApp } from "#server/factory";
import { organisationMiddleware } from "#server/middlewares/auth";
import { extractCoordsFromGoogleMaps } from "#server/helper";
import { ok } from "#server/helper";


const listing = createApp();
const ProjectCreateSchema = z.object({
  title: z.string().min(1),
  summary: z.string(),
  category: z.string(),
  project_type: z.enum(["local", "overseas"]),
  country: z.string().optional().nullable(),
  description: z.string(),
  about_provide: z.string(),
  about_do: z.string(),
  requirements: z.string(),
  skill_tags: z.array(z.string()).default([]),
  district: z.string(),
  google_maps: z.string(),
  remote: z.boolean(),
  repeat_interval: z.number(),
  repeat_unit: z.enum(["day", "week", "month", "year"]),
  days_of_week: z.array(z.string()).default([]),
  time_start: z.string(),
  time_end: z.string(),
  start_date: z.string(),           
  end_date: z.string(),             
  application_deadline: z.string(), 
  commitable_hours: z.number(),
  slots: z.number(),
  image_url: z.string(),
  project_tags: z.array(z.string()).default([]),
});

listing.post("/new", async (c) => {
  try {
  const body = await c.req.json();
  const parsed = ProjectCreateSchema.parse(body);

  const user = c.get("user");
  if (!user || user.accountType !== "organisation") {
    return c.json({ error: "Not authorised" }, 403);
  }
  const { lat, lng } = extractCoordsFromGoogleMaps(parsed.google_maps);

  const inserted = await db.insert(schema.projects).values({
    orgId: user?.id,
    title: parsed.title,
    summary: parsed.summary,
    category: parsed.category,
    type: parsed.project_type,
    country: parsed.country || (parsed.project_type === "overseas" ? "Singapore" : null),
    description: parsed.description,
    aboutProvide: parsed.about_provide,
    aboutDo: parsed.about_do,
    requirements: parsed.requirements,
    skillTags: parsed.skill_tags,
    projectTags: parsed.project_tags,
    district: parsed.district,
    googleMaps: parsed.google_maps,
    latitude: lat,
    longitude: lng,
    isRemote: parsed.remote,
    repeatInterval: parsed.repeat_interval,
    repeatUnit: parsed.repeat_unit,
    daysOfWeek: parsed.days_of_week,
    timeStart: parsed.time_start,
    timeEnd: parsed.time_end,
    startDate: new Date(parsed.start_date),
    endDate: new Date(parsed.end_date),
    applyBy: new Date(parsed.application_deadline),
    requiredHours: parsed.commitable_hours,
    slotsTotal: parsed.slots,
    imageUrl: parsed.image_url,
  }).returning();

  return ok(c, {
      success: true,
      project: inserted[0],
    });

  } catch (err) {
    console.error(" Project creation failed:", err);
    return c.json(
      { error: "Error", details: err instanceof Error ? err.message : err },
      500
    );
  }
});

listing.delete("/:projectId", async (c) => {
  try {
    const user = c.get("user");
    const projectId = c.req.param("projectId");

    if (!user || user.accountType !== "organisation") {
      return c.json({ error: "Not authorised" }, 403);
    }

    const [project] = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.id, projectId))
      .limit(1);

    if (!project) return c.json({ error: "Project not found" }, 404);
    if (project.orgId !== user.id)
      return c.json({ error: "You do not own this project" }, 403);

    await db.delete(schema.applications).where(eq(schema.applications.projectId, projectId));
    await db.delete(schema.projMemberships).where(eq(schema.projMemberships.projId, projectId));

    await db.delete(schema.projects).where(eq(schema.projects.id, projectId));

    return c.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error(" Delete project failed:", err);
    return c.json(
      { error: "Failed to delete project", details: err instanceof Error ? err.message : err },
      500
    );
  }
});

listing.get("/:projectId", async (c) => {
  const projectId = c.req.param("projectId");

  const project = await db.query.projects.findFirst({
    where: eq(schema.projects.id, projectId),
    with: {
      org: {
        columns: {
          userId: true,
          slug: true,
          website: true,
          phone: true,
          description: true,
        },
        with: {
          user: { columns: { name: true } },
        },
      },
    },
  });

  if (!project) return c.json({ error: "Project not found" }, 404);

  const members = await db
    .select()
    .from(schema.projMemberships)
    .where(eq(schema.projMemberships.projId, projectId));

  const volunteerCount = members.length;

  const applications = await db
    .select({
      id: schema.applications.id,
      userId: schema.applications.userId,
      status: schema.applications.status,
      motivation: schema.applications.motivation,
      submittedAt: schema.applications.submittedAt,
      applicantName: schema.user.name,
      applicantEmail: schema.user.email,
    })
    .from(schema.applications)
    .leftJoin(schema.user, eq(schema.user.id, schema.applications.userId))
    .where(eq(schema.applications.projectId, projectId));

  return c.json({
    project: {
      ...project,
      volunteerCount,
      orgName: project.org?.user?.name ?? null,
    },
    applications: applications.map((a) => ({
      id: a.id,
      userId: a.userId,
      status: a.status,
      motivation: a.motivation,
      submittedAt: a.submittedAt,
      applicant: {
        name: a.applicantName,
        email: a.applicantEmail,
      },
    })),
  });
});


export default listing;
