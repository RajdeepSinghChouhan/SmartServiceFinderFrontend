import { type ReactNode } from "react";

export default function ConfirmModal({
  open, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel",
  tone = "danger", onConfirm, onClose, children,
}: {
  open: boolean; title: string; message?: string;
  confirmLabel?: string; cancelLabel?: string;
  tone?: "danger" | "primary";
  onConfirm: () => void; onClose: () => void; children?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="ssf-modal-backdrop" onClick={onClose}>
      <div className="ssf-modal" onClick={(e) => e.stopPropagation()}>
        <h5 className="mb-2">{title}</h5>
        {message && <p className="text-secondary mb-3">{message}</p>}
        {children}
        <div className="d-flex gap-2 justify-content-end mt-3">
          <button className="btn btn-ssf-ghost" onClick={onClose}>{cancelLabel}</button>
          <button
            className={tone === "danger" ? "btn btn-danger" : "btn btn-ssf-primary"}
            onClick={onConfirm}
          >{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}