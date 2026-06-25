import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, User, Mail, Sparkles, Briefcase } from "lucide-react";

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); alert("Registration API will connect to your Spring Boot backend."); }, 700);
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
                <input type="text" className="form-control ps-5" placeholder="Choose a username" required />
              </div>

              <label className="form-label small fw-semibold">Email</label>
              <div className="position-relative mb-3">
                <Mail size={16} className="position-absolute" style={{ left: 12, top: 12, color: "#94a3b8" }} />
                <input type="email" className="form-control ps-5" placeholder="you@example.com" required />
              </div>

              <label className="form-label small fw-semibold">Password</label>
              <div className="position-relative mb-4">
                <Lock size={16} className="position-absolute" style={{ left: 12, top: 12, color: "#94a3b8" }} />
                <input type="password" className="form-control ps-5" placeholder="Create a strong password" required />
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