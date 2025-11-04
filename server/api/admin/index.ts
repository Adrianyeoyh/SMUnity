import { createApp } from "#server/factory";
import { adminMiddleware } from "#server/middlewares/auth";
import { adminCreate } from "./create";
import { adminDashboardRoutes } from "./dashboard";
import { queue } from "./queue";


const admin = createApp().use(adminMiddleware); 

// Mount subroutes
admin.route("/dashboard", adminDashboardRoutes);
admin.route("/create", adminCreate);
admin.route("/queue", queue)

export default admin;