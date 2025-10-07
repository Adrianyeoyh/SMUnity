import { Link } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Badge } from "#client/components/ui/badge";
import { 
  Search, 
  Bell, 
  User, 
  Heart, 
  MapPin, 
  Calendar,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-heading font-bold text-lg">
              S
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              SMUnity
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Discover CSPs
            </Link>
            <Link 
              to="/map" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
            >
              <MapPin className="h-4 w-4" />
              <span>Map View</span>
            </Link>
            <Link 
              to="/my-applications" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              My Applications
            </Link>
            <Link 
              to="/favorites" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
            >
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search CSPs, organizations..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>

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

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search CSPs, organizations..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t pt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Discover CSPs
              </Link>
              <Link 
                to="/map" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <MapPin className="h-4 w-4" />
                <span>Map View</span>
              </Link>
              <Link 
                to="/my-applications" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Applications
              </Link>
              <Link 
                to="/favorites" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-4 w-4" />
                <span>Favorites</span>
              </Link>
              <div className="pt-4 border-t">
                <Button className="w-full" variant="outline">
                  Sign In
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
