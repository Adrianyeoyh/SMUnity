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
                          <p className="text-sm font-medium break-words sm:text-base">
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

// import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
// import { useMemo } from "react";
// import { Button } from "#client/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
// import { Badge } from "#client/components/ui/badge";
// import { Separator } from "#client/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "#client/components/ui/tabs";
// import { ScrollArea } from "#client/components/ui/scroll-area";
// import { Avatar, AvatarFallback, AvatarImage } from "#client/components/ui/avatar";
// import { Mail, Phone, GraduationCap, MapPin, ArrowLeft, UserRound, Star, Award, Clock } from "lucide-react";

// type ApplicantProfile = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   yearOfStudy: number;
//   major: string;
//   location: string;
//   image: string;
//   summary: string;
//   skills: string[];
//   interests: string[];
//   // backend-provided textual fields (optional)
//   experience?: string; // e.g. "none" | "some" | "extensive"
//   skillsText?: string; // optional short string (different from skills[])
//   comments?: string; // optional additional remarks
//   serviceHours: number;
//   completedProjects: number;
//   recentApplications: Array<{
//     id: string;
//     title: string;
//     status: "pending" | "shortlisted" | "confirmed" | "rejected" | "completed";
//     appliedOn: string;
//     hours: number;
//   }>;
// };

// const applicantDirectory: Record<string, ApplicantProfile> = {
//   "serena-liang": {
//     id: "serena-liang",
//     name: "Serena Liang",
//     email: "serena.liang@smu.edu.sg",
//     phone: "+65 9345 1023",
//     yearOfStudy: 2,
//     major: "Information Systems",
//     location: "Bukit Timah, Singapore",
//     image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&auto=format&fit=facearea&facepad=3",
//     summary: "Keen to support sustainability initiatives and build stronger neighbourhood communities.",
//     skills: ["Community Engagement", "Presentation", "Design Thinking"],
//     interests: ["Urban Farming", "Sustainability", "Neighbourhood Outreach"],
//     serviceHours: 52,
//     completedProjects: 3,
//     recentApplications: [
//       {
//         id: "csp-001",
//         title: "Community Garden Mentors",
//         status: "pending",
//         appliedOn: "2025-03-04",
//         hours: 40,
//       },
//       {
//         id: "csp-920",
//         title: "Neighbourhood Clean-up Leaders",
//         status: "confirmed",
//         appliedOn: "2024-10-12",
//         hours: 15,
//       },
//     ],
//   },
//   "daniel-ong": {
//     id: "daniel-ong",
//     name: "Daniel Ong",
//     email: "daniel.ong@smu.edu.sg",
//     phone: "+65 9188 4421",
//     yearOfStudy: 3,
//     major: "Business Management",
//     location: "Serangoon, Singapore",
//     image: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=200&auto=format&fit=facearea&facepad=3",
//     summary: "Experienced facilitator passionate about bridging the digital divide for seniors.",
//     skills: ["Digital Literacy", "Workshop Facilitation", "Team Leadership"],
//     interests: ["Elderly Care", "Technology Adoption", "Social Innovation"],
//     serviceHours: 86,
//     completedProjects: 5,
//     recentApplications: [
//       {
//         id: "csp-002",
//         title: "Digital Literacy Buddies",
//         status: "shortlisted",
//         appliedOn: "2025-03-03",
//         hours: 32,
//       },
//       {
//         id: "csp-910",
//         title: "Seniors Tech Champions Network",
//         status: "confirmed",
//         appliedOn: "2024-09-20",
//         hours: 20,
//       },
//     ],
//   },
//   "micah-koh": {
//     id: "micah-koh",
//     name: "Micah Koh",
//     email: "micah.koh@smu.edu.sg",
//     phone: "+65 9654 7782",
//     yearOfStudy: 4,
//     major: "Psychology",
//     location: "Jurong West, Singapore",
//     image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&auto=format&fit=facearea&facepad=2",
//     summary: "Volunteer mentor focused on youth development and academic support programmes.",
//     skills: ["Mentoring", "Curriculum Planning", "Conflict Resolution"],
//     interests: ["Youth Development", "Education Equity", "Sports"],
//     serviceHours: 120,
//     completedProjects: 7,
//     recentApplications: [
//       {
//         id: "csp-003",
//         title: "North Bridge Homework Club",
//         status: "confirmed",
//         appliedOn: "2025-03-02",
//         hours: 60,
//       },
//       {
//         id: "csp-855",
//         title: "Sports Buddies Outreach",
//         status: "completed",
//         appliedOn: "2024-05-14",
//         hours: 24,
//       },
//     ],
//   },
//   "priya-nair": {
//     id: "priya-nair",
//     name: "Priya Nair",
//     email: "priya.nair@smu.edu.sg",
//     phone: "+65 9271 6644",
//     yearOfStudy: 1,
//     major: "Social Sciences",
//     location: "Queenstown, Singapore",
//     image: "https://images.unsplash.com/photo-1521579971123-1192931a1452?w=200&auto=format&fit=facearea&facepad=3",
//     summary: "First-year student eager to gain hands-on experience with community programmes.",
//     skills: ["Public Speaking", "Event Support", "Content Creation"],
//     interests: ["Community Events", "Communications", "Inclusive Programmes"],
//     serviceHours: 24,
//     completedProjects: 2,
//     recentApplications: [
//       {
//         id: "csp-002",
//         title: "Digital Literacy Buddies",
//         status: "pending",
//         appliedOn: "2025-03-02",
//         hours: 32,
//       },
//       {
//         id: "csp-790",
//         title: "Community Arts Festival",
//         status: "completed",
//         appliedOn: "2024-11-04",
//         hours: 12,
//       },
//     ],
//   },
//   "jasper-teo": {
//     id: "jasper-teo",
//     name: "Jasper Teo",
//     email: "jasper.teo@smu.edu.sg",
//     phone: "+65 9003 3345",
//     yearOfStudy: 2,
//     major: "Economics",
//     location: "Hougang, Singapore",
//     image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&auto=format&fit=facearea&facepad=1.5",
//     summary: "Aspiring community organiser with interest in urban farming and sustainability projects.",
//     skills: ["Data Analysis", "Community Outreach", "Fundraising"],
//     interests: ["Sustainability", "Policy Research", "Community Gardens"],
//     serviceHours: 68,
//     completedProjects: 4,
//     recentApplications: [
//       {
//         id: "csp-001",
//         title: "Community Garden Mentors",
//         status: "rejected",
//         appliedOn: "2025-03-01",
//         hours: 40,
//       },
//       {
//         id: "csp-720",
//         title: "Urban Farming Accelerator",
//         status: "confirmed",
//         appliedOn: "2024-08-12",
//         hours: 28,
//       },
//     ],
//   },
// };

