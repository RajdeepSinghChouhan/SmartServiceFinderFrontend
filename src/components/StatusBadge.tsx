import type { BookingStatus } from "../data/userMock";

const map: Record<BookingStatus, { label: string; cls: string }> = {
  PENDING: { label: "Pending", cls: "ssf-status pending" },
  CONFIRMED: { label: "Confirmed", cls: "ssf-status confirmed" },
  COMPLETED: { label: "Completed", cls: "ssf-status completed" },
  CANCELLED: { label: "Cancelled", cls: "ssf-status cancelled" },
  REJECTED: { label: "Rejected", cls: "ssf-status rejected" },
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  const m = map[status];
  return <span className={m.cls}>{m.label}</span>;
}