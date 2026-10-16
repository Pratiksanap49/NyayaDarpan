import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ROLES } from "./constants/app.js";
import { useAuth } from "./features/auth/useAuth.js";
import ClerkDashboard from "./pages/ClerkDashboard.jsx";
import JudgeDashboard from "./pages/JudgeDashboard.jsx";
import Login from "./pages/Login.jsx";
import RojnamaForm from "./pages/RojnamaForm.jsx";
import StenoDashboard from "./pages/StenoDashboard.jsx";
import { ROLE_HOME } from "./utils/roleRoutes.js";

function App() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          loading ? (
            <p>Loading...</p>
          ) : user ? (
            <Navigate to={ROLE_HOME[user.role] || "/login"} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.CLERK, ROLES.STENOGRAPHER, ROLES.JUDGE]}
          >
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="clerk"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLERK]}>
              <ClerkDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="steno"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STENOGRAPHER]}>
              <StenoDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="steno/rojnama/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STENOGRAPHER]}>
              <RojnamaForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="judge"
          element={
            <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
              <JudgeDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<p>Page not found</p>} />
    </Routes>
  );
}

export default App;
