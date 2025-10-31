
import { Hono } from "hono";

import { usersRoutes } from "./users/index";
import { profileRoutes } from "./profile/index";


import { auth } from "../lib/auth"

// add-ons already in your repo
import { taxonomiesRoutes } from "./taxonomies/index";
import { timesheetsRoutes } from "./timesheets/index";


//NEW UPDATES
import admin from "./admin";
import organisationsRoutes from "./organisations";
import { organisationRequestsRoutes } from "./organisations/requests";
import discover from "./public/discover";
import projects from "./projects"


export const apiRouter = new Hono();

// NEW ROUTES
apiRouter.route("/admin", admin);
apiRouter.route("/organisations/requests", organisationRequestsRoutes);
apiRouter.route("/organisations", organisationsRoutes);
apiRouter.route("/discover", discover);
apiRouter.route("/projects", projects);

  

// OLD ROUTES
apiRouter.route("/users", usersRoutes);
apiRouter.route("/profile", profileRoutes);


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
