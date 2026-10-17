import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { NAV_CONFIG, ROLE_LABELS } from "../../constants/navigation.js";
import { useAuth } from "../../features/auth/useAuth.js";

function Icon({ name }) {
  const paths = {
    dashboard: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    cases: "M4 5h16v14H4zM8 9h8M8 13h6",
    remarks: "M5 5h14v14H5zM8 9h8M8 13h5",
    settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 12h2m12 0h2M12 4v2m0 12v2",
    logout: "M10 5H5v14h5M14 8l4 4-4 4M18 12H9",
    user: "M12 8a3.2 3.2 0 1 0 0 6.4A3.2 3.2 0 0 0 12 8ZM5.5 20c.6-3.4 2.7-5.2 6.5-5.2s5.9 1.8 6.5 5.2",
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path d={paths[name]} />
    </svg>
  );
}

// Sidebar accepts open and onClose props for responsive drawer behavior.
function Sidebar({ open, onClose }) {
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
          title="Coming soon"
          className="flex cursor-not-allowed items-center gap-2 rounded-md px-2 py-2 text-[0.58rem] text-slate-400"
        >
          <Icon name={item.icon} />
          {item.label}
        </div>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={({ isActive }) =>
          `relative flex items-center gap-2 rounded-md px-2 py-2 text-[0.58rem] font-semibold transition ${
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
            {item.label}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-slate-900/30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-28 -translate-x-full flex-col border-r border-[#e0eaf5] bg-white px-1.5 py-3 transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : ""
        }`}
      >
        <nav className="space-y-1.5">{items.map(renderItem)}</nav>
          <div className="mt-auto space-y-1.5 border-t border-slate-100 pt-2.5">
          <div
            title="Coming soon"
            className="flex cursor-not-allowed items-center gap-2 rounded-md px-2 py-2 text-[0.58rem] text-slate-400"
          >
            <Icon name="settings" />
            Settings
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-brand-light px-1.5 py-1.5">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-sky text-accent">
              <Icon name="user" />
            </span>
            <div className="min-w-0">
              <strong className="block text-[0.52rem] text-brand-navy">Court Staff</strong>
              <span className="block truncate text-[0.45rem] text-brand-muted">
                {roleLabel}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-[0.58rem] font-semibold text-brand-error hover:bg-brand-error-bg"
            onClick={handleLogout}
          >
            <Icon name="logout" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
