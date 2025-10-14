import { Hono } from "hono";
import authRoutes from "./auth";
import userRoutes from "./users";
// import orgRoutes from "./organizations";
// import projectRoutes from "./projects";
// import appRoutes from "./applications";
// import adminRoutes from "./admin";

export const apiRouter = new Hono();

apiRouter.route("/auth", authRoutes);
apiRouter.route("/users", userRoutes);
// apiRouter.route("/org", orgRoutes);
// apiRouter.route("/projects", projectRoutes);
// apiRouter.route("/applications", appRoutes);
// apiRouter.route("/admin", adminRoutes);

export default apiRouter;