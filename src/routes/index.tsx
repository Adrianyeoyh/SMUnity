import { createFileRoute } from "@tanstack/react-router";

import { env } from "#client/env.ts";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <div>Hello World {env.VITE_APP_URL}</div>;
}
