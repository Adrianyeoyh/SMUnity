import { useEffect, useState } from "react";
import { auth } from "#client/lib/auth";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const session = await auth.getSession();
      if (session?.data?.user) {
        setIsLoggedIn(true);
        setUser(session.data.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for custom auth events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("auth-change", handleAuthChange);
    
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      setUser(null);
      window.dispatchEvent(new Event("auth-change"));
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    isLoggedIn,
    user,
    isLoading,
    logout,
    refetch: checkAuth,
  };
}
