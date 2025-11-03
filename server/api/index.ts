
import { usersRoutes } from "./users/index";

//NEW UPDATES
import admin from "./admin";
import organisationsRoutes from "./organisations";
import { organisationRequestsRoutes } from "./organisations/requests";
import discover from "./public/discover";
import chatbot from "./public/chatbot";
import projects from "./projects"
import application from "./organisations/application";
import student from "./student";
import { createApp } from "#server/factory.ts";
import { profileRoutes } from "./profile";


export const apiRouter = createApp();

// NEW ROUTES
apiRouter.route("/admin", admin);
apiRouter.route("/organisations/requests", organisationRequestsRoutes);
apiRouter.route("/organisations", organisationsRoutes);
apiRouter.route("/discover", discover);
apiRouter.route("/chatbot", chatbot);
apiRouter.route("/projects", projects);
apiRouter.route("/applications", application)
apiRouter.route("/student", student);

  

// OLD ROUTES
apiRouter.route("/users", usersRoutes);
apiRouter.route("/profile", profileRoutes)


apiRouter.onError((err, c) => {
  const status = (err as any)?.status ?? (err.message === "Not authenticated" ? 401 : 500);
  const message = err.message || "Internal Server Error";
  return c.json({ error: message }, status);
});

export default apiRouter;
