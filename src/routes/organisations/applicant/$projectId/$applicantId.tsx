import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

import { fetchApplicantDetails } from "#client/api/organisations/application.ts";
import { fetchListingById } from "#client/api/organisations/listing.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "#client/components/ui/avatar";
import { Badge } from "#client/components/ui/badge";
import { Button } from "#client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#client/components/ui/card";
import { ScrollArea } from "#client/components/ui/scroll-area";
import { Separator } from "#client/components/ui/separator";

export const Route = createFileRoute(
  "/organisations/applicant/$projectId/$applicantId",
)({
  component: ApplicantDetailsPage,
});

function ApplicantDetailsPage() {
  const navigate = useNavigate();
  const { projectId, applicantId } = Route.useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["applicant", projectId, applicantId],
    queryFn: () => fetchApplicantDetails(projectId, applicantId),
  });

  const { data: projectData } = useQuery({
    queryKey: ["listing", projectId],
    queryFn: () => fetchListingById({ queryKey: ["listing", projectId] }),
  });

  if (isLoading)
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground p-6 text-sm sm:text-base">
          Loading applicant details...
        </p>
      </div>
    );
  if (isError || !data)
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-destructive p-6 text-sm sm:text-base">
          Failed to load applicant data.
        </p>
      </div>
    );

  const { user, profile, application, history } = data;
  const project = projectData?.project || projectData;
  const projectTitle = project?.title || "project";
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "NA";

  return (
    <div className="bg-background min-h-screen py-4 sm:py-6 md:py-8">
      <div className="container mx-auto space-y-6 px-4 pb-4 sm:space-y-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate({ to: `/organisations/${projectId}` })}
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center text-sm transition-colors sm:mb-6 sm:text-base"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="font-body break-words">
            Back to {projectTitle} Overview
          </span>
        </button>

        {/* Profile Card */}
        <Card>
          <CardContent className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row min-w-0 flex-1 items-center sm:items-start gap-3 sm:gap-4 overflow-hidden text-center sm:text-left">
              <Avatar className="h-16 w-16 flex-shrink-0 sm:h-20 sm:w-20">
                <AvatarImage src={user?.image ?? ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h1 className="font-heading text-xl font-semibold break-words sm:text-2xl">
                  {user?.name}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {profile?.school ?? "School not specified"}
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Year {profile?.entryYear ?? "?"} •{" "}
                  {profile?.studentId ?? "Student Number not specified"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(profile?.skills ?? []).map((s: string) => (
                    <Badge key={s} variant="outline" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                  {(profile?.interests ?? []).map((i: string) => (
                    <Badge
                      key={i}
                      className="bg-primary/10 text-primary text-xs"
                    >
                      {i}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm w-full sm:w-auto">
              <Button
                variant="secondary"
                asChild
                className="flex-1 sm:flex-none"
              >
                <a href={`mailto:${user?.email}`}>
                  <Mail className="mr-2 h-4 w-4" /> Email
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (profile?.phone) {
                    window.location.href = `tel:${profile.phone}`;
                  } else {
                    toast.error(
                      "The student has yet to provide a contact number",
                    );
                  }
                }}
                className="flex-1 sm:flex-none"
              >
                <Phone className="mr-2 h-4 w-4" /> Call
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Application Details */}
        <Card>
          <CardHeader className="px-4 pt-4 pb-4 sm:px-6 sm:pt-4 sm:pb-4">
            <CardTitle className="font-heading text-lg sm:text-xl">
              Application Details
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              Submitted on:{" "}
              {format(new Date(application.submittedAt), "do MMMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div>
              <h3 className="font-body text-sm font-medium sm:text-base">
                Motivation
              </h3>
              <p className="text-muted-foreground text-sm break-words whitespace-pre-wrap sm:text-base">
                {application.motivation}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-body text-sm font-medium sm:text-base">
                Experience
              </h3>
              <p className="text-muted-foreground text-sm break-words capitalize sm:text-base">
                {application.experience}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-body text-sm font-medium sm:text-base">
                Relevant Skills
              </h3>
              <p className="text-muted-foreground text-sm break-words sm:text-base">
                {application.skills || "—"}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-body text-sm font-medium sm:text-base">
                Additional Comments
              </h3>
              <p className="text-muted-foreground text-sm break-words whitespace-pre-wrap sm:text-base">
                {application.comments || "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Application History */}
        <Card className="-mt-4 mb-4">
          <CardHeader className="px-4 pt-4 pb-4 sm:px-6 sm:pt-4 sm:pb-4">
            <CardTitle className="font-heading text-lg sm:text-xl">
              Application History
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Number of applications made by this volunteer:{" "}
              {history?.length || 0}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-4 py-4 sm:px-6">
              <div
                className="h-[400px] overflow-x-hidden overflow-y-scroll"
                style={{
                  overscrollBehavior: "contain",
                }}
                onWheel={(e) => {
                  const target = e.currentTarget;
                  const { scrollTop, scrollHeight, clientHeight } = target;
                  const isAtTop = scrollTop === 0;
                  const isAtBottom =
                    scrollTop + clientHeight >= scrollHeight - 1;

                  // Prevent page scroll if we can scroll within the container
                  if (
                    (e.deltaY < 0 && !isAtTop) ||
                    (e.deltaY > 0 && !isAtBottom)
                  ) {
                    e.stopPropagation();
                    e.preventDefault();
                    // Manually scroll the container
                    target.scrollTop += e.deltaY;
                  }
                }}
              >
                <div className="divide-y">
                  {history.map((app: any) => (
                    <div
                      key={app.id}
                      className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium break-words sm:text-base block truncate overflow-hidden text-ellipsis">
                            {app.projectTitle}
                          </p>
                          {(() => {
                            const statusMeta: Record<
                              string,
                              { tone: string; label: string }
                            > = {
                              pending: {
                                tone: "bg-amber-100 text-amber-800",
                                label: "Pending",
                              },
                              accepted: {
                                tone: "bg-emerald-100 text-emerald-800",
                                label: "Accepted",
                              },
                              rejected: {
                                tone: "bg-rose-100 text-rose-800",
                                label: "Rejected",
                              },
                              confirmed: {
                                tone: "bg-purple-100 text-purple-800",
                                label: "Confirmed",
                              },
                              withdrawn: {
                                tone: "bg-gray-100 text-gray-700",
                                label: "Withdrawn",
                              },
                            };
                            const meta = statusMeta[app.status as string] || {
                              tone: "bg-gray-100 text-gray-700",
                              label: app.status,
                            };
                            return (
                              <Badge className={`text-xs ${meta.tone}`}>
                                {meta.label}
                              </Badge>
                            );
                          })()}
                        </div>
                        <p className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          {format(new Date(app.submittedAt), "dd/MM/yyyy")}
                        </p>
                      </div>

                      <div className="flex flex-shrink-0 items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="text-xs sm:text-sm"
                        >
                          <Link
                            to="/csp/$projectID"
                            params={{ projectID: String(app.projectId) }}
                          >
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}