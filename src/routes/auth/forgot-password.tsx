import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, HeartHandshake, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "#client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#client/components/ui/card";
import { Input } from "#client/components/ui/input";
import { auth } from "#client/lib/auth.ts";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    setError(null);
    setEmailError(null);

    if (!email) {
      setEmailError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // REAL Better Auth API call
      const { data, error } = await auth.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw new Error(error.message);

      setEmailSent(true);
      toast.success("Password reset email sent", {
        description: "Check your inbox for instructions to reset your password",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send reset email";
      setError(message);
      toast.error("Failed to send reset email", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="from-primary/5 via-accent/5 to-secondary/5 flex min-h-screen items-center justify-center bg-gradient-to-br px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981]">
              <HeartHandshake className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="font-heading text-2xl">
            Forgot Password
          </CardTitle>
          <CardDescription>
            {emailSent
              ? "We've sent you a password reset link"
              : "Enter your email to receive a password reset link"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {emailSent ? (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                  <Mail className="text-primary h-8 w-8" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Check your email at{" "}
                <span className="font-semibold">{email}</span>
              </p>
              <p className="text-muted-foreground text-sm">
                Follow the instructions to reset your password
              </p>
              <div className="space-y-2 pt-2">
                <Button
                  onClick={() =>
                    navigate({
                      to: "/auth/login",
                    })
                  }
                  variant="secondary"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-destructive/10 border-destructive/20 flex items-start space-x-2 rounded-lg border p-3">
                  <AlertCircle className="text-destructive mt-0.5 h-5 w-5" />
                  <p className="text-destructive font-body text-sm">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={emailError ? "border-destructive" : ""}
                  />
                  {emailError && (
                    <p className="text-destructive font-body text-sm">
                      {emailError}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