// const statusBadgeTone: Record<string, string> = {
//   pending: "bg-amber-100 text-amber-700",
//   shortlisted: "bg-blue-100 text-blue-700",
//   confirmed: "bg-emerald-100 text-emerald-700",
//   rejected: "bg-rose-100 text-rose-700",
//   completed: "bg-slate-100 text-slate-700",
// };

// export const Route = createFileRoute("/organisations/applicant/$projectId/$applicantId")({
//   component: ApplicantProfileRoute,
// });

// function ApplicantProfileRoute() {
//   const navigate = useNavigate();
//   const { applicantId } = Route.useParams();
//   const applicant = applicantDirectory[applicantId];

//   const initials = useMemo(() => {
//     if (!applicant) return "NA";
//     return applicant.name
//       .split(" ")
//       .map((part) => part[0])
//       .join("")
//       .slice(0, 2)
//       .toUpperCase();
//   }, [applicant]);

//   if (!applicant) {
//     return (
//       <div className="min-h-screen bg-muted/40">
//         <div className="container mx-auto px-4 py-24 text-center">
//           <Card className="mx-auto max-w-md">
//             <CardHeader>
//               <CardTitle className="font-heading text-xl">Applicant not found</CardTitle>
//               <CardDescription className="font-body">
//                 We couldn&apos;t locate the volunteer profile you were looking for.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <Button onClick={() => navigate({ to: "/leader/dashboard" })} className="w-full">
//                 Back to dashboard
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-muted/30">
//       <div className="container mx-auto px-4 py-10 space-y-8">
//         <div className="flex items-center gap-3">
//           <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/leader/dashboard" })}>
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to dashboard
//           </Button>
//         </div>

