import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Calendar, CheckCircle2, Star, Clock, MessageSquare } from "lucide-react";
import StatsCard from "../components/StatsCard";
import StatusBadge from "../components/StatusBadge";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { bookingApi } from "../api/bookingApi";
import { serviceApi } from "../api/serviceApi";
import { reviewApi } from "../api/reviewApi";
import { providerApi } from "../api/providerApi";


export const Route = createFileRoute("/pro/")({
  component: ProviderHome,
});

function ProviderHome() {
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
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

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  const totalServices = services.length;
  const activeServices = services.filter(
    (s) => s.available === true
  ).length;
  const pending = bookings.filter(
    (b) => b.status === "PENDING"
  ).length;
  const completed = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;
  const avgRating = reviews.length

    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 4);
  const recentReviews = [...reviews]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

    const loadDashboardData = async () => {
      try 
      {
        const providerId = await providerApi.getId();

        if (!providerId) {
          toast.error("Provider ID not found");
          setLoading(false);
          return;
        }

        const [serviceData, bookingData, reviewData] =
          await Promise.all([
            serviceApi.mine(),
            bookingApi.provider(),
            reviewApi.byProvider(providerId),
          ]);
          
          setServices(serviceData);
          setBookings(bookingData);
          setReviews(reviewData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }
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
                        <div className="small text-secondary">
                          {b.username} | {formatDate(b.bookingDate)} | {formatTime(b.bookingTime)}
                        </div>
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
                      <div className="fw-semibold">{r.username}</div>
                    </div>
                    <div className="small text-secondary">
                      {r.serviceTitle} | {formatDateTime(r.createdAt)}
                    </div>
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