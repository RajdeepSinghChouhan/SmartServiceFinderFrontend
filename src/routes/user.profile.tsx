import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { API_BASE_URL, API_PATHS } from "../utils/constants";
import { userApi } from "../api/userApi";

import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/user/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    username: user?.username ?? "",
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const loadProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) return;

      const userData = await userApi.me(userId);

      setForm({
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
      });

      updateProfile(userData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    }
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.email.trim()) {
      toast.error("Full name and email are required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setSaving(true);

    try {

      console.log("Update Path:", API_PATHS.user.update);
      console.log("Base URL:", API_BASE_URL);
      // Send request to backend
      const updatedUser = await userApi.update(form);

      // Update AuthContext and localStorage
      updateProfile(updatedUser);

      toast.success("Profile updated");
    } catch (err) {
      const networkOrNotFound =
        axios.isAxiosError(err) &&
        (!err.response || err.response.status === 404);

      if (networkOrNotFound) {
        toast.success("Profile updated (offline demo mode)");

        // Update only frontend state
        updateProfile(form);

        return;
      }

      console.error(err);

      // Other Axios errors are already handled by your interceptor
      if (!axios.isAxiosError(err)) {
        toast.error("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="row g-3">
      <div className="col-lg-4">
        <div className="ssf-panel text-center">
          <div className="ssf-avatar mx-auto mb-3" style={{ width: 96, height: 96, fontSize: "2rem" }}>
            {(form.fullName || form.username || "U").charAt(0).toUpperCase()}
          </div>
          <h5 className="mb-0">{form.fullName || form.username}</h5>
          <div className="text-secondary small">{form.email}</div>
          <hr />
          <div className="small text-secondary text-start">
            <div className="mb-2"><strong className="text-light">Username:</strong> {form.username}</div>
            <div className="mb-2"><strong className="text-light">Phone:</strong> {form.phone || "—"}</div>
            <div><strong className="text-light">Address:</strong> {form.address || "—"}</div>
          </div>
        </div>
      </div>

      <div className="col-lg-8">
        <div className="ssf-panel">
          <h5 className="mb-3">Account Information</h5>
          <form onSubmit={submit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Username</label>
                <input className="form-control" value={form.username} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Full Name</label>
                <input className="form-control" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Email</label>
                <input type="email" className="form-control" value={form.email} onChange={(e) => set("email", e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Phone</label>
                <input className="form-control" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Address</label>
                <textarea className="form-control" rows={3} value={form.address} onChange={(e) => set("address", e.target.value)} />
              </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button type="submit" className="btn btn-ssf-primary" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}