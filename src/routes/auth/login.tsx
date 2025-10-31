import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { auth } from "#client/lib/auth";
import { Button } from "#client/components/ui/button";
import { Input } from "#client/components/ui/input";
import { Checkbox } from "#client/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#client/components/ui/card";
import { Separator } from "#client/components/ui/separator";
import { HeartHandshake, AlertCircle } from "lucide-react";
import { z } from "zod";

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
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/login" });
  const redirectTo = search.redirectTo || "/dashboard";

  async function handleGoogleLogin() {
    try {
      setIsLoading(true);
      setError(null);
      const callbackUrl = `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(
        redirectTo
      )}`;
      const result = await auth.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:4000/dashboard",
        //  callbackUrl,
      });
      // if (result.data?.url) {
      //   window.location.href = result.data.url;
      // } else if (result.data?.user) {
      //   navigate({ to: redirectTo });
      // }
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    setError(null);

    if (!emailLogin.email || !emailLogin.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await auth.signIn.email({
        email: emailLogin.email,
        password: emailLogin.password,
        rememberMe: rememberMe,
      })
      window.dispatchEvent(new Event("auth-change"));
      ;
      if (result?.error) throw new Error(result.error.message);

      // const userType = result.data?.user?.accountType;
      const u = result.data?.user;
      const name = u?.name;
      const email = u?.email?.toLowerCase();

      const isSMUDomain = email.endsWith("@smu.edu.sg");
      const studentMatch = email.match(/\.?(\d{4})@smu\.edu\.sg$/);
      const isStudent = Boolean(studentMatch);

      console.log(name);
      if (isStudent && isSMUDomain) {
        throw new Error("Students must use Google sign-in with SMU email.");
      }

      if (name === "Admin") navigate({ to: "/admin/dashboard" });
      else navigate({ to: "/organisations/dashboard" });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981]">
              <HeartHandshake className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="font-heading text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in with your <span className="font-semibold">@smu.edu.sg</span> account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <p className="text-sm text-destructive font-body">{error}</p>
            </div>
          )}

          {/* GOOGLE OAUTH */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center"
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
              <span className="bg-background px-2 text-muted-foreground font-body">
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
                onChange={(e) => setEmailLogin({ ...emailLogin, email: e.target.value })}
                className={hasAttemptedSubmit && !emailLogin.email ? 'border-destructive' : ''}
              />
              {hasAttemptedSubmit && !emailLogin.email && (
                <p className="text-sm text-destructive font-body">
                  Please enter your email address
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={emailLogin.password}
                onChange={(e) => setEmailLogin({ ...emailLogin, password: e.target.value })}
                className={hasAttemptedSubmit && !emailLogin.password ? 'border-destructive' : ''}
              />
              {hasAttemptedSubmit && !emailLogin.password && (
                <p className="text-sm text-destructive font-body">
                  Please enter your password
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember-me" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-sm font-body leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link 
                  to="/auth/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
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
              <span className="bg-background px-2 text-muted-foreground font-body text-center leading-tight">
                Need an account?
                <br />
                <span className="normal-case text-[11px] text-muted-foreground/70">
                  (For CSP organisations only)
                </span>
              </span>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Request account creation via{" "}
            <Link to="/auth/request" className="text-primary hover:text-primary/80">
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
