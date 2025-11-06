import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useRoleGuard } from "#client/hooks/use-auth-guard";

function AdminRoot() {
  const { user, isLoading } = useRoleGuard(["admin"]);
  const navigate = useNavigate();

  const shouldShowLoading = isLoading && !user;

  useEffect(() => {
    if (!isLoading && user && user.accountType !== "admin") {
      if (user.accountType === "student") navigate({ to: "/dashboard", replace: true });
      else if (user.accountType === "organisation") navigate({ to: "/organisations/dashboard", replace: true });
      else navigate({ to: "/", replace: true });
    }
  }, [isLoading, user, navigate]);

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

  return <Outlet />;
}

export const Route = createFileRoute("/admin/__root")({
  component: AdminRoot,
});
