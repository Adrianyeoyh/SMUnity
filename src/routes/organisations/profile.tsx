import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Edit, Globe, Mail, Phone, Trash2 } from "lucide-react";

import { useOrganisation } from "#client/api/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#client/components/ui/alert-dialog";
import { Button } from "#client/components/ui/button";
import {
  Card,
  CardContent
} from "#client/components/ui/card";

export const Route = createFileRoute("/organisations/profile")({
  component: OrganisationProfile,
});

const PROFILE_DATA = {
  name: "Sample Organisation",
  email: "contact@organisation.sg",
  organisationName: "Sample Organisation",
  description:
    "We are dedicated to making a positive impact in our community through various community service projects. Our mission is to connect volunteers with meaningful opportunities that create lasting change.",
  website: "https://www.organisation.sg",
  phone: "+65 9123 4567",
};

function OrganisationProfile() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data, isLoading, isError } = useOrganisation();

  const displayOrganisationName = data?.name ?? PROFILE_DATA.organisationName;
  const displayEmail = data?.email ?? PROFILE_DATA.email;
  const displayPhone = data?.phone ?? "";
  const displayWebsite = data?.website ?? "";
  const displayDescription = data?.description ?? PROFILE_DATA.description;

  const aboutItems = [
    {
      icon: Edit,
      label: "Description",
      value: displayDescription,
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
    {
      icon: Globe,
      label: "Website",
      value: displayWebsite || "Add a website via Edit Profile",
      muted: !displayWebsite,
      isLink: !!displayWebsite,
    },
  ];

  const handleDeleteAccount = async () => {
    console.log("Delete account clicked");
    setShowDeleteDialog(false);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {/* Error alert */}
        {isError && (
          <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            We&apos;re showing placeholder information because we couldn&apos;t
            load your latest organisation profile.
          </div>
        )}

        {/* Centered wider card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-3xl shadow-sm">
            <CardContent className="space-y-8 py-8">
              {/* Header section */}
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981]">
                    <Building2 className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h2 className="font-heading text-foreground text-2xl font-semibold">
                    {displayOrganisationName}
                  </h2>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button variant="outline" asChild>
                    <Link to="/organisations/editprofile">Edit Profile</Link>
                  </Button>
                  {/* Delete Button — visible but not dominant */}
                  <AlertDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete your organisation account
                          and remove all associated data including listings and
                          applications. <br /> <br />
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* About section */}
              <section>
                <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                  About
                </p>
                <div className="space-y-3">
                  {aboutItems.map((item) => (
                    <div
                      key={item.label}
                      className="text-muted-foreground flex items-start gap-3 text-sm"
                    >
                      <item.icon className="text-muted-foreground mt-1 h-4 w-4" />
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

              {/* Contact section */}
              <section>
                <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                  Contact
                </p>
                <div className="space-y-3">
                  {contactItems.map((item) => (
                    <div
                      key={item.label}
                      className="text-muted-foreground flex items-start gap-3 text-sm"
                    >
                      <item.icon className="text-muted-foreground mt-1 h-4 w-4" />
                      <div className="leading-tight">
                        <p className="text-foreground font-medium">
                          {item.label}
                        </p>
                        {item.isLink ? (
                          <a
                            href={item.value}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary text-xs break-all hover:underline"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p
                            className={`text-xs ${
                              item.muted
                                ? "text-muted-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OrganisationProfile;
