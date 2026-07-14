import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Star, Briefcase, ShieldCheck, ArrowRight } from "lucide-react";
import { providers, services, reviews } from "../data/mock";
import { useEffect, useState } from "react";
import { providerApi } from "../api/providerApi";
import { serviceApi } from "../api/serviceApi";
import { STORAGE_KEYS } from "../utils/constants";
import { reviewApi } from "../api/reviewApi";

export const Route = createFileRoute("/provider/$id")({
 head: () => ({
    meta: [
      {
        title: "Provider Details — Smart Service Finder",
      },
    ],
  }),
  component: ProviderDetailPage,
});


function ProviderDetailPage() {
  const { id } = useParams({ from: "/provider/$id" });
  const [provider, setProvider] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [providerServices, setProviderServices] = useState<any[]>([]);
  const [providerReviews, setProviderReviews] = useState<any[]>([]);
  const isLoggedIn = !!localStorage.getItem(STORAGE_KEYS.token);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Guest user -> use mock data
        if (!isLoggedIn) {
          const mockProvider = providers.find(
            (p) => p.id === Number(id)
          );

          if (!mockProvider) {
            setProvider(null);
            return;
          }

          const mockServices = services.filter(
            (s) => s.providerId === mockProvider.id
          );

          const mockReviews = reviews.filter((r: any) =>
            mockServices.some((s: any) => s.id === r.serviceId)
          );

          setProvider(mockProvider);
          setProviderServices(mockServices);
          setProviderReviews(mockReviews);

          setRating(mockProvider.rating ?? 0);
          setReviewCount(mockProvider.reviewCount ?? 0);

          return;
        }

        // Logged-in user -> use backend
        const [
          providerData,
          servicesData,
          reviewsData,
          avgRating,
          totalReviews,
        ] = await Promise.all([
          providerApi.byId(id),
          serviceApi.byProvider(id),
          reviewApi.byProvider(id),
          reviewApi.averageRating(id),
          reviewApi.count(id),
        ]);

        setProvider(providerData);
        setProviderServices(servicesData ?? []);
        setProviderReviews(reviewsData ?? []);
        setRating(avgRating ?? 0);
        setReviewCount(totalReviews ?? 0);
      } catch (err) {
        console.error(err);

        // fallback to mock data
        const mockProvider = providers.find(
          (p) => p.id === Number(id)
        );

        if (mockProvider) {
          const mockServices = services.filter(
            (s) => s.providerId === mockProvider.id
          );

          const mockReviews = reviews.filter((r: any) =>
            mockServices.some((s: any) => s.id === r.serviceId)
          );

          setProvider(mockProvider);
          setProviderServices(mockServices);
          setProviderReviews(mockReviews);

          setRating(mockProvider.rating ?? 0);
          setReviewCount(mockProvider.reviewCount ?? 0);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isLoggedIn]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading provider...</h4>
      </div>
    );
  }
  if (!provider) {
    return (
      <div className="ssf-error-wrap">
        <div>
          <div className="ssf-error-code">404</div>
          <h2>Provider not found</h2>
          <Link to="/services" className="btn btn-ssf-primary mt-3">Browse services</Link>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="ssf-detail-hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-auto">
              <div className="ssf-avatar" style={{ width: 96, height: 96, fontSize: "2rem", background: "rgba(255,255,255,0.2)" }}>
                {provider.businessName.split(" ").map((w : string) => w[0]).slice(0, 2).join("")}
              </div>
            </div>
            <div className="col">
              <h1 className="mb-2">{provider.businessName}</h1>
              <div className="d-flex flex-wrap gap-3 align-items-center" style={{ color: "#e0e7ff" }}>
                <span className="d-flex align-items-center gap-1"><Star size={16} fill="#fbbf24" stroke="#fbbf24" /> <strong style={{ color: "#fff" }}>{Number(rating).toFixed(1)}</strong> ({reviewCount} reviews)</span>
                <span className="d-flex align-items-center gap-1"><Briefcase size={16} /> {provider.experience} years experience</span>
                <span className="d-flex align-items-center gap-1"><ShieldCheck size={16} /> Verified Provider</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="ssf-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="ssf-info-card mb-4">
                <h4 className="mb-3">About</h4>
                <p className="text-secondary mb-0" style={{ lineHeight: 1.7 }}>{provider.description}</p>
              </div>

              <div className="ssf-info-card mb-4">
                <h4 className="mb-3">Services Offered ({providerServices.length})</h4>
                {providerServices.length === 0 ? (
                  <div className="ssf-empty"><p className="mb-0">No services listed yet.</p></div>
                ) : (
                  <div className="row g-3">
                    {providerServices.map((s) => (
                      <div className="col-md-6" key={s.serviceId}>
                        <div className="ssf-card">
                          <div className="ssf-card-body">
                            <span className="ssf-badge ssf-badge-price mb-2">{s.categoryName}</span>
                            <h6 className="ssf-card-title">{s.title}</h6>
                            <p className="ssf-card-text">{s.description.slice(0, 80)}…</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <strong style={{ color: "var(--ssf-primary)" }}>₹{s.price.toLocaleString()}</strong>
                              <Link to="/service/$id" params={{ id: String(s.serviceId) }} className="btn btn-ssf-outline btn-sm">View <ArrowRight size={12} /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="ssf-info-card">
                <h4 className="mb-3">Recent Reviews</h4>
                {providerReviews.length === 0 ? (
                  <div className="ssf-empty"><p className="mb-0">No reviews yet.</p></div>
                ) : (
                  providerReviews.map((r) => (
                    <div key={r.id} className="border-bottom pb-3 mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <strong>{r.userName}</strong>
                        <div className="ssf-stars">
                          {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={14} fill="#fbbf24" stroke="#fbbf24" />)}
                        </div>
                      </div>
                      <p className="mb-0 text-secondary small">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <aside className="col-lg-4">
              <div className="ssf-info-card sticky-lg-top" style={{ top: 90 }}>
                <h6 className="mb-3">Quick Stats</h6>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-secondary">Experience</span>
                  <strong>{provider.experience}</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-secondary">Rating</span>
                  <strong>{Number(rating).toFixed(1)} / 5</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-secondary">Reviews</span>
                  <strong>{reviewCount}</strong>
                </div>
                <div className="d-flex justify-content-between py-2 mb-3">
                  <span className="text-secondary">Services</span>
                  <strong>{providerServices.length}</strong>
                </div>
                <Link to="/services" className="btn btn-ssf-primary w-100 mb-2">Book a Service</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}