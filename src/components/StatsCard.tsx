import type { ReactNode } from "react";

export default function StatsCard({
  icon, label, value, tone = "primary",
}: { icon: ReactNode; label: string; value: number | string; tone?: "primary" | "warning" | "success" | "muted" | "danger" }) {
  return (
    <div className={`ssf-stat-card tone-${tone}`}>
      <div className="ssf-stat-card-icon">{icon}</div>
      <div>
        <div className="ssf-stat-card-value">{value}</div>
        <div className="ssf-stat-card-label">{label}</div>
      </div>
    </div>
  );
}