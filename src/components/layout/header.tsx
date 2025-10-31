import { Link } from "@tanstack/react-router";
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
  Heart,
  LayoutDashboard,
  Building2
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "#client/hooks/use-auth";
import { Popover, PopoverContent, PopoverTrigger } from "#client/components/ui/popover";
// import ProfileDropdown from "#client/components/layout/profile-dropdown.tsx";
import ProfileMenu from "#client/components/layout/profileMenu.tsx";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isJiggling, setIsJiggling] = useState(false);
  const { isLoggedIn, isLoading, logout, user } = useAuth();

  // Fake notifications data
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

  // Determine logo destination based on user type
  const getLogoDestination = () => {
    if (!isLoggedIn || !user) return "/";
    if (user.accountType === "admin") return "/admin/dashboard";
    if (user.accountType === "organisation") return "/organisations/dashboard";
    return "/dashboard"; // student/default
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between relative">
          {/* Logo */}
          <Link 
            to={getLogoDestination()} 
            className="flex items-center space-x-3 mr-4"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981]">
              <HeartHandshake className="h-6 w-6 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-gradient-smunity">
              SMUnity
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 lg:gap-12">
            {isLoading ? null : !isLoggedIn ? (
              <>
                <Link 
                  to="/" 
                  className="nav-link relative text-sm font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: 'oklch(0.45 0.15 200)' }}></span>
                </Link>
                <Link 
                  to="/about" 
                  className="nav-link relative text-sm font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Heart className="h-4 w-4" />
                  <span>About Us</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: 'oklch(0.45 0.15 200)' }}></span>
                </Link>
                <Link 
                  to="/discover" 
                  className="nav-link relative text-sm font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group"
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
                  className="nav-link relative text-sm font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group"
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
                  className="nav-link relative text-sm font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group"
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
                  className="nav-link relative text-sm font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                ><LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: 'oklch(0.45 0.15 200)' }}></span>
              </Link>
              <Link 
                  to="/discover" 
                  className="nav-link relative text-sm font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group"
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
                  className="nav-link relative text-sm font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group"
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
                  className="nav-link relative text-sm font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group"
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
                  className="nav-link relative text-sm font-medium text-foreground transition-colors flex items-center justify-center space-x-2 py-2 group"
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

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {isLoading ? null : isLoggedIn ? (
              <>
                {/* Notifications - Only when logged in */}
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
                      {notifications.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                          <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>

                {/* User Menu - Only when logged in */}
                {/* in components/layout/ProfileMenu.tsx */}
                <ProfileMenu/>
              </>
            ) : (
              <>
                {/* Auth Buttons - Only when not logged in */}
                <div className="hidden md:flex items-center space-x-2">
                  <Link to="/auth/login">
                    <Button variant="ghost">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/signup">
                    <Button>
                      Get Started
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {/* Mobile Notifications - Only when logged in */}
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

            {/* Mobile Menu Button */}
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

        {/* Mobile Navigation Menu */}
        {isMenuOpen && !isLoading && (
          <div className="md:hidden border-t pt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              {!isLoggedIn ? (
                <>
                  <Link 
                    to="/" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <Heart className="h-4 w-4" />
                    <span>About Us</span>
                  </Link>
                  <Link 
                    to="/discover" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <Search className="h-4 w-4" />
                    <span>Discover CSPs</span>
                  </Link>
                  <div className="pt-4 border-t space-y-2">
                    <Link to="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full" variant="outline">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </>
              ) : user?.accountType === 'admin' ? (
                <>
                  <Link 
                    to="/admin/dashboard" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/admin/organisations" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>View Organisations</span>
                  </Link>
                </>
              ) : (
                <>
                <Link 
                    to="/dashboard" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/discover" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <Search className="h-4 w-4" />
                    <span>Discover CSPs</span>
                  </Link>
                  <Link 
                    to="/my-applications" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <FileText className="h-4 w-4" />
                    <span>My Applications</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <div className="pt-4 border-t">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
