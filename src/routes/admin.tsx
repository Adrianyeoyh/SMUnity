import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { auth } from "#client/lib/auth.ts";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  beforeLoad: async (c) => {
    const { data, error } = await auth.getSession();
    const user = data?.user;
    if (!user || error) {
      throw redirect({
        to: "/auth/login",
        search: { redirectTo: c.location.pathname },
      });
    }
    // @ts-ignore
    const role = user.accountType;

    if (role == "student") {
      throw redirect({ to: "/dashboard" });
    } else if (role == "organisation") {
      throw redirect({ to: "/organisations/dashboard" });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
