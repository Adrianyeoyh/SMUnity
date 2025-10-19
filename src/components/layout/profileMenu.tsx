import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "#client/components/ui/popover";
import { User, LogOut } from "lucide-react";
import { useAuth } from "#client/hooks/use-auth";

function ProfileMenu() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Popover open={open}>
        <PopoverTrigger asChild>
          <Link to="/profile">
            <Button
              variant="ghost"
              size="icon"
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
              >
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-36 p-2 space-y-1 bg-white shadow-lg rounded-md"
          sideOffset={8}
        >
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block px-2 py-1 rounded hover:bg-gray-100"
          >
            Profile
          </Link>
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ProfileMenu;
