import React from "react";
import { User, Settings, LogOut, Moon, Sun, Camera, Lock } from "lucide-react";
import { userService } from "@/api/userApi";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { UpdatePasswordDialog } from "./UpdatePDialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const Navbar = () => {
  const { logout, user, updateUserData, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("The Selected file:", file);
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      console.log("File is too large (max 2MB)");
      return;
    }

    const formData = new FormData();
    formData.append("profile", file);

    try {
      const response = await userService.updateProfile(formData);
      updateUserData(response);
      console.log("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed", err);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b shadow-sm">
      <div className="text-xl font-bold text-blue-600">GoalSnap</div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profileUrl || ""} alt={user?.name} />
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
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <Settings size={16} className="mr-2" />
              <span>Settings</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-48">
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <label className="flex items-center w-full px-2 py-1.5 cursor-pointer">
                    <Camera size={16} className="mr-2" />
                    <span>Update Photo</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </label>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={toggleTheme}
                  className="cursor-pointer"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun size={16} className="mr-2" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon size={16} className="mr-2 text-slate-600" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  onClick={() => setIsPassModalOpen(true)}
                >
                  <label
                    htmlFor="password"
                    className="flex items-center w-full px-2 py-1.5 cursor-pointer"
                  >
                    {" "}
                    <Lock size={16} className="mr-2" />
                    <span>Update Password</span>
                  </label>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

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

      <UpdatePasswordDialog
        isOpen={isPassModalOpen}
        onOpenChange={setIsPassModalOpen}
      />
    </nav>
  );
};

export default Navbar;
