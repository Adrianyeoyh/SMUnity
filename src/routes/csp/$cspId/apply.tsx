import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCspById } from "#client/api/public/discover.ts"; // ✅ existing API
import { ApplicationForm } from "#client/components/forms/applicationform";
import { Card, CardHeader, CardTitle, CardContent } from "#client/components/ui/card";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/csp/$cspId/apply")({
  component: ApplyForCSPPage,
});

function ApplyForCSPPage() {
  const { cspId } = useParams({ from: "/csp/$cspId/apply" });
  const navigate = useNavigate();

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["csp-detail", cspId],
    queryFn: () => fetchCspById(cspId),
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-muted-foreground">Loading project details...</div>;
  }

  if (isError || !project) {
    return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-destructive">Failed to load project.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <span>/</span>
        <span className="text-foreground">Apply for {project.title}</span>
      </div>
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

