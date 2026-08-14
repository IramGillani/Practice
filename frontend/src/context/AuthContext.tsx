import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { signOut } from "firebase/auth";

import { AUTH_KEYS } from "@/types";
import { authService } from "@/api/authApi";
import type { AuthContextType, User } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../services/firebase";
import type { Provider } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const login = (userData: User, accessToken: string, refreshToken: string) => {
    localStorage.setItem(AUTH_KEYS.ACCESS, accessToken);
    localStorage.setItem(AUTH_KEYS.REFRESH, refreshToken);

    localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem(AUTH_KEYS.REFRESH);
      await signOut(auth);
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      localStorage.removeItem(AUTH_KEYS.ACCESS);
      localStorage.removeItem(AUTH_KEYS.REFRESH);
      localStorage.removeItem(AUTH_KEYS.USER);

      setUser(null);

      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(AUTH_KEYS.ACCESS);
    const savedUser = localStorage.getItem(AUTH_KEYS.USER);
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse saved user", err);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const handleSocialLogin = async (providerName: Provider) => {
    const provider =
      providerName === "google"
        ? new GoogleAuthProvider()
        : new GithubAuthProvider();

    try {
      console.log(`Initiating ${provider} authentication...`);
      const result = await signInWithPopup(auth, provider);

      const firebaseUser = result.user;

      const idToken = await firebaseUser.getIdToken(true);

      const res = await authService.socialLogin(idToken);
      console.log("login response", res);

      localStorage.setItem(AUTH_KEYS.ACCESS, res.accessToken);
      localStorage.setItem(AUTH_KEYS.REFRESH, res.refreshToken);

      localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(res.user));
      setUser(res.user);

      navigate("/todos");
      return res.user;
    } catch (err: any) {
      console.error("Social login failed", err);
    }
  };

  const handleResendEmail = async (email: string) => {
    if (!email) {
      toast.error("No email address found to resend verification link.");
      return;
    }

    try {
      await authService.resendVerification(email);
    } catch (error: any) {
      console.log(error);
    }
  };

  const updateUserData = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUserData,
        isAuthenticated: !!user,
        isLoading,
        handleSocialLogin,
        handleResendEmail,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
