import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { auth } from "#client/lib/auth";
import { Button } from "#client/components/ui/button";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "#client/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/auth/adminOnly")({
  component: AdminOnly,
});

function AdminOnly() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function createAdminAccount() {
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      // create the admin user through BetterAuth signup API
      const result = await auth.signUp.email({
        email: "admin@smunity.sg",
        name: "admin",
        password: "admin1234",
      });

      if (result.error) throw new Error(result.error.message);

      toast.success("Admin account created successfully.");
      setStatus("success");
      setMessage("Admin account created successfully!");
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : "Failed to create admin account.";
      toast.error(msg);
      setStatus("error");
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Admin Setup Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "error" && (
            <div className="flex items-center justify-center space-x-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}
          {status === "success" && (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          <p className="text-muted-foreground text-sm">
            Click below to create a default admin account:
            <br />
            <span className="font-mono text-xs">admin@smunity.sg / admin1234</span>
          </p>

          <Button onClick={createAdminAccount} disabled={loading}>
            {loading ? "Creating..." : "Create Admin Account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
