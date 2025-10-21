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
      user: schema.users,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  baseURL: env.VITE_APP_URL + "/api/auth",
  secret: env.BETTER_AUTH_SECRET,
  telemetry: { enabled: false },

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

          // 🧠 CASE 3: External organiser (must have valid invite)
          const invite = await db.query.organiserInvites.findFirst({
            where: (t, { and, eq, gt }) =>
              and(eq(t.email, email), eq(t.approved, true), gt(t.expiresAt, new Date())),
          });

          if (!invite) {
            throw new APIError("BAD_REQUEST", {
              message:
                "Only invited organisers may register manually. Please request approval from SMUnity admin.",
            });
          }

          // Consume invite after successful validation
          await db
            .delete(schema.organiserInvites)
            .where(eq(schema.organiserInvites.email, email));

          return { data: user };
        },

        after: async (user) => {
          const email = user.email?.toLowerCase() ?? "";
          const studentMatch = email.match(/\.?(\d{4})@smu\.edu\.sg$/);
          const isStudent = Boolean(studentMatch);
          const accountType = isStudent ? "student" : "organisation";

          // 🧭 Update users table
          await db
            .update(schema.users)
            .set({
              accountType,
              isActive: true,
              updatedAt: new Date(),
            })
            .where(eq(schema.users.id, user.id));

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
