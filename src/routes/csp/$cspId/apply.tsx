import { createFileRoute, useParams } from "@tanstack/react-router";
import { ApplicationForm } from "#client/components/forms/applicationform";

export const Route = createFileRoute("/csp/$cspId/apply")({
  component: ApplyForCSPPage,
});

function ApplyForCSPPage() {
  const { cspId } = useParams({ from: "/csp/$cspId/apply" });

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Apply for CSP #{cspId}</h1>
      <ApplicationForm projectId={cspId} />
    </div>
  );
}
