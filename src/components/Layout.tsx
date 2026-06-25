import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles, Bell, User, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (p: string) => (p === "/" ? pathname === "/" : pathname.startsWith(p));

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
          <Link to="/login" className="btn btn-ssf-ghost ms-2">Login</Link>
          <Link to="/register" className="btn btn-ssf-primary ms-2">Register</Link>
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
          <div className="d-flex gap-2 mt-2">
            <Link to="/login" className="btn btn-ssf-ghost flex-fill" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/register" className="btn btn-ssf-primary flex-fill" onClick={() => setOpen(false)}>Register</Link>
          </div>
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
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
