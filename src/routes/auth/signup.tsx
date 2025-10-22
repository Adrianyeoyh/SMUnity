import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { auth } from "#client/lib/auth";
import { toast } from "sonner";
import { Button } from "#client/components/ui/button";
import { Input } from "#client/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { AlertCircle, HeartHandshake, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/auth/signup")({
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  // 👁️ Track visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.email) return setError("Email is required.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    try {
      setIsLoading(true);

      const result = await auth.signUp.emailAndPassword({
        email: form.email,
        password: form.password,
      });

      if (result.error) {
        throw new Error(result.error.message || "Sign-up failed");
      }

      toast.success("Account created. Please verify your email to continue.");
      navigate({ to: "/auth/login" });
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : "Sign-up failed";
      setError(msg);
      toast.error("Sign-up failed", { description: msg });
    } finally {
      setIsLoading(false);
    }
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
          <CardTitle className="font-heading text-2xl">Join SMUnity</CardTitle>
          <CardDescription className="font-body">
            Sign up with your requested email account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <p className="text-sm text-destructive font-body">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailSignup} className="space-y-4">
            {/* EMAIL */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-1 relative">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD FIELD */}
            <div className="space-y-1 relative">
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* SIGN-IN LINK */}
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:text-primary/80">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
