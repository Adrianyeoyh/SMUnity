import { createFileRoute, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "#client/hooks/use-auth";

function OrganisationRoot() {
  // const navigate = useNavigate();
  
  return <Outlet />;
}

export const Route = createFileRoute("/organisations/__layout")({
  component: OrganisationRoot,
});
