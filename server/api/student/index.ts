import { createApp } from "#server/factory";
import { studentMiddleware } from "#server/middlewares/auth";
import applications from "./applications";
import dashboard from "./dashboard";
import profile from "./profile";
import savedProjectsRoute from "./saveProject";

const student = createApp().use(studentMiddleware)
.route("/dashboard", dashboard)
.route("/applications", applications)
.route("/save", savedProjectsRoute)
.route("/profile", profile);

export default student;
