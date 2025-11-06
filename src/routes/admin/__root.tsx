import { useEffect } from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";

import { useRoleGuard } from "#client/hooks/use-auth-guard";

function AdminRoot() {
  const { user, isLoading } = useRoleGuard(["admin"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user && user.accountType !== "admin") {
      if (user.accountType === "student")
        navigate({ to: "/dashboard", replace: true });
      else if (user.accountType === "organisation")
        navigate({ to: "/organisations/dashboard", replace: true });
      else navigate({ to: "/", replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading)
    return (
      <div className="text-muted-foreground flex h-screen items-center justify-center">
        Checking access…
      </div>
    );

  return <Outlet />;
}

export const Route = createFileRoute("/admin/__root")({
  component: AdminRoot,
});
