import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { Onboarding } from "./pages/Onboarding";
import { absoluteNoNavbarPaths } from "./constants";
import PricingPlans from "./pages/PlanCards";
import TrialBanner from "./components/TrialBanner";
import CheckoutSuccessPage from "./pages/CheckoutSuccess";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  console.log("=== ProtectedRoute Debug ===", {
    isLoading,
    isAuthenticated,
    user,
    isVerified: user?.isVerified,
    isOnboardingCompleted: user?.isOnboardingCompleted,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/signupSuccess" replace />;
  }

  if (!user?.isOnboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  const status = user?.subscription?.status ?? "";
  const hasAccess = ["active", "trialing"].includes(status);

  if (!hasAccess) {
    return <Navigate to="/plans" replace />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role !== "admin") return <Navigate to="/todos" replace />;

  return <>{children}</>;
};

const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/signupSuccess" replace />;
  }

  if (user?.isOnboardingCompleted) {
    if (user?.isInvited) {
      return <Navigate to="/teamDashboard" replace />;
    }
    return <Navigate to="/plans" replace />;
  }

  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  const status = user?.subscription?.status ?? "";
  const hasAccess = ["active", "trialing"].includes(status);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log("AuthRoute Check:", { isAuthenticated, user });
  if (isAuthenticated) {
    if (!user?.isVerified) {
      return <Navigate to="/signupSuccess" replace />;
    }
    if (user?.isInvited) {
      return <Navigate to="/teamDashboard" replace />;
    }

    if (!user?.isOnboardingCompleted) {
      return <Navigate to="/onboarding" replace />;
    }
    if (!hasAccess) {
      return <Navigate to="/plans" replace />;
    }

    return <Navigate to="/todos" replace />;
  }

  return <>{children}</>;
};

const PlanRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!user?.isVerified) return <Navigate to="/signupSuccess" replace />;

  if (user?.isInvited) {
    return <Navigate to="/teamDashboard" replace />;
  }

  if (!user?.isOnboardingCompleted)
    return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
};

function App() {
  const { isAuthenticated, user } = useAuth();
  console.log(user);
  const location = useLocation();
  const showHeader =
    isAuthenticated && !absoluteNoNavbarPaths.includes(location.pathname);
  return (
    <div className="min-h-screen bg-background p-4">
      <Toaster position="top-center" richColors />

      {showHeader && (
        <>
          <Navbar />
          <TrialBanner />
        </>
      )}

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
        <Route
          path="/onboarding"
          element={
            <OnboardingRoute>
              <Onboarding />
            </OnboardingRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <PlanRoute>
              <PricingPlans />
            </PlanRoute>
          }
        ></Route>
        <Route
          path="/checkoutSuccess"
          element={
            <PlanRoute>
              <CheckoutSuccessPage />
            </PlanRoute>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
