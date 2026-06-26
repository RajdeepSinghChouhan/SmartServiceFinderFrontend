import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Calendar, Star, Bell, User as UserIcon, LogOut, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const items = [
  { to: "/user", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/user/bookings", label: "My Bookings", icon: Calendar },
  { to: "/user/reviews", label: "My Reviews", icon: Star },
  { to: "/user/notifications", label: "Notifications", icon: Bell },
  { to: "/user/profile", label: "Profile", icon: UserIcon },
];

export default function UserSidebar({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { logout, user } = useAuth();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <aside className="ssf-sidebar">
      <div className="d-flex justify-content-between align-items-center d-lg-none mb-3">
        <span className="fw-bold">Menu</span>
        <button className="btn btn-ssf-ghost btn-sm" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
      </div>

      <div className="ssf-sidebar-user">
        <div className="ssf-avatar" style={{ width: 48, height: 48, fontSize: "1.1rem" }}>
          {(user?.fullName || user?.username || "U").charAt(0).toUpperCase()}
        </div>
        <div className="ms-2">
          <div className="fw-semibold text-truncate" style={{ maxWidth: 160 }}>{user?.fullName || user?.username}</div>
          <div className="small text-secondary">USER</div>
        </div>
      </div>

      <nav className="ssf-sidebar-nav">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to as any}
              onClick={onNavigate}
              className={`ssf-sidebar-link ${isActive(it.to, it.exact) ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{it.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => { logout(); onNavigate?.(); window.location.href = "/"; }}
          className="ssf-sidebar-link ssf-sidebar-logout"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}