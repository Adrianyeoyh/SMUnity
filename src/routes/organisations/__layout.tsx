import { createFileRoute, Outlet } from "@tanstack/react-router";

function OrganisationLayout() {
  console.log("✅ ORG LAYOUT MOUNTED");
  return (
    <div style={{ border: "5px solid red", padding: "10px" }}>
      <h1>ORGANISATIONS LAYOUT WRAPPER</h1>
      <Outlet />
    </div>
  );
}

export const Route = createFileRoute("/organisations/__layout")({
  component: OrganisationLayout,
});
