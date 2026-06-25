import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Star, Calendar, Tag, CheckCircle2, XCircle, ArrowRight, MessageSquare } from "lucide-react";
import { services, providers, reviews } from "../data/mock";

export const Route = createFileRoute("/service/$id")({
  head: ({ params }) => {
    const s = services.find((x) => x.id === Number(params.id));
    const title = s ? `${s.title} — Smart Service Finder` : "Service — Smart Service Finder";
    const desc = s?.description ?? "View this service on Smart Service Finder.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: ServiceDetailPage,
  notFoundComponent: () => (
    <div className="ssf-error-wrap"><div><div className="ssf-error-code">404</div><h2>Service not found</h2><Link to="/services" className="btn btn-ssf-primary mt-3">All services</Link></div></div>
  ),
});

function ServiceDetailPage() {
  const { id } = useParams({ from: "/service/$id" });
  const service = services.find((s) => s.id === Number(id));

  if (!service) {
    return (
      <div className="ssf-error-wrap">
        <div>
          <div className="ssf-error-code">404</div>
          <h2>Service not found</h2>
          <Link to="/services" className="btn btn-ssf-primary mt-3">Browse all services</Link>
        </div>
      </div>
    );
  }

  const provider = providers.find((p) => p.id === service.providerId);
  const serviceReviews = reviews.filter((r) => r.serviceId === service.id);
  const related = services.filter((s) => s.categoryId === service.categoryId && s.id !== service.id).slice(0, 3);

  return (
    <>
      <div className="ssf-detail-hero">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/services">Services</Link></li>
              <li className="breadcrumb-item active">{service.categoryName}</li>
            </ol>
          </nav>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="ssf-badge" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>{service.categoryName}</span>
            <span className={`ssf-badge ${service.available ? "ssf-badge-available" : "ssf-badge-unavailable"}`}>
              {service.available ? <><CheckCircle2 size={12} /> Available</> : <><XCircle size={12} /> Unavailable</>}
            </span>
          </div>
          <h1>{service.title}</h1>
        </div>
      </div>

      <section className="ssf-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="ssf-info-card mb-4">
                <h4 className="mb-3">About this service</h4>
                <p className="text-secondary mb-4" style={{ lineHeight: 1.7 }}>{service.description}</p>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center gap-2 text-secondary"><Tag size={16} /> Category</div>
                    <div className="fw-semibold">{service.categoryName}</div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center gap-2 text-secondary"><Calendar size={16} /> Listed on</div>
                    <div className="fw-semibold">{new Date(service.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</div>
                  </div>
                </div>
              </div>

              <div className="ssf-info-card mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Reviews ({serviceReviews.length})</h4>
                  <div className="ssf-stars"><Star size={16} fill="#fbbf24" stroke="#fbbf24" /> <strong className="ms-1 text-dark">4.8</strong></div>
                </div>
                {serviceReviews.length === 0 ? (
                  <div className="ssf-empty">
                    <div className="ssf-empty-icon"><MessageSquare size={28} /></div>
                    <p className="mb-0">No reviews yet. Be the first to review.</p>
                  </div>
                ) : (
                  serviceReviews.map((r) => (
                    <div key={r.id} className="border-bottom pb-3 mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="d-flex align-items-center gap-2">
                          <div className="ssf-avatar" style={{ width: 40, height: 40, fontSize: "0.9rem" }}>
                            {r.userName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                          </div>
                          <div>
                            <div className="fw-semibold">{r.userName}</div>
                            <small className="text-secondary">{new Date(r.createdAt).toLocaleDateString()}</small>
                          </div>
                        </div>
                        <div className="ssf-stars">
                          {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={14} fill="#fbbf24" stroke="#fbbf24" />)}
                        </div>
                      </div>
                      <p className="mb-0 text-secondary">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <aside className="col-lg-4">
              <div className="ssf-info-card mb-4 sticky-lg-top" style={{ top: 90 }}>
                <div className="text-secondary">Service price</div>
                <div className="display-6 fw-bold mb-3" style={{ color: "var(--ssf-primary)" }}>₹{service.price.toLocaleString()}</div>
                <button className="btn btn-ssf-primary w-100 mb-2" disabled={!service.available}>
                  {service.available ? "Book Service" : "Currently Unavailable"}
                </button>
                <Link to="/login" className="btn btn-ssf-ghost w-100">Login to book</Link>

                {provider && (
                  <>
                    <hr className="my-4" />
                    <h6 className="mb-3">Provider</h6>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="ssf-avatar">{provider.businessName.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                      <div>
                        <div className="fw-bold">{provider.businessName}</div>
                        <div className="ssf-stars"><Star size={14} fill="#fbbf24" stroke="#fbbf24" /> <span className="ms-1 small text-dark fw-semibold">{provider.rating}</span> <span className="ms-1 small text-secondary">({provider.reviewCount} reviews)</span></div>
                      </div>
                    </div>
                    <p className="small text-secondary">{provider.description}</p>
                    <Link to="/provider/$id" params={{ id: String(provider.id) }} className="btn btn-ssf-outline w-100">View Provider Profile <ArrowRight size={14} className="ms-1" /></Link>
                  </>
                )}
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-4">Related Services</h4>
              <div className="row g-4">
                {related.map((s) => (
                  <div className="col-md-4" key={s.id}>
                    <div className="ssf-card">
                      <div className="ssf-card-body">
                        <span className="ssf-badge ssf-badge-price mb-2">{s.categoryName}</span>
                        <h6 className="ssf-card-title">{s.title}</h6>
                        <p className="ssf-card-text">{s.description.slice(0, 80)}…</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <strong style={{ color: "var(--ssf-primary)" }}>₹{s.price.toLocaleString()}</strong>
                          <Link to="/service/$id" params={{ id: String(s.id) }} className="btn btn-ssf-outline btn-sm">View</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}