import { useState } from "react";
import { Star } from "lucide-react";

export default function ReviewModal({
  open, onClose, onSubmit, serviceTitle, initialRating = 5, initialComment = "",
  title = "Write a Review",
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string }) => void;
  serviceTitle?: string;
  initialRating?: number;
  initialComment?: string;
  title?: string;
}) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [hover, setHover] = useState(0);

  if (!open) return null;

  return (
    <div className="ssf-modal-backdrop" onClick={onClose}>
      <div className="ssf-modal" onClick={(e) => e.stopPropagation()}>
        <h5 className="mb-1">{title}</h5>
        {serviceTitle && <p className="text-secondary small mb-3">{serviceTitle}</p>}

        <label className="form-label small fw-semibold">Rating</label>
        <div className="d-flex gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n} type="button"
              className="btn btn-ssf-ghost p-2"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(n)}
              aria-label={`${n} stars`}
            >
              <Star
                size={22}
                fill={(hover || rating) >= n ? "#fbbf24" : "none"}
                color={(hover || rating) >= n ? "#fbbf24" : "#94a3b8"}
              />
            </button>
          ))}
        </div>

        <label className="form-label small fw-semibold">Comment</label>
        <textarea
          className="form-control mb-3"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience…"
        />

        <div className="d-flex gap-2 justify-content-end">
          <button className="btn btn-ssf-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-ssf-primary"
            disabled={!comment.trim()}
            onClick={() => onSubmit({ rating, comment: comment.trim() })}
          >Submit Review</button>
        </div>
      </div>
    </div>
  );
}