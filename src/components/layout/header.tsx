import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Badge } from "#client/components/ui/badge";
import { 
  Bell, 
  User, 
  HeartHandshake,
  Menu,
  X,
  LogOut,
  Home,
  Search,
  FileText,
  LayoutDashboard,
  Building2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "#client/hooks/use-auth";
import { Popover, PopoverContent, PopoverTrigger } from "#client/components/ui/popover";
// import ProfileDropdown from "#client/components/layout/profile-dropdown.tsx";
import ProfileMenu from "#client/components/layout/profileMenu.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { useMobileMenu } from "#client/contexts/mobile-menu-context";

export function Header() {
  const { isMenuOpen, setIsMenuOpen } = useMobileMenu();
  const [isJiggling, setIsJiggling] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, isLoading, logout, user } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

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
      unread: true
    },
    {
      id: 2,
      title: "New CSP Available",
      message: "Beach Cleanup at East Coast Park is now accepting applications.",
      time: "1 day ago",
      unread: true
    },
    {
      id: 3,
      title: "Reminder: CSU Module",
      message: "Don't forget to complete your CSU module before applying for CSPs.",
      time: "3 days ago",
      unread: true
    }
  ];

  const handleBellClick = () => {
    setIsJiggling(true);
    setTimeout(() => setIsJiggling(false), 600);
  };

  const getLogoDestination = () => {
    if (!isLoggedIn || !user) return "/";
    if (user.accountType === "admin") return "/admin/dashboard";
    if (user.accountType === "organisation") return "/organisations/dashboard";
    return "/dashboard"; 
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      isLandingPage && !isScrolled
        ? "bg-transparent border-transparent" 
        : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between relative">
          <Link 
            to={getLogoDestination()} 
            className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 md:mr-8 lg:mr-12"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981]">
              <HeartHandshake className="h-6 w-6 text-white" />
            </div>
            <span className="font-heading font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-gradient-smunity">
              SMUnity
            </span>
          </Link>

          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-4 lg:gap-6 xl:gap-12 md:left-[calc(50%+2rem)] lg:left-1/2">
            {isLoading ? null : !isLoggedIn ? (
              <>
                <Link 
                  to="/" 
                  className="nav-link relative text-xs sm:text-sm md:text-base font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: 'oklch(0.45 0.15 200)' }}></span>
                </Link>
                <Link 
                  to="/discover" 
                  className="nav-link relative text-xs sm:text-sm md:text-base font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group whitespace-nowrap"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Search className="h-4 w-4" />
                  <span>Discover CSPs</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: 'oklch(0.45 0.15 200)' }}></span>
                </Link>
              </>
            ) : user?.accountType === 'admin' ? (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className="nav-link relative text-xs sm:text-sm md:text-base font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: 'oklch(0.45 0.15 200)' }}></span>
                </Link>
                <Link 
                  to="/admin/organisations" 
                  className="nav-link relative text-xs sm:text-sm md:text-base font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group whitespace-nowrap"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Building2 className="h-4 w-4" />
                  <span>View Organisations</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: 'oklch(0.45 0.15 200)' }}></span>
                </Link>
              </>
            ) : user?.accountType === 'organisation' ? (
              <>
              <Link 
                  to="/organisations/dashboard" 
                  className="nav-link relative text-xs sm:text-sm md:text-base font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                ><LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: 'oklch(0.45 0.15 200)' }}></span>
              </Link>
              <Link 
                  to="/discover" 
                  className="nav-link relative text-xs sm:text-sm md:text-base font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group whitespace-nowrap"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Search className="h-4 w-4" />
                  <span>Discover CSPs</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: 'oklch(0.45 0.15 200)' }}></span>
                </Link>
              </>     
            ): (
              <>
                <Link 
                  to="/dashboard" 
                  className="nav-link relative text-xs sm:text-sm md:text-base font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: 'oklch(0.45 0.15 200)' }}></span>
                </Link>
                <Link 
                  to="/discover" 
                  className="nav-link relative text-xs sm:text-sm md:text-base font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group whitespace-nowrap"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Search className="h-4 w-4" />
                  <span>Discover CSPs</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: 'oklch(0.45 0.15 200)' }}></span>
                </Link>
                <Link 
                  to="/my-applications" 
                  className="nav-link relative text-xs sm:text-sm md:text-base font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group whitespace-nowrap"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <FileText className="h-4 w-4" />
                  <span>My Applications</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: 'oklch(0.45 0.15 200)' }}></span>
                </Link>
                
              </>
            )}
          </nav>

          <div className="flex items-center gap-2 relative z-50">
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
                      <Bell className={`h-5 w-5 ${isJiggling ? 'animate-pulse' : ''}`} style={{
                        animation: isJiggling ? 'shake 0.6s ease-in-out' : 'none',
                        transformOrigin: 'top center'
                      }} />
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {notifications.filter(n => n.unread).length}
                      </Badge>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                      <div className="p-4 border-b">
                        <h3 className="font-heading font-semibold text-sm sm:text-base md:text-lg">Notifications</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b hover:bg-muted/50 transition-colors ${
                              notification.unread ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="space-y-1">
                              <h4 className="font-heading font-medium text-xs sm:text-sm md:text-base">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {notifications.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                          <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs sm:text-sm md:text-base">No notifications yet</p>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>

                <ProfileMenu/>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center space-x-2">
                  <Link to="/auth/login">
                    <Button>
                      Sign In
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {isLoggedIn && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative md:hidden mr-2"
                    onClick={handleBellClick}
                  >
                    <Bell className={`h-5 w-5 ${isJiggling ? 'animate-pulse' : ''}`} style={{
                      animation: isJiggling ? 'shake 0.6s ease-in-out' : 'none',
                      transformOrigin: 'top center'
                    }} />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {notifications.filter(n => n.unread).length}
                    </Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <h3 className="font-heading font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 border-b hover:bg-muted/50 transition-colors ${
                          notification.unread ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="space-y-1">
                          <h4 className="font-heading font-medium text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

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
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
                onClick={() => setIsMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.div 
                className="fixed inset-0 z-[70] md:hidden bg-background overflow-y-auto flex flex-col"
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ 
                  type: "spring", 
                  damping: 25, 
                  stiffness: 200,
                  duration: 0.4
                }}
                style={{ height: '100vh', width: '100vw', top: 0, left: 0, right: 0, bottom: 0 }}
              >
              <div className="container mx-auto px-4 sm:px-6 py-6 pb-12 flex-1">
                <div className="flex items-center justify-between mb-8">
                  <Link 
                    to={getLogoDestination()}
                    className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981]">
                      <HeartHandshake className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-heading font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-gradient-smunity">
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

                <nav className="flex flex-col space-y-6">
                  {!isLoggedIn ? (
                    <>
                      <Link 
                        to="/" 
                        className="text-lg sm:text-xl font-medium text-foreground hover:text-primary transition-colors flex items-center space-x-3 py-3"
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
                        className="text-lg sm:text-xl font-medium text-foreground hover:text-primary transition-colors flex items-center space-x-3 py-3"
                        onClick={() => {
                          setIsMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <Search className="h-5 w-5" />
                        <span>Discover CSPs</span>
                      </Link>
                      <div className="pt-6 border-t space-y-3">
                        <Link to="/auth/login" onClick={() => setIsMenuOpen(false)}>
                          <Button className="w-full" size="lg">
                            Sign In
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : user?.accountType === 'admin' ? (
                    <>
                      <Link 
                        to="/admin/dashboard" 
                        className="text-lg sm:text-xl font-medium text-foreground hover:text-primary transition-colors flex items-center space-x-3 py-3"
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
                        className="text-lg sm:text-xl font-medium text-foreground hover:text-primary transition-colors flex items-center space-x-3 py-3"
                        onClick={() => {
                          setIsMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <Building2 className="h-5 w-5" />
                        <span>View Organisations</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/dashboard" 
                        className="text-lg sm:text-xl font-medium text-foreground hover:text-primary transition-colors flex items-center space-x-3 py-3"
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
                        className="text-lg sm:text-xl font-medium text-foreground hover:text-primary transition-colors flex items-center space-x-3 py-3"
                        onClick={() => {
                          setIsMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <Search className="h-5 w-5" />
                        <span>Discover CSPs</span>
                      </Link>
                      <Link 
                        to="/my-applications" 
                        className="text-lg sm:text-xl font-medium text-foreground hover:text-primary transition-colors flex items-center space-x-3 py-3"
                        onClick={() => {
                          setIsMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <FileText className="h-5 w-5" />
                        <span>My Applications</span>
                      </Link>
                      <Link 
                        to="/profile" 
                        className="text-lg sm:text-xl font-medium text-foreground hover:text-primary transition-colors flex items-center space-x-3 py-3"
                        onClick={() => {
                          setIsMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                      <div className="pt-6 border-t">
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
