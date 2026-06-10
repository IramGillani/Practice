import { User, Settings, LogOut, Moon, Sun } from "lucide-react";
import { Loader2 } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout, user, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b shadow-sm">
      <Link to="/" className="text-xl font-bold text-blue-600">
        GoalSnap
      </Link>
      <div className="flex gap-2 items-center">
        <Button
          onClick={toggleTheme}
          className="cursor-pointer bg-gray-400 dark:bg-gray-200 "
        >
          {theme === "dark" ? (
            <>
              <Sun size={16} />
            </>
          ) : (
            <>
              <Moon size={16} />
            </>
          )}
        </Button>{" "}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="w-8 h-8">
                {user?.profileUrl && (
                  <AvatarImage src={user.profileUrl} alt={user?.name} />
                )}

                <AvatarFallback>
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <User size={20} />
                  )}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {user?.role === "admin" && (
              <DropdownMenuItem onClick={() => navigate("/adminPanel")}>
                <LayoutDashboard size={16} className="mr-2" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings size={16} className="mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 focus:bg-red-100 dark:focus:bg-red-900/30 cursor-pointer"
              onClick={() => logout()}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
