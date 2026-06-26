import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Star, Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import ReviewModal from "../components/ReviewModal";
import { mockUserReviews, type UserReview } from "../data/userMock";

export const Route = createFileRoute("/user/reviews")({
  component: MyReviews,
});

function Stars({ value }: { value: number }) {
  return (
    <span className="ssf-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={16} fill={n <= value ? "#fbbf24" : "none"} color={n <= value ? "#fbbf24" : "#475569"} />
      ))}
    </span>
  );
}

function MyReviews() {
  const [reviews, setReviews] = useState<UserReview[]>(mockUserReviews);
  const [editing, setEditing] = useState<UserReview | null>(null);
  const [deleting, setDeleting] = useState<UserReview | null>(null);

  const onUpdate = (data: { rating: number; comment: string }) => {
    if (!editing) return;
    setReviews((rs) => rs.map((r) => (r.reviewId === editing.reviewId ? { ...r, ...data } : r)));
    toast.success("Review updated");
    setEditing(null);
  };

  const onDelete = (id: number) => {
    setReviews((rs) => rs.filter((r) => r.reviewId !== id));
    toast.success("Review deleted");
    setDeleting(null);
  };

  if (reviews.length === 0) {
    return (
      <div className="ssf-panel ssf-empty">
        <div className="ssf-empty-icon"><Star size={28} /></div>
        <div className="fw-semibold">No reviews yet</div>
        <div className="small">Complete a booking to leave a review.</div>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {reviews.map((r) => (
        <div key={r.reviewId} className="col-12 col-lg-6">
          <div className="ssf-panel h-100">
            <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
              <h6 className="mb-0">{r.serviceTitle}</h6>
              <Stars value={r.rating} />
            </div>
            <p className="text-secondary mb-2">{r.comment}</p>
            <div className="small text-secondary mb-3">Posted on {r.createdAt}</div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-ssf-ghost" onClick={() => setEditing(r)}><Pencil size={14} className="me-1" /> Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => setDeleting(r)}><Trash2 size={14} className="me-1" /> Delete</button>
            </div>
          </div>
        </div>
      ))}

      <ReviewModal
        key={editing?.reviewId}
        open={!!editing}
        onClose={() => setEditing(null)}
        onSubmit={onUpdate}
        title="Update Review"
        serviceTitle={editing?.serviceTitle}
        initialRating={editing?.rating ?? 5}
        initialComment={editing?.comment ?? ""}
      />

      <ConfirmModal
        open={!!deleting}
        title="Delete this review?"
        message="This will permanently remove your review."
        confirmLabel="Delete"
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && onDelete(deleting.reviewId)}
      />
    </div>
  );
}