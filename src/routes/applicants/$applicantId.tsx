import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Separator } from "#client/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import { ScrollArea } from "#client/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "#client/components/ui/avatar";
import { Mail, Phone, GraduationCap, MapPin, ArrowLeft, UserRound, Star, Award, Clock } from "lucide-react";

type ApplicantProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  yearOfStudy: number;
  major: string;
  location: string;
  image: string;
  summary: string;
  skills: string[];
  interests: string[];
  serviceHours: number;
  completedProjects: number;
  recentApplications: Array<{
    id: string;
    title: string;
    status: "pending" | "shortlisted" | "confirmed" | "rejected" | "completed";
    appliedOn: string;
    hours: number;
  }>;
};

const applicantDirectory: Record<string, ApplicantProfile> = {
  "serena-liang": {
    id: "serena-liang",
    name: "Serena Liang",
    email: "serena.liang@smu.edu.sg",
    phone: "+65 9345 1023",
    yearOfStudy: 2,
    major: "Information Systems",
    location: "Bukit Timah, Singapore",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&auto=format&fit=facearea&facepad=3",
    summary: "Keen to support sustainability initiatives and build stronger neighbourhood communities.",
    skills: ["Community Engagement", "Presentation", "Design Thinking"],
    interests: ["Urban Farming", "Sustainability", "Neighbourhood Outreach"],
    serviceHours: 52,
    completedProjects: 3,
    recentApplications: [
      {
        id: "csp-001",
        title: "Community Garden Mentors",
        status: "pending",
        appliedOn: "2025-03-04",
        hours: 40,
      },
      {
        id: "csp-920",
        title: "Neighbourhood Clean-up Leaders",
        status: "confirmed",
        appliedOn: "2024-10-12",
        hours: 15,
      },
    ],
  },
  "daniel-ong": {
    id: "daniel-ong",
    name: "Daniel Ong",
    email: "daniel.ong@smu.edu.sg",
    phone: "+65 9188 4421",
    yearOfStudy: 3,
    major: "Business Management",
    location: "Serangoon, Singapore",
    image: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=200&auto=format&fit=facearea&facepad=3",
    summary: "Experienced facilitator passionate about bridging the digital divide for seniors.",
    skills: ["Digital Literacy", "Workshop Facilitation", "Team Leadership"],
    interests: ["Elderly Care", "Technology Adoption", "Social Innovation"],
    serviceHours: 86,
    completedProjects: 5,
    recentApplications: [
      {
        id: "csp-002",
        title: "Digital Literacy Buddies",
        status: "shortlisted",
        appliedOn: "2025-03-03",
        hours: 32,
      },
      {
        id: "csp-910",
        title: "Seniors Tech Champions Network",
        status: "confirmed",
        appliedOn: "2024-09-20",
        hours: 20,
      },
    ],
  },
  "micah-koh": {
    id: "micah-koh",
    name: "Micah Koh",
    email: "micah.koh@smu.edu.sg",
    phone: "+65 9654 7782",
    yearOfStudy: 4,
    major: "Psychology",
    location: "Jurong West, Singapore",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&auto=format&fit=facearea&facepad=2",
    summary: "Volunteer mentor focused on youth development and academic support programmes.",
    skills: ["Mentoring", "Curriculum Planning", "Conflict Resolution"],
    interests: ["Youth Development", "Education Equity", "Sports"],
    serviceHours: 120,
    completedProjects: 7,
    recentApplications: [
      {
        id: "csp-003",
        title: "North Bridge Homework Club",
        status: "confirmed",
        appliedOn: "2025-03-02",
        hours: 60,
      },
      {
        id: "csp-855",
        title: "Sports Buddies Outreach",
        status: "completed",
        appliedOn: "2024-05-14",
        hours: 24,
      },
    ],
  },
  "priya-nair": {
    id: "priya-nair",
    name: "Priya Nair",
    email: "priya.nair@smu.edu.sg",
    phone: "+65 9271 6644",
    yearOfStudy: 1,
    major: "Social Sciences",
    location: "Queenstown, Singapore",
    image: "https://images.unsplash.com/photo-1521579971123-1192931a1452?w=200&auto=format&fit=facearea&facepad=3",
    summary: "First-year student eager to gain hands-on experience with community programmes.",
    skills: ["Public Speaking", "Event Support", "Content Creation"],
    interests: ["Community Events", "Communications", "Inclusive Programmes"],
    serviceHours: 24,
    completedProjects: 2,
    recentApplications: [
      {
        id: "csp-002",
        title: "Digital Literacy Buddies",
        status: "pending",
        appliedOn: "2025-03-02",
        hours: 32,
      },
      {
        id: "csp-790",
        title: "Community Arts Festival",
        status: "completed",
        appliedOn: "2024-11-04",
        hours: 12,
      },
    ],
  },
  "jasper-teo": {
    id: "jasper-teo",
    name: "Jasper Teo",
    email: "jasper.teo@smu.edu.sg",
    phone: "+65 9003 3345",
    yearOfStudy: 2,
    major: "Economics",
    location: "Hougang, Singapore",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&auto=format&fit=facearea&facepad=1.5",
    summary: "Aspiring community organiser with interest in urban farming and sustainability projects.",
    skills: ["Data Analysis", "Community Outreach", "Fundraising"],
    interests: ["Sustainability", "Policy Research", "Community Gardens"],
    serviceHours: 68,
    completedProjects: 4,
    recentApplications: [
      {
        id: "csp-001",
        title: "Community Garden Mentors",
        status: "rejected",
        appliedOn: "2025-03-01",
        hours: 40,
      },
      {
        id: "csp-720",
        title: "Urban Farming Accelerator",
        status: "confirmed",
        appliedOn: "2024-08-12",
        hours: 28,
      },
    ],
  },
};

