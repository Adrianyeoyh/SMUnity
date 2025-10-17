// server/drizzle/schema/domain.ts
import {
  pgTable, text, varchar, integer, serial, timestamp, boolean, jsonb, uuid,
  primaryKey, uniqueIndex, index, pgEnum, real, customType
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ---------- Enums ----------
export const accountTypeEnum = pgEnum("account_type", ["student","external","admin"]);
export const projectStatusEnum = pgEnum("project_status", ["draft","pending","approved","closed","archived"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending","accepted","rejected","waitlisted","withdrawn","cancelled"]);
export const verificationActionEnum = pgEnum("verification_action", ["submitted","approved","rejected","closed","reopened"]);
export const attachmentOwnerEnum = pgEnum("attachment_owner", ["project","organization","profile","application"]);
export const requirementTypeEnum = pgEnum("requirement_type", ["CSU_MODULE","ONTRAC"]);
export const notificationTypeEnum = pgEnum("notification_type", ["info","warning","success","action"]);
export const interviewOutcomeEnum = pgEnum("interview_outcome", ["pending","pass","fail","no_show","reschedule"]);
export const orgRoleEnum = pgEnum("org_role", ["leader","member"]);
export const requestStatusEnum = pgEnum("request_status", [
  "pending",
  "approved",
  "rejected",
]);


// ---------- Auth bridge (app profile layered on template's auth.user) ----------
export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey(),
  externalProvider: varchar("external_provider", { length: 50 }),
  externalUserId: varchar("external_user_id", { length: 190 }),
  displayName: varchar("display_name", { length: 120 }),
  phone: varchar("phone", { length: 50 }),
  accountType: accountTypeEnum("account_type").notNull().default("student"),
  skills: text("skills").array(),
  interests: text("interests").array(),
  csuCompletedAt: timestamp("csu_completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (t) => ({
  extIdx: uniqueIndex("profiles_ext_provider_user").on(t.externalProvider, t.externalUserId),
}));

// ---------- Organizations & membership (leaders/admins manage CSPs) ----------
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 160 }).notNull(),
  description: text("description"),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 255 }),
  createdBy: text("created_by").notNull(), // FK → auth.user.id (text)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (t) => ({
  slugUnique: uniqueIndex("org_slug_unique").on(t.slug),
  creatorIdx: index("org_created_by_idx").on(t.createdBy),
}));

export const orgMemberships = pgTable("org_memberships", {
  orgId: integer("org_id").notNull(),
  userId: text("user_id").notNull(),
  role: orgRoleEnum("role").notNull().default("member"),
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at"),
}, (t) => ({
  pk: primaryKey({ columns: [t.orgId, t.userId] }),
  byUser: index("org_memberships_user_idx").on(t.userId),
}));

// ---------- Taxonomies ----------
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

// ---------- Projects & sessions ----------
const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),                    // FK → organizations.id
  title: varchar("title", { length: 255 }).notNull(),
  summary: varchar("summary", { length: 500 }),
  description: text("description").notNull(),
  categoryId: integer("category_id"),                    // optional primary category
  // Location
  location: varchar("location", { length: 255 }),
  addressLine1: varchar("address_line1", { length: 255 }),
  addressLine2: varchar("address_line2", { length: 255 }),
  city: varchar("city", { length: 120 }),
  postalCode: varchar("postal_code", { length: 20 }),
  latitude: real("latitude"),
  longitude: real("longitude"),
  // Capacity
  slotsTotal: integer("slots_total").notNull().default(0),
  slotsFilled: integer("slots_filled").notNull().default(0),
  // Publishing & approvals
  status: projectStatusEnum("status").notNull().default("pending"),
  createdBy: text("created_by").notNull(),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at"),
  // Search support: tsvector (optional, can be maintained via trigger)
  search: tsvector("search"),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (t) => ({
  idxOrg: index("projects_org_idx").on(t.orgId),
  idxStatus: index("projects_status_idx").on(t.status),
  idxGeo: index("projects_geo_idx").on(t.latitude, t.longitude),
  idxCategory: index("projects_category_idx").on(t.categoryId),
}));

export const projectTags = pgTable("project_tags", {
  projectId: integer("project_id").notNull(),
  tagId: integer("tag_id").notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.projectId, t.tagId] }),
}));

// Multi-date sessions for each project (map/calendar)
export const projectSessions = pgTable("project_sessions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  capacity: integer("capacity"),
  locationNote: varchar("location_note", { length: 255 }),
}, (t) => ({
  byProject: index("sessions_project_idx").on(t.projectId),
  byTime: index("sessions_time_idx").on(t.startsAt),
}));

// ---------- Applications & reviews ----------
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: text("user_id").notNull(), // applicant (auth.user.id)
  status: applicationStatusEnum("status").notNull().default("pending"),
  // optional: target session if required
  sessionId: integer("session_id"),
  motivation: text("motivation"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  decidedAt: timestamp("decided_at"),
}, (t) => ({
  uniqOnePerUserPerProject: uniqueIndex("uniq_applicant_project").on(t.projectId, t.userId),
  byProject: index("apps_project_idx").on(t.projectId),
  byUser: index("apps_user_idx").on(t.userId),
  byStatus: index("apps_status_idx").on(t.status),
}));

