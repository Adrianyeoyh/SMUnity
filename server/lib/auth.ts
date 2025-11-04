import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { openAPI } from "better-auth/plugins";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { env } from "#server/env";
import { mailer } from "#server/lib/mailer";
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
  getSessionUser: async (userId: string) => {
    const [user] = await db.select().from(schema.user).where(eq(schema.user.id, userId));
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      accountType: user.accountType,
    };
  },

  plugins: [openAPI({ path: "/docs" })],

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const email = user.email?.toLowerCase() ?? "";
          const isSMUDomain = email.endsWith("@smu.edu.sg");
          const studentMatch = email.match(/\.?(\d{4})@smu\.edu\.sg$/);
          const isStudent = Boolean(studentMatch);

          // 🧠 CASE 1: SMU student → allowed
          if (isSMUDomain && isStudent) {
            return { data: user };
          }

          // 🧠 CASE 2: SMU staff or professor → must be verified organiser
          if (isSMUDomain && !isStudent) {
            const [orgReq] = await db
              .select()
              .from(schema.organisationRequests)
              .where(and(
                eq(schema.organisationRequests.requesterEmail, email),
                eq(schema.organisationRequests.status, "approved")
              ));

            if (!orgReq) {
              throw new APIError("FORBIDDEN", {
                message:
                  "This SMU email is not recognised as a student or approved organisation. Please request organiser access first.",
              });
            }

            // Organisation request approved → allow account creation
            return { data: user };
          }

          // 🧠 CASE 3: external organiser (non-SMU domain)
          return { data: user };
        },


       after: async (user) => {
        const email = user.email?.toLowerCase() ?? "";
        const studentMatch = email.match(/\.?(\d{4})@smu\.edu\.sg$/);
        const isStudent = Boolean(studentMatch);
        const accountType = isStudent ? "student" : "organisation";

        await db
          .update(schema.user)
          .set({
            accountType,
            isActive: true,
            updatedAt: new Date(),
          })
          .where(eq(schema.user.id, user.id));

        // 🧭 Student setup
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
          return;
        }

        // 🧭 Organisation setup
        const [orgReq] = await db
          .select()
          .from(schema.organisationRequests)
          .where(and(
            eq(schema.organisationRequests.requesterEmail, email),
            eq(schema.organisationRequests.status, "approved")
          ));

        // only create if an approved org request exists
        if (orgReq) {
          const slug = orgReq.orgName.toLowerCase().trim().replace(/[\s\W-]+/g, "-");
          await db
            .insert(schema.organisations)
            .values({
              userId: user.id,
              slug,
              description: orgReq.orgDescription ?? null,
              website: orgReq.website ?? null,
              phone: orgReq.phone ?? null,
              createdBy: orgReq.decidedBy ?? user.id,
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
