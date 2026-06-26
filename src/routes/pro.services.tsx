import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, PlusCircle, Briefcase, Lock } from "lucide-react";
import { toast } from "sonner";
import ConfirmModal from "../components/ConfirmModal";
import { providerServices as seed, type ProviderService } from "../data/providerMock";

export const Route = createFileRoute("/pro/services")({
  component: MyServices,
});

function MyServices() {
  const [services, setServices] = useState<ProviderService[]>(seed);
  const [toDelete, setToDelete] = useState<ProviderService | null>(null);

  const onDelete = () => {
    if (!toDelete) return;
    setServices((arr) => arr.filter((s) => s.id !== toDelete.id));
    toast.success(`"${toDelete.title}" deleted`);
    setToDelete(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="small text-secondary">
          <Lock size={14} className="me-1" /> Services are immutable after creation. You can create, view or delete them.
        </div>
        <Link to="/pro/services/add" className="btn btn-ssf-primary"><PlusCircle size={16} className="me-1" /> Add Service</Link>
      </div>

      {services.length === 0 ? (
        <div className="ssf-empty">
          <Briefcase size={40} />
          <p className="mt-2 mb-2">You haven't added any services yet.</p>
          <Link to="/pro/services/add" className="btn btn-ssf-primary btn-sm">Add your first service</Link>
        </div>
      ) : (
        <div className="row g-3">
          {services.map((s) => (
            <div className="col-md-6 col-lg-4" key={s.id}>
              <div className="ssf-card h-100 p-3 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <h6 className="mb-1">{s.title}</h6>
                  <span className={`ssf-status ${s.available ? "confirmed" : "cancelled"}`}>
                    {s.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="small text-secondary mb-2">Category #{s.categoryId} · Created {s.createdAt}</div>
                <p className="small mb-3">{s.description}</p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <div className="fw-bold" style={{ color: "var(--ssf-primary-light)" }}>₹{s.price}</div>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => setToDelete(s)}>
                    <Trash2 size={14} className="me-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete service?"
        message={`"${toDelete?.title}" will be removed permanently. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={onDelete}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}