//         <Card>
//   <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
//     {/* Left: Avatar + Info + Skills/Interests (stacked under avatar) */}
//     <div className="flex-1 min-w-0">
//       <div className="flex items-start gap-4">
//         <Avatar className="h-20 w-20 flex-shrink-0">
//           <AvatarImage src={applicant.image} alt={applicant.name} />
//           <AvatarFallback>{initials}</AvatarFallback>
//         </Avatar>
//         <div className="min-w-0">
//           <h1 className="font-heading text-2xl font-semibold text-foreground truncate">{applicant.name}</h1>
//           <p className="text-sm text-muted-foreground font-body mt-1 truncate">{applicant.summary}</p>
//           <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-body">
//             <Badge variant="outline" className="flex items-center gap-1">
//               <GraduationCap className="h-3.5 w-3.5" />
//               Year {applicant.yearOfStudy} · {applicant.major}
//             </Badge>
//           </div>
//         </div>
//       </div>

//       {/* Skills and Interests below avatar */}
//       <div className="mt-4 flex flex-col gap-4">
//         <div>
//           <h2 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wide">
//             Skills
//           </h2>
//           <div className="mt-3 flex flex-wrap gap-2">
//             {(applicant.skills ?? []).map((skill) => (
//               <Badge key={skill} variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
//                 {skill}
//               </Badge>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
//             Interest areas
//           </h2>
//           <div className="mt-3 flex flex-wrap gap-2">
//             {(applicant.interests ?? []).map((interest) => (
//               <Badge key={interest} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
//                 {interest}
//               </Badge>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Right: Contact buttons - align to the top and right on md screens */}
//     <div className="flex flex-col gap-2 text-sm font-body self-start md:items-end">
//       <Button variant="secondary" asChild>
//         <a href={`mailto:${applicant.email}`} className="inline-flex items-center gap-2">
//           <Mail className="h-4 w-4" />
//           Email {applicant.name.split(" ")[0]}
//         </a>
//       </Button>
//       <Button variant="outline" asChild>
//         <a href={`tel:${applicant.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2">
//           <Phone className="h-4 w-4" />
//           Call {applicant.phone}
//         </a>
//       </Button>
//     </div>
//   </CardContent>
// </Card>

//         {/* Backend-provided additional fields */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="font-heading text-lg">Profile details</CardTitle>
//             <CardDescription className="font-body">
//               Additional fields pulled from the backend.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4 text-sm text-foreground font-body">
//             <div>
//               <p className="text-muted-foreground">Experience</p>
//               <p className="font-medium">{(applicant as any).experience ?? (applicant.experience ?? '—')}</p>
//             </div>

//             <div>
//               <p className="text-muted-foreground">Comments</p>
//               <p className="font-medium whitespace-pre-wrap">{(applicant as any).comments ?? applicant.comments ?? '—'}</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="font-heading text-lg">Application history</CardTitle>
//             <CardDescription className="font-body">
//               Previous CSPs help you gauge experience, commitment, and fit.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Tabs defaultValue="applications" className="space-y-4">
//               <TabsList>
//                 <TabsTrigger value="applications" className="font-body">
//                   Applications
//                 </TabsTrigger>
//               </TabsList>
//               <TabsContent value="applications">
//                 <ScrollArea className="max-h-[320px] rounded-lg border">
//                   <div className="divide-y">
//                     {applicant.recentApplications.map((application) => (
//                       <div key={application.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
//                         <div>
//                           <Link
//                             to="/csp/$cspId"
//                             params={{ cspId: application.id }}
//                             className="font-heading text-sm font-semibold text-foreground hover:underline"
//                           >
//                             {application.title}
//                           </Link>
//                           <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-body">
//                             <Badge
//                               variant="outline"
//                               className={`rounded-full border-transparent px-3 py-1 font-semibold ${
//                                 statusBadgeTone[application.status] ?? "bg-slate-100 text-slate-700"
//                               }`}
//                             >
//                               {application.status.toUpperCase()}
//                             </Badge>
//                             <span>Applied on {application.appliedOn}</span>
//                             <span>Estimated {application.hours} hours</span>
//                           </div>
//                         </div>
//                         <Button variant="ghost" size="sm" className="text-sm font-body" asChild>
//                           <Link to="/leader/dashboard" search={{ focus: application.id }}>
//                             View in dashboard
//                           </Link>
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
