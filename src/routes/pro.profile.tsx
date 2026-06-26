import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import ConfirmModal from "../components/ConfirmModal";
import { providerProfile as seed } from "../data/providerMock";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/pro/profile")({
  component: ProviderProfilePage,
});

function ProviderProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [form, setForm] = useState({
    businessName: seed.businessName,
    description: seed.description,
    experience: String(seed.experience),
  });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim()) {
      toast.error("Business name is required");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated");
    }, 500);
  };

  const onDelete = () => {
    setConfirmDelete(false);
    toast.success("Provider account deleted");
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="row g-3">
      <div className="col-lg-8">
        <div className="ssf-panel">
          <form onSubmit={submit} className="p-3 p-md-4">
            <div className="mb-3">
              <label className="form-label small fw-semibold">Business Name</label>
              <input className="form-control" value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Description</label>
              <textarea className="form-control" rows={4} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Experience (years)</label>
              <input type="number" className="form-control" value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })} />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="submit" className="btn btn-ssf-primary" disabled={saving}>
                <Save size={16} className="me-1" /> {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        <div className="ssf-panel mt-3 p-3 p-md-4">
          <h6 className="text-danger">Danger Zone</h6>
          <p className="small text-secondary mb-3">
            Deleting your provider account is permanent and removes all your services and bookings.
          </p>
          <button className="btn btn-outline-danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={16} className="me-1" /> Delete Provider Account
          </button>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="ssf-card p-3">
          <div className="small text-secondary">Provider ID</div>
          <h5 className="mb-3">#{seed.id}</h5>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Star size={16} color="#fbbf24" fill="#fbbf24" />
            <span className="fw-semibold">{seed.rating.toFixed(1)}</span>
            <span className="text-secondary small">overall rating</span>
          </div>
          <div className="small text-secondary">Joined as PROVIDER · Auto-attached to all new services.</div>
        </div>
      </div>

      <ConfirmModal
        open={confirmDelete}
        title="Delete provider account?"
        message="This will permanently delete your provider profile and all listings."
        confirmLabel="Delete Account"
        onConfirm={onDelete}
        onClose={() => setConfirmDelete(false)}
      />
    </div>
  );
}