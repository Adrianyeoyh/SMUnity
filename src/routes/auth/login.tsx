import { useEffect, useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { Eye, EyeOff, HeartHandshake } from "lucide-react";
import { z } from "zod";

import { Button } from "#client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#client/components/ui/card";
import { Checkbox } from "#client/components/ui/checkbox";
import { Input } from "#client/components/ui/input";
import { Separator } from "#client/components/ui/separator";
import { env } from "#client/env";
import { auth } from "#client/lib/auth";

export const Route = createFileRoute("/auth/login")({
  validateSearch: z.object({
    redirectTo: z.string().optional(),
  }),
  component: Login,
});

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailLogin, setEmailLogin] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/login" });
  const redirectTo = search.redirectTo || "/dashboard";

  async function handleGoogleLogin() {
    try {
      setIsLoading(true);
      await auth.signIn.social({
        provider: "google",
        callbackURL: env.VITE_APP_URL + "/dashboard",
        //  callbackUrl,
      });
      // if (result.data?.url) {
      //   window.location.href = result.data.url;
      // } else if (result.data?.user) {
      //   navigate({ to: redirectTo });
      // }
    } catch (err: any) {
      // Don't display errors for Google login - silent failure
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    setError(null);

    setIsLoading(true);
    try {
      const isSMUDomain = emailLogin.email.endsWith("@smu.edu.sg");
      const studentMatch = emailLogin.email.match(/\.?(\d{4})@smu\.edu\.sg$/);
      const isStudent = Boolean(studentMatch);

      // console.log(name);
      if (isStudent && isSMUDomain) {
        throw new Error("Students must use Google sign-in with SMU email");
      }

      const result = await auth.signIn.email({
        email: emailLogin.email,
        password: emailLogin.password,
        rememberMe: rememberMe,
      });

      if (result?.error) throw new Error(result.error.message);

      window.dispatchEvent(new Event("auth-change"));

      const { data } = await auth.getSession();

      // const userType = result.data?.user?.accountType;
      const u = data?.user;
      // @ts-expect-error
      const accountType = u?.accountType;

      if (accountType == "admin") {
        navigate({ to: "/admin/dashboard" });
      } else if (accountType == "organisation") {
        navigate({ to: "/organisations/dashboard" });
      } else {
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function checkSession() {
      const session = await auth.getSession();
      if (session?.data?.user) {
        navigate({ to: redirectTo });
      }
    }
    checkSession();
  }, [navigate, redirectTo]);

  return (
    <div className="from-primary/5 via-accent/5 to-secondary/5 flex min-h-screen items-center justify-center bg-gradient-to-br px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981]">
              <HeartHandshake className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="font-heading text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in with your <span className="font-semibold">@smu.edu.sg</span>{" "}
            account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* GOOGLE OAUTH */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isLoading ? "Redirecting..." : "Continue with Google"}
          </Button>

          {/* --- SEPARATOR --- */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground font-body px-2">
                Organisation / Admin Login
              </span>
            </div>
          </div>

          {/* --- ORG/ADMIN LOGIN FORM --- */}
          <form onSubmit={handleEmailLogin} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={emailLogin.email}
                onChange={(e) => {
                  setEmailLogin({ ...emailLogin, email: e.target.value });
                  setError(null);
                }}
                className={
                  hasAttemptedSubmit &&
                  !emailLogin.email &&
                  !emailLogin.password
                    ? "border-destructive"
                    : error && emailLogin.email && emailLogin.password
                      ? "border-destructive"
                      : ""
                }
              />
              {hasAttemptedSubmit && !emailLogin.email && (
                <p className="text-destructive font-body text-sm">
                  Please enter your email address
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={emailLogin.password}
                  onChange={(e) => {
                    setEmailLogin({ ...emailLogin, password: e.target.value });
                    setError(null);
                  }}
                  className={
                    hasAttemptedSubmit &&
                    !emailLogin.password &&
                    emailLogin.email
                      ? "border-destructive pr-10"
                      : error
                        ? "border-destructive pr-10"
                        : "pr-10"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {hasAttemptedSubmit &&
                !emailLogin.password &&
                emailLogin.email && (
                  <p className="text-destructive font-body text-sm">
                    Please enter your password
                  </p>
                )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                  />
                  <label
                    htmlFor="remember-me"
                    className="font-body text-muted-foreground cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/auth/forgot-password"
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            {error && emailLogin.email && emailLogin.password && (
              <div className="bg-destructive/10 border-destructive/20 rounded-md border p-3">
                <p className="text-destructive font-body text-sm">{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* --- SEPARATOR FOR SIGNUP --- */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground font-body px-2 text-center leading-tight">
                Need an account?
                <br />
                <span className="text-muted-foreground/70 text-[11px] normal-case">
                  (For CSP organisations only)
                </span>
              </span>
            </div>
          </div>
          <div className="text-muted-foreground text-center text-sm">
            Request account creation via{" "}
            <Link
              to="/auth/request"
              className="text-primary hover:text-primary/80"
            >
              admin approval form
            </Link>
          </div>
          {/* <div className="text-center text-sm text-muted-foreground">
            <Link to="/auth/signup" className="text-primary hover:text-primary/80">
              Sign up with SMU
            </Link>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
