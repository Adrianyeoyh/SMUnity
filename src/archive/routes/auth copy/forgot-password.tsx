import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Input } from "#client/components/ui/input";
import { Label } from "#client/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Mail, ArrowLeft, HeartHandshake } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Mail className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="font-heading text-2xl">Check Your Email</CardTitle>
            <CardDescription className="font-body">
              We've sent a password reset link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground font-body">
                If you don't see the email in your inbox, please check your spam folder.
              </p>
              <p className="text-sm text-muted-foreground font-body">
                The reset link will expire in 24 hours for security reasons.
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => setEmailSent(false)} 
                variant="outline" 
                className="w-full"
              >
                Try Another Email
              </Button>
              
              <Link to="/auth/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981]">
              <HeartHandshake className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="font-heading text-2xl">Forgot Password?</CardTitle>
          <CardDescription className="font-body">
            No worries! Enter your email and we'll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@smu.edu.sg"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground font-body">
              Remember your password?{" "}
              <Link
                to="/auth/login"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
