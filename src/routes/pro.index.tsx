import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Calendar, CheckCircle2, Star, Clock, MessageSquare } from "lucide-react";
import StatsCard from "../components/StatsCard";
import StatusBadge from "../components/StatusBadge";
import { providerBookings, providerServices, providerReviews } from "../data/providerMock";

export const Route = createFileRoute("/pro/")({
  component: ProviderHome,
});

function ProviderHome() {
  const totalServices = providerServices.length;
  const activeServices = providerServices.filter((s) => s.available).length;
  const pending = providerBookings.filter((b) => b.status === "PENDING").length;
  const completed = providerBookings.filter((b) => b.status === "COMPLETED").length;
  const avgRating = providerReviews.length
    ? (providerReviews.reduce((s, r) => s + r.rating, 0) / providerReviews.length).toFixed(1)
    : "0.0";

  const recentBookings = [...providerBookings]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);
  const recentReviews = [...providerReviews]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3"><StatsCard icon={<Briefcase size={20} />} label="Total Services" value={totalServices} tone="primary" /></div>
        <div className="col-6 col-lg-3"><StatsCard icon={<CheckCircle2 size={20} />} label="Active Services" value={activeServices} tone="success" /></div>
        <div className="col-6 col-lg-3"><StatsCard icon={<Clock size={20} />} label="Pending Bookings" value={pending} tone="warning" /></div>
        <div className="col-6 col-lg-3"><StatsCard icon={<Star size={20} />} label="Avg. Rating" value={avgRating} tone="muted" /></div>
      </div>

      <div className="row g-3">
        <div className="col-lg-7">
          <div className="ssf-panel">
            <div className="ssf-panel-header">
              <h5 className="mb-0">Recent Bookings</h5>
              <Link to="/pro/bookings" className="small">View all</Link>
            </div>
            {recentBookings.length === 0 ? (
              <div className="ssf-empty"><Calendar size={36} /><p className="mt-2 mb-0">No bookings yet</p></div>
            ) : (
              <div className="ssf-panel-body">
                {recentBookings.map((b) => (
                  <div key={b.id} className="ssf-list-row">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div>
                        <div className="fw-semibold">{b.serviceTitle}</div>
                        <div className="small text-secondary">{b.customerName} · {b.bookingDate} {b.bookingTime}</div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="ssf-panel">
            <div className="ssf-panel-header">
              <h5 className="mb-0">Recent Reviews</h5>
              <Link to="/pro/reviews" className="small">View all</Link>
            </div>
            {recentReviews.length === 0 ? (
              <div className="ssf-empty"><MessageSquare size={36} /><p className="mt-2 mb-0">No reviews yet</p></div>
            ) : (
              <div className="ssf-panel-body">
                {recentReviews.map((r) => (
                  <div key={r.reviewId} className="ssf-list-row">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="fw-semibold">{r.userName}</div>
                      <div className="small" style={{ color: "#fbbf24" }}>{"★".repeat(r.rating)}<span className="text-secondary">{"★".repeat(5 - r.rating)}</span></div>
                    </div>
                    <div className="small text-secondary">{r.serviceTitle} · {r.createdAt}</div>
                    <p className="small mb-0 mt-1">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}