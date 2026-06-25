import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, ArrowRight, Star, Zap, Wrench, Paintbrush, Hammer, Sparkles,
  Scissors, Wind, Refrigerator, ShieldCheck, CalendarCheck, Smile, UserCheck,
} from "lucide-react";
import { categories, services, providers, testimonials } from "../data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Service Finder — Find Trusted Professionals Near You" },
      { name: "description", content: "Book reliable home services — electricians, plumbers, cleaners, painters and more — from verified professionals near you." },
      { property: "og:title", content: "Smart Service Finder" },
      { property: "og:description", content: "Book reliable home services quickly and easily from verified providers." },
    ],
  }),
  component: HomePage,
});

const iconMap: Record<string, any> = {
  Zap, Wrench, Paintbrush, Hammer, Sparkles, Scissors, Wind, Refrigerator,
};

function HomePage() {
  const [q, setQ] = useState("");
  const featuredServices = services.filter((s) => s.available).slice(0, 6);
  const featuredProviders = providers.slice(0, 4);

  const filteredQuick = q.trim()
    ? services.filter((s) => s.title.toLowerCase().includes(q.toLowerCase())).slice(0, 5)
    : [];

  return (
    <>
      {/* Hero */}
      <section className="ssf-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="ssf-badge ssf-badge-price mb-3">
                <Sparkles size={14} /> Trusted by 1,000+ customers
              </span>
              <h1>Find Trusted Professionals <span style={{ color: "var(--ssf-primary)" }}>Near You</span></h1>
              <p className="lead">Book reliable home services quickly and easily — from verified electricians, plumbers, cleaners and more.</p>

              <div className="ssf-hero-search position-relative">
                <div className="ps-3 text-secondary"><Search size={20} /></div>
                <input
                  type="text"
                  placeholder="What service do you need today?"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <Link to="/services" className="btn btn-ssf-primary">Search</Link>
                {filteredQuick.length > 0 && (
                  <div className="position-absolute bg-white shadow rounded-3 mt-2 p-2" style={{ top: "100%", left: 0, right: 0, zIndex: 10 }}>
                    {filteredQuick.map((s) => (
                      <Link key={s.id} to="/service/$id" params={{ id: String(s.id) }} className="d-block p-2 rounded text-decoration-none text-dark" style={{ transition: "background 0.15s" }}>
                        <Search size={14} className="me-2 text-secondary" /> {s.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="d-flex gap-3 mt-4">
                <Link to="/services" className="btn btn-ssf-primary">Explore Services <ArrowRight size={16} className="ms-1" /></Link>
                <Link to="/register" className="btn btn-ssf-outline">Become Provider</Link>
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-block">
              <div style={{ position: "relative" }}>
                <div className="ssf-info-card" style={{ background: "var(--ssf-gradient)", color: "#fff", border: 0 }}>
                  <h4 style={{ color: "#fff" }}>500+ Verified Pros</h4>
                  <p style={{ color: "#e0e7ff", marginBottom: 0 }}>Background-checked & rated by real customers.</p>
                </div>
                <div className="ssf-info-card mt-3" style={{ marginLeft: "30%" }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="ssf-avatar">JS</div>
                    <div>
                      <div className="fw-bold">John S.</div>
                      <div className="ssf-stars"><Star size={14} fill="#fbbf24" /><Star size={14} fill="#fbbf24" /><Star size={14} fill="#fbbf24" /><Star size={14} fill="#fbbf24" /><Star size={14} fill="#fbbf24" /></div>
                      <small className="text-secondary">Electrician • 4.9</small>
                    </div>
                  </div>
                </div>
                <div className="ssf-info-card mt-3" style={{ marginRight: "30%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-secondary">Booking confirmed</small>
                      <div className="fw-bold">AC Cleaning ✓</div>
                    </div>
                    <div className="ssf-category-icon" style={{ width: 44, height: 44, marginBottom: 0 }}>
                      <CalendarCheck size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="ssf-section">
        <div className="container">
          <div className="ssf-section-title">
            <h2>Popular Categories</h2>
            <p>Browse top services by category</p>
          </div>
          <div className="row g-4">
            {categories.map((c) => {
              const Icon = iconMap[c.icon];
              return (
                <div className="col-6 col-md-4 col-lg-3" key={c.id}>
                  <Link to="/services" className="text-decoration-none">
                    <div className="ssf-category-card">
                      <div className="ssf-category-icon">{Icon && <Icon size={28} />}</div>
                      <h6 className="mb-0">{c.name}</h6>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="ssf-section ssf-section-alt">
        <div className="container">
          <div className="ssf-section-title">
            <h2>Featured Services</h2>
            <p>Hand-picked services from top-rated providers</p>
          </div>
          <div className="row g-4">
            {featuredServices.map((s) => (
              <div className="col-md-6 col-lg-4" key={s.id}>
                <ServiceCardHome service={s} />
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/services" className="btn btn-ssf-outline">View All Services <ArrowRight size={16} className="ms-1" /></Link>
          </div>
        </div>
      </section>

      {/* Featured providers */}
      <section className="ssf-section">
        <div className="container">
          <div className="ssf-section-title">
            <h2>Featured Providers</h2>
            <p>Verified professionals you can trust</p>
          </div>
          <div className="row g-4">
            {featuredProviders.map((p) => (
              <div className="col-md-6 col-lg-3" key={p.id}>
                <div className="ssf-card">
                  <div className="ssf-card-body text-center">
                    <div className="ssf-avatar mx-auto mb-3">{p.businessName.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                    <h6 className="ssf-card-title">{p.businessName}</h6>
                    <div className="ssf-stars justify-content-center mb-2"><Star size={14} fill="#fbbf24" /> <span className="ms-1 small fw-semibold text-dark">{p.rating}</span> <span className="ms-1 small text-secondary">({p.reviewCount})</span></div>
                    <p className="ssf-card-text">{p.description.slice(0, 80)}…</p>
                    <Link to="/provider/$id" params={{ id: String(p.id) }} className="btn btn-ssf-outline w-100">View Profile</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="ssf-section ssf-section-alt">
        <div className="container">
          <div className="ssf-section-title">
            <h2>How It Works</h2>
            <p>Get help in 4 simple steps</p>
          </div>
          <div className="row g-4">
            {[
              { icon: Search, title: "Search Service", text: "Browse categories and find the right pro." },
              { icon: CalendarCheck, title: "Book Service", text: "Pick a time slot that works for you." },
              { icon: UserCheck, title: "Provider Visits", text: "A verified expert arrives at your door." },
              { icon: Smile, title: "Rate Experience", text: "Share feedback and help others choose." },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div className="col-md-6 col-lg-3" key={i}>
                  <div className="ssf-step">
                    <div className="ssf-step-num"><Icon size={26} /></div>
                    <h5>{step.title}</h5>
                    <p>{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="ssf-section">
        <div className="container">
          <div className="row g-4">
            {[
              { num: "500+", label: "Verified Providers" },
              { num: "2,000+", label: "Services Listed" },
              { num: "1,000+", label: "Happy Customers" },
              { num: "4.8★", label: "Average Rating" },
            ].map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="ssf-stat">
                  <div className="ssf-stat-num">{s.num}</div>
                  <div className="ssf-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="ssf-section ssf-section-alt">
        <div className="container">
          <div className="ssf-section-title">
            <h2>What Our Customers Say</h2>
            <p>Real reviews from real people</p>
          </div>
          <div className="row g-4">
            {testimonials.map((t, i) => (
              <div className="col-md-4" key={i}>
                <div className="ssf-testimonial">
                  <div className="ssf-testimonial-stars">
                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={16} fill="#fbbf24" stroke="#fbbf24" />)}
                  </div>
                  <p className="ssf-testimonial-text">"{t.text}"</p>
                  <div className="ssf-testimonial-author">
                    <div className="ssf-avatar" style={{ width: 48, height: 48, fontSize: "1rem" }}>{t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                    <div>
                      <div className="fw-bold">{t.name}</div>
                      <small className="text-secondary">{t.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceCardHome({ service }: { service: typeof services[number] }) {
  return (
    <div className="ssf-card">
      <div className="ssf-card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="ssf-badge ssf-badge-price">{service.categoryName}</span>
          <span className={`ssf-badge ${service.available ? "ssf-badge-available" : "ssf-badge-unavailable"}`}>
            {service.available ? "Available" : "Unavailable"}
          </span>
        </div>
        <h6 className="ssf-card-title">{service.title}</h6>
        <p className="ssf-card-text">{service.description}</p>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="fw-bold" style={{ color: "var(--ssf-primary)", fontSize: "1.15rem" }}>₹{service.price.toLocaleString()}</div>
          <div className="ssf-stars"><Star size={14} fill="#fbbf24" stroke="#fbbf24" /> <span className="ms-1 small fw-semibold text-dark">4.8</span></div>
        </div>
        <div className="d-flex gap-2">
          <Link to="/service/$id" params={{ id: String(service.id) }} className="btn btn-ssf-ghost flex-fill">Details</Link>
          <Link to="/service/$id" params={{ id: String(service.id) }} className="btn btn-ssf-primary flex-fill">Book Now</Link>
        </div>
      </div>
    </div>
  );
}
