import { createFileRoute } from "@tanstack/react-router";
import { Star, MessageSquare } from "lucide-react";
import { providerReviews } from "../data/providerMock";

export const Route = createFileRoute("/pro/reviews")({
  component: ProviderReviews,
});

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="d-inline-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14} fill={i <= rating ? "#fbbf24" : "transparent"} color="#fbbf24" />
      ))}
      <span className="small text-secondary ms-1">{rating}.0</span>
    </div>
  );
}

function ProviderReviews() {
  const reviews = providerReviews;
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <div className="ssf-card p-3">
            <div className="small text-secondary">Average Rating</div>
            <div className="d-flex align-items-center gap-2 mt-1">
              <h3 className="mb-0">{avg.toFixed(1)}</h3>
              <StarRow rating={Math.round(avg)} />
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="ssf-card p-3">
            <div className="small text-secondary">Total Reviews</div>
            <h3 className="mb-0 mt-1">{reviews.length}</h3>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="ssf-empty"><MessageSquare size={40} /><p className="mt-2 mb-0">No reviews yet.</p></div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {reviews.map((r) => (
            <div key={r.reviewId} className="ssf-card p-3">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <div className="fw-semibold">{r.userName} <span className="text-secondary small">· User #{r.userId}</span></div>
                  <div className="small text-secondary">{r.serviceTitle} · Service #{r.serviceId}</div>
                </div>
                <StarRow rating={r.rating} />
              </div>
              <p className="mb-1 mt-2">{r.comment}</p>
              <div className="small text-secondary">{r.createdAt}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}