import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthContextType, User } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    console.log("savedUser:", savedUser);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: User) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    console.log("User logged in:", userData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
