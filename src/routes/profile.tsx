import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMe } from "#client/api/hooks";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Progress } from "#client/components/ui/progress";
import { Award, Calendar, Clock, Edit, GraduationCap, IdCard, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

const FALLBACK_PROFILE = {
  name: "John Doe",
  email: "john.doe@smu.edu.sg",
  studentId: "12345678",
  phone: "+65 9123 4567",
  school: "Lee Kong Chian School of Business",
  entryYear: 2022,
  skills: ["Leadership", "Communication", "Project Management", "Teaching"],
  interests: ["Education", "Environment", "Community Service"],
  totalServiceHours: 120,
  requiredServiceHours: 200,
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  joinDate: "2022-08-15",
};

function Profile() {
  const { data, isError } = useMe();
  const profileData = data?.profile ?? null;

  const currentYear = new Date().getFullYear();
  const entryYear = profileData?.entryYear ?? FALLBACK_PROFILE.entryYear;
  const yearOfStudy = entryYear ? Math.max(1, currentYear - entryYear + 1) : 1;

  const displayName = data?.name ?? FALLBACK_PROFILE.name;
  const displayEmail = data?.email ?? FALLBACK_PROFILE.email;
  const displayStudentId = profileData?.studentId ?? (data ? "Not provided" : FALLBACK_PROFILE.studentId);
  const displayPhone = profileData?.phone ?? (data ? "" : FALLBACK_PROFILE.phone);
  const displaySchool = profileData?.school ?? (data ? "" : FALLBACK_PROFILE.school);
  const displaySkills =
    profileData?.skills && profileData.skills.length ? profileData.skills : data ? [] : FALLBACK_PROFILE.skills;
  const displayInterests =
    profileData?.interests && profileData.interests.length ? profileData.interests : data ? [] : FALLBACK_PROFILE.interests;
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

  const avatarImage = customAvatar ?? data?.image ?? FALLBACK_PROFILE.image;

  const totalServiceHours = data?.dashboard?.verifiedHours ?? FALLBACK_PROFILE.totalServiceHours;
  const requiredServiceHours = FALLBACK_PROFILE.requiredServiceHours;
  const progressPercentage = requiredServiceHours ? Math.min((totalServiceHours / requiredServiceHours) * 100, 100) : 0;
  const hoursRemaining = Math.max(requiredServiceHours - totalServiceHours, 0);
  const joinDate = FALLBACK_PROFILE.joinDate;
  const formattedJoinDate = joinDate ? new Date(joinDate).toLocaleDateString("en-GB") : "Not available";

  const completedCSPs = [
    {
      id: "1",
      title: "Community Garden Project",
      organisation: "Green Thumbs",
      completedDate: "2023-12-15",
      serviceHours: 20,
      rating: 5,
    },
    {
      id: "2",
      title: "Food Bank Volunteer",
      organisation: "Food for All",
      completedDate: "2023-11-30",
      serviceHours: 15,
      rating: 4,
    },
  ];

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {isError && (
          <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            We&apos;re showing placeholder data because we couldn&apos;t load your latest profile details.
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[400px_1fr]">
          <aside className="space-y-6">
            <Card className="shadow-sm">
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="relative">
                    <img src={avatarImage} alt={displayName} className="h-24 w-24 rounded-full object-cover" />
                    <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full" asChild>
                      <Link to="/profileedit" search={{ section: "avatar" }}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <h2 className="font-heading text-xl font-semibold text-foreground">{displayName}</h2>
                    <p className="text-sm text-muted-foreground font-body">{displaySchool || "School not specified"}</p>
                    <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">Year {yearOfStudy}</p>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/profileedit" search={{ section: "about" }}>
                      Edit Profile
                    </Link>
                  </Button>
                </div>

                <div className="space-y-6 text-left">
                  <section>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">About</p>
                    <div className="mt-3 space-y-3">
                      {aboutItems.map((item) => (
                        <div key={item.label} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <div className="leading-tight">
                            <p className="font-medium text-foreground">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact</p>
                    <div className="mt-3 space-y-3">
                      {contactItems.map((item) => (
                        <div key={item.label} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <div className="leading-tight">
                            <p className="font-medium text-foreground">{item.label}</p>
                            <p className={`text-xs ${item.muted ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
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
            <Card className="shadow-sm">
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
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold">Skills & Interests</CardTitle>
                    <CardDescription>Organisations use these to tailor opportunities for you</CardDescription>
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
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skills</p>
                  {displaySkills.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {displaySkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Add skills to highlight what you bring to each CSP.
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Interests</p>
                  {displayInterests.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {displayInterests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
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
                    <CardTitle className="text-xl font-semibold">Completed CSPs</CardTitle>
                    <CardDescription>Your recent service contributions</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    View all
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {completedCSPs.map((csp) => (
                  <Card key={csp.id} className="border border-border/60 shadow-none transition hover:border-border">
                    <CardContent className="pt-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                        <div>
                          <h4 className="font-heading text-base font-semibold text-foreground">{csp.title}</h4>
                          <p className="text-sm text-muted-foreground font-body">{csp.organisation}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{csp.rating}/5</span>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-4 text-sm text-muted-foreground md:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Completed on {new Date(csp.completedDate).toLocaleDateString("en-GB")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{csp.serviceHours} service hours</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {!completedCSPs.length && (
                  <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
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
