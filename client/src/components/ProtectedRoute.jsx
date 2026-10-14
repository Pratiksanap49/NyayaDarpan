import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth.js";
import { ROLE_HOME } from "../utils/roleRoutes.js";

function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] || "/login"} replace />;
  }

  return children;
}

export default ProtectedRoute;
