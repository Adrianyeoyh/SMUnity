import { useEffect } from "react";
import {
  createFileRoute,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";

import { useAuth } from "#client/hooks/use-auth";

function OrganisationRoot() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { isLoggedIn, user } = useAuth();

  // scroll reset
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [routerState.location.pathname]);

  // redirect from "/" to appropriate dashboard
  useEffect(() => {
    if (!isLoggedIn || routerState.location.pathname !== "/") return;

    if (user?.accountType === "admin") {
      navigate({ to: "/admin/dashboard", replace: true });
    } else if (user?.accountType === "organisation") {
      navigate({ to: "/organisations/dashboard", replace: true });
    } else {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [isLoggedIn, user?.accountType, routerState.location.pathname, navigate]);

  // 🧩 role-based route protection for organisation pages
  useEffect(() => {
    if (!isLoggedIn) return;

    const path = routerState.location.pathname;
    const role = user?.accountType;

    const organisationsRoutes = [
      "/organisations/dashboard",
      "/organisations/new",
      "/organisations/preview-new",
      "/organisations/profile",
      "/organisations/editprofile",
    ];

    const isOrganisationsRoute = organisationsRoutes.some((route) =>
      path.startsWith(route),
    );

    if (isOrganisationsRoute) {
      if (role === "admin") {
        navigate({ to: "/admin/dashboard", replace: true });
        return;
      }

      if (role === "student") {
        if (path.startsWith("/organisations/editprofile")) {
          navigate({ to: "/profileedit", replace: true });
          return;
        }
        if (path.startsWith("/organisations/profile")) {
          navigate({ to: "/profile", replace: true });
          return;
        }

        navigate({ to: "/dashboard", replace: true });
        return;
      }
    }

    if (role !== "organisation") {
      navigate({ to: "/", replace: true });
      return;
    }
  }, [isLoggedIn, user?.accountType, routerState.location.pathname, navigate]);

  return <Outlet />;
}

export const Route = createFileRoute("/organisations/__layout")({
  component: OrganisationRoot,
});
