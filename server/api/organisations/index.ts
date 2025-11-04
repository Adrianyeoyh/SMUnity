// server/api/organisations/index.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { createApp } from "#server/factory";
import listing from "./listing";
import dashboard from "./dashboard";
import application from "./application";
import profile from "./profile";
import { authMiddleware, organisationMiddleware } from "#server/middlewares/auth";


const organisationsRoutes = createApp()
  .use(authMiddleware)          // first populate session
  .use(organisationMiddleware); // then restrict access

organisationsRoutes.route("/dashboard", dashboard);
organisationsRoutes.route("/listing", listing);
organisationsRoutes.route("/application", application)
organisationsRoutes.route("/profile", profile);
// organisationsRoutes.route("/queue", queue)

export default organisationsRoutes
