import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, StickyNote, ArrowLeft, CheckCircle2, XCircle, Star } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { useAuth } from "../context/AuthContext";
import { bookingApi } from "../api/bookingApi";
import { providerApi } from "../api/providerApi";
import { serviceApi } from "../api/serviceApi";
import { reviewApi } from "@/api/reviewApi";

export const Route = createFileRoute("/booking/$serviceId")({
  head: ({ params }) => ({
    meta: [
      {
        title: `Book Service #${params.serviceId} — Smart Service Finder`,
      },
      {
        name: "description",
        content: "Book this service on Smart Service Finder.",
      },
    ],
  }),

  component: BookingPage,
  notFoundComponent: () => (
    <div className="ssf-error-wrap">
      <div>
        <div className="ssf-error-code">404</div>
        <h2>Service not found</h2>
        <Link to="/services" className="btn btn-ssf-primary mt-3">Browse services</Link>
      </div>
    </div>
  ),
});

type FormState = {
  bookingDate: string;
  bookingTime: string;
  address: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function BookingPage() {
  const { serviceId } = useParams({ from: "/booking/$serviceId" });
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [service, setService] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  const loadService = async () => {
    console.log("serviceId =", serviceId);
    try {
      const serviceData = await serviceApi.byId(serviceId);
      setService(serviceData);
      console.log("serviceData =", serviceData);

      if (serviceData?.providerId) {
        const providerData = await providerApi.byId(serviceData.providerId);
        setProvider(providerData);
      }
      if (serviceData?.providerId) {
        const providerData = await providerApi.byId(serviceData.providerId);
        setProvider(providerData);

        const reviewData = await reviewApi.byProvider(
          serviceData.providerId
        );

        setReviews(reviewData);
      }
    } 
    catch (err) {
      console.error(err);
      setError("Failed to load service");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadService();
  }, [serviceId]);
  
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<FormState>({
    bookingDate: "",
    bookingTime: "",
    address: user?.address ?? "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  const avgRating = reviews.length
  ? (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1)
  : "0.0";
  

  if (!service) {
    return (
      <div className="ssf-error-wrap">
        <div>
          <div className="ssf-error-code">404</div>
          <h2>Service not found</h2>
          <Link to="/services" className="btn btn-ssf-primary mt-3">Browse services</Link>
        </div>
      </div>
    );
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.bookingDate) next.bookingDate = "Please pick a booking date.";
    else if (form.bookingDate < today) next.bookingDate = "Date cannot be in the past.";
    if (!form.bookingTime) next.bookingTime = "Please pick a booking time.";
    if (!form.address.trim()) next.address = "Address is required.";
    if (!form.notes.trim()) next.notes = "Please add a short note for the provider.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to book a service");
      navigate({ to: "/login" });
      return;
    }
    if (!service.available) {
      toast.error("This service is currently unavailable");
      return;
    }
    if (!validate()) return;
    setConfirmOpen(true);
  };

  const submitBooking = async () => {
    if (!service) return;
    setSubmitting(true);
    try {
      await bookingApi.create({
        providerId: service.providerId,
        serviceId: service.id,
        bookingDate: form.bookingDate,
        bookingTime: form.bookingTime,
        address: form.address.trim(),
        notes: form.notes.trim(),
      });
      toast.success("Booking request sent");
      setConfirmOpen(false);
      navigate({ to: "/user/bookings" });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to create booking";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <h4>Loading services ...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <h4>{error}</h4>
      </div>
    );
  }

  return (
    <>
      <div className="ssf-detail-hero">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/services">Services</Link></li>
              <li className="breadcrumb-item">
                <Link to="/service/$id" params={{ id: String(service.id) }}>{service.title}</Link>
              </li>
              <li className="breadcrumb-item active">Book</li>
            </ol>
          </nav>
          <h1>Book this service</h1>
        </div>
      </div>

      <section className="ssf-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="ssf-info-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Booking details</h4>
                  <Link
                    to="/service/$id"
                    params={{ id: String(service.id) }}
                    className="btn btn-ssf-ghost btn-sm"
                  >
                    <ArrowLeft size={14} className="me-1" /> Back to service
                  </Link>
                </div>

                <form noValidate onSubmit={onSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center gap-2">
                        <Calendar size={14} /> Booking date
                      </label>
                      <input
                        type="date"
                        min={today}
                        className={`form-control ${errors.bookingDate ? "is-invalid" : ""}`}
                        value={form.bookingDate}
                        onChange={(e) => setField("bookingDate", e.target.value)}
                      />
                      {errors.bookingDate && <div className="invalid-feedback">{errors.bookingDate}</div>}
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center gap-2">
                        <Clock size={14} /> Booking time
                      </label>
                      <input
                        type="time"
                        className={`form-control ${errors.bookingTime ? "is-invalid" : ""}`}
                        value={form.bookingTime}
                        onChange={(e) => setField("bookingTime", e.target.value)}
                      />
                      {errors.bookingTime && <div className="invalid-feedback">{errors.bookingTime}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label d-flex align-items-center gap-2">
                        <MapPin size={14} /> Service address
                      </label>
                      <input
                        type="text"
                        placeholder="Flat / street / city / pincode"
                        className={`form-control ${errors.address ? "is-invalid" : ""}`}
                        value={form.address}
                        onChange={(e) => setField("address", e.target.value)}
                      />
                      {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label d-flex align-items-center gap-2">
                        <StickyNote size={14} /> Notes for the provider
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Describe the issue or any specific requirements"
                        className={`form-control ${errors.notes ? "is-invalid" : ""}`}
                        value={form.notes}
                        onChange={(e) => setField("notes", e.target.value)}
                      />
                      {errors.notes && <div className="invalid-feedback">{errors.notes}</div>}
                    </div>
                  </div>

                  <div className="d-flex gap-2 justify-content-end mt-4">
                    <Link
                      to="/service/$id"
                      params={{ id: String(service.id) }}
                      className="btn btn-ssf-ghost"
                    >Cancel</Link>
                    <button
                      type="submit"
                      className="btn btn-ssf-primary"
                      disabled={submitting || !service.available}
                    >
                      {service.available ? "Review & Confirm" : "Currently Unavailable"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <aside className="col-lg-4">
              <div className="ssf-info-card sticky-lg-top" style={{ top: 90 }}>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  <span className="ssf-badge ssf-badge-price">{service.categoryName}</span>
                  <span className={`ssf-badge ${service.available ? "ssf-badge-available" : "ssf-badge-unavailable"}`}>
                    {service.available ? <><CheckCircle2 size={12} /> Available</> : <><XCircle size={12} /> Unavailable</>}
                  </span>
                </div>
                <h5 className="mb-1">{service.title}</h5>
                <p className="text-secondary small mb-3">{service.description}</p>
                <div className="text-secondary">Service price</div>
                <div className="display-6 fw-bold mb-3" style={{ color: "var(--ssf-primary)" }}>
                  ₹{service.price.toLocaleString()}
                </div>

                {provider && (
                  <>
                    <hr className="my-3" />
                    <h6 className="mb-2">Provider</h6>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="ssf-avatar">
                        {provider.businessName.split(" ").map((w : string) => w[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="fw-bold">{provider.businessName}</div>
                        <div className="ssf-stars">
                          <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                          <span className="ms-1 small text-dark fw-semibold">
                            {avgRating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/provider/$id"
                      params={{ id: String(provider.id) }}
                      className="btn btn-ssf-outline btn-sm w-100"
                    >View provider</Link>
                  </>
                )}
                <hr className="my-3" />
                <Link to="/user/bookings" className="btn btn-ssf-ghost btn-sm w-100">
                  My bookings
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <ConfirmModal
        open={confirmOpen}
        title="Confirm your booking?"
        message={`Book “${service.title}” on ${form.bookingDate} at ${form.bookingTime}?`}
        confirmLabel={submitting ? "Booking…" : "Yes, book now"}
        cancelLabel="Review again"
        tone="primary"
        onClose={() => (submitting ? null : setConfirmOpen(false))}
        onConfirm={submitBooking}
      />
    </>
  );
}