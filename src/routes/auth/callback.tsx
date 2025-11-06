import { useEffect } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/callback")({
  // 👇 declare the type of search params (query params)
  validateSearch: (search: Record<string, unknown>) => ({
    redirectTo:
      typeof search.redirectTo === "string" ? search.redirectTo : undefined,
  }),
  component: AuthCallback,
});

function AuthCallback() {
  // ✅ now fully typed
  const { redirectTo } = useSearch({ from: "/auth/callback" });

  useEffect(() => {
    const target = redirectTo || "/dashboard";
    // small delay for smoother transition
    setTimeout(() => {
      window.location.href = target;
    }, 500);
  }, [redirectTo]);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-2 animate-pulse text-lg text-gray-600">
          Logging you in...
        </div>
        <p className="text-sm text-gray-400">
          Please wait while we redirect you.
        </p>
      </div>
    </div>
  );
}
