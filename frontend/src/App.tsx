import { Navigate, Route, Routes } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import ClipperDashboard from "./pages/ClipperDashboard";
import CreatorDashboard from "./pages/CreatorDashboard";
import LoginPage from "./pages/LoginPage";
import useAuthStore from "./store/useAuthStore";
import type { UserRole } from "./types";

interface ProtectedRouteProps {
  roles?: UserRole[];
  children: JSX.Element;
}

function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return children;
}

function App(): JSX.Element {
  const { user } = useAuthStore();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? <Navigate to={`/dashboard/${user.role}`} replace /> : <LoginPage />
        }
      />
      <Route
        path="/dashboard/creator"
        element={
          <ProtectedRoute roles={["creator", "admin"]}>
            <CreatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/clipper"
        element={
          <ProtectedRoute roles={["clipper", "admin"]}>
            <ClipperDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
