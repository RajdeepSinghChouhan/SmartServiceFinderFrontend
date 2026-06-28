import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Sparkles, Bell, User as UserIcon, Facebook, Twitter, Instagram, Linkedin, LayoutDashboard, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (p: string) => (p === "/" ? pathname === "/" : pathname.startsWith(p));

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isProvider = user?.role === "PROVIDER";
  const notifSource = notifications;
  const unread = unreadCount;
  const dashboardTo = isProvider ? "/pro" : "/user";
  const notifTo = isProvider ? "/pro/notifications" : "/user/notifications";
  const profileTo = isProvider ? "/pro/profile" : "/user/profile";

  const links = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/providers", label: "Providers" },
  ];

  return (
    <nav className="ssf-navbar">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/" className="ssf-brand text-decoration-none">
          <span className="ssf-brand-icon"><Sparkles size={18} /></span>
          Smart Service Finder
        </Link>

        <button
          className="btn btn-ssf-ghost d-lg-none"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="d-none d-lg-flex align-items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to as any}
              className={`ssf-nav-link ${isActive(l.to) ? "active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <button
            className="btn btn-ssf-ghost ms-2"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {!isAuthenticated && (
            <>
              <Link to="/login" className="btn btn-ssf-ghost ms-2">Login</Link>
              <Link to="/register" className="btn btn-ssf-primary ms-2">Register</Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <div className="position-relative ms-2" ref={notifRef}>
                <button className="btn btn-ssf-ghost position-relative" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
                  <Bell size={18} />
                  {unread > 0 && <span className="ssf-notif-badge">{unread}</span>}
                </button>
                {notifOpen && (
                  <div className="ssf-dropdown">
                    <div className="ssf-dropdown-header">
                      <span className="fw-semibold">Notifications</span>
                      <Link to="/user/notifications" onClick={() => setNotifOpen(false)} className="small">View all</Link>
                    </div>
                    <div className="ssf-dropdown-body">
                      {notifSource.slice(0, 4).map((n) => (
                        <Link key={n.id} to={notifTo as any} onClick={() => setNotifOpen(false)} className={`ssf-dropdown-item ${!n.isRead ? "unread" : ""}`}>
                          <div className="fw-semibold small">{n.title}</div>
                          <div className="text-secondary small text-truncate">{n.message}</div>
                          <div className="text-secondary" style={{ fontSize: "0.72rem" }}>{n.createdAt}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="position-relative ms-2" ref={userRef}>
                <button className="btn btn-ssf-ghost d-flex align-items-center gap-2" onClick={() => setUserOpen((v) => !v)}>
                  <div className="ssf-avatar" style={{ width: 28, height: 28, fontSize: "0.8rem" }}>
                    {(user?.fullName || user?.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="small fw-semibold">{user?.username}</span>
                </button>
                {userOpen && (
                  <div className="ssf-dropdown" style={{ minWidth: 220 }}>
                    <Link to={dashboardTo as any} onClick={() => setUserOpen(false)} className="ssf-dropdown-item d-flex align-items-center gap-2">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link to={profileTo as any} onClick={() => setUserOpen(false)} className="ssf-dropdown-item d-flex align-items-center gap-2">
                      <UserIcon size={16} /> Profile
                    </Link>
                    <button
                      className="ssf-dropdown-item d-flex align-items-center gap-2 w-100 text-start"
                      onClick={() => { setUserOpen(false); logout(); window.location.href = "/"; }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="d-lg-none container pt-3 pb-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to as any}
              className={`ssf-nav-link d-block py-2 ${isActive(l.to) ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <button
            className="btn btn-ssf-ghost w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <><Sun size={16} /> Light mode</> : <><Moon size={16} /> Dark mode</>}
          </button>
          {isAuthenticated ? (
            <>
              <Link to={dashboardTo as any} className="ssf-nav-link d-block py-2" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link to={notifTo as any} className="ssf-nav-link d-block py-2" onClick={() => setOpen(false)}>
                Notifications {unread > 0 && <span className="badge bg-danger ms-2">{unread}</span>}
              </Link>
              <button className="btn btn-ssf-ghost w-100 mt-2" onClick={() => { setOpen(false); logout(); window.location.href = "/"; }}>Logout</button>
            </>
          ) : (
            <div className="d-flex gap-2 mt-2">
              <Link to="/login" className="btn btn-ssf-ghost flex-fill" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-ssf-primary flex-fill" onClick={() => setOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="ssf-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="ssf-brand text-white mb-3" style={{ color: "#fff" }}>
              <span className="ssf-brand-icon"><Sparkles size={18} /></span>
              Smart Service Finder
            </div>
            <p style={{ color: "#94a3b8", maxWidth: 320 }}>
              Connecting customers with trusted, verified service providers across your city.
            </p>
            <div className="mt-3">
              <a href="#" className="ssf-social" aria-label="Facebook"><Facebook size={16} color="#fff" /></a>
              <a href="#" className="ssf-social" aria-label="Twitter"><Twitter size={16} color="#fff" /></a>
              <a href="#" className="ssf-social" aria-label="Instagram"><Instagram size={16} color="#fff" /></a>
              <a href="#" className="ssf-social" aria-label="LinkedIn"><Linkedin size={16} color="#fff" /></a>
            </div>
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            <h6>Company</h6>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            <h6>Services</h6>
            <Link to="/services">All Services</Link>
            <a href="#">Categories</a>
            <a href="#">Pricing</a>
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            <h6>Legal</h6>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Refund</a>
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            <h6>Support</h6>
            <a href="#">Help Center</a>
            <a href="#">FAQs</a>
            <a href="#">Become Provider</a>
          </div>
        </div>
        <div className="ssf-footer-bottom">
          © {new Date().getFullYear()} Smart Service Finder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isDashboard = pathname.startsWith("/user") || pathname.startsWith("/pro");
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}
