import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";

import { auth } from "#client/lib/auth.ts";
import { motion } from "framer-motion";

export const Route = createFileRoute("/organisations")({
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

    if (role == "admin") {
      throw redirect({ to: "/admin/dashboard" });
    } else if (role == "student") {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function RouteComponent() {
  // const routerState = useRouterState();

  // const pathname = routerState.location.pathname;
  return (
    // <motion.div
    //   key={pathname}
    //   initial={{ opacity: 0, y: 20 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   transition={{
    //     duration: 0.3,
    //     ease: "easeOut",
    //   }}
    //   className="h-full"
    // >
      <Outlet />
    // </motion.div>
  );
}
