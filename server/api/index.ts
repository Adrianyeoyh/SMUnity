
import { Hono } from "hono";

import { usersRoutes } from "./users/index";
import { projectsRoutes } from "./projects/index";
import { applicationsRoutes } from "./projects/applications";
import { favouritesRoutes } from "./projects/favourites";
import { organisationsRoutes } from "./organisations/index";
import { organisationRequestsRoutes } from "./organisations/requests";
import { adminDashboardRoutes } from "./admin/dashboard";
import { dashboardRoutes } from "./dashboard";
import { auth } from "../lib/auth"
// import { authRoutes } from "./auth/routes";

// add-ons already in your repo
import { taxonomiesRoutes } from "./taxonomies/index";
import { timesheetsRoutes } from "./timesheets/index";
import { manageApplicationsRoutes } from "./projects/manage-applications";
import { orgMembersRoutes } from "./organisations/members";

export const apiRouter = new Hono();

// routes
apiRouter.route("/users", usersRoutes);
apiRouter.route("/projects", projectsRoutes);
apiRouter.route("/projects/applications", applicationsRoutes);
apiRouter.route("/projects/applications/manage", manageApplicationsRoutes);
apiRouter.route("/projects/favourites", favouritesRoutes);
apiRouter.route("/organisations", organisationsRoutes);
apiRouter.route("/organisations/requests", organisationRequestsRoutes);
apiRouter.route("/organisations/members", orgMembersRoutes);
apiRouter.route("/admin/dashboard", adminDashboardRoutes);
apiRouter.route("/dashboard", dashboardRoutes);
// apiRouter.route("/auth", authRoutes);
apiRouter.on(["POST", "GET"], "/auth/*", (c) => {
 return auth.handler(c.req.raw);
});
apiRouter.route("/taxonomies", taxonomiesRoutes);
apiRouter.route("/timesheets", timesheetsRoutes);

// consistent JSON error responses for thrown ApiError / generic errors
apiRouter.onError((err, c) => {
  const status = (err as any)?.status ?? (err.message === "Not authenticated" ? 401 : 500);
  const message = err.message || "Internal Server Error";
  return c.json({ error: message }, status);
});

export default apiRouter;
