import { createApp } from "#server/factory";
import { studentMiddleware } from "#server/middlewares/auth";
import applications from "./applications";
import dashboard from "./dashboard";
import profile from "./profile";
import savedProjectsRoute from "./saveProject";

const student = createApp().use(studentMiddleware)

student.route("/dashboard", dashboard);
student.route("/applications", applications);
student.route("/save", savedProjectsRoute);
student.route("/profile", profile);

export default student;