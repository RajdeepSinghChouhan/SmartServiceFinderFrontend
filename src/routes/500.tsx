import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/500")({
  head: () => ({ meta: [{ title: "500 — Server Error" }] }),
  component: () => (
    <div className="ssf-error-wrap">
      <div>
        <div className="ssf-error-code">500</div>
        <h2>Server Error</h2>
        <p className="text-secondary mb-4">Something went wrong on our end. Please try again later.</p>
        <Link to="/" className="btn btn-ssf-primary">Go home</Link>
      </div>
    </div>
  ),
});