import {
  createFileRoute,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { motion } from "framer-motion";

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
  // const routerState = useRouterState();

  // const pathname = routerState.location.pathname;
  return (
    <Outlet />
  );
}
