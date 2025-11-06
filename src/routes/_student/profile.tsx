import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  Calendar,
  Clock,
  Edit,
  GraduationCap,
  IdCard,
  Mail,
  Phone,
} from "lucide-react";

import { useCompletedCSPs, useMe } from "#client/api/hooks";
import { Badge } from "#client/components/ui/badge";
import { Button } from "#client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#client/components/ui/card";

export const Route = createFileRoute("/_student/profile")({
  component: Profile,
});

function Profile() {
  const { data, isError } = useMe();
  const { data: completedCSPs = [], isLoading: loadingCompleted } =
    useCompletedCSPs();
  const profileData = data?.profile ?? null;

  const currentYear = new Date().getFullYear();
  const entryYear = profileData?.entryYear ?? null;
  const yearOfStudy = entryYear ? Math.max(1, currentYear - entryYear + 1) : 1;

  const displayName = data?.name ?? null;
  const displayEmail = data?.email ?? null;
  const displayStudentId =
    profileData?.studentId ?? (data ? "Not provided" : null);
  const displayPhone = profileData?.phone ?? (data ? "" : null);
  const displaySchool = profileData?.school ?? (data ? "" : null);
  const displaySkills =
    profileData?.skills && profileData.skills.length
      ? profileData.skills
      : data
        ? []
        : null;
  const displayInterests =
    profileData?.interests && profileData.interests.length
      ? profileData.interests
      : data
        ? []
        : null;
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateAvatar = () => {
      setCustomAvatar(window.localStorage.getItem("profileAvatarUrl"));
    };
    updateAvatar();
    window.addEventListener("storage", updateAvatar);
    return () => {
      window.removeEventListener("storage", updateAvatar);
    };
  }, []);

  const avatarImage = customAvatar ?? data?.image ?? null;

  const joinDate = null;
  const formattedJoinDate = joinDate
    ? new Date(joinDate).toLocaleDateString("en-GB")
    : "Not available";

  const aboutItems = [
    {
      icon: GraduationCap,
      label: "School",
      value: displaySchool || "School not specified",
    },
    {
      icon: Calendar,
      label: "Year of Study",
      value: `Year ${yearOfStudy}`,
    },
    {
      icon: IdCard,
      label: "Student ID",
      value: displayStudentId,
    },
    {
      icon: Calendar,
      label: "Joined",
      value: formattedJoinDate,
    },
  ];

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: displayEmail,
    },
    {
      icon: Phone,
      label: "Phone",
      value: displayPhone || "Add a phone number via Edit Profile",
      muted: !displayPhone,
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {isError && (
          <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            We&apos;re showing placeholder data because we couldn&apos;t load
            your latest profile details.
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[400px_1fr]">
          <aside className="space-y-6">
            <Card className="shadow-sm">
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="relative">
                    <img
                      src={avatarImage}
                      alt={displayName}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <Button
                      size="icon"
                      className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
                      asChild
                    >
                      <Link to="/profileedit" search={{ section: "avatar" }}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <h2 className="font-heading text-foreground text-xl font-semibold">
                      {displayName}
                    </h2>
                    <p className="text-muted-foreground font-body text-sm">
                      {displaySchool || "School not specified"}
                    </p>
                    <p className="text-muted-foreground font-body text-xs tracking-wide uppercase">
                      Year {yearOfStudy}
                    </p>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/profileedit" search={{ section: "about" }}>
                      Edit Profile
                    </Link>
                  </Button>
                </div>

                <div className="space-y-6 text-left">
                  <section>
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                      About
                    </p>
                    <div className="mt-3 space-y-3">
                      {aboutItems.map((item) => (
                        <div
                          key={item.label}
                          className="text-muted-foreground flex items-center gap-3 text-sm"
                        >
                          <item.icon className="text-muted-foreground h-4 w-4" />
                          <div className="leading-tight">
                            <p className="text-foreground font-medium">
                              {item.label}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                      Contact
                    </p>
                    <div className="mt-3 space-y-3">
                      {contactItems.map((item) => (
                        <div
                          key={item.label}
                          className="text-muted-foreground flex items-center gap-3 text-sm"
                        >
                          <item.icon className="text-muted-foreground h-4 w-4" />
                          <div className="leading-tight">
                            <p className="text-foreground font-medium">
                              {item.label}
                            </p>
                            <p
                              className={`text-xs ${item.muted ? "text-muted-foreground/70" : "text-muted-foreground"}`}
                            >
                              {item.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </aside>

          <section className="space-y-6">
            {/* <Card className="shadow-sm">
              <CardHeader className="space-y-1">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-semibold">Service Overview</CardTitle>
                  <CardDescription>Track your progress towards {requiredServiceHours} required hours</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-muted-foreground">Completed Hours</span>
                    <span className="font-semibold text-foreground">
                      {totalServiceHours} / {requiredServiceHours}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="mt-3 h-2" />
                </div>
                <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground md:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide">Total Earned</p>
                    <p className="text-base font-medium text-foreground">{totalServiceHours} hours</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide">Remaining</p>
                    <p className="text-base font-medium text-foreground">{hoursRemaining} hours</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide">Completion</p>
                    <p className="text-base font-medium text-foreground">{Math.round(progressPercentage)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            <Card className="shadow-sm">
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold">
                      Skills & Interests
                    </CardTitle>
                    <CardDescription>
                      Organisations use these to tailor opportunities for you
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/profileedit" search={{ section: "skills" }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Skills
                  </p>
                  {displaySkills?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {displaySkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-green-100 text-xs text-green-800 hover:bg-green-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground mt-2 text-sm">
                      Add skills to highlight what you bring to each CSP.
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Interests
                  </p>
                  {displayInterests?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {displayInterests.map((interest) => (
                        <Badge
                          key={interest}
                          variant="outline"
                          className="bg-blue-100 text-xs text-blue-800 hover:bg-blue-200"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground mt-2 text-sm">
                      Choose interests to tailor recommendations for you.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold">
                      Completed CSPs
                    </CardTitle>
                    <CardDescription>
                      Your recent service contributions
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    View all
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {loadingCompleted && (
                  <div className="text-muted-foreground py-6 text-center">
                    Loading completed projects…
                  </div>
                )}

                {!loadingCompleted &&
                  completedCSPs.length > 0 &&
                  completedCSPs.map((csp) => (
                    <Card
                      key={csp.id}
                      className="border-border/60 hover:border-border border shadow-none transition"
                    >
                      <CardContent className="pt-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                          <div>
                            <h4 className="font-heading text-foreground text-base font-semibold">
                              {csp.title}
                            </h4>
                            <p className="text-muted-foreground font-body text-sm">
                              {csp.organisation}
                            </p>
                          </div>
                          <div className="text-muted-foreground flex items-center gap-1 text-sm">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">
                              {csp.serviceHours}h
                            </span>
                          </div>
                        </div>
                        <div className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Completed on{" "}
                            {new Date(csp.completedDate).toLocaleDateString(
                              "en-GB",
                            )}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                {!loadingCompleted && completedCSPs.length === 0 && (
                  <div className="text-muted-foreground rounded-md border border-dashed p-6 text-center text-sm">
                    Completed CSPs will appear here once you finish a project.
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
