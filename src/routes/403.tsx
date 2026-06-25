import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/403")({
  head: () => ({ meta: [{ title: "403 — Access Denied" }] }),
  component: () => (
    <div className="ssf-error-wrap">
      <div>
        <div className="ssf-error-code">403</div>
        <h2>Access Denied</h2>
        <p className="text-secondary mb-4">You don't have permission to view this page.</p>
        <div className="d-flex gap-2 justify-content-center">
          <Link to="/" className="btn btn-ssf-primary">Go home</Link>
          <Link to="/login" className="btn btn-ssf-outline">Login</Link>
        </div>
      </div>
    </div>
  ),
});