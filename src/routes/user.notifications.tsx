import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Bell, Trash2, Check } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { mockNotifications, type AppNotification, type NotificationType } from "../data/userMock";

export const Route = createFileRoute("/user/notifications")({
  component: NotificationsPage,
});

const typeStyle: Record<NotificationType, string> = {
  BOOKING_CREATED: "ssf-badge ssf-type-info",
  BOOKING_ACCEPTED: "ssf-badge ssf-type-success",
  BOOKING_REJECTED: "ssf-badge ssf-type-danger",
  BOOKING_COMPLETED: "ssf-badge ssf-type-success",
  REVIEW_RECEIVED: "ssf-badge ssf-type-info",
  SYSTEM_ALERT: "ssf-badge ssf-type-muted",
};

function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>(mockNotifications);
  const [deleting, setDeleting] = useState<AppNotification | null>(null);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  const visible = filter === "UNREAD" ? items.filter((n) => !n.isRead) : items;

  const markRead = (id: number) => {
    setItems((xs) => xs.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    toast.success("Marked as read");
  };
  const markAllRead = () => {
    setItems((xs) => xs.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };
  const remove = (id: number) => {
    setItems((xs) => xs.filter((n) => n.id !== id));
    toast.success("Notification deleted");
    setDeleting(null);
  };

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          <button className={`ssf-chip ${filter === "ALL" ? "active" : ""}`} onClick={() => setFilter("ALL")}>All</button>
          <button className={`ssf-chip ${filter === "UNREAD" ? "active" : ""}`} onClick={() => setFilter("UNREAD")}>Unread</button>
        </div>
        <button className="btn btn-sm btn-ssf-ghost" onClick={markAllRead}>Mark all as read</button>
      </div>

      {visible.length === 0 ? (
        <div className="ssf-panel ssf-empty">
          <div className="ssf-empty-icon"><Bell size={28} /></div>
          <div className="fw-semibold">No notifications</div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {visible.map((n) => (
            <div key={n.id} className={`ssf-notif-row ${!n.isRead ? "unread" : ""}`}>
              <div className="flex-grow-1 min-width-0">
                <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                  <span className="fw-semibold">{n.title}</span>
                  <span className={typeStyle[n.type]}>{n.type.replace(/_/g, " ")}</span>
                  {!n.isRead && <span className="ssf-dot" aria-label="Unread" />}
                </div>
                <div className="text-secondary small">{n.message}</div>
                <div className="text-secondary" style={{ fontSize: "0.75rem" }}>{n.createdAt}</div>
              </div>
              <div className="d-flex gap-2 align-self-start">
                {!n.isRead && (
                  <button className="btn btn-sm btn-ssf-ghost" onClick={() => markRead(n.id)} title="Mark as read"><Check size={14} /></button>
                )}
                <button className="btn btn-sm btn-danger" onClick={() => setDeleting(n)} title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleting}
        title="Delete notification?"
        message="This notification will be removed."
        confirmLabel="Delete"
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove(deleting.id)}
      />
    </div>
  );
}