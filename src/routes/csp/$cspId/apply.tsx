import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { fetchCspById } from "#client/api/public/discover.ts"; // ✅ existing API
import { ApplicationForm } from "#client/components/forms/applicationform";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#client/components/ui/card";

export const Route = createFileRoute("/csp/$cspId/apply")({
  component: ApplyForCSPPage,
});

function ApplyForCSPPage() {
  const { cspId } = useParams({ from: "/csp/$cspId/apply" });
  const navigate = useNavigate();

  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["csp-detail", cspId],
    queryFn: () => fetchCspById(cspId),
  });

  if (isLoading) {
    return (
      <div className="text-muted-foreground container mx-auto px-4 py-12 text-center sm:px-6 lg:px-8">
        Loading project details...
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="text-destructive container mx-auto px-4 py-12 text-center sm:px-6 lg:px-8">
        Failed to load project.
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-muted-foreground mb-8 flex items-center gap-2 text-sm">
        <button
          onClick={() => window.history.back()}
          className="text-muted-foreground hover:text-foreground inline-flex items-center transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <span>/</span>
        <span className="text-foreground">Apply for {project.title}</span>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl">
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
