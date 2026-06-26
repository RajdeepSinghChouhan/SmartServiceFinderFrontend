import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import UserSidebar from "../components/UserSidebar";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/user")({
  head: () => ({
    meta: [
      { title: "Dashboard — Smart Service Finder" },
      { name: "description", content: "Manage your bookings, reviews and profile." },
    ],
  }),
  component: UserDashboardLayout,
});

const titleByPath: Record<string, { title: string; subtitle: string }> = {
  "/user": { title: "Dashboard", subtitle: "Overview of your activity" },
  "/user/bookings": { title: "My Bookings", subtitle: "Track and manage your service bookings" },
  "/user/reviews": { title: "My Reviews", subtitle: "Reviews you've written" },
  "/user/notifications": { title: "Notifications", subtitle: "Updates about your bookings & account" },
  "/user/profile": { title: "Profile", subtitle: "Manage your account information" },
};

function UserDashboardLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
  }, [isAuthenticated, navigate]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (!isAuthenticated) return null;

  const head = titleByPath[pathname] || { title: "Dashboard", subtitle: "" };

  return (
    <div className="ssf-dashboard">
      <div className="d-none d-lg-block ssf-sidebar-wrap">
        <UserSidebar />
      </div>

      {mobileOpen && (
        <div className="ssf-sidebar-drawer-backdrop" onClick={() => setMobileOpen(false)}>
          <div className="ssf-sidebar-drawer" onClick={(e) => e.stopPropagation()}>
            <UserSidebar onNavigate={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="ssf-dashboard-main">
        <div className="ssf-dashboard-header">
          <button className="btn btn-ssf-ghost d-lg-none me-2" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
          <div>
            <h3 className="mb-0">{head.title}</h3>
            {head.subtitle && <p className="text-secondary small mb-0">{head.subtitle}</p>}
          </div>
        </div>
        <div className="ssf-dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}