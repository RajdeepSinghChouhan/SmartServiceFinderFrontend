import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Calendar, MapPin, StickyNote, User as UserIcon, Clock } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import ReviewModal from "../components/ReviewModal";
import {  type Booking, type BookingStatus } from "../data/userMock";
import { useEffect } from "react";
import { bookingApi } from "../api/bookingApi";
import { reviewApi } from "../api/reviewApi";


export const Route = createFileRoute("/user/bookings")({
  component: MyBookings,
});

const FILTERS: { label: string; value: BookingStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Rejected", value: "REJECTED" },
];

function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL");
  const [confirmCancel, setConfirmCancel] = useState<Booking | null>(null);
  const [reviewFor, setReviewFor] = useState<Booking | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  const filtered = useMemo(
    () => (filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter],
  );

  const cancel = async (id: number) => {
    try {
      await bookingApi.cancel(id);

      setBookings((bs) =>
        bs.map((b) =>
          b.id === id
            ? { ...b, status: "CANCELLED" }
            : b
        )
      );

      toast.success("Booking cancelled");
      setConfirmCancel(null);
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  const complete = async (id: number) => {
    try {
      await bookingApi.complete(id);

      setBookings((bs) =>
        bs.map((b) =>
          b.id === id
            ? { ...b, status: "COMPLETED" }
            : b
        )
      );

      toast.success("Marked as completed");
    } catch (err) {
      toast.error("Failed to update booking");
    }
  };

  const submitReview = async (data: {
    rating: number;
    comment: string;
  }) => {

    if (submittingReview) return;

    if (!reviewFor) return;

    if (data.rating < 1 || data.rating > 5) {
      toast.error("Please select a rating");
      return;
    }

    if (data.comment.trim().length < 5) {
      toast.error("Review must be at least 5 characters");
      return;
    }

    try {

      setSubmittingReview(true);

      await reviewApi.create({
        serviceId: reviewFor.serviceId,
        rating: data.rating,
        comment: data.comment.trim(),
      });

      toast.success("Review submitted successfully");
      setReviewFor(null);
    } 
    catch (error: any) {

      if (error?.response?.status === 409) {
        toast.error("You have already reviewed this service");
        return;
      }

      toast.error("Failed to submit review");

    } finally {
      setSubmittingReview(false);
    }
  };

  const loadBookings = async () => {
    try {
      const data = await bookingApi.user();

      console.log("Bookings =", data);

      setBookings(
        [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  if (loading) {
    return (
      <div className="container py-4">
        <h5>Loading bookings...</h5>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 mb-3">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`ssf-chip ${filter === f.value ? "active" : ""}`}
            onClick={() => setFilter(f.value)}
          >{f.label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="ssf-panel ssf-empty">
          <div className="ssf-empty-icon"><Calendar size={28} /></div>
          <div className="fw-semibold">No bookings found</div>
          <div className="small">Try a different filter or book a new service.</div>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((b) => (
            <div key={b.id} className="col-12 col-xl-6">
              <div className="ssf-booking-card">
                <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                  <h5 className="mb-0">{b.serviceTitle}</h5>
                  <StatusBadge status={b.status} />
                </div>
                <div className="text-secondary small d-flex align-items-center gap-2 mb-2">
                  <UserIcon size={14} />  Provider #{b.providerId}
                  <span className="ssf-badge ssf-badge-price ms-auto">₹{b.price}</span>
                </div>
                <div className="ssf-booking-meta">
                  <div>
                    <Calendar size={14} className="me-1" />
                    {new Date(`${b.bookingDate}T${b.bookingTime}`).toLocaleString("en-IN", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                  <div className="text-truncate"><MapPin size={14} className="me-1" /> {b.address}</div>
                  {b.notes && <div className="text-truncate"><StickyNote size={14} className="me-1" /> {b.notes}</div>}
                </div>

                <div className="d-flex gap-2 flex-wrap mt-3">
                  {b.status === "PENDING" && (
                    <button className="btn btn-sm btn-danger" onClick={() => setConfirmCancel(b)}>Cancel Booking</button>
                  )}
                  {b.status === "ACCEPTED" && (
                    <button className="btn btn-sm btn-ssf-primary" onClick={() => complete(b.id)}>Mark as Completed</button>
                  )}
                  {b.status === "COMPLETED" && (
                    <button className="btn btn-sm btn-ssf-outline" onClick={() => setReviewFor(b)}>Write Review</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!confirmCancel}
        title="Cancel this booking?"
        message={confirmCancel ? `“${confirmCancel.serviceTitle}” will be cancelled. This action cannot be undone.` : ""}
        confirmLabel="Yes, cancel"
        cancelLabel="Keep booking"
        onClose={() => setConfirmCancel(null)}
        onConfirm={() => confirmCancel && cancel(confirmCancel.id)}
      />

      <ReviewModal
        open={!!reviewFor}
        onClose={() => setReviewFor(null)}
        onSubmit={submitReview}
        serviceTitle={reviewFor?.serviceTitle}
        loading={submittingReview}
      />
    </div>
  );
}