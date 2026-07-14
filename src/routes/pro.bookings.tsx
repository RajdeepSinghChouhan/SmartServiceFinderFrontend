import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar, MapPin, Clock, FileText, User as UserIcon, Check, X, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import { bookingApi } from "@/api/bookingApi";
import { type BookingStatus } from "../data/userMock";
import type { ProviderBooking } from "../data/providerMock";


export const Route = createFileRoute("/pro/bookings")({
  component: ProviderBookings,
});

type FilterKey = "ALL" | BookingStatus;
const filters: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "COMPLETED", label: "Completed" },
  { key: "REJECTED", label: "Rejected" },
  { key: "CANCELLED", label: "Cancelled" },
];

type PendingAction = { booking: ProviderBooking; action: "accept" | "reject" | "complete" } | null;

function ProviderBookings() {
  const [bookings, setBookings] = useState<ProviderBooking[]>([]);

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const [pending, setPending] = useState<PendingAction>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");

    return new Date(
      2000,
      0,
      1,
      Number(hours),
      Number(minutes)
    ).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const list = useMemo(
    () => bookings.filter((b) => filter === "ALL" || b.status === filter),
    [bookings, filter]
  );

  const apply = async () => {
    if (!pending) return;

    const { booking, action } = pending;

    try {
      if (action === "accept") {
        await bookingApi.accept(booking.id);

        setBookings(prev =>
          prev.map(b =>
            b.id === booking.id
              ? { ...b, status: "ACCEPTED" }
              : b
          )
        );

        toast.success("Booking accepted");
      }

      if (action === "reject") {
        await bookingApi.reject(booking.id);

        setBookings(prev =>
          prev.map(b =>
            b.id === booking.id
              ? { ...b, status: "REJECTED" }
              : b
          )
        );

        toast.success("Booking rejected");
      }

      if (action === "complete") {
        await bookingApi.complete(booking.id);

        setBookings(prev =>
          prev.map(b =>
            b.id === booking.id
              ? { ...b, status: "COMPLETED" }
              : b
          )
        );

        toast.success("Booking marked as completed");
      }

      setPending(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update booking");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingApi.provider();

      console.log("Provider bookings =", data);

      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setBookings(sorted);
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <h5>Loading bookings...</h5>
      </div>
    );
  }

  return (
    <div>
      <div className="ssf-filter-bar mb-3">
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`ssf-filter-chip ${filter === f.key ? "active" : ""}`}>
            {f.label}
            <span className="ms-2 small text-secondary">
              {f.key === "ALL" ? bookings.length : bookings.filter((b) => b.status === f.key).length}
            </span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="ssf-empty">
          <Calendar size={40} />
          <p className="mt-2 mb-0">No bookings in this view.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {list.map((b) => (
            <div key={b.id} className="ssf-card p-3">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                <div>
                  <h6 className="mb-1">{b.serviceTitle}</h6>
                  <div className="small text-secondary">BookingId: {b.id}    |   ₹{b.price}</div>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <div className="row small text-secondary g-2 mb-3">
                <div className="col-sm-6 d-flex align-items-center gap-2"><UserIcon size={14} /> UserName: {b.username}</div>
                <div className="col-sm-6 d-flex align-items-center gap-2"><Calendar size={14} /> {formatDate(b.bookingDate)}</div>
                <div className="col-sm-6 d-flex align-items-center gap-2"><Clock size={14} /> {formatTime(b.bookingTime)}</div>
                <div className="col-sm-6 d-flex align-items-center gap-2"><MapPin size={14} /> {b.address}</div>
                {b.notes && <div className="col-12 d-flex align-items-start gap-2"><FileText size={14} className="mt-1" /> <span>{b.notes}</span></div>}
              </div>

              <div className="d-flex flex-wrap gap-2">
                {b.status === "PENDING" && (
                  <>
                    <button className="btn btn-sm btn-ssf-primary" onClick={() => setPending({ booking: b, action: "accept" })}>
                      <Check size={14} className="me-1" /> Accept
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setPending({ booking: b, action: "reject" })}>
                      <X size={14} className="me-1" /> Reject
                    </button>
                  </>
                )}
                {b.status === "ACCEPTED" && (
                  <button className="btn btn-sm btn-success" onClick={() => setPending({ booking: b, action: "complete" })}>
                    <CheckCheck size={14} className="me-1" /> Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!pending}
        title={
          pending?.action === "accept" ? "Accept this booking?" :
          pending?.action === "reject" ? "Reject this booking?" :
          "Mark booking as completed?"
        }
        message={pending ? `${pending.booking.serviceTitle} — ${pending.booking.username} on ${pending.booking.bookingDate} ${pending.booking.bookingTime}.` : ""}
        confirmLabel={
          pending?.action === "accept" ? "Accept" :
          pending?.action === "reject" ? "Reject" : "Mark Completed"
        }
        tone={pending?.action === "reject" ? "danger" : "primary"}
        onConfirm={apply}
        onClose={() => setPending(null)}
      />
    </div>
  );
}