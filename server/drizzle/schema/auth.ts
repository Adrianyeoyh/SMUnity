import { boolean, integer, pgTable, text, timestamp, varchar, jsonb, decimal } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  // SMU-specific fields
  studentId: varchar("student_id", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  yearOfStudy: integer("year_of_study"),
  major: text("major"),
  skills: jsonb("skills").$type<string[]>().$defaultFn(() => []),
  interests: jsonb("interests").$type<string[]>().$defaultFn(() => []),
  totalServiceHours: integer("total_service_hours").$defaultFn(() => 0),
  isCspLeader: boolean("is_csp_leader").$defaultFn(() => false),
  organizationId: text("organization_id"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

// Organizations table
export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  website: text("website"),
  email: text("email").notNull(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  logo: text("logo"),
  isVerified: boolean("is_verified").$defaultFn(() => false),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// CSP Projects table
export const cspProject = pgTable("csp_project", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdById: text("created_by_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // Project details
  category: text("category").notNull(), // e.g., "Education", "Environment", "Healthcare"
  skills: jsonb("skills").$type<string[]>().$defaultFn(() => []),
  requirements: text("requirements"),
  // Location and timing
  location: text("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isRemote: boolean("is_remote").$defaultFn(() => false),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  applicationDeadline: timestamp("application_deadline").notNull(),
  // Capacity and status
  maxVolunteers: integer("max_volunteers").notNull(),
  currentVolunteers: integer("current_volunteers").$defaultFn(() => 0),
  serviceHours: integer("service_hours").notNull(),
  isApproved: boolean("is_approved").$defaultFn(() => false),
  isActive: boolean("is_active").$defaultFn(() => true),
  // Additional info
  images: jsonb("images").$type<string[]>().$defaultFn(() => []),
  tags: jsonb("tags").$type<string[]>().$defaultFn(() => []),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Applications table
export const application = pgTable("application", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  cspProjectId: text("csp_project_id")
    .notNull()
    .references(() => cspProject.id, { onDelete: "cascade" }),
  status: text("status").notNull().$defaultFn(() => "pending"), // pending, approved, rejected, withdrawn
  motivation: text("motivation"),
  relevantExperience: text("relevant_experience"),
  availability: text("availability"),
  additionalNotes: text("additional_notes"),
  appliedAt: timestamp("applied_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: text("reviewed_by").references(() => user.id),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Favorites/Bookmarks table
export const favorite = pgTable("favorite", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  cspProjectId: text("csp_project_id")
    .notNull()
    .references(() => cspProject.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Notifications table
export const notification = pgTable("notification", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // application_status, new_csp, reminder, etc.
  isRead: boolean("is_read").$defaultFn(() => false),
  relatedId: text("related_id"), // ID of related CSP, application, etc.
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Service hours tracking
export const serviceHours = pgTable("service_hours", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  cspProjectId: text("csp_project_id")
    .notNull()
    .references(() => cspProject.id, { onDelete: "cascade" }),
  applicationId: text("application_id")
    .notNull()
    .references(() => application.id, { onDelete: "cascade" }),
  hours: integer("hours").notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  isVerified: boolean("is_verified").$defaultFn(() => false),
  verifiedBy: text("verified_by").references(() => user.id),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});
