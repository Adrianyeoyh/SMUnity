import { createApp } from "#server/factory";
import { adminMiddleware } from "#server/middlewares/auth";
import { adminCreate } from "./create";
import { adminDashboardRoutes } from "./dashboard";
import { queue } from "./queue";
import { viewOrgs } from "./viewOrgs";

const admin = createApp()
.use(adminMiddleware)
.route("/dashboard", adminDashboardRoutes)
.route("/create", adminCreate)
.route("/queue", queue)
.route("/viewOrgs", viewOrgs);

export default admin;