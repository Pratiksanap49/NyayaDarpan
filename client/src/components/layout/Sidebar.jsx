import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { NAV_CONFIG, ROLE_LABELS } from "../../constants/navigation.js";
import { useAuth } from "../../features/auth/useAuth.js";

// Sidebar icon with correct stroke attributes so it renders consistently across browsers.
function Icon({ name }) {
  const paths = {
    dashboard: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    cases: "M4 5h16v14H4zM8 9h8M8 13h6",
    remarks: "M5 5h14v14H5zM8 9h8M8 13h5",
    settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 12h2m12 0h2M12 4v2m0 12v2",
    logout: "M10 5H5v14h5M14 8l4 4-4 4M18 12H9",
    user: "M12 8a3.2 3.2 0 1 0 0 6.4A3.2 3.2 0 0 0 12 8ZM5.5 20c.6-3.4 2.7-5.2 6.5-5.2s5.9 1.8 6.5 5.2",
    chevronLeft: "M15 6l-6 6 6 6",
    chevronRight: "M9 6l6 6-6 6",
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0"
    >
      <path d={paths[name]} />
    </svg>
  );
}

// Sidebar accepts open/onClose (mobile drawer), collapsed/onToggle (desktop collapse).
function Sidebar({ open, onClose, collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV_CONFIG[user?.role] || [];
  const roleLabel = ROLE_LABELS[user?.role] || "Staff";

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login", { replace: true });
  };

  const renderItem = (item) => {
    if (!item.ready) {
      return (
        <div
          key={item.path}
          title={collapsed ? item.label + " (coming soon)" : "Coming soon"}
          className="flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400"
        >
          <Icon name={item.icon} />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </div>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={onClose}
        title={collapsed ? item.label : undefined}
        className={({ isActive }) =>
          `relative flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
            isActive
              ? "bg-brand-sky text-accent"
              : "text-brand-muted hover:bg-slate-50 hover:text-brand-navy"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-accent" />
            )}
            <Icon name={item.icon} />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-slate-900/30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[#e0eaf5] bg-white px-3 py-4 transition-all duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:self-stretch
          ${collapsed ? "md:w-[68px]" : "md:w-56"}
          w-56
        `}
      >
        {/* Toggle button — collapses/expands on desktop, closes drawer on mobile */}
        <div className={`mb-3 flex ${collapsed ? "justify-center" : "justify-end"}`}>
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => {
              onToggle();
              onClose();
            }}
            className="grid h-8 w-8 place-items-center rounded-md text-brand-muted hover:bg-slate-100 hover:text-brand-navy transition-colors"
          >
            <Icon name={collapsed ? "chevronRight" : "chevronLeft"} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto">
          {items.map(renderItem)}
        </nav>

        {/* Bottom section */}
        <div className="mt-4 shrink-0 space-y-2 border-t border-slate-100 pt-4">
          {/* Settings (coming soon) */}
          <div
            title={collapsed ? "Settings (coming soon)" : "Coming soon"}
            className="flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400"
          >
            <Icon name="settings" />
            {!collapsed && <span>Settings</span>}
          </div>

          {/* User card */}
          {!collapsed && (
            <div className="flex items-center gap-3 rounded-lg bg-brand-light px-3 py-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-sky text-accent">
                <Icon name="user" />
              </span>
              <div className="min-w-0">
                <strong className="block truncate text-sm text-brand-navy">
                  {user?.name || "-"}
                </strong>
                <span className="block truncate text-xs text-brand-muted">
                  {roleLabel}
                </span>
              </div>
            </div>
          )}
          {collapsed && (
            <div
              title={user?.name || "-"}
              className="flex justify-center py-1"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-sky text-accent">
                <Icon name="user" />
              </span>
            </div>
          )}

          {/* Logout */}
          <button
            type="button"
            title={collapsed ? "Logout" : undefined}
            className={`flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-brand-error hover:bg-brand-error-bg transition-colors ${collapsed ? "justify-center" : ""}`}
            onClick={handleLogout}
          >
            <Icon name="logout" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
