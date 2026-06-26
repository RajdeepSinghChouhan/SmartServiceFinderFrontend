import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, User, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Smart Service Finder" },
      { name: "description", content: "Login to your Smart Service Finder account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      toast.error("Please enter username and password");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(form.username.trim(), "USER");
      toast.success("Login successful");
      navigate({ to: "/user" });
    }, 500);
  };

  return (
    <div className="ssf-auth-wrap">
      <div className="container">
        <div className="d-flex justify-content-center">
          <div className="ssf-auth-card">
            <div className="text-center mb-3">
              <span className="ssf-brand-icon mx-auto"><Sparkles size={18} /></span>
            </div>
            <h2 className="text-center">Welcome back</h2>
            <p className="muted text-center">Login to manage your bookings and services.</p>

            <form onSubmit={submit}>
              <label className="form-label small fw-semibold">Username</label>
              <div className="position-relative mb-3">
                <User size={16} className="position-absolute" style={{ left: 12, top: 12, color: "#94a3b8" }} />
                <input type="text" className="form-control ps-5" placeholder="Enter username" required
                  value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </div>

              <label className="form-label small fw-semibold">Password</label>
              <div className="position-relative mb-3">
                <Lock size={16} className="position-absolute" style={{ left: 12, top: 12, color: "#94a3b8" }} />
                <input type="password" className="form-control ps-5" placeholder="Enter password" required
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3 small">
                <label className="d-flex align-items-center gap-2 mb-0">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#">Forgot password?</a>
              </div>

              <button type="submit" className="btn btn-ssf-primary w-100" disabled={loading}>
                {loading ? "Logging in…" : "Login"}
              </button>
            </form>

            <p className="text-center text-secondary mt-4 mb-0">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}