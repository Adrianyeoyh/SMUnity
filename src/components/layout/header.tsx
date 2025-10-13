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
  Heart
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "#client/hooks/use-auth";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3"
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
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-6 lg:space-x-12 md:ml-4 lg:ml-8">
            {!isLoggedIn ? (
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
            ) : (
              <>
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
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                {/* Notifications - Only when logged in */}
                <Button variant="ghost" size="icon" className="relative hidden md:flex">
                  <Bell className="h-5 w-5" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </Button>

                {/* User Menu - Only when logged in */}
                <div className="hidden md:flex items-center space-x-2">
                  <Link to="/profile">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
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
        {isMenuOpen && (
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
              ) : (
                <>
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
