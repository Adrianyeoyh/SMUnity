// server/api/index.ts
import { Hono } from "hono";
import { authRoutes } from "./auth/routes";
import { usersRoutes } from "./users";
import { projectsRoutes } from "./projects";
import { applicationsRoutes } from "./projects/applications";
import { favouritesRoutes } from "./projects/favourites";
import { organisationsRoutes } from "./organisations";
import { orgRequestsRoutes } from "./organisations/requests";
import { adminDashboardRoutes } from "./admin/dashboard";

export const apiRouter = new Hono();

apiRouter.route("/auth", authRoutes);
apiRouter.route("/users", usersRoutes);
apiRouter.route("/projects", projectsRoutes);
apiRouter.route("/projects/applications", applicationsRoutes);
apiRouter.route("/projects/favourites", favouritesRoutes);
apiRouter.route("/organisations", organisationsRoutes);
apiRouter.route("/organisations/requests", orgRequestsRoutes);
apiRouter.route("/admin/dashboard", adminDashboardRoutes);

export default apiRouter;
