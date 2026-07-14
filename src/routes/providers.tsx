import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Search, Briefcase } from "lucide-react";
import { providers } from "../data/mock";
import { useEffect, useState } from "react";
import { providers as mockProviders } from "../data/mock";
import { STORAGE_KEYS } from "../utils/constants";
import { providerApi } from "../api/providerApi";
import { reviewApi } from "../api/reviewApi";

export const Route = createFileRoute("/providers")({
  head: () => ({
    meta: [
      { title: "Verified Providers — Smart Service Finder" },
      { name: "description", content: "Browse verified service providers and their ratings on Smart Service Finder." },
      { property: "og:title", content: "Verified Providers — Smart Service Finder" },
      { property: "og:description", content: "Browse verified service providers and their ratings." },
    ],
  }),
  component: ProvidersPage,
});

function ProvidersPage() {
  const [q, setQ] = useState("");
  const [providerList, setProviderList] = useState(mockProviders);
  const [loading, setLoading] = useState(true);
  const list = providerList.filter((p) => p.businessName.toLowerCase().includes(q.toLowerCase()));

  const isLoggedIn = !!localStorage.getItem(STORAGE_KEYS.token);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoading(true);

        if (!isLoggedIn) {
          setProviderList(mockProviders);
          return;
        }

        const data = await providerApi.all()

        const providersWithRatings = await Promise.all(
          data.map(async (provider: any) => {
            try {
              const [rating, reviewCount] = await Promise.all([
                reviewApi.averageRating(provider.id),
                reviewApi.count(provider.id),
              ]);

              return {
                ...provider,
                rating: rating ?? 0,
                reviewCount: reviewCount ?? 0,
              };
            } catch {
              return {
                ...provider,
                rating: 0,
                reviewCount: 0,
              };
            }
          })
        );

        setProviderList(providersWithRatings);
        
      } catch (error) {
        console.error(error);

        // fallback to mock data
        setProviderList(mockProviders);
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, [isLoggedIn]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading providers...</h4>
      </div>
    );
  }
  return (
    <>
      <div className="ssf-detail-hero">
        <div className="container">
          <h1 className="mb-2">Verified Providers</h1>
          <p className="mb-0" style={{ color: "#e0e7ff" }}>Background-checked professionals you can trust</p>
        </div>
      </div>

      <section className="ssf-section">
        <div className="container">
          <div className="mb-4" style={{ maxWidth: 480 }}>
            <div className="position-relative">
              <Search size={16} className="position-absolute" style={{ left: 14, top: 14, color: "#94a3b8" }} />
              <input type="text" className="form-control ps-5" placeholder="Search providers…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>

          <div className="row g-4">
            {list.map((p) => (
              <div className="col-md-6 col-lg-4" key={p.id}>
                <div className="ssf-card">
                  <div className="ssf-card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="ssf-avatar">{p.businessName.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                      <div>
                        <h6 className="mb-1">{p.businessName}</h6>
                        <div className="ssf-stars">
                          <Star size={14} fill="#fbbf24" stroke="#fbbf24" />{p.reviewCount > 0 ? (<><span className="ms-1 small fw-semibold text-dark">{Number(p.rating).toFixed(1)}</span><span className="ms-1 small text-secondary">({p.reviewCount})</span></>) : (<span className="ms-1 small text-secondary">No reviews yet</span>)}</div>
                      </div>
                    </div>
                    <p className="ssf-card-text">{p.description}</p>
                    <div className="d-flex justify-content-between align-items-center mb-3 small text-secondary">
                      <span className="d-flex align-items-center gap-1"><Briefcase size={14} /> {p.experience} yrs</span>
                    </div>
                    <Link to="/provider/$id" params={{ id: String(p.id) }} className="btn btn-ssf-primary w-100">View Profile</Link>
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