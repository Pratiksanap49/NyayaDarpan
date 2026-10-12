import { Navigate, Route, Routes } from "react-router-dom";
import ClerkDashboard from "./pages/ClerkDashboard.jsx";
import JudgeDashboard from "./pages/JudgeDashboard.jsx";
import Login from "./pages/Login.jsx";
import StenoDashboard from "./pages/StenoDashboard.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/clerk" element={<ClerkDashboard />} />
      <Route path="/steno" element={<StenoDashboard />} />
      <Route path="/judge" element={<JudgeDashboard />} />
      <Route path="*" element={<p>Page not found</p>} />
    </Routes>
  );
}

export default App;
