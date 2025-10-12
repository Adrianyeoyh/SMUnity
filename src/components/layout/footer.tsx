import { Link } from "@tanstack/react-router";
import { HeartHandshake, Heart, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981]">
                <HeartHandshake className="h-6 w-6 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-gradient-smunity">
                SMUnity
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-body">
              Connecting SMU students with meaningful community service opportunities. 
              Making a difference, one project at a time.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4 text" />
                <span>Made with love for SMU</span>
                <Heart className="h-4 w-4 text" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Discover CSPs
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Map View
                </Link>
              </li>
              <li>
                <Link to="/my-applications" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  My Applications
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizations */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">For Organizations</h3>
            <ul className="space-y-2">
              <li>
                <a href="/organization/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Create Organization
                </a>
              </li>
              <li>
                <a href="/organization/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Organisation Dashboard
                </a>
              </li>
              <li>
                <a href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@smunity.sg</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+65 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Singapore Management University</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground font-body">
              © 2025 SMUnity. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
