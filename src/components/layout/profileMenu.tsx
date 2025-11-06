import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { useMe } from "#client/api/hooks";
import { Button } from "#client/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#client/components/ui/popover";
import { useAuth } from "#client/hooks/use-auth";

function ProfileMenu() {
  const { logout, user } = useAuth();
  const { data: userData } = useMe();
  const [open, setOpen] = useState(false);

  const isOrganisation =
    user?.role === "organisation" || user?.accountType === "organisation";
  const isAdmin = user?.accountType === "admin";

  // Get first letter of user's name for avatar
  const userName = userData?.name || user?.email || "";
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : "?";

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="group h-8 w-8 rounded-full p-0 transition-all duration-200 hover:scale-110 focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-9 sm:w-9 md:h-10 md:w-10"
          >
            <div className="bg-primary text-primary-foreground group-hover:bg-primary/90 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200 group-hover:shadow-lg sm:h-9 sm:w-9 sm:text-sm md:h-10 md:w-10">
              {firstLetter}
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-36 space-y-1 rounded-md bg-white p-2 shadow-lg sm:w-40 sm:p-3 md:w-44"
          sideOffset={8}
        >
          {!isAdmin && (
            <Link
              to={isOrganisation ? "/organisations/profile" : "/profile"}
              onClick={() => setOpen(false)}
              className="block rounded px-2 py-1 text-sm hover:bg-gray-100"
            >
              Profile
            </Link>
          )}
          {!isOrganisation && !isAdmin && (
            <Link
              to="/favourites"
              onClick={() => setOpen(false)}
              className="block rounded px-2 py-1 text-sm hover:bg-gray-100"
            >
              Favourites
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ProfileMenu;
