import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Input } from "#client/components/ui/input";
import { Label } from "#client/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Checkbox } from "#client/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#client/components/ui/select";
import { Separator } from "#client/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, Phone, GraduationCap, AlertCircle, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { auth } from "#client/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/signup")({
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCspLeader, setIsCspLeader] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match", {
        description: "Please ensure both passwords are the same",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await auth.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message || "Failed to create account");
        toast.error("Signup failed", {
          description: result.error.message || "Could not create your account",
        });
      } else {
        toast.success("Account created!", {
          description: "Welcome to SMUnity! You can now sign in.",
        });
        // Navigate to login page after successful signup
        navigate({ to: "/auth/login" });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error("Signup failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981]">
              <HeartHandshake className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="font-heading text-2xl">Create Account</CardTitle>
          <CardDescription className="font-body">
            Join SMUnity and start making a difference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <p className="text-sm text-destructive font-body">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-body">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-body">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@smu.edu.sg"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId" className="font-body">Student ID</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="studentId"
                  type="text"
                  placeholder="e.g., 12345678"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-body">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+65 1234 5678"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearOfStudy" className="font-body">Year of Study</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                    <SelectItem value="5">Year 5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="major" className="font-body">Major</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select major" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="economics">Economics</SelectItem>
                    <SelectItem value="law">Law</SelectItem>
                    <SelectItem value="computing">Computing</SelectItem>
                    <SelectItem value="social-sciences">Social Sciences</SelectItem>
                    <SelectItem value="accountancy">Accountancy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-body">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-body">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cspLeader"
                  checked={isCspLeader}
                  onCheckedChange={(checked) => setIsCspLeader(checked as boolean)}
                />
                <Label htmlFor="cspLeader" className="text-sm font-body">
                  I am a CSP leader representing an organisation
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  required
                />
                <Label htmlFor="terms" className="text-sm font-body">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:text-primary/80">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:text-primary/80">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!agreeToTerms || isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-body">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
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
              Google
            </Button>
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground font-body">
              Already have an account?{" "}
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