export const applicationReviews = pgTable("application_reviews", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(),
  reviewerId: text("reviewer_id").notNull(), // org leader/admin
  action: verificationActionEnum("action").notNull(), // approved/rejected/etc.
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  byApp: index("app_reviews_app_idx").on(t.applicationId),
}));

// Optional: interview scheduling (stretch)
export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  interviewerId: text("interviewer_id").notNull(),
  mode: varchar("mode", { length: 40 }), // online/offline
  location: varchar("location", { length: 255 }),
  outcome: interviewOutcomeEnum("outcome").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  byApp: index("interviews_app_idx").on(t.applicationId),
  byTime: index("interviews_time_idx").on(t.scheduledAt),
}));

// ---------- Timesheets (hours, verification for SMU alignment) ----------
export const timesheets = pgTable("timesheets", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: text("user_id").notNull(),
  sessionId: integer("session_id"),
  date: timestamp("date").notNull(),
  hours: integer("hours").notNull(),
  description: varchar("description", { length: 300 }),
  verified: boolean("verified").notNull().default(false),
  verifiedBy: text("verified_by"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  byUser: index("timesheets_user_idx").on(t.userId),
  byProject: index("timesheets_project_idx").on(t.projectId),
  byVerified: index("timesheets_verified_idx").on(t.verified),
}));

// ---------- Requirements compliance (CSU / OnTrac flags) ----------
export const userRequirements = pgTable("user_requirements", {
  userId: text("user_id").notNull(),
  type: requirementTypeEnum("type").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.type] }),
}));

// ---------- Notifications (in-app) ----------
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: notificationTypeEnum("type").notNull().default("info"),
  title: varchar("title", { length: 160 }),
  message: text("message").notNull(),
  link: varchar("link", { length: 255 }),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  byUserRead: index("notif_user_read_idx").on(t.userId, t.isRead),
}));

// ---------- Outbox emails (Maildev in docker) ----------
export const emailOutbox = pgTable("email_outbox", {
  id: serial("id").primaryKey(),
  toEmail: varchar("to_email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  bodyHtml: text("body_html"),
  bodyText: text("body_text"),
  sent: boolean("sent").notNull().default(false),
  sendAfter: timestamp("send_after").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
  meta: jsonb("meta"), // store correlation ids (userId, applicationId, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  bySent: index("email_outbox_sent_idx").on(t.sent),
}));
// Justification: docker includes Maildev for local email flows.

// ---------- Announcements (email blasts) ----------
export const announcementCampaigns = pgTable("announcement_campaigns", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  bodyMarkdown: text("body_markdown").notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
});

// ---------- Attachments (MinIO/S3 objects) ----------
export const attachments = pgTable("attachments", {
  id: serial("id").primaryKey(),
  ownerType: attachmentOwnerEnum("owner_type").notNull(),
  ownerId: text("owner_id").notNull(), // project/org/profile/application
  bucket: varchar("bucket", { length: 100 }).notNull(), // from env AWS_S3_BUCKET
  objectKey: varchar("object_key", { length: 500 }).notNull(),
  mimeType: varchar("mime_type", { length: 120 }),
  sizeBytes: integer("size_bytes"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  ownerIdx: index("attachments_owner_idx").on(t.ownerType, t.ownerId),
}));

// ---------- Saved projects (wishlist) ----------
export const savedProjects = pgTable("saved_projects", {
  projectId: integer("project_id").notNull(),
  userId: text("user_id").notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.projectId, t.userId] }),
  byUser: index("saved_user_idx").on(t.userId),
}));

// ---------- Verification / moderation journal for projects ----------
export const projectVerificationLog = pgTable("project_verification_log", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  actorId: text("actor_id").notNull(),
  action: verificationActionEnum("action").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  byProject: index("verify_project_idx").on(t.projectId),
}));

// ---------- Audit events (append-only) ----------
export const auditEvents = pgTable("audit_events", {
  id: serial("id").primaryKey(),
  actorId: text("actor_id"),
  entityType: varchar("entity_type", { length: 60 }).notNull(),
  entityId: text("entity_id").notNull(),
  action: varchar("action", { length: 60 }).notNull(),
  detail: jsonb("detail"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  byEntity: index("audit_entity_idx").on(t.entityType, t.entityId),
}));

export const organiserInvites = pgTable("organiser_invites", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull(),               // random string
  approved: boolean("approved").notNull().default(true),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const organizationRequests = pgTable("organization_requests", {
  id: serial("id").primaryKey(),
  requestedByUserId: text("requested_by_user_id"), // nullable for external non-SMU
  requesterEmail: text("requester_email").notNull(), // external email for non-SMU
  requesterName: text("requester_name"),
  orgName: varchar("org_name", { length: 160 }).notNull(),
  orgDescription: text("org_description"),
  website: varchar("website", { length: 255 }),
  // optional: document links / attachment ids
  status: requestStatusEnum("status").notNull().default("pending"),
  decidedBy: text("decided_by"),
  decidedAt: timestamp("decided_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
