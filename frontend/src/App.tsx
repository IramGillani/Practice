import { Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./pages/Login";
import { Signup } from "./pages/SignUp";
import { Button } from "./components/ui/button";
import TodoApp from "./pages/TodoApp";
import { AuthProvider, useAuth } from "./context/AuthContext";

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const user = localStorage.getItem("currentUser");
//   return user ? <>{children}</> : <Navigate to="/signup" />;
// };

// const AuthRoute = ({ children }: { children: React.ReactNode }) => {
//   const user = localStorage.getItem("currentUser");
//   return user ? <Navigate to="/todos" /> : <>{children}</>;
// };

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/signup" />;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/todos" /> : <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background p-4">
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
            path="/todos"
            element={
              <ProtectedRoute>
                <TodoApp />
                <Button
                  className="mt-6"
                  onClick={() => {
                    localStorage.removeItem("currentUser");
                    window.location.reload();
                  }}
                >
                  Logout
                </Button>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
