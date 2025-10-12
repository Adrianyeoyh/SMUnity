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
  database: drizzleAdapter(db, { provider: "pg", schema }),
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
    async userCreated(ctx: any) {
      const { user, database } = ctx;
      const email = user.email?.toLowerCase() ?? "";
      const isSMU = email.endsWith("@smu.edu.sg");

      if (!isSMU) {
        const invite = await database.query.organiserInvites.findFirst({
          where: (t:any, { and, eq, gt }: any) =>
            and(eq(t.email, email), eq(t.approved, true), gt(t.expiresAt, new Date())),
        });
        if (!invite) {
          throw new Error(
            "Only invited external organisers may register manually. Please request approval from SMUnity admin.",
          );
        }
      }

      // Auto-create profile
      await database
        .insert(schema.profiles)
        .values({
          userId: user.id,
          displayName: user.name || email.split("@")[0],
          role: isSMU ? "student" : "leader",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      if (!isSMU) {
        await database
          .delete(schema.organiserInvites)
          .where(eq(schema.organiserInvites.email, email));
      }
    },
  },
});

