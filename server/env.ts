import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {
    VITE_APP_URL: z.url(),
  },
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    DATABASE_URL: z.url(),

    // Better Auth
    BETTER_AUTH_SECRET: z.string(),

    // Mail
    SMTP_HOST: z.string(),
    SMTP_PORT: z.coerce.number(),
    SMTP_SECURE: z.coerce.boolean(),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),
    SMTP_FROM: z.string(),

    // Minio
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_REGION: z.string(),
    AWS_S3_ENDPOINT: z.string(),
    AWS_S3_BUCKET: z.string(),
    FORCE_PATH_STYLE: z.coerce.boolean(),
  },
  clientPrefix: "VITE_",
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    VITE_APP_URL: process.env.VITE_APP_URL ?? `http://localhost:4000`,
    DATABASE_URL: process.env.DATABASE_URL,

    // Better Auth
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

    // Mail
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,

    // Minio
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_ENDPOINT: process.env.AWS_S3_ENDPOINT,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    FORCE_PATH_STYLE: process.env.FORCE_PATH_STYLE,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});

export type Env = {
  [K in keyof typeof env as K extends `VITE_${string}` ? K : never]: string;
};
