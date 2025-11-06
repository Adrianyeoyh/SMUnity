import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "#client/components/ui/popover";
import { useAuth } from "#client/hooks/use-auth";
import { useMe } from "#client/api/hooks";

function ProfileMenu() {
  const { logout, user } = useAuth();
  const { data: userData } = useMe();
  const [open, setOpen] = useState(false);

  const isOrganisation = user?.role === "organisation" || user?.accountType === "organisation";
  const isAdmin = user?.accountType === "admin";

  // Get first letter of user's name for avatar
  const userName = userData?.name || user?.email || "";
  const userEmail = user?.email || "";
  const displayName = userData?.name || userEmail;
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : "?";

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="focus-visible:ring-0 focus-visible:ring-offset-0 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full p-0 transition-all duration-200 hover:scale-110 group"
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs sm:text-sm transition-all duration-200 group-hover:shadow-lg group-hover:bg-primary/90">
              {firstLetter}
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-48 sm:w-52 md:w-56 p-2 sm:p-3 space-y-2 bg-white shadow-lg rounded-md"
          sideOffset={8}
        >
          <div className="px-2 py-2 border-b border-gray-200 space-y-1">
            <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
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
