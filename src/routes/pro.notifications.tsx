import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { notificationApi } from "../api/notificationApi";
import { Bell, Trash2, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import ConfirmModal from "../components/ConfirmModal";
import type { AppNotification, NotificationType } from "../data/userMock";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/pro/notifications")({
  component: ProviderNotifications,
});

const typeMeta: Record<NotificationType, { label: string; cls: string }> = {
  BOOKING_CREATED: { label: "Booking", cls: "pending" },
  BOOKING_ACCEPTED: { label: "Accepted", cls: "accepted" },
  BOOKING_REJECTED: { label: "Rejected", cls: "rejected" },
  BOOKING_COMPLETED: { label: "Completed", cls: "completed" },
  REVIEW_RECEIVED: { label: "Review", cls: "accepted" },
  SYSTEM_ALERT: { label: "System", cls: "cancelled" },
};

function ProviderNotifications() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<AppNotification | null>(null);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  const { user } = useAuth();
  const userId = user?.id;

  const markRead = async (id: number) => {
    try {
      await notificationApi.markRead(id);

      setItems((arr) =>
        arr.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };
  const markAllRead = () => {
    setItems((arr) => arr.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };
  const onDelete = async () => {
    if (!toDelete) return;

    try {
      await notificationApi.remove(toDelete.id);

      setItems((arr) =>
        arr.filter((n) => n.id !== toDelete.id)
      );

      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    } finally {
      setToDelete(null);
    }
  };

  const unread = items.filter((n) => !n.isRead).length;
  useEffect(() => {
    if (!userId)
    {
      setLoading(false);
      return;
    }
    const loadNotifications = async () => {
      try {
        const data = await notificationApi.list(userId);
        setItems(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [userId]);

   if (loading) {
    return (
      <div className="text-center py-5">
        Loading notifications...
      </div>
    );
  }
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="small text-secondary">{unread} unread of {items.length}</div>
        <button className="btn btn-ssf-ghost btn-sm" onClick={markAllRead} disabled={!unread}>
          <CheckCheck size={14} className="me-1" /> Mark all as read
        </button>
      </div>

      {items.length === 0 ? (
        <div className="ssf-empty"><Bell size={40} /><p className="mt-2 mb-0">You're all caught up.</p></div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {items.map((n) => {
            const meta = typeMeta[n.type as NotificationType] ?? {
              label: n.type,
              cls: "pending",
            };
            return (
              <div key={n.id} className={`ssf-card p-3 ${!n.isRead ? "ssf-card-unread" : ""}`}>
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className={`ssf-status ${meta.cls}`}>{meta.label}</span>
                      <span className="fw-semibold">{n.title}</span>
                      {!n.isRead && <span className="ssf-dot" />}
                    </div>
                    <p className="mb-1 mt-1 small">{n.message}</p>
                    <div className="small text-secondary">
                      {formatDateTime(n.createdAt)}
                    </div>
                  </div>
                  <div className="d-flex gap-1">
                    {!n.isRead && (
                      <button className="btn btn-sm btn-ssf-ghost" onClick={() => markRead(n.id)} title="Mark read">
                        <CheckCheck size={14} />
                      </button>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setToDelete(n)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete notification?"
        message="This notification will be removed."
        confirmLabel="Delete"
        onConfirm={onDelete}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}