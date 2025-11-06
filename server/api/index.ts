import { createApp } from "#server/factory";
//NEW UPDATES
import admin from "./admin";
import organisationsRoutes from "./organisations";
import application from "./organisations/application";
import { organisationRequestsRoutes } from "./organisations/requests";
import { profileRoutes } from "./profile";
import projects from "./projects";
import chatbot from "./public/chatbot";
import discover from "./public/discover";
import student from "./student";
import { usersRoutes } from "./users/index";

export const apiRouter = createApp();

// NEW ROUTES
apiRouter.route("/admin", admin);
apiRouter.route("/organisations/requests", organisationRequestsRoutes);
apiRouter.route("/organisations", organisationsRoutes);
apiRouter.route("/discover", discover);
apiRouter.route("/chatbot", chatbot);
apiRouter.route("/projects", projects);
apiRouter.route("/applications", application);
apiRouter.route("/student", student);

// OLD ROUTES
apiRouter.route("/users", usersRoutes);
apiRouter.route("/profile", profileRoutes);

apiRouter.onError((err, c) => {
  const status =
    (err as any)?.status ?? (err.message === "Not authenticated" ? 401 : 500);
  const message = err.message || "Internal Server Error";
  return c.json({ error: message }, status);
});

export default apiRouter;
