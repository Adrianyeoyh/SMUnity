// server/api/organisations/index.ts
import { Hono } from "hono";
import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { createApp } from "#server/factory.ts";
import { organisationMiddleware } from "#server/middlewares/auth.ts";
import listing from "./listing";
import dashboard from "./dashboard";


const organisationsRoutes = createApp().use(organisationMiddleware);

organisationsRoutes.route("/dashboard", dashboard);
organisationsRoutes.route("/listing", listing);
// organisationsRoutes.route("/queue", queue)

export default organisationsRoutes
