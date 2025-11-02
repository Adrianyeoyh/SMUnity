import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useRoleGuard } from "#client/hooks/use-auth-guard";

function AdminRoot() {
  const { isLoading } = useRoleGuard(["admin"]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Checking access…
      </div>
    );
  }

  return <Outlet />;
}

export const Route = createFileRoute("/admin/__root")({
  component: AdminRoot,
});
