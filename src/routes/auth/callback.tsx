import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/callback")({
  // 👇 declare the type of search params (query params)
  validateSearch: (search: Record<string, unknown>) => ({
    redirectTo: typeof search.redirectTo === "string" ? search.redirectTo : undefined,
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-pulse text-lg text-gray-600 mb-2">
          Logging you in...
        </div>
        <p className="text-sm text-gray-400">
          Please wait while we redirect you.
        </p>
      </div>
    </div>
  );
}
