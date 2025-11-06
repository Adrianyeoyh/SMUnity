// server/drizzle/schema/domain.ts
import {
  pgTable, text, varchar, integer, serial, timestamp, boolean, jsonb, uuid,
  primaryKey, uniqueIndex, index, pgEnum, real, customType,
  time,
  date
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { user } from "./auth";
import { url } from "inspector";

// ---------- Enums ----------
export const accountTypeEnum = pgEnum("account_type", ["student", "organisation", "admin"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "accepted", "rejected", "confirmed", "withdrawn", "cancelled"]);
//pending means user has sent an application
//accepted means org has accepted application
//rejected means org has rejected
//confirmed means user has confirmed the application
//withdrawn means user has withdrawn the application
//cancelled mean user has cancelled the application before org made a decision
export const verificationActionEnum = pgEnum("verification_action", ["submitted", "approved", "rejected", "closed", "reopened"]);
export const attachmentOwnerEnum = pgEnum("attachment_owner", ["project", "organisation", "profile", "application"]);
export const requirementTypeEnum = pgEnum("requirement_type", ["CSU_MODULE", "ONTRAC"]);
export const notificationTypeEnum = pgEnum("notification_type", ["info", "warning", "success", "action"]);
export const interviewOutcomeEnum = pgEnum("interview_outcome", ["pending", "pass", "fail", "no_show", "reschedule"]);
export const requestStatusEnum = pgEnum("request_status", ["pending", "approved", "rejected"]);

export const organisationRequests = pgTable("organisation_requests", { 
  id: uuid("id").defaultRandom().primaryKey(), 
  requesterEmail: text("requester_email").notNull().unique(), // external email for non-SMU
  requesterName: text("requester_name"),
  orgName: varchar("org_name", { length: 160 }).notNull(),
  orgDescription: text("org_description"),
  website: varchar("website", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  status: requestStatusEnum("status").notNull().default("pending"),
  decidedBy: text("decided_by").references(() => user.id),
  decidedAt: timestamp("decided_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  comments: text("comments"),
}, (t) => ({
  requesterIdx: index("org_requests_email_idx").on(t.requesterEmail),
  statusIdx: index("org_requests_status_idx").on(t.status),
}));

// ---------- PROFILES (extended user info) ----------
export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey().references(() => user.id),
  phone: varchar("phone", { length: 50 }),

  // ---- Student fields ----
  studentId: varchar("student_id", { length: 20 }), 
  entryYear: integer("entry_year"),
  school: varchar("school", { length: 100 }),

  // ---- Additional metadata ----
  skills: text("skills").array(),
  interests: text("interests").array(),

}, (t) => ({
  studentIdUnique: uniqueIndex("profiles_student_id_unique").on(t.studentId),
}));

// ---------- ORGANISATIONS (CSP providers) ----------
export const organisations = pgTable(
  "organisations",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id)
      .notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    description: text("description"),
    website: varchar("website", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    suspended: boolean("suspended").default(false).notNull(),
    createdBy: text("created_by")
      .references(() => user.id)
      .notNull(), // admin
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => ({
    slugUnique: uniqueIndex("org_slug_unique").on(t.slug),
    userUnique: uniqueIndex("org_user_unique").on(t.userId),
    creatorIdx: index("org_created_by_idx").on(t.createdBy),
  }),
);

export const projects = pgTable("projects", {
  id: uuid("project_id").defaultRandom().primaryKey(),
  orgId: text("org_id").references(() => organisations.userId).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: varchar("summary", { length: 500 }),
  category: text("category"),
  type: varchar("type", { length: 20 }).default("local").notNull(), 
  country: varchar("country", { length: 100 }),  

  description: text("description").notNull(),
  aboutProvide: text("about_provide"),
  aboutDo: text("about_do"),
  requirements: text("requirements"),
  skillTags: text("skill_tags").array().default(sql`ARRAY[]::text[]`),

  district: varchar("district", { length: 120 }),
  googleMaps: varchar("google_maps", { length: 1024 }),
  latitude: real("latitude"),
  longitude: real("longitude"),
  isRemote: boolean("is_remote").default(false).notNull(),

  repeatInterval: integer("repeat_interval"),
  repeatUnit: varchar("repeat_unit", { length: 10 }),
  daysOfWeek: text("days_of_week").array(),
  timeStart: time("time_start"),
  timeEnd: time("time_end"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  applyBy: timestamp("apply_by"), 

  slotsTotal: integer("slots_total").notNull().default(0),
  requiredHours: integer("required_hours").notNull().default(0),
  imageUrl: varchar("image_url", { length: 1024 }), 
  projectTags: text("project_tags").array().default(sql`ARRAY[]::text[]`),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- MEMBERSHIPS ----------
export const projMemberships = pgTable("project_memberships", {
  projId: uuid("project_id").notNull().references(() => projects.id),
  userId: text("user_id").notNull().references(() => profiles.userId),
  acceptedAt: timestamp("accepted_at"),
}, (t) => ({
  pk: primaryKey({ columns: [t.projId, t.userId] }),
  byUser: index("proj_memberships_user_idx").on(t.userId),
}));

// ---------- PROJECTS ----------
const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),

  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id),

  userId: text("user_id")
    .notNull()
    .references(() => user.id),

  status: applicationStatusEnum("status")
    .notNull()
    .default("pending"),

  motivation: text("motivation").notNull(),

  experience: text("experience").notNull(), 
  skills: text("skills"), 
  comments: text("comments"), 
  acknowledgeSchedule: boolean("acknowledge_schedule").notNull().default(false),
  agree: boolean("agree").notNull().default(false),

  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  decidedAt: timestamp("decided_at"),
}, (t) => ({
  uniqOnePerUserPerProject: uniqueIndex("uniq_applicant_project").on(t.projectId, t.userId),
  byProject: index("apps_project_idx").on(t.projectId),
  byUser: index("apps_user_idx").on(t.userId),
}));


// ---------- SAVED PROJECTS ----------
export const savedProjects = pgTable("saved_projects", {
  projectId: uuid("project_id").notNull().references(()=>projects.id),
  userId: text("user_id").references(() => profiles.userId).notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.projectId, t.userId] }),
  byUser: index("saved_user_idx").on(t.userId),
}));

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => user.id).notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectRelations = relations(projects, ({ one, many }) => ({
  org: one(organisations, {
    fields: [projects.orgId],
    references: [organisations.userId],
  }),
  memberships: many(projMemberships),
  applications: many(applications),
}));

export const organisationRelations = relations(organisations, ({ one }) => ({
  user: one(user, {
    fields: [organisations.userId],
    references: [user.id],
  }),
}));