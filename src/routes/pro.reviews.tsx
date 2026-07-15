import { createFileRoute } from "@tanstack/react-router";
import { Star, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { reviewApi } from "../api/reviewApi";
import { providerApi } from "../api/providerApi";

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
    const [reviews, setReviews] = useState<any[]>([]);
    const [avg, setAvg] = useState(0);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };
    const fetchReviews = async () => {
      try {
        const providerId = await providerApi.getId(); // Get provider id

        const reviewData = await reviewApi.byProvider(providerId);
        setReviews(reviewData);

        const avgRating =
          reviewData.length > 0
            ? reviewData.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewData.length
            : 0;

        setAvg(avgRating);

      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchReviews();
    }, []);

    if (loading) {
      return <div>Loading reviews...</div>;
    }

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
                  <div className="fw-semibold">{r.username} <span className="text-secondary small">UserId: {r.userId}</span></div>
                  <div className="small text-secondary">{r.serviceTitle} | ServiceId: {r.serviceId}</div>
                </div>
                <StarRow rating={r.rating} />
              </div>
              <p className="mb-1 mt-2">{r.comment}</p>
              <div className="small text-secondary">
                {formatDate(r.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}