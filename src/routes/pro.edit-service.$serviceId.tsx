import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useParams } from '@tanstack/react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { serviceApi } from '@/api/serviceApi';

export const Route = createFileRoute('/pro/edit-service/$serviceId')({
  component: EditService,
})
function EditService() {
  const { serviceId } = useParams({
    from: "/pro/edit-service/$serviceId",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    available: true,
  });

  useEffect(() => {
    loadService();
  }, [serviceId]);
  
  const loadService = async () => {
    try {
      const service = await serviceApi.byId(serviceId);

      setForm({
        title: service.title,
        description: service.description,
        price: String(service.price),
        categoryId: String(service.categoryId),
        available: service.available,
      });
    } catch (err) {
      toast.error("Failed to load service");
    }
  };
  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.title.trim())
      e.title = "Title is required";

    if (
      !form.description.trim() ||
      form.description.trim().length < 10
    ) {
      e.description =
        "Description must be at least 10 characters";
    }

    if (!form.price || Number(form.price) <= 0) {
      e.price = "Enter a valid price";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);

      await serviceApi.update(serviceId, {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
        available: form.available,
      });

      toast.success("Service updated successfully");

      navigate({
        to: "/pro/services",
      });
    } catch (err) {
      toast.error("Failed to update service");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link to="/pro/services" className="small d-inline-flex align-items-center mb-3"><ArrowLeft size={14} className="me-1" /> Back to services</Link>
      <div className="ssf-panel" style={{ maxWidth: 720 }}>
        <form onSubmit={submit} className="p-3 p-md-4">
          <div className="mb-3">
            <label className="form-label small fw-semibold">Title</label>
            <input className="form-control" placeholder="e.g. AC Deep Cleaning"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            {errors.title && <div className="text-danger small mt-1">{errors.title}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Description</label>
            <textarea className="form-control" rows={4} placeholder="What's included, duration, materials, etc."
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            {errors.description && <div className="text-danger small mt-1">{errors.description}</div>}
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Price (₹)</label>
              <input type="number" className="form-control" placeholder="0"
                value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              {errors.price && <div className="text-danger small mt-1">{errors.price}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Category</label>
              <input type="text" className="form-control" placeholder="Category cannot be changed after service creation."
                value={`Category ID: ${form.categoryId}`} />
                {errors.categoryId && <div className="text-danger small mt-1">{errors.categoryId}</div>}
            </div>
          </div>
          <div className="form-check mt-3">
            <input className="form-check-input" type="checkbox" id="avail"
              checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
            <label className="form-check-label small" htmlFor="avail">Available for booking</label>
          </div>

          <div className="d-flex gap-2 justify-content-end mt-4">
            <Link to="/pro/services" className="btn btn-ssf-ghost">Cancel</Link>
            <button type="submit" className="btn btn-ssf-primary" disabled={saving}>
              <Save size={16} className="me-1" /> {saving ? "Saving..." : "Update Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
