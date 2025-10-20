// server/api/index.ts
import { Hono } from "hono";

import { usersRoutes } from "./users/index";
import { projectsRoutes } from "./projects/index";
import { applicationsRoutes } from "./projects/applications";
import { favouritesRoutes } from "./projects/favourites";
import { organisationsRoutes } from "./organisations/index";
import { organisationRequestsRoutes } from "./organisations/requests";
import { adminDashboardRoutes } from "./admin/dashboard";
import { dashboardRoutes } from "./dashboard";
import { authRoutes } from "./auth/routes";

export const api = new Hono();

api.route("/users", usersRoutes);
api.route("/projects", projectsRoutes);
api.route("/projects/applications", applicationsRoutes);
api.route("/projects/favourites", favouritesRoutes);
api.route("/organisations", organisationsRoutes);
api.route("/organisations/requests", organisationRequestsRoutes);
api.route("/admin/dashboard", adminDashboardRoutes);
api.route("/dashboard", dashboardRoutes);
api.route("/auth", authRoutes);

export default api;
