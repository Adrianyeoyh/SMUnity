import { createRootRoute, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Header } from "#client/components/layout/header";
import { Footer } from "#client/components/layout/footer";
import { Toaster } from "#client/components/ui/sonner";
import { useEffect } from "react";
import { useAuth } from "#client/hooks/use-auth";

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

    if (user?.role === "admin") {
      navigate({ to: "/admin/dashboard" });
    } else if (user?.role === "organisation") {
      navigate({ to: "/organisation/dashboard" });
    } else {
      // default: student
      navigate({ to: "/dashboard" });
    }
  }, [isLoggedIn, user?.role, routerState.location.pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <TanStackRouterDevtools />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});

