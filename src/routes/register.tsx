import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, User, Mail, Sparkles, Briefcase } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { authApi } from "../api/authApi";
import { userApi } from "../api/userApi";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — Smart Service Finder" },
      { name: "description", content: "Create a Smart Service Finder account as a customer or service provider." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [role, setRole] = useState<"USER" | "PROVIDER">("USER");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!form.password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      await authApi.register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role,
      });
      
      toast.success("Registration successful!");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);

    } catch (err) {
      const networkOrNotFound =
        axios.isAxiosError(err) &&
        (!err.response || err.response.status === 404);

      if (networkOrNotFound) {
        toast.success("Registered (offline demo mode)");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);

        return;
      }

      console.error(err);

      // Other errors are already handled by your axios interceptor.
      // Only show this if it isn't an Axios error.
      if (!axios.isAxiosError(err)) {
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ssf-auth-wrap">
      <div className="container">
        <div className="d-flex justify-content-center">
          <div className="ssf-auth-card" style={{ maxWidth: 520 }}>
            <div className="text-center mb-3">
              <span className="ssf-brand-icon mx-auto"><Sparkles size={18} /></span>
            </div>
            <h2 className="text-center">Create your account</h2>
            <p className="muted text-center">Join thousands using Smart Service Finder.</p>

            <div className="btn-group w-100 mb-4" role="group">
              <button type="button" className={`btn ${role === "USER" ? "btn-ssf-primary" : "btn-ssf-ghost"}`} onClick={() => setRole("USER")}>
                <User size={16} className="me-1" /> Customer
              </button>
              <button type="button" className={`btn ${role === "PROVIDER" ? "btn-ssf-primary" : "btn-ssf-ghost"}`} onClick={() => setRole("PROVIDER")}>
                <Briefcase size={16} className="me-1" /> Provider
              </button>
            </div>

            <form onSubmit={submit}>
              <label className="form-label small fw-semibold">Username</label>
              <div className="position-relative mb-3">
                <User size={16} className="position-absolute" style={{ left: 12, top: 12, color: "#94a3b8" }} />
                <input type="text" className="form-control ps-5" placeholder="Choose a username" 
                              value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                } required />
              </div>

              <label className="form-label small fw-semibold">Email</label>
              <div className="position-relative mb-3">
                <Mail size={16} className="position-absolute" style={{ left: 12, top: 12, color: "#94a3b8" }} />
                <input type="email" className="form-control ps-5" placeholder="you@example.com" 
                              value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  } required />
                </div>

              <label className="form-label small fw-semibold">Password</label>
              <div className="position-relative mb-4">
                <Lock size={16} className="position-absolute" style={{ left: 12, top: 12, color: "#94a3b8" }} />
                <input type="password" className="form-control ps-5" placeholder="Create a strong password" 
                              value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                } required />
              </div>

              <button type="submit" className="btn btn-ssf-primary w-100" disabled={loading}>
                {loading ? "Creating account…" : `Create ${role === "USER" ? "Customer" : "Provider"} Account`}
              </button>
            </form>

            <p className="text-center text-secondary mt-4 mb-0">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}