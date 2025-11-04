import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "#client/components/ui/popover";
import { User } from "lucide-react";
import { useAuth } from "#client/hooks/use-auth";

function ProfileMenu() {
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  const isOrganisation = user?.role === "organisation" || user?.accountType === "organisation";
  const isAdmin = user?.accountType === "admin";

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <User className="h-5 w-5" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-36 p-2 space-y-1 bg-white shadow-lg rounded-md"
          sideOffset={8}
        >
          {!isAdmin && (
          <Link
              to={isOrganisation ? "/organisations/profile" : "/profile"}
            onClick={() => setOpen(false)}
              className="block px-2 py-1 rounded hover:bg-gray-100 text-sm"
          >
            Profile
          </Link>
          )}
          {!isOrganisation && !isAdmin && (
          <Link
            to="/favourites"
            onClick={() => setOpen(false)}
              className="block px-2 py-1 rounded hover:bg-gray-100 text-sm"
          >
            Favourites
          </Link>
          )}
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-sm"
          >
            Logout
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ProfileMenu;
