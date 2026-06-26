import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import ProviderSidebar from "../components/ProviderSidebar";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/pro")({
  head: () => ({
    meta: [
      { title: "Provider Dashboard — Smart Service Finder" },
      { name: "description", content: "Manage your services, bookings, reviews and profile." },
    ],
  }),
  component: ProviderDashboardLayout,
});

const titleByPath: Record<string, { title: string; subtitle: string }> = {
  "/pro": { title: "Provider Dashboard", subtitle: "Overview of your business activity" },
  "/pro/services": { title: "My Services", subtitle: "All services you currently offer" },
  "/pro/services/add": { title: "Add Service", subtitle: "Create a new service listing" },
  "/pro/bookings": { title: "Bookings", subtitle: "Manage incoming customer requests" },
  "/pro/reviews": { title: "Reviews", subtitle: "Customer feedback on your services" },
  "/pro/notifications": { title: "Notifications", subtitle: "Activity updates for your account" },
  "/pro/profile": { title: "Business Profile", subtitle: "Manage your provider profile" },
};

function ProviderDashboardLayout() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    else if (user?.role !== "PROVIDER") navigate({ to: "/403" });
  }, [isAuthenticated, user, navigate]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (!isAuthenticated || user?.role !== "PROVIDER") return null;

  const head = titleByPath[pathname] || { title: "Provider Dashboard", subtitle: "" };

  return (
    <div className="ssf-dashboard">
      <div className="d-none d-lg-block ssf-sidebar-wrap">
        <ProviderSidebar />
      </div>

      {mobileOpen && (
        <div className="ssf-sidebar-drawer-backdrop" onClick={() => setMobileOpen(false)}>
          <div className="ssf-sidebar-drawer" onClick={(e) => e.stopPropagation()}>
            <ProviderSidebar onNavigate={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} />
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