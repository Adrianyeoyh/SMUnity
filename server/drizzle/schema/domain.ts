// server/drizzle/schema/domain.ts
import {
  pgTable, text, varchar, integer, serial, timestamp, boolean, jsonb, uuid,
  primaryKey, uniqueIndex, index, pgEnum, real, customType
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";

// ---------- Enums ----------
export const accountTypeEnum = pgEnum("account_type", ["student", "organisation", "admin"]);
export const projectStatusEnum = pgEnum("project_status", ["draft", "pending", "approved", "closed", "archived"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "accepted", "rejected", "waitlisted", "withdrawn", "cancelled"]);
export const verificationActionEnum = pgEnum("verification_action", ["submitted", "approved", "rejected", "closed", "reopened"]);
export const attachmentOwnerEnum = pgEnum("attachment_owner", ["project", "organisation", "profile", "application"]);
export const requirementTypeEnum = pgEnum("requirement_type", ["CSU_MODULE", "ONTRAC"]);
export const notificationTypeEnum = pgEnum("notification_type", ["info", "warning", "success", "action"]);
export const interviewOutcomeEnum = pgEnum("interview_outcome", ["pending", "pass", "fail", "no_show", "reschedule"]);
export const requestStatusEnum = pgEnum("request_status", ["pending", "approved", "rejected"]);

// ---------- PROFILES (extended user info) ----------
export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey().references(() => user.id),
  phone: varchar("phone", { length: 50 }),

  // ---- Student fields ----
  studentId: varchar("student_id", { length: 20 }), // e.g., S1234567A
  entryYear: integer("entry_year"),
  school: varchar("school", { length: 100 }),

  // ---- Additional metadata ----
  skills: text("skills").array(),
  interests: text("interests").array(),
  csuCompletedAt: timestamp("csu_completed_at"),

}, (t) => ({
  studentIdUnique: uniqueIndex("profiles_student_id_unique").on(t.studentId),
}));

// ---------- ORGANISATIONS (CSP providers) ----------
export const organisations = pgTable("organisations", {
  userId: text("user_id").primaryKey().references(() => user.id).notNull(),
  slug: varchar("slug", { length: 160 }).notNull(),
  description: text("description"),
  website: varchar("website", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  createdBy: text("created_by").references(() => user.id).notNull(), // admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (t) => ({
  slugUnique: uniqueIndex("org_slug_unique").on(t.slug),
  userUnique: uniqueIndex("org_user_unique").on(t.userId),
  creatorIdx: index("org_created_by_idx").on(t.createdBy),
}));

// ---------- MEMBERSHIPS ----------
export const projMemberships = pgTable("project_memberships", {
  projId: uuid("project_id").notNull().references(() => projects.id),
  userId: text("user_id").notNull().references(() => profiles.userId),
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at"),
}, (t) => ({
  pk: primaryKey({ columns: [t.projId, t.userId] }),
  byUser: index("proj_memberships_user_idx").on(t.userId),
}));

// ---------- TAXONOMIES ----------
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull(),
}, (t) => ({
  catSlugUnique: uniqueIndex("category_slug_unique").on(t.slug),
}));

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 60 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull(),
}, (t) => ({
  tagSlugUnique: uniqueIndex("tag_slug_unique").on(t.slug),
}));

// ---------- PROJECTS ----------
const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const projects = pgTable("projects", {
  // existing columns...
  id: uuid("project_id").defaultRandom().primaryKey(),
  orgId: text("org_id").references(() => organisations.userId).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: varchar("summary", { length: 500 }),
  description: text("description").notNull(),
  requiredHours: integer("required_hours").notNull().default(0),

  categoryId: integer("category_id").references(() => categories.id),
  type: varchar("type", { length: 20 }).default("local").notNull(), // <-- NEW (local/overseas)
  location: varchar("location", { length: 255 }),
  isRemote: boolean("is_remote").default(false).notNull(), // <-- NEW
  applyBy: timestamp("apply_by"), // <-- NEW
  imageUrl: varchar("image_url", { length: 255 }), // <-- NEW

  aboutProvide: text("about_provide"),
  aboutDo: text("about_do"),
  skillsRequired: text("skills_required"),

  slotsTotal: integer("slots_total").notNull().default(0),
  slotsFilled: integer("slots_filled").notNull().default(0),
  status: projectStatusEnum("status").notNull().default("pending"),

  latitude: real("latitude"),
  longitude: real("longitude"),

  createdBy: text("created_by").references(() => user.id).notNull(),
  approvedBy: text("approved_by").references(() => user.id),
  approvedAt: timestamp("approved_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectTags = pgTable("project_tags", {
  projectId: uuid("project_id").notNull().references(() => projects.id),
  tagId: integer("tag_id").notNull().references(() => tags.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.projectId, t.tagId] }),
}));

export const projectSessions = pgTable("project_sessions", {
  id: serial("id").primaryKey(),
  projectId: uuid("project_id").notNull().references(() => projects.id),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  capacity: integer("capacity"),
  locationNote: varchar("location_note", { length: 255 }),
}, (t) => ({
  byProject: index("sessions_project_idx").on(t.projectId),
  byTime: index("sessions_time_idx").on(t.startsAt),
}));

// ---------- APPLICATIONS ----------
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  projectId: uuid("project_id").notNull().references(() => projects.id),
  userId: text("user_id").references(() => user.id).notNull(),
  status: applicationStatusEnum("status").notNull().default("pending"),
  sessionId: integer("session_id").references(() => projectSessions.id),
  motivation: text("motivation"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  decidedAt: timestamp("decided_at"),
}, (t) => ({
  uniqOnePerUserPerProject: uniqueIndex("uniq_applicant_project").on(t.projectId, t.userId),
  byProject: index("apps_project_idx").on(t.projectId),
  byUser: index("apps_user_idx").on(t.userId),
}));

export const applicationReviews = pgTable("application_reviews", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull().references(() => applications.id),
  action: verificationActionEnum("action").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- TIMESHEETS ----------
export const timesheets = pgTable("timesheets", {
  id: serial("id").primaryKey(),
  projectId: uuid("project_id").notNull().references(()=>projects.id),
  userId: text("user_id").references(() => profiles.userId).notNull(),
  sessionId: integer("session_id").references(() => projectSessions.id),
  date: timestamp("date").notNull(),
  hours: integer("hours").notNull(),
  description: varchar("description", { length: 300 }),
  verified: boolean("verified").notNull().default(false),
  verifiedBy: text("verified_by").references(() => user.id),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- SAVED PROJECTS ----------
export const savedProjects = pgTable("saved_projects", {
  projectId: uuid("project_id").notNull().references(()=>projects.id),
  userId: text("user_id").references(() => profiles.userId).notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.projectId, t.userId] }),
  byUser: index("saved_user_idx").on(t.userId),
}));


export const organisationRequests = pgTable("organisation_requests", { 
  id: uuid("id").defaultRandom().primaryKey(), // ✅ UUID PK
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

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => user.id).notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});