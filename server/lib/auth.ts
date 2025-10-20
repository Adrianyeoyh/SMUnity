// server/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { env } from "#server/env";
import { mailer } from "#server/lib/mailer.ts";
import { and, eq, gt } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema: {
      user: schema.users, 
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    } }),
  baseURL: env.VITE_APP_URL + "/api/auth",
  secret: env.BETTER_AUTH_SECRET,
  telemetry: { enabled: false },

  // --- External invited organisers use email/password ---
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await mailer.sendMail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await mailer.sendMail({
        to: user.email,
        subject: "Verify your email",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },

  // --- SMU students use Google OAuth restricted to their workspace ---
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      hostedDomain: "smu.edu.sg",
    },
  },

  plugins: [openAPI({ path: "/docs" })],

  // --- Event-based hooks (no import needed) ---
  events: {
    /**
     * Runs when a new user is created via BetterAuth (email/password or OAuth)
     */
    async userCreated(ctx: any) {
      const { user, database } = ctx;
      const email = user.email?.toLowerCase() ?? "";
      const isSMU = email.endsWith("@smu.edu.sg");

      // 1️⃣ Check organiser invite for non-SMU accounts
      let accountType: "student" | "organisation" | "admin" = "student";
      if (!isSMU) {
        const invite = await database.query.organiserInvites.findFirst({
          where: (t: any, { and, eq, gt }: any) =>
            and(
              eq(t.email, email),
              eq(t.approved, true),
              gt(t.expiresAt, new Date())
            ),
        });

        if (!invite) {
          throw new Error(
            "Only invited organisers may register manually. Please request approval from SMUnity admin."
          );
        }

        accountType = "organisation";

        // Consume the invite after successful registration
        await database
          .delete(schema.organiserInvites)
          .where(eq(schema.organiserInvites.email, email));
      }

      // 2️⃣ Ensure unified users table has a complete record (BetterAuth inserts basic fields)
      await database
        .update(schema.users)
        .set({
          name: user.name ?? email.split("@")[0],
          accountType,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, user.id));

      // 3️⃣ Create profile entry for new user
      await database
        .insert(schema.profiles)
        .values({
          userId: user.id,
          phone: null,
          school: null,
          entryYear: null,
          skills: [],
          interests: [],
        })
        .onConflictDoNothing();
    },
  },
});