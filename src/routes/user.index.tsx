import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Clock, CheckCircle2, XCircle, Bell } from "lucide-react";
import StatsCard from "../components/StatsCard";
import StatusBadge from "../components/StatusBadge";
import { useEffect, useState } from "react";
import { bookingApi } from "../api/bookingApi";
import { notificationApi } from "../api/notificationApi";
import { STORAGE_KEYS } from "../utils/constants";
import { toast } from "sonner";

export const Route = createFileRoute("/user/")({
  component: DashboardHome,
});


function DashboardHome() {

  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const total = bookings.length;
  const pending = bookings.filter(
    (b) => b.status === "PENDING"
  ).length;
  const completed = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;
  const cancelled = bookings.filter(
    (b) =>
      b.status === "CANCELLED" ||
      b.status === "REJECTED"
  ).length;

  
  const recent = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const recentNotifs = [...notifications]
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )
  .slice(0, 5);

  const loadDashboardData = async () => {
    try {
      const userId = localStorage.getItem(STORAGE_KEYS.userId);

      if (!userId) return;

      const [bookingData, notificationData] =
        await Promise.all([
          bookingApi.user(),
          notificationApi.list(userId),
        ]);

      setBookings(bookingData);

      const sortedNotifications = [...notificationData].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data");
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
        <div className="col-sm-6 col-xl-3"><StatsCard icon={<Calendar size={22} />} label="Total Bookings" value={total} tone="primary" /></div>
        <div className="col-sm-6 col-xl-3"><StatsCard icon={<Clock size={22} />} label="Pending" value={pending} tone="warning" /></div>
        <div className="col-sm-6 col-xl-3"><StatsCard icon={<CheckCircle2 size={22} />} label="Completed" value={completed} tone="success" /></div>
        <div className="col-sm-6 col-xl-3"><StatsCard icon={<XCircle size={22} />} label="Cancelled / Rejected" value={cancelled} tone="danger" /></div>
      </div>

      <div className="row g-3">
        <div className="col-lg-7">
          <div className="ssf-panel">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="mb-0">Recent Bookings</h5>
              <Link to="/user/bookings" className="small">View all</Link>
            </div>
            {recent.length === 0 ? (
              <div className="ssf-empty"><div className="ssf-empty-icon"><Calendar size={28} /></div>No bookings yet</div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {recent.map((b) => (
                  <div key={b.id} className="ssf-list-row">
                    <div className="flex-grow-1 min-width-0">
                      <div className="fw-semibold text-truncate">{b.serviceTitle}</div>
                      <div className="small text-secondary">
                        {b.providerName} •{" "}
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
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-5">
          <div className="ssf-panel">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="mb-0">Recent Notifications</h5>
              <Link to="/user/notifications" className="small">View all</Link>
            </div>
            {recentNotifs.length === 0 ? (
              <div className="ssf-empty"><div className="ssf-empty-icon"><Bell size={28} /></div>No notifications</div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {recentNotifs.map((n) => (
                  <div key={n.id} className={`ssf-list-row ${!n.isRead ? "unread" : ""}`}>
                    <div className="flex-grow-1 min-width-0">
                      <div className="fw-semibold text-truncate">{n.title}</div>
                      <div className="small text-secondary text-truncate">{n.message}</div>
                    </div>
                    <div className="small text-secondary">
                    {new Date(n.createdAt).toLocaleString("en-IN", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
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