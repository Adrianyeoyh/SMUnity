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

export const apiRouter = new Hono();

apiRouter.route("/users", usersRoutes);
apiRouter.route("/projects", projectsRoutes);
apiRouter.route("/projects/applications", applicationsRoutes);
apiRouter.route("/projects/favourites", favouritesRoutes);
apiRouter.route("/organisations", organisationsRoutes);
apiRouter.route("/organisations/requests", organisationRequestsRoutes);
apiRouter.route("/admin/dashboard", adminDashboardRoutes);
apiRouter.route("/dashboard", dashboardRoutes);
apiRouter.route("/auth", authRoutes);

export default apiRouter;
