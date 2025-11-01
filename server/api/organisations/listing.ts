// server/api/organisations/listing.ts
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { createApp } from "#server/factory.ts";
import { organisationMiddleware } from "#server/middlewares/auth.ts";
import { extractCoordsFromGoogleMaps } from "#server/helper/index.ts";
import { ok } from "#server/helper/index.ts";


const listing = createApp();
// Define validation schema for the incoming request
const ProjectCreateSchema = z.object({
  title: z.string().min(1),
  summary: z.string(),
  category: z.string(),
  project_type: z.enum(["local", "overseas"]),
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
  start_date: z.string(),           // ✅ just string
  end_date: z.string(),             // ✅ just string
  application_deadline: z.string(), // ✅ just string
  commitable_hours: z.number(),
  slots: z.number(),
  image_url: z.string(),
  project_tags: z.array(z.string()).default([]),
});

listing.post("/new", async (c) => {
  try {
  const body = await c.req.json();
  const parsed = ProjectCreateSchema.parse(body);

  // Example: get orgId from current session (pseudo)
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
    console.error("❌ Project creation failed:", err);
    return c.json(
      { error: "Error", details: err instanceof Error ? err.message : err },
      500
    );
  }
});

listing.delete("/delete")

listing.get("/:projectId", async (c) => {
  const projectId = c.req.param("projectId");

  // --- Fetch project + org info ---
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

  // --- Count current members ---
  const members = await db
    .select()
    .from(schema.projMemberships)
    .where(eq(schema.projMemberships.projId, projectId));

  const volunteerCount = members.length;

  // --- Fetch applications + join with user ---
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

  // --- Respond to frontend ---
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
