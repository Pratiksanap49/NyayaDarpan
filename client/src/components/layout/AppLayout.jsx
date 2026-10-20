import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth.js";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

// AppLayout manages sidebar open (mobile drawer) and collapsed (desktop icon-only) states.
function AppLayout() {
  const { user } = useAuth();
  // Mobile: drawer open/close
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Desktop: collapsed to icon-only
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggle = () => {
    if (window.innerWidth < 768) {
      // On mobile, the toggle opens the drawer
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div
      data-role={user?.role || ""}
      className="flex h-screen flex-col overflow-hidden bg-[#eff7fb] text-brand-navy"
    >
      <Navbar onMenuClick={handleToggle} />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
        />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <div className="min-h-full px-4 pb-8 pt-5 md:px-6 md:pb-10 md:pt-6">
            <Outlet />
          </div>
        </main>
      </div>
      {/* Footer is outside the scroll container so it stays pinned to the bottom */}
      <Footer />
    </div>
  );
}

export default AppLayout;
