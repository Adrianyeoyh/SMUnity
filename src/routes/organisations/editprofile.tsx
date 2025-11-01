import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#client/components/ui/form";
import { Input } from "#client/components/ui/input";
import { Textarea } from "#client/components/ui/textarea";
import { Button } from "#client/components/ui/button";
import { Card, CardContent } from "#client/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/organisations/editprofile")({
  component: OrganisationProfileEdit,
});

const organisationProfileSchema = z.object({
  organisationName: z.string().trim().min(1, "Organisation name is required"),
  contactPerson: z.string().trim().min(1, "Contact person is required"),
  phone: z.string().trim().min(8, "Phone number must be at least 8 digits"),
  website: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      "Enter a valid website URL",
    )
    .optional(),
  description: z.string().trim().min(1, "Description is required"),
});

type OrganisationProfileFormValues = z.infer<typeof organisationProfileSchema>;

// Mock data - in real implementation, this would come from API
const PROFILE_DATA = {
  organisationName: "Sample Organisation",
  contactPerson: "John Doe",
  phone: "+65 9123 4567",
  website: "https://www.organisation.sg",
  description: "We are dedicated to making a positive impact in our community through various community service projects. Our mission is to connect volunteers with meaningful opportunities that create lasting change.",
};

function OrganisationProfileEdit() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OrganisationProfileFormValues>({
    resolver: zodResolver(organisationProfileSchema),
    defaultValues: {
      organisationName: PROFILE_DATA.organisationName,
      contactPerson: PROFILE_DATA.contactPerson,
      phone: PROFILE_DATA.phone,
      website: PROFILE_DATA.website,
      description: PROFILE_DATA.description,
    },
  });

  const onSubmit = async (values: OrganisationProfileFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to update organisation profile
      console.log("Updating organisation profile:", values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("Profile updated");
      navigate({ to: "/organisations/profile" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile.";
      toast.error(message, { className: "bg-destructive text-destructive-foreground" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <nav aria-label="Breadcrumb">
          <ol className="text-sm text-muted-foreground flex items-center gap-2">
            <li className="flex items-center gap-2">
              <Link to="/organisations/profile" className="hover:text-foreground transition-colors">
                Profile
              </Link>
              <span aria-hidden="true">/</span>
            </li>
            <li aria-current="page" className="text-foreground font-medium">
              Edit
            </li>
          </ol>
        </nav>

        <Card className="shadow-sm border border-border/60">
          <CardContent className="pt-1">
            <div className="space-y-6">
              <div className="space-y-1">
                <h1 className="text-xl font-semibold text-foreground">Edit Profile & Description</h1>
                <p className="text-sm text-muted-foreground">Update your organisation details.</p>
              </div>

              <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="organisationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organisation Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Sample Organisation" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. John Doe" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="+65 9123 4567"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="url"
                            placeholder="https://www.organisation.sg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe your organisation and its mission..."
                            className="min-h-[120px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="h-1" aria-hidden="true" />

                  <div className="sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 py-4">
                    <div className="container mx-auto px-4 lg:px-8">
                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:items-center">
                        <Button variant="ghost" asChild disabled={isSubmitting}>
                          <Link to="/organisations/profile">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Save changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default OrganisationProfileEdit;
