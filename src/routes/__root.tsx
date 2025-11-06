import { createRootRoute, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Header } from "#client/components/layout/header";
import { Footer } from "#client/components/layout/footer";
import { Toaster } from "#client/components/ui/sonner";
import { Chatbot } from "#client/components/chatbot/Chatbot";
import { useEffect, useMemo } from "react";
import { useAuth } from "#client/hooks/use-auth";
import { MobileMenuProvider } from "#client/contexts/mobile-menu-context";
import { motion } from "framer-motion";

function RootComponent() {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const { isLoggedIn, user, isLoading } = useAuth();
  
  const path = routerState.location.pathname;
  
  // Define all protected routes
  const protectedRoutes = [
    "/dashboard",
    "/favourites",
    "/my-applications",
    "/profile",
    "/profileedit",
    "/admin",
    "/organisations",
  ];

  // Check if current path is a protected route
  const isProtectedRoute = useMemo(() => 
    protectedRoutes.some((route) => path.startsWith(route)),
    [path]
  );
  const shouldShowLoading = isLoading && isProtectedRoute && !user && !isLoggedIn;
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [routerState.location.pathname]);

  // Authentication guard
  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (isLoading) return;

    // Check if current path is a protected route
    // If accessing a protected route and not logged in, redirect to login
    if (isProtectedRoute && !isLoggedIn) {
      navigate({ 
        to: "/auth/login", 
        replace: true,
        search: { redirectTo: path }
      });
      return;
    }
  }, [isLoading, isLoggedIn, isProtectedRoute, path, navigate]);

  useEffect(() => {
    if (isLoading || !isLoggedIn) return;

    const path = routerState.location.pathname;
    const role = user?.accountType;

    // Student routes
    const studentRoutes = [
      "/dashboard",
      "/favourites",
      "/my-applications",
      "/profile",
      "/profileedit",
    ];

    // Admin routes
    const adminRoutes = ["/admin"];

    // Organisation routes
    const organisationRoutes = ["/organisations"];

    const isStudentRoute = studentRoutes.some((route) =>
      path.startsWith(route)
    );
    const isAdminRoute = adminRoutes.some((route) =>
      path.startsWith(route)
    );
    const isOrganisationRoute = organisationRoutes.some((route) =>
      path.startsWith(route)
    );

    // Prevent students from accessing admin or organisation routes
    if (role === "student") {
      if (isAdminRoute) {
        navigate({ to: "/dashboard", replace: true });
        return;
      }
      if (isOrganisationRoute) {
        navigate({ to: "/dashboard", replace: true });
        return;
      }
    }

    // Prevent admins from accessing student or organisation routes
    if (role === "admin") {
      if (isStudentRoute) {
        navigate({ to: "/admin/dashboard", replace: true });
        return;
      }
      if (isOrganisationRoute) {
        navigate({ to: "/admin/dashboard", replace: true });
        return;
      }
    }

    // Prevent organisations from accessing student or admin routes
    if (role === "organisation") {
      if (isStudentRoute) {
        if (path.startsWith("/profileedit")) {
          navigate({ to: "/organisations/editprofile", replace: true });
          return;
        }
        if (path.startsWith("/profile")) {
          navigate({ to: "/organisations/profile", replace: true });
          return;
        }
        navigate({ to: "/organisations/dashboard", replace: true });
        return;
      }
      if (isAdminRoute) {
        navigate({ to: "/organisations/dashboard", replace: true });
        return;
      }
    }
  }, [isLoading, isLoggedIn, user?.accountType, routerState.location.pathname, navigate]);



  const pathname = routerState.location.pathname;

  // Show loading screen while checking authentication for protected routes
  if (shouldShowLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
});

