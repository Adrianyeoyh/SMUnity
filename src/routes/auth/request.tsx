import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createOrganisationRequest } from "#client/api/organisations/requests";
import { Button } from "#client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#client/components/ui/card";
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
import { env } from "#client/env";

export const Route = createFileRoute("/auth/request")({
  component: RouteComponent,
});

const organiserRequestSchema = z.object({
  email: z.string().email("Valid email required"),
  name: z.string().min(1, "Name is required"),
  organisationName: z.string().min(2, "Organisation name required"),
  organisationDescription: z.string().min(5, "Description required"),
  phone: z.string().min(8, "Valid Phone Number required"),
  website: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

type OrganiserRequestForm = z.infer<typeof organiserRequestSchema>;

function RouteComponent() {
  const [loading, setLoading] = useState(false);

  const form = useForm<OrganiserRequestForm>({
    resolver: zodResolver(organiserRequestSchema),
    defaultValues: {
      email: "",
      name: "",
      organisationName: "",
      organisationDescription: "",
      phone: "",
      website: "",
    },
  });

  async function onSubmit(values: OrganiserRequestForm) {
    setLoading(true);
    try {
      const data = await createOrganisationRequest({
        requesterEmail: values.email,
        requesterName: values.name,
        orgName: values.organisationName,
        orgDescription: values.organisationDescription,
        phone: values.phone,
        website: values.website || null,
      });

      toast.success(`Request submitted! Your ID: ${data.requesterEmail}`);
      form.reset();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="from-primary/5 via-accent/5 to-secondary/5 flex min-h-screen items-center justify-center bg-gradient-to-br px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl">
            Organisation Account Request
          </CardTitle>
          <CardDescription>
            Fill in this form to request an organisation account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@organisation.sg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organisationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organisation Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Helping Hands" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organisationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organisation Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your organisation's mission or activities"
                        className="min-h-[120px]"
                        {...field}
                      />
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
                      <Input placeholder="+65 8999 8999" {...field} />
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
                    <FormLabel>Website (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.org" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </Form>

          <Button
            variant="ghost"
            className="mt-2 w-full"
            onClick={() => (window.location.href = "/auth/login")}
          >
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
