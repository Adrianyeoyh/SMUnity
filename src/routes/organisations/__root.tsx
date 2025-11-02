import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useRoleGuard } from "#client/hooks/use-auth-guard";

function OrganisationRoot() {
  const { isLoading, isRedirecting } = useRoleGuard(["organisation"]);

  if (isLoading || isRedirecting) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Checking access…
      </div>
    );
  }

  return <Outlet />;
}

export const Route = createFileRoute("/organisations/__root")({
  component: OrganisationRoot,
});
