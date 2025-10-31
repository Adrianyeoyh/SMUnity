import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCspById } from "#client/api/public/discover.ts"; // ✅ existing API
import { ApplicationForm } from "#client/components/forms/applicationform";
import { Card, CardHeader, CardTitle, CardContent } from "#client/components/ui/card";

export const Route = createFileRoute("/csp/$cspId/apply")({
  component: ApplyForCSPPage,
});

function ApplyForCSPPage() {
  const { cspId } = useParams({ from: "/csp/$cspId/apply" });

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["csp-detail", cspId],
    queryFn: () => fetchCspById(cspId),
  });

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Loading project details...</div>;
  }

  if (isError || !project) {
    return <div className="p-12 text-center text-destructive">Failed to load project.</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-heading">
            Apply for <span className="text-primary">{project.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationForm projectId={cspId} />
        </CardContent>
      </Card>
    </div>
  );
}

