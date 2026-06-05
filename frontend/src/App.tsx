import { Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./pages/Login";
import { Signup } from "./pages/SignUp";
import TodoApp from "./pages/TodoApp";
import { Toaster } from "sonner";
import UserSettings from "./pages/UserSettings";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/signup" />;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/todos" /> : <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (user?.role !== "admin") return <Navigate to="/todos" />;

  return <>{children}</>;
};

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen  bg-background p-4">
      <Toaster position="top-center" richColors />
      {isAuthenticated && <Navbar />}
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
