// server/drizzle/schema/domain.ts
import {
  pgTable, text, varchar, integer, serial, timestamp, boolean, jsonb, uuid,
  primaryKey, uniqueIndex, index, pgEnum, real, customType
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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

// ---------- USERS (unified authentication root) ----------
export const users = pgTable("users", {
  id: text("user_id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
  .$defaultFn(() => false)
  .notNull(),
  image: text("image"),
  passwordHash: varchar("password_hash", { length: 255 }), // null for OAuth students
  accountType: accountTypeEnum("account_type").notNull().default("student"),   // student | organisation | admin
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at")
  .$defaultFn(() => /* @__PURE__ */ new Date())
  .notNull(),
  updatedAt: timestamp("updated_at")
  .$defaultFn(() => /* @__PURE__ */ new Date())
  .notNull(),
});

// ---------- PROFILES (extended user info) ----------
export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey().references(() => users.id),
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
  userId: text("user_id").primaryKey().references(() => users.id).notNull(),
  slug: varchar("slug", { length: 160 }).notNull(),
  description: text("description"),
  website: varchar("website", { length: 255 }),
  createdBy: text("created_by").references(() => users.id).notNull(), // admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (t) => ({
  slugUnique: uniqueIndex("org_slug_unique").on(t.slug),
  userUnique: uniqueIndex("org_user_unique").on(t.userId),
  creatorIdx: index("org_created_by_idx").on(t.createdBy),
}));

// ---------- MEMBERSHIPS ----------
export const orgMemberships = pgTable("org_memberships", {
  orgId: text("org_id").notNull().references(() => organisations.userId),
  userId: text("user_id").notNull().references(() => profiles.userId),
  roleLabel: varchar("role_label", { length: 50 }),
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at"),
}, (t) => ({
  pk: primaryKey({ columns: [t.orgId, t.userId] }),
  byUser: index("org_memberships_user_idx").on(t.userId),
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
  id: serial("project_id").primaryKey(),
  orgId: text("org_id").references(() => organisations.userId).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: varchar("summary", { length: 500 }),
  description: text("description").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  location: varchar("location", { length: 255 }),
  addressLine1: varchar("address_line1", { length: 255 }),
  addressLine2: varchar("address_line2", { length: 255 }),
  city: varchar("city", { length: 120 }),
  postalCode: varchar("postal_code", { length: 20 }),
  latitude: real("latitude"),
  longitude: real("longitude"),
  slotsTotal: integer("slots_total").notNull().default(0),
  slotsFilled: integer("slots_filled").notNull().default(0),
  status: projectStatusEnum("status").notNull().default("pending"),
  createdBy: text("created_by").references(() => users.id).notNull(),
  approvedBy: text("approved_by").references(() => users.id), 
  approvedAt: timestamp("approved_at"),
  search: tsvector("search"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  idxOrg: index("projects_org_idx").on(t.orgId),
  idxStatus: index("projects_status_idx").on(t.status),
  idxGeo: index("projects_geo_idx").on(t.latitude, t.longitude),
}));

export const projectTags = pgTable("project_tags", {
  projectId: integer("project_id").notNull().references(() => projects.id),
  tagId: integer("tag_id").notNull().references(() => tags.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.projectId, t.tagId] }),
}));

export const projectSessions = pgTable("project_sessions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
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
  projectId: integer("project_id").notNull().references(() => projects.id),
  userId: text("user_id").references(() => users.id).notNull(),
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
  projectId: integer("project_id").notNull().references(()=>projects.id),
  userId: text("user_id").references(() => profiles.userId).notNull(),
  sessionId: integer("session_id").references(() => projectSessions.id),
  date: timestamp("date").notNull(),
  hours: integer("hours").notNull(),
  description: varchar("description", { length: 300 }),
  verified: boolean("verified").notNull().default(false),
  verifiedBy: text("verified_by").references(() => users.id),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- SAVED PROJECTS ----------
export const savedProjects = pgTable("saved_projects", {
  projectId: integer("project_id").notNull().references(()=>projects.id),
  userId: text("user_id").references(() => profiles.userId).notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.projectId, t.userId] }),
  byUser: index("saved_user_idx").on(t.userId),
}));

// ---------- ORGANISATION INVITES ----------
export const organiserInvites = pgTable("organiser_invites", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull(),
  approved: boolean("approved").notNull().default(true),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const organisationRequests = pgTable("organisation_requests", {
  id: serial("id").primaryKey(),
  requesterUserId: text("requested_by_user_id"),
  requesterEmail: text("requester_email").notNull(), // external email for non-SMU
  requesterName: text("requester_name"),
  orgName: varchar("org_name", { length: 160 }).notNull(),
  orgDescription: text("org_description"),
  website: varchar("website", { length: 255 }),
  status: requestStatusEnum("status").notNull().default("pending"),
  decidedBy: text("decided_by").references(() => users.id),
  decidedAt: timestamp("decided_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  requesterIdx: index("org_requests_email_idx").on(t.requesterEmail),
  statusIdx: index("org_requests_status_idx").on(t.status),
}));
