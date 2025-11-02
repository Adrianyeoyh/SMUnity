import { createApp } from "#server/factory.ts";
import { studentMiddleware } from "#server/middlewares/auth.ts";
import applications from "./applications";
import dashboard from "./dashboard";
import savedProjectsRoute from "./saveProject";

const student = createApp().use(studentMiddleware)

student.route("/dashboard", dashboard);
student.route("/applications", applications);
student.route("/save", savedProjectsRoute);

export default student;