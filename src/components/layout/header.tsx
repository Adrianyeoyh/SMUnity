import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Building2,
  FileText,
  Heart,
  HeartHandshake,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  User,
  X,
} from "lucide-react";

import { useMe } from "#client/api/hooks";
// import ProfileDropdown from "#client/components/layout/profile-dropdown.tsx";
import ProfileMenu from "#client/components/layout/profileMenu.tsx";
import { Badge } from "#client/components/ui/badge";
import { Button } from "#client/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#client/components/ui/popover";
import { useMobileMenu } from "#client/contexts/mobile-menu-context";
import { useAuth } from "#client/hooks/use-auth";

export function Header() {
  const { isMenuOpen, setIsMenuOpen } = useMobileMenu();
  const [isJiggling, setIsJiggling] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, isLoading, logout, user } = useAuth();
  const { data: userData } = useMe();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  // Get first letter of user's name for avatar
  const userName = userData?.name || user?.email || "";
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : "?";

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const notifications = [
    {
      id: 1,
      title: "Application Accepted!",
      message: "Your application for Project Kidleidoscope has been accepted.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "New CSP Available",
      message:
        "Beach Cleanup at East Coast Park is now accepting applications.",
      time: "1 day ago",
      unread: true,
    },
    {
      id: 3,
      title: "Reminder: CSU Module",
      message:
        "Don't forget to complete your CSU module before applying for CSPs.",
      time: "3 days ago",
      unread: true,
    },
  ];

  const handleBellClick = () => {
    setIsJiggling(true);
    setTimeout(() => setIsJiggling(false), 600);
  };

  const getLogoDestination = () => {
    return "/"; // Always route to landing page
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isLandingPage && !isScrolled
          ? "border-transparent bg-transparent"
          : "bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative flex h-16 items-center justify-between">
          <Link
            to={getLogoDestination()}
            className="flex flex-shrink-0 items-center space-x-2 sm:space-x-3 md:mr-8 lg:mr-12"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981]">
              <HeartHandshake className="h-6 w-6 text-white" />
            </div>
            <span className="font-heading text-gradient-smunity text-base font-bold sm:text-lg md:text-xl lg:text-2xl">
              SMUnity
            </span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-4 md:left-[calc(50%+2rem)] md:flex lg:left-1/2 lg:gap-6 xl:gap-12">
            {isLoading ? null : !isLoggedIn ? (
              <>
                <Link
                  to="/"
                  className="nav-link text-foreground group relative flex items-center justify-center space-x-2 py-2 text-xs font-medium transition-colors sm:text-sm md:text-base"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                  <span
                    className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: "oklch(0.45 0.15 200)" }}
                  ></span>
                </Link>
                <Link
                  to="/discover"
                  className="nav-link text-foreground group relative flex items-center justify-center space-x-2 py-2 text-xs font-medium whitespace-nowrap transition-colors sm:text-sm md:text-base"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Search className="h-4 w-4" />
                  <span>Discover CSPs</span>
                  <span
                    className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: "oklch(0.45 0.15 200)" }}
                  ></span>
                </Link>
              </>
            ) : user?.accountType === "admin" ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="nav-link text-foreground group relative flex items-center justify-center space-x-2 py-2 text-xs font-medium transition-colors sm:text-sm md:text-base"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                  <span
                    className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: "oklch(0.45 0.15 200)" }}
                  ></span>
                </Link>
                <Link
                  to="/admin/organisations"
                  className="nav-link text-foreground group relative flex items-center justify-center space-x-2 py-2 text-xs font-medium whitespace-nowrap transition-colors sm:text-sm md:text-base"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Building2 className="h-4 w-4" />
                  <span>View Organisations</span>
                  <span
                    className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: "oklch(0.45 0.15 200)" }}
                  ></span>
                </Link>
              </>
            ) : user?.accountType === "organisation" ? (
              <>
                <Link
                  to="/organisations/dashboard"
                  className="nav-link text-foreground group relative flex items-center justify-center space-x-2 py-2 text-xs font-medium transition-colors sm:text-sm md:text-base"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                  <span
                    className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: "oklch(0.45 0.15 200)" }}
                  ></span>
                </Link>
                <Link
                  to="/discover"
                  className="nav-link text-foreground group relative flex items-center justify-center space-x-2 py-2 text-xs font-medium whitespace-nowrap transition-colors sm:text-sm md:text-base"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Search className="h-4 w-4" />
                  <span>Discover CSPs</span>
                  <span
                    className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: "oklch(0.45 0.15 200)" }}
                  ></span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="nav-link text-foreground group relative flex items-center justify-center space-x-2 py-2 text-xs font-medium transition-colors sm:text-sm md:text-base"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                  <span
                    className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: "oklch(0.45 0.15 200)" }}
                  ></span>
                </Link>
                <Link
                  to="/discover"
                  className="nav-link text-foreground group relative flex items-center justify-center space-x-2 py-2 text-xs font-medium whitespace-nowrap transition-colors sm:text-sm md:text-base"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Search className="h-4 w-4" />
                  <span>Discover CSPs</span>
                  <span
                    className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: "oklch(0.45 0.15 200)" }}
                  ></span>
                </Link>
                <Link
                  to="/my-applications"
                  className="nav-link text-foreground group relative flex items-center justify-center space-x-2 py-2 text-xs font-medium whitespace-nowrap transition-colors sm:text-sm md:text-base"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <FileText className="h-4 w-4" />
                  <span>My Applications</span>
                  <span
                    className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: "oklch(0.45 0.15 200)" }}
                  ></span>
                </Link>
              </>
            )}
          </nav>

          <div className="relative z-50 flex items-center gap-3 sm:gap-4">
            {/* Desktop Notifications (hidden on mobile) */}
            {isLoading ? null : isLoggedIn ? (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hidden md:flex"
                      onClick={handleBellClick}
                    >
                      <Bell
                        className={`h-5 w-5 ${isJiggling ? "animate-pulse" : ""}`}
                        style={{
                          animation: isJiggling
                            ? "shake 0.6s ease-in-out"
                            : "none",
                          transformOrigin: "top center",
                        }}
                      />
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                      >
                        {notifications.filter((n) => n.unread).length}
                      </Badge>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="border-b p-4">
                      <h3 className="font-heading text-sm font-semibold sm:text-base md:text-lg">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`hover:bg-muted/50 border-b p-4 transition-colors ${
                            notification.unread ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <div className="space-y-1">
                            <h4 className="font-heading text-xs font-medium sm:text-sm md:text-base">
                              {notification.title}
                            </h4>
                            <p className="text-muted-foreground text-xs">
                              {notification.message}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {notifications.length === 0 && (
                      <div className="text-muted-foreground p-8 text-center">
                        <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
                        <p className="text-xs sm:text-sm md:text-base">
                          No notifications yet
                        </p>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                <div className="hidden md:block">
                  <ProfileMenu />
                </div>
              </>
            ) : (
              <>
                <div className="hidden items-center space-x-2 md:flex">
                  <Link to="/auth/login">
                    <Button>Sign In</Button>
                  </Link>
                </div>
              </>
            )}

            {/* Mobile: Notifications first, then Hamburger */}
            {isLoggedIn && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative md:hidden"
                    onClick={handleBellClick}
                  >
                    <Bell
                      className={`h-5 w-5 ${isJiggling ? "animate-pulse" : ""}`}
                      style={{
                        animation: isJiggling
                          ? "shake 0.6s ease-in-out"
                          : "none",
                        transformOrigin: "top center",
                      }}
                    />
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                    >
                      {notifications.filter((n) => n.unread).length}
                    </Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="border-b p-4">
                    <h3 className="font-heading font-semibold">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`hover:bg-muted/50 border-b p-4 transition-colors ${
                          notification.unread ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="space-y-1">
                          <h4 className="font-heading text-sm font-medium">
                            {notification.title}
                          </h4>
                          <p className="text-muted-foreground text-xs">
                            {notification.message}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Hamburger Menu - always last on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && !isLoading && (
            <>
              <motion.div
                className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
                onClick={() => setIsMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="bg-background fixed inset-0 z-[70] flex flex-col overflow-y-auto md:hidden"
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 200,
                  duration: 0.4,
                }}
                style={{
                  height: "100vh",
                  width: "100vw",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <div className="container mx-auto flex-1 px-4 py-6 pb-12 sm:px-6">
                  <div className="mb-8 flex items-center justify-between">
                    <Link
                      to={getLogoDestination()}
                      className="flex flex-shrink-0 items-center space-x-2 sm:space-x-3"
                      onClick={() => {
                        setIsMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981]">
                        <HeartHandshake className="h-6 w-6 text-white" />
                      </div>
                      <span className="font-heading text-gradient-smunity text-base font-bold sm:text-lg md:text-xl lg:text-2xl">
                        SMUnity
                      </span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Profile Avatar Section - only show when logged in */}
                  {isLoggedIn && userName && (
                    <div className="mb-6 flex items-center gap-3 border-b pb-6">
                      <div className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-lg font-semibold transition-all duration-200 hover:scale-110 hover:shadow-lg">
                        {firstLetter}
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground text-base font-semibold">
                          {userName}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  )}

                  <nav className="flex flex-col space-y-6">
                    {!isLoggedIn ? (
                      <>
                        <Link
                          to="/"
                          className="text-foreground hover:text-primary flex items-center space-x-3 py-3 text-lg font-medium transition-colors sm:text-xl"
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <Home className="h-5 w-5" />
                          <span>Home</span>
                        </Link>
                        <Link
                          to="/discover"
                          className="text-foreground hover:text-primary flex items-center space-x-3 py-3 text-lg font-medium transition-colors sm:text-xl"
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <Search className="h-5 w-5" />
                          <span>Discover CSPs</span>
                        </Link>
                        <div className="space-y-3 border-t pt-6">
                          <Link
                            to="/auth/login"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Button className="w-full" size="lg">
                              Sign In
                            </Button>
                          </Link>
                        </div>
                      </>
                    ) : user?.accountType === "admin" ? (
                      <>
                        <Link
                          to="/admin/dashboard"
                          className="text-foreground hover:text-primary flex items-center space-x-3 py-3 text-lg font-medium transition-colors sm:text-xl"
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/admin/organisations"
                          className="text-foreground hover:text-primary flex items-center space-x-3 py-3 text-lg font-medium transition-colors sm:text-xl"
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <Building2 className="h-5 w-5" />
                          <span>View Organisations</span>
                        </Link>
                        <div className="border-t pt-6">
                          <Button
                            className="w-full"
                            variant="outline"
                            size="lg"
                            onClick={() => {
                              logout();
                              setIsMenuOpen(false);
                            }}
                          >
                            <LogOut className="mr-2 h-5 w-5" />
                            Logout
                          </Button>
                        </div>
                      </>
                    ) : user?.accountType === "organisation" ? (
                      <>
                        <Link
                          to="/organisations/dashboard"
                          className="text-foreground hover:text-primary flex items-center space-x-3 py-3 text-lg font-medium transition-colors sm:text-xl"
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/discover"
                          className="text-foreground hover:text-primary flex items-center space-x-3 py-3 text-lg font-medium transition-colors sm:text-xl"
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <Search className="h-5 w-5" />
                          <span>Discover CSPs</span>
                        </Link>
                        <Link
                          to="/organisations/profile"
                          className="text-foreground hover:text-primary flex items-center space-x-3 py-3 text-lg font-medium transition-colors sm:text-xl"
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <User className="h-5 w-5" />
                          <span>Profile</span>
                        </Link>
                        <div className="border-t pt-6">
                          <Button
                            className="w-full"
                            variant="outline"
                            size="lg"
                            onClick={() => {
                              logout();
                              setIsMenuOpen(false);
                            }}
                          >
                            <LogOut className="mr-2 h-5 w-5" />
                            Logout
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          className="text-foreground hover:text-primary flex items-center space-x-3 py-3 text-lg font-medium transition-colors sm:text-xl"
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/discover"
                          className="text-foreground hover:text-primary flex items-center space-x-3 py-3 text-lg font-medium transition-colors sm:text-xl"
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <Search className="h-5 w-5" />
                          <span>Discover CSPs</span>
                        </Link>
                        {user?.accountType !== "organisation" && (
                          <Link
                            to="/my-applications"
                            className="text-foreground hover:text-primary flex items-center space-x-3 py-3 text-lg font-medium transition-colors sm:text-xl"
                            onClick={() => {
                              setIsMenuOpen(false);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            <FileText className="h-5 w-5" />
                            <span>My Applications</span>
                          </Link>
                        )}
                        {user?.accountType !== "organisation" &&
                          user?.accountType !== "admin" && (
                            <Link
                              to="/favourites"
                              className="text-foreground hover:text-primary flex items-center space-x-3 py-3 text-lg font-medium transition-colors sm:text-xl"
                              onClick={() => {
                                setIsMenuOpen(false);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                            >
                              <Heart className="h-5 w-5" />
                              <span>Favourites</span>
                            </Link>
                          )}
                        <Link
                          to="/profile"
                          className="text-foreground hover:text-primary flex items-center space-x-3 py-3 text-lg font-medium transition-colors sm:text-xl"
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <User className="h-5 w-5" />
                          <span>Profile</span>
                        </Link>
                        <div className="border-t pt-6">
                          <Button
                            className="w-full"
                            variant="outline"
                            size="lg"
                            onClick={() => {
                              logout();
                              setIsMenuOpen(false);
                            }}
                          >
                            <LogOut className="mr-2 h-5 w-5" />
                            Logout
                          </Button>
                        </div>
                      </>
                    )}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
