import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Trash2, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import ConfirmModal from "../components/ConfirmModal";
import { providerNotifications as seed } from "../data/providerMock";
import type { AppNotification, NotificationType } from "../data/userMock";

export const Route = createFileRoute("/pro/notifications")({
  component: ProviderNotifications,
});

const typeMeta: Record<NotificationType, { label: string; cls: string }> = {
  BOOKING_CREATED: { label: "Booking", cls: "pending" },
  BOOKING_ACCEPTED: { label: "Accepted", cls: "confirmed" },
  BOOKING_REJECTED: { label: "Rejected", cls: "rejected" },
  BOOKING_COMPLETED: { label: "Completed", cls: "completed" },
  REVIEW_RECEIVED: { label: "Review", cls: "confirmed" },
  SYSTEM_ALERT: { label: "System", cls: "cancelled" },
};

function ProviderNotifications() {
  const [items, setItems] = useState<AppNotification[]>(seed);
  const [toDelete, setToDelete] = useState<AppNotification | null>(null);

  const markRead = (id: number) => {
    setItems((arr) => arr.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };
  const markAllRead = () => {
    setItems((arr) => arr.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };
  const onDelete = () => {
    if (!toDelete) return;
    setItems((arr) => arr.filter((n) => n.id !== toDelete.id));
    toast.success("Notification deleted");
    setToDelete(null);
  };

  const unread = items.filter((n) => !n.isRead).length;

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
            const meta = typeMeta[n.type];
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
                    <div className="small text-secondary">{n.createdAt}</div>
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