const statusBadgeTone: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  shortlisted: "bg-blue-100 text-blue-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  completed: "bg-slate-100 text-slate-700",
};

export const Route = createFileRoute("/applicants/$applicantId")({
  component: ApplicantProfileRoute,
});

function ApplicantProfileRoute() {
  const navigate = useNavigate();
  const { applicantId } = Route.useParams();
  const applicant = applicantDirectory[applicantId];

  const initials = useMemo(() => {
    if (!applicant) return "NA";
    return applicant.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [applicant]);

  if (!applicant) {
    return (
      <div className="min-h-screen bg-muted/40">
        <div className="container mx-auto px-4 py-24 text-center">
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Applicant not found</CardTitle>
              <CardDescription className="font-body">
                We couldn&apos;t locate the volunteer profile you were looking for.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate({ to: "/leader/dashboard" })} className="w-full">
                Back to dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/leader/dashboard" })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
              <Avatar className="h-20 w-20">
                <AvatarImage src={applicant.image} alt={applicant.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-heading text-2xl font-semibold text-foreground">{applicant.name}</h1>
                <p className="text-sm text-muted-foreground font-body">{applicant.summary}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-body">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Year {applicant.yearOfStudy} · {applicant.major}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {applicant.location}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm font-body">
              <Button variant="secondary" asChild>
                <a href={`mailto:${applicant.email}`} className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email {applicant.name.split(" ")[0]}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={`tel:${applicant.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Call {applicant.phone}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Volunteer snapshot</CardTitle>
              <CardDescription className="font-body">
                Track this applicant&apos;s experience and interest fit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-background/70 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <Clock className="h-4 w-4" />
                    Service hours
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{applicant.serviceHours}h</p>
                </div>
                <div className="rounded-lg bg-background/70 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <Star className="h-4 w-4" />
                    Completed projects
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{applicant.completedProjects}</p>
                </div>
                <div className="rounded-lg bg-background/70 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <Award className="h-4 w-4" />
                    Year of study
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-foreground">Year {applicant.yearOfStudy}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wide">Skills</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {applicant.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
                  Interest areas
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {applicant.interests.map((interest) => (
                    <Badge key={interest} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="items-start text-left">
              <CardTitle className="font-heading text-lg">Contact details</CardTitle>
              <CardDescription className="font-body">
                Reach out directly or share with your organising team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-foreground font-body">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{applicant.email}</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={`mailto:${applicant.email}`}>Copy</a>
                </Button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-muted-foreground">Contact number</p>
                  <p className="font-medium">{applicant.phone}</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={`tel:${applicant.phone.replace(/\s+/g, "")}`}>Call</a>
                </Button>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium">{applicant.location}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Application history</CardTitle>
            <CardDescription className="font-body">
              Previous CSPs help you gauge experience, commitment, and fit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="applications" className="space-y-4">
              <TabsList>
                <TabsTrigger value="applications" className="font-body">
                  Applications
                </TabsTrigger>
              </TabsList>
              <TabsContent value="applications">
                <ScrollArea className="max-h-[320px] rounded-lg border">
                  <div className="divide-y">
                    {applicant.recentApplications.map((application) => (
                      <div key={application.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <Link
                            to="/csp/$cspId"
                            params={{ cspId: application.id }}
                            className="font-heading text-sm font-semibold text-foreground hover:underline"
                          >
                            {application.title}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-body">
                            <Badge
                              variant="outline"
                              className={`rounded-full border-transparent px-3 py-1 font-semibold ${
                                statusBadgeTone[application.status] ?? "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {application.status.toUpperCase()}
                            </Badge>
                            <span>Applied on {application.appliedOn}</span>
                            <span>Estimated {application.hours} hours</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-sm font-body" asChild>
                          <Link to="/leader/dashboard" search={{ focus: application.id }}>
                            View in dashboard
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
