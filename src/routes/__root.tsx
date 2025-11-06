import { createRootRoute, Outlet, useRouterState, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Header } from "#client/components/layout/header";
import { Footer } from "#client/components/layout/footer";
import { Toaster } from "#client/components/ui/sonner";
import { Chatbot } from "#client/components/chatbot/Chatbot";
import { useEffect } from "react";
import { MobileMenuProvider } from "#client/contexts/mobile-menu-context";
import { motion } from "framer-motion";
import { auth } from "#client/lib/auth.ts";

function RootComponent() {
  const routerState = useRouterState();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [routerState.location.pathname]);

  const pathname = routerState.location.pathname;

  return (
    <MobileMenuProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut"
            }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
        <Footer />
        <Chatbot />
        <Toaster />
        <TanStackRouterDevtools />
      </div>
    </MobileMenuProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: async (c) => {
    console.log(c.location.pathname)
    const { data, error } = await auth.getSession();
    const user = data?.user;
    const path = c.location.pathname;

    // Define protected routes
    const protectedRoutes = [
      "/dashboard",
      "/favourites",
      "/my-applications",
      "/profile",
      "/profileedit",
      "/admin",
      "/organisations",
    ];

    // If not on an auth route and there's no valid session, redirect to login with redirectTo
    if (!path.startsWith("/auth") && (!user || error)) {
      throw redirect({ to: "/auth/login", search: { redirectTo: path } });
    }

    // If user is present, enforce role-based route access
    if (user) {
      // @ts-ignore
      const role = user.accountType;

      const studentRoutes = [
        "/dashboard",
        "/favourites",
        "/my-applications",
        "/profile",
        "/profileedit",
      ];
      const adminRoutes = ["/admin"];
      const organisationRoutes = ["/organisations"];

      const isStudentRoute = studentRoutes.some((r) => path.startsWith(r));
      const isAdminRoute = adminRoutes.some((r) => path.startsWith(r));
      const isOrganisationRoute = organisationRoutes.some((r) => path.startsWith(r));

      if (role === "student") {
        if (isAdminRoute || isOrganisationRoute) {
          throw redirect({ to: "/dashboard" });
        }
      }

      if (role === "admin") {
        if (isStudentRoute || isOrganisationRoute) {
          throw redirect({ to: "/admin/dashboard" });
        }
      }

      if (role === "organisation") {
        if (isStudentRoute) {
          if (path.startsWith("/profileedit")) {
            throw redirect({ to: "/organisations/editprofile" });
          }
          if (path.startsWith("/profile")) {
            throw redirect({ to: "/organisations/profile" });
          }
          throw redirect({ to: "/organisations/dashboard" });
        }
        if (isAdminRoute) {
          throw redirect({ to: "/organisations/dashboard" });
        }
      }
    }
  },
});

