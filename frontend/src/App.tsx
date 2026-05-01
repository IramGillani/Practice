import { Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./pages/Login";
import { Signup } from "./pages/SignUp";
import TodoApp from "./pages/TodoApp";
import { Toaster } from "sonner";
import UserSettings from "./pages/UserSettings";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/signup" />;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/todos" /> : <>{children}</>;
};

function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background p-4">
      <Toaster position="top-center" richColors />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

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
              <Navbar />
              <h1 className="text-2xl font-bold capitalize text-blue-500/80 mt-4 text-center">
                Welcome, <i>{user?.name}!</i>
              </h1>
              <TodoApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
