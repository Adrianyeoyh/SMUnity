import { useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import { useRouter } from "@tanstack/react-router";

/**
 * Restricts route access based on allowed roles.
 * Redirects immediately if user is unauthorized.
 */
export function useRoleGuard(allowedRoles: Array<"student" | "organisation" | "admin">) {
  const { user, isLoading, isLoggedIn } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  console.log("Guard check:", { isLoading, isLoggedIn, role: user?.accountType });


  useEffect(() => {
    if (isLoading) return; // wait for auth to finish

    // not logged in → redirect to login
    if (!isLoggedIn) {
      setIsRedirecting(true);
      router.navigate({ to: "/auth/login", replace: true });
      return;
    }

    const role = user?.accountType;

    // role mismatch → reroute to correct dashboard
    if (!allowedRoles.includes(role)) {
      setIsRedirecting(true);

      if (role === "student") {
        router.navigate({ to: "/dashboard", replace: true });
      } else if (role === "organisation") {
        router.navigate({ to: "/organisations/dashboard", replace: true });
      } else if (role === "admin") {
        router.navigate({ to: "/admin/dashboard", replace: true });
      } else {
        router.navigate({ to: "/", replace: true });
      }
    }
  }, [isLoading, isLoggedIn, user, allowedRoles, router]);

  return {
    user,
    isLoading,
    isRedirecting,
  };
}
