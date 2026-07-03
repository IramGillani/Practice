import { Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./pages/Login";
import { Signup } from "./pages/SignUp";
import TodoApp from "./pages/TodoApp";
import { Toaster } from "sonner";
import UserSettings from "./pages/UserSettings";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import SignupSuccessPage from "./pages/SignupSuccessPage";
import { EmailVerificationBanner } from "@/components/EmailReminder";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/signup" />;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user && !user.isVerified) {
      return <Navigate to="/signupSuccess" replace />;
    }

    return <Navigate to="/todos" replace />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (user?.role !== "admin") return <Navigate to="/todos" />;

  return <>{children}</>;
};

function App() {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="min-h-screen  bg-background p-4">
      <Toaster position="top-center" richColors />
      {isAuthenticated && <Navbar />}
      {isAuthenticated && !user?.isVerified && <EmailVerificationBanner />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/adminPanel"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginForm />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <AuthRoute>
              <ResetPassword />
            </AuthRoute>
          }
        />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/signupSuccess" element={<SignupSuccessPage />} />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <UserSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <TodoApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
