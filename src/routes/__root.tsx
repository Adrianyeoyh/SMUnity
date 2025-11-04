import { createRootRoute, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Header } from "#client/components/layout/header";
import { Footer } from "#client/components/layout/footer";
import { Toaster } from "#client/components/ui/sonner";
import { Chatbot } from "#client/components/chatbot/Chatbot";
import { useEffect } from "react";
import { useAuth } from "#client/hooks/use-auth";
import { MobileMenuProvider } from "#client/contexts/mobile-menu-context";

function RootComponent() {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth(); // ⬅️ ensure your hook exposes `user`
  

  // Scroll reset on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [routerState.location.pathname]);

  // Redirect logged-in users from "/" to their role dashboard
  useEffect(() => {
    if (!isLoggedIn || routerState.location.pathname !== "/") return;

    // Redirect logged-in users from "/" to their role dashboard
    if (user?.accountType === "admin") {
      navigate({ to: "/admin/dashboard", replace: true });
    } else if (user?.accountType === "organisation") {
      navigate({ to: "/organisations/dashboard", replace: true });
    } else {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [isLoggedIn, user?.accountType, routerState.location.pathname, navigate]);


  // role-based route protection for user pages
  useEffect(() => {
    if (!isLoggedIn) return;

    const path = routerState.location.pathname;
    const role = user?.accountType;

    // --- Student routes (user-only)
    const studentRoutes = [
      "/dashboard",
      "/favourites",
      "/my-applications",
      "/profile",
      "/profileedit",
    ];

    // check if current path starts with any of those
    const isStudentRoute = studentRoutes.some((route) =>
      path.startsWith(route)
    );

    if (isStudentRoute) {
      // ADMIN trying to access student pages
      if (role === "admin") {
        navigate({ to: "/admin/dashboard", replace: true });
        return;
      }

      // ORGANISATION trying to access student pages
      if (role === "organisation") {
        // Handle /profile + /profileedit separately
        if (path.startsWith("/profileedit")) {
          navigate({ to: "/organisations/editprofile", replace: true });
          return;
        }
        if (path.startsWith("/profile")) {
          navigate({ to: "/organisations/profile", replace: true });
          return;
        }

        // Everything else (dashboard, favourites, my-applications)
        navigate({ to: "/organisations/dashboard", replace: true });
        return;
      }
    }
  }, [isLoggedIn, user?.accountType, routerState.location.pathname, navigate]);



  return (
    <MobileMenuProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
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

