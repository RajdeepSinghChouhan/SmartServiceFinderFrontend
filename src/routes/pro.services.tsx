import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, PlusCircle, Briefcase, Lock } from "lucide-react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { serviceApi } from "@/api/serviceApi";
import ConfirmModal from "../components/ConfirmModal";
import { Service } from "@/data/mock";

export const Route = createFileRoute("/pro/services")({
  component: MyServices,
});

function MyServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [toDelete, setToDelete] = useState<Service | null>(null);

  const [loading, setLoading] = useState(true);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    fetchServices();
  }, []);


  const onDelete = async () => {
    if (!toDelete) return;

    try {
      await serviceApi.remove(toDelete.serviceId);

      setServices((arr) =>
        arr.filter((s) => s.serviceId !== toDelete.serviceId)
      );

      toast.success("Service deleted");

      setToDelete(null);

    } catch (error) {
      console.error(error);
      toast.error("Failed to delete service");
    }
  };

  const fetchServices = async () => {
    try {
      const data = await serviceApi.mine();
      setServices(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setServices([]);
        return;
      }

      console.error(error);
      toast.error("Failed to load services");
    }finally {
    setLoading(false);
  }
  };
  if (loading) {
    return <div>Loading services...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="small text-secondary">
          <Lock size={14} className="me-1" /> Services are immutable after creation. You can create, view or delete them.
        </div>
        <Link to="/pro/add-service" className="btn btn-ssf-primary"><PlusCircle size={16} className="me-1" /> Add Service</Link>
      </div>

      {services.length === 0 ? (
        <div className="ssf-empty">
          <Briefcase size={40} />
          <p className="mt-2 mb-2">You haven't added any services yet.</p>
          <Link to="/pro/add-service" className="btn btn-ssf-primary btn-sm">Add your first service</Link>
        </div>
      ) : (
        <div className="row g-3">
          {services.map((s) => (
            <div className="col-md-6 col-lg-4" key={s.serviceId}>
              <div className="ssf-card h-100 p-3 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <h6 className="mb-1">{s.title}</h6>
                  <div className="d-flex gap-2">
                    <span className={`ssf-status ${s.available ? "accepted" : "cancelled"}`}>
                      {s.available ? "Available" : "Unavailable"}
                    </span>
                    {s.verified && (
                      <span className="ssf-status accepted">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="small text-secondary mb-2">CategoryId: {s.categoryId} · Created {formatDateTime(s.createdAt)}</div>
                <p className="small mb-3">{s.description}</p>
                <div className="small text-secondary mb-2">
                  Experience: {s.experience} years
                </div>
                <div className="small text-secondary">
                  {s.businessName}
                </div>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <div className="fw-bold" style={{ color: "var(--ssf-primary-light)" }}>
                      ₹{s.price}
                    </div>

                    <div className="d-flex gap-2">
                      <Link
                        to="/pro/edit-service/$serviceId"
                        params={{ serviceId: String(s.serviceId) }}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <Pencil size={14} className="me-1" />
                        Edit
                      </Link>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setToDelete(s)}
                      >
                        <Trash2 size={14} className="me-1" />
                        Delete
                      </button>
                    </div>
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