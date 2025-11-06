import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
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
import { useOrganisation, useUpdateOrganisation } from "#client/api/hooks";

export const Route = createFileRoute("/organisations/editprofile")({
  component: OrganisationProfileEdit,
});

const organisationProfileSchema = z.object({
  name: z.string().trim().min(1, "Organisation name is required"),
  phone: z.string().trim().min(8, "Phone number must be at least 8 digits"),
  website: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      "Enter a valid website URL"
    )
    .optional(),
  description: z.string().trim().min(1, "Description is required"),
});

type OrganisationProfileFormValues = z.infer<typeof organisationProfileSchema>;

function OrganisationProfileEdit() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useOrganisation();
  const updateOrganisation = useUpdateOrganisation();
  const isSubmitting = updateOrganisation.isPending;

  const form = useForm<OrganisationProfileFormValues>({
    resolver: zodResolver(organisationProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      website: "",
      description: "",
    },
  });

  // Load organisation data into the form
  useEffect(() => {
    if (!data) return;
    form.reset({
      name: data.name ?? "",
      phone: data.phone ?? "",
      website: data.website ?? "",
      description: data.description ?? "",
    });
  }, [data, form]);

  const onSubmit = async (values: OrganisationProfileFormValues) => {
    try {
      await updateOrganisation.mutateAsync(values);
      toast.success("Profile updated");
      navigate({ to: "/organisations/profile" });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update organisation profile.";
      toast.error(message, {
        className: "bg-destructive text-destructive-foreground",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <nav aria-label="Breadcrumb">
          <ol className="text-sm text-muted-foreground flex items-center gap-2">
            <li className="flex items-center gap-2">
              <Link
                to="/organisations/profile"
                className="hover:text-foreground transition-colors"
              >
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
            {isLoading ? (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading profile…</span>
              </div>
            ) : isError ? (
              <p className="text-sm text-destructive">
                Could not load your organisation profile. Please try again later.
              </p>
            ) : (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h1 className="text-xl font-semibold text-foreground">
                    Edit Organisation Profile
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Update your organisation details and description.
                  </p>
                </div>

                <Form {...form}>
                  <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="name"
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default OrganisationProfileEdit;
