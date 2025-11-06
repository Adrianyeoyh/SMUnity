import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Heart, HeartHandshake, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const element = document.getElementById("about");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate({ to: "/", hash: "#about" });
      setTimeout(() => {
        const element = document.getElementById("about");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12 lg:gap-16">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center space-x-3 md:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981]">
                <HeartHandshake className="h-6 w-6 text-white" />
              </div>
              <span className="font-heading text-gradient-smunity text-xl font-bold">
                SMUnity
              </span>
            </div>
            <p className="text-muted-foreground font-body text-sm">
              Connecting SMU students with meaningful community service
              opportunities
            </p>
            <div className="flex justify-center space-x-4 md:justify-start">
              <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                <Heart className="h-4 w-4" />
                <span>Made with love for SMU</span>
                <Heart className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="hidden space-y-4 text-center md:ml-4 md:block md:text-left lg:ml-8 xl:ml-12">
            <h3 className="font-heading text-foreground font-semibold">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="/#about"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  onClick={handleAboutClick}
                >
                  About
                </a>
              </li>
              <li>
                <Link
                  to="/discover"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Discover CSPs
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/login"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Student Login
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden space-y-4 text-center md:ml-4 md:block md:text-left lg:ml-8 xl:ml-12">
            <h3 className="font-heading text-foreground font-semibold">
              For Organisations
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/auth/login"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Organisation Login
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/request"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Create Organisation
                </Link>
              </li>
              <li>
                <a
                  href="mailto:adrian.yeo.2024@computing.smu.edu.sg"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4 text-center md:ml-4 md:text-left lg:ml-8 xl:ml-12">
            <h3 className="font-heading text-foreground font-semibold">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="text-muted-foreground flex items-center justify-center space-x-3 text-sm md:justify-start">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:adrian.yeo.2024@computing.smu.edu.sg"
                  className="hover:text-foreground transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  support@smunity.sg
                </a>
              </div>
              <div className="text-muted-foreground flex items-center justify-center space-x-3 text-sm md:justify-start">
                <Phone className="h-4 w-4" />
                <a
                  href="tel:+6596724702"
                  className="hover:text-foreground transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  +65 9672 2702
                </a>
              </div>
              <div className="text-muted-foreground flex items-center justify-center space-x-3 text-sm md:justify-start">
                <MapPin className="h-4 w-4" />
                <a
                  href="https://maps.google.com/?q=Singapore+Management+University"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Singapore Management University
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-muted-foreground font-body text-sm">
              © {currentYear} SMUnity. All Rights Reserved
            </p>
            <div className="flex space-x-6">
              <a
                href="/privacy"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
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
