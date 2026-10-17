import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth.js";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

// AppLayout accepts no props and composes the authenticated navbar, sidebar, content, and footer.
function AppLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      data-role={user?.role || ""}
      className="flex min-h-screen flex-col overflow-x-hidden bg-[#eff7fb] text-brand-navy"
    >
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex min-h-0 flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="min-h-full px-4 pb-12 pt-4 md:px-4 md:pb-12 md:pt-4">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AppLayout;
