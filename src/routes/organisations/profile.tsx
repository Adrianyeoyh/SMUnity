import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Globe, Phone, User, Edit, Trash2, Mail, Building2 } from "lucide-react";
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

export const Route = createFileRoute("/organisations/profile")({
  component: OrganisationProfile,
});

const PROFILE_DATA = {
  name: "Sample Organisation",
  email: "contact@organisation.sg",
  organisationName: "Sample Organisation",
  description: "We are dedicated to making a positive impact in our community through various community service projects. Our mission is to connect volunteers with meaningful opportunities that create lasting change.",
  website: "https://www.organisation.sg",
  phone: "+65 9123 4567",
  contactPerson: "John Doe",
};

function OrganisationProfile() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const displayEmail = PROFILE_DATA.email;
  const displayOrganisationName = PROFILE_DATA.organisationName;
  const displayDescription = PROFILE_DATA.description;
  const displayWebsite = PROFILE_DATA.website;
  const displayPhone = PROFILE_DATA.phone;
  const displayContactPerson = PROFILE_DATA.contactPerson;

  const aboutItems = [
    {
      icon: Building2,
      label: "Organisation Name",
      value: displayOrganisationName,
    },
    {
      icon: User,
      label: "Contact Person",
      value: displayContactPerson,
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
    // TODO: Implement delete account API call
    console.log("Delete account clicked");
    setShowDeleteDialog(false);
    // After successful deletion, redirect to home or logout
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[400px_1fr]">
          <aside className="space-y-6">
            <Card className="shadow-sm">
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981] flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h2 className="font-heading text-xl font-semibold text-foreground">{displayOrganisationName}</h2>
                  </div>
                   <Button variant="outline" className="w-full" asChild>
                     <Link to="/organisations/editprofile">
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
                            {item.isLink ? (
                              <a
                                href={item.value}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                {item.value}
                              </a>
                            ) : (
                              <p className={`text-xs ${item.muted ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                                {item.value}
                              </p>
                            )}
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
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold">Description</CardTitle>
                    <CardDescription>About your organisation</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/organisations/editprofile">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {displayDescription}
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
                      and remove all associated data including listings and applications. <br/> <br/>This action cannot be undone. 
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default OrganisationProfile;
