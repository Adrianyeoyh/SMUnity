import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { openAPI } from "better-auth/plugins";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { env } from "#server/env";
import { mailer } from "#server/lib/mailer.ts";
import { and, eq, gt } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      account: schema.account,
      session: schema.session,
      verification: schema.verification,
    },
  }),
  user: {
    additionalFields: {
      isActive: {
        type: 'boolean',
        required: true,
        defaultValue: true,
        input: true, // Allows user to set this field during registration or profile updates
      },
      // Add other custom fields as needed
      accountType: {
        type: 'string',
        required: true,
        defaultValue: 'student',
        input: false, // Hides this field from user input
      },
    },
  },

  baseURL: env.VITE_APP_URL + "/api/auth",
  secret: env.BETTER_AUTH_SECRET,
  telemetry: { enabled: false },
  cookies: {
    domain: "localhost",   // applies to all localhost ports
    sameSite: "lax",       // allows cross-site (cross-port) requests
    secure: false,         // true only for HTTPS in production
  },

  // ── Email + Password for organisers
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await mailer.sendMail({
        to: user.email,
        subject: "Reset your SMUnity password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },

  // ── Google OAuth restricted to SMU workspace (students only)
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      hostedDomain: "smu.edu.sg",
    },
  },

  // ── Email verification for organisers
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await mailer.sendMail({
        to: user.email,
        subject: "Verify your email",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },

  plugins: [openAPI({ path: "/docs" })],

  // ── Role assignment and linked record creation
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const email = user.email?.toLowerCase() ?? "";

          const isSMUDomain = email.endsWith("@smu.edu.sg");
          const studentMatch = email.match(/\.?(\d{4})@smu\.edu\.sg$/);
          const isStudent = Boolean(studentMatch);

          // 🧠 CASE 1: SMU student (Google OAuth)
          if (isSMUDomain && isStudent) {
            return { data: user };
          }

          // 🧠 CASE 2: SMU staff or professor (no year in email)
          if (isSMUDomain && !isStudent) {
            throw new APIError("FORBIDDEN", {
              message: "SMU staff and faculty are not eligible for student accounts.",
            });
          }
          return { data: user };
        },

        after: async (user) => {
          const email = user.email?.toLowerCase() ?? "";
          const studentMatch = email.match(/\.?(\d{4})@smu\.edu\.sg$/);
          const isStudent = Boolean(studentMatch);
          const accountType = isStudent ? "student" : "organisation";
          // 🧭 Update users table

          // if (email === "admin@smunity.sg") {
          //   await db
          //     .update(schema.users)
          //     .set({
          //       accountType: "admin",
          //       isActive: true,
          //       updatedAt: new Date(),
          //     })
          //     .where(eq(schema.users.id, user.id));

          //   // ✅ nothing to return
          //   return;
          // }

          await db
            .update(schema.user)
            .set({
              accountType,
              isActive: true,
              updatedAt: new Date(),
            })
            .where(eq(schema.user.id, user.id));

          // 🧭 Students → create profile row
          if (isStudent) {
            const entryYear = studentMatch ? Number(studentMatch[1]) : null;

            await db
              .insert(schema.profiles)
              .values({
                userId: user.id,
                school: null,
                entryYear,
                skills: [],
                interests: [],
              })
              .onConflictDoNothing();
          }

          // 🧭 Organisers → create organisation row
          if (!isStudent) {
            // Derive basic slug from email (before @)
            const slug = email.split("@")[0].replace(/[^a-z0-9]+/g, "-");

            await db
              .insert(schema.organisations)
              .values({
                userId: user.id,
                slug,
                description: null,
                website: null,
                createdBy: user.id,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
              .onConflictDoNothing();
          }
        },
      },
    },
  },
});
