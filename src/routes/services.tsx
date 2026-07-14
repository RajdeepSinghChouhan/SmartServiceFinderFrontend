import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star, Filter, SearchX } from "lucide-react";
import { categories } from "../data/mock"; // keep only if categories are still local
import { services as mockServices } from "../data/mock";
import { serviceApi } from "../api/serviceApi";
import { useEffect } from "react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "All Services — Smart Service Finder" },
      { name: "description", content: "Browse and book from hundreds of verified home services in your area." },
      { property: "og:title", content: "All Services — Smart Service Finder" },
      { property: "og:description", content: "Browse and book from hundreds of verified home services in your area." },
    ],
  }),
  component: ServicesPage,
});

const PAGE_SIZE = 6;

function ServicesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<number | "all">("all");
  const [avail, setAvail] = useState<"all" | "yes" | "no">("all");
  const [sort, setSort] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [page, setPage] = useState(1);

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  const filtered = useMemo(() => {
    let list = services.filter((s) => s.title.toLowerCase().includes(q.toLowerCase()));
    if (cat !== "all") list = list.filter((s) => s.categoryId === cat);
    if (avail === "yes") list = list.filter((s) => s.available);
    if (avail === "no") list = list.filter((s) => !s.available);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "newest") list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return list;
  }, [services, q, cat, avail, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);


  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);

        if (!isLoggedIn) {
        // Use mock data for guests
        setServices(mockServices);
        return;
      }

      // Logged-in users get real data
      const data = await serviceApi.list();

        setServices(data);
      } catch (err) {

        console.error(err);
        // Optional fallback to mock data if API fails
        setServices(mockServices);

        setError("Failed to load services. Please try again later."); 
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [isLoggedIn]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading services...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center text-danger">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="ssf-detail-hero">
        <div className="container">
          <h1 className="mb-2">All Services</h1>
          <p className="mb-0" style={{ color: "#e0e7ff" }}>Browse {services.length}+ services from verified providers</p>
        </div>
      </div>

      <section className="ssf-section">
        <div className="container">
          <div className="row g-4">
            <aside className="col-lg-3">
              <div className="ssf-info-card sticky-lg-top" style={{ top: 90 }}>
                <h6 className="d-flex align-items-center gap-2 mb-3"><Filter size={16} /> Filters</h6>

                <label className="form-label small fw-semibold">Search</label>
                <div className="position-relative mb-3">
                  <Search size={16} className="position-absolute" style={{ left: 12, top: 12, color: "#94a3b8" }} />
                  <input type="text" className="form-control ps-5" placeholder="Search title…" value={q}
                    onChange={(e) => { setQ(e.target.value); setPage(1); }} />
                </div>

                <label className="form-label small fw-semibold">Category</label>
                <select className="form-select mb-3" value={cat}
                  onChange={(e) => { setCat(e.target.value === "all" ? "all" : Number(e.target.value)); setPage(1); }}>
                  <option value="all">All Categories</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <label className="form-label small fw-semibold">Availability</label>
                <select className="form-select mb-3" value={avail}
                  onChange={(e) => { setAvail(e.target.value as any); setPage(1); }}>
                  <option value="all">All</option>
                  <option value="yes">Available</option>
                  <option value="no">Unavailable</option>
                </select>

                <label className="form-label small fw-semibold">Sort by</label>
                <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value as any)}>
                  <option value="newest">Newest first</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </aside>

            <div className="col-lg-9">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-secondary">Showing <strong className="text-dark">{pageItems.length}</strong> of <strong className="text-dark">{filtered.length}</strong> services</span>
              </div>

              {pageItems.length === 0 ? (
                <div className="ssf-empty">
                  <div className="ssf-empty-icon"><SearchX size={32} /></div>
                  <h5>No services found</h5>
                  <p>Try adjusting your filters or search query.</p>
                </div>
              ) : (
                <div className="row g-4">
                  {pageItems.map((s) => (
                    <div className="col-md-6" key={s.serviceId}>
                      <div className="ssf-card">
                        <div className="ssf-card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="ssf-badge ssf-badge-price">{s.categoryName}</span>
                            <span className={`ssf-badge ${s.available ? "ssf-badge-available" : "ssf-badge-unavailable"}`}>
                              {s.available ? "Available" : "Unavailable"}
                            </span>
                          </div>
                          <h6 className="ssf-card-title">{s.title}</h6>
                          <p className="ssf-card-text">{s.description}</p>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="fw-bold" style={{ color: "var(--ssf-primary)", fontSize: "1.15rem" }}>₹{s.price.toLocaleString()}</div>
                            <small className="text-secondary">Added {new Date(s.createdAt).toLocaleDateString()}</small>
                          </div>
                          <div className="d-flex gap-2">
                            <Link to="/service/$id" params={{ id: String(s.serviceId) }} className="btn btn-ssf-ghost flex-fill">Details</Link>
                            <Link to="/service/$id" params={{ id: String(s.serviceId) }} className="btn btn-ssf-primary flex-fill">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <nav className="mt-4 d-flex justify-content-center">
                  <ul className="pagination">
                    <li className={`page-item ${safePage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setPage(safePage - 1)}>Previous</button>
                    </li>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <li key={i} className={`page-item ${safePage === i + 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${safePage === totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setPage(safePage + 1)}>Next</button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}