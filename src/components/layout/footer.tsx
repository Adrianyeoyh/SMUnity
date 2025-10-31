import { Link } from "@tanstack/react-router";
import { HeartHandshake, Heart, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {

  const currentYear = new Date().getFullYear();

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
              Connecting SMU students with meaningful community service opportunities 
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
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
                <Link 
                  to="/" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/discover" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Discover CSPs
                </Link>
              </li>
              <li>
                <Link 
                  to="/auth/login" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Student Login
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organisations */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">For Organisations</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/auth/login" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Organisation Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/auth/request" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Create Organisation
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:adrian.yeo.2024@computing.smu.edu.sg" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
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
                <a 
                  href="mailto:adrian.yeo.2024@computing.smu.edu.sg" 
                  className="hover:text-foreground transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  support@smunity.sg
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a 
                  href="tel:+6596724702" 
                  className="hover:text-foreground transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  +65 9672 2702
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <a 
                  href="https://maps.google.com/?q=Singapore+Management+University" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-foreground transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Singapore Management University
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground font-body">
              © {currentYear} SMUnity. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a 
                href="/privacy" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
