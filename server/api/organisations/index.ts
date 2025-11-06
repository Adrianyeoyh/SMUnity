// server/api/organisations/index.ts
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";

import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { createApp } from "#server/factory";
import {
  authMiddleware,
  organisationMiddleware,
} from "#server/middlewares/auth";
import application from "./application";
import dashboard from "./dashboard";
import listing from "./listing";
import profile from "./profile";

const organisationsRoutes = createApp()
  .use(authMiddleware) // first populate session
  .use(organisationMiddleware) // then restrict access
  .route("/dashboard", dashboard)
  .route("/listing", listing)
  .route("/application", application)
  .route("/profile", profile);


export default organisationsRoutes;
