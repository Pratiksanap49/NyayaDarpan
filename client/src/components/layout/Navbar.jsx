import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROLE_LABELS } from "../../constants/navigation.js";
import { useAuth } from "../../features/auth/useAuth.js";
import Logo from "../common/Logo.jsx";

function UserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19c.6-3.4 2.7-5.2 6.5-5.2s5.9 1.8 6.5 5.2" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

// Navbar accepts an onMenuClick callback and an optional notification count.
function Navbar({ onMenuClick, count }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const roleLabel = ROLE_LABELS[user?.role] || "Staff";

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e1eaf4] bg-white px-5 shadow-[0_2px_7px_rgb(28_71_112_/_5%)] md:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-md text-brand-navy hover:bg-brand-sky md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <MenuIcon />
        </button>
        <Logo size="sm" subtitle />
      </div>
      <div className="flex items-center gap-4 text-brand-navy">
        <button
          type="button"
          className="relative grid h-10 w-10 place-items-center rounded-full text-brand-muted hover:bg-brand-sky"
          aria-label="Notifications"
        >
          <BellIcon />
          {count !== undefined && count !== null && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>
        <span className="h-8 w-px bg-slate-200" />
        <div className="hidden text-right leading-tight sm:block">
          <strong className="block text-sm">{user?.name || "-"}</strong>
          <span className="text-xs text-brand-muted">
            Court ID: {user?.courtId || "-"}
          </span>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            className="flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-bold hover:bg-brand-sky"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
          >
            <UserIcon />
            <span className="hidden sm:inline">{roleLabel}</span>
            <ChevronIcon />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-48 rounded-lg border border-brand-border bg-white p-2 shadow-lg">
              <p className="truncate px-3 py-2 text-sm font-semibold text-brand-navy">
                {user?.name || "User"}
              </p>
              <button
                type="button"
                className="w-full rounded-md px-3 py-2 text-left text-sm text-brand-error hover:bg-brand-error-bg"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
