import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, User, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Role, useAuth } from "../context/AuthContext";
import { authApi } from "../api/authApi";
import axios from "axios";

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
  const { login, loginWithToken } = useAuth();
  const [form, setForm] = useState({ username: "", password: "", role: "USER" as "USER" | "PROVIDER" });
  const [loading, setLoading] = useState(false);
  const DEMO_USERS = [
      {
        username: "user",
        password: "user123",
        role: "USER",
      },
      {
        username: "provider",
        password: "provider123",
        role: "PROVIDER",
      },
    ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password.trim()) {
      toast.error("Please enter username and password");
      return;
    }

    setLoading(true);

    try {
      const { token } = await authApi.login({
        username: form.username.trim(),
        password: form.password,
      });

      const u = loginWithToken(token);

      if (!u) throw new Error("Invalid token");

      toast.success("Login successful");

      navigate({
        to: u.role === "PROVIDER" ? "/pro" : "/user",
      });

    } catch (err) {

      // Backend unavailable -> Demo Mode
      if (axios.isAxiosError(err) && !err.response) {

        const demo = DEMO_USERS.find(
          (u) =>
            u.username === form.username &&
            u.password === form.password &&
            u.role === form.role
        );
        if (!demo) {
          toast.error(
            "Invalid demo username or password"
          );
          toast.error(
            "Use DEMO User -  user user123"
          );
          toast.error(
            "Use DEMO Provider - provider provider123"
          );
          setLoading(false);
          return;
        }
        const demoUser = login(
          demo.username,
          demo.role as Role
        );

        navigate({
          to:
            demoUser.role === "PROVIDER"
              ? "/pro"
              : "/user",
        });

        return;
}

      // Actual backend errors
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          toast.error("Invalid username or password");
        } else {
          toast.error("Login failed");
        }
      }
    }
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

              <label className="form-label small fw-semibold">Login as</label>
              <div className="d-flex gap-2 mb-3">
                {(["USER", "PROVIDER"] as const).map((r) => (
                  <button type="button" key={r}
                    onClick={() => setForm({ ...form, role: r })}
                    className={`ssf-chip flex-fill ${form.role === r ? "active" : ""}`}
                  >{r}</button>
                ))}
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