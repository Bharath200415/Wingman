import { C } from "../ui.jsx";

function MetricCard({ label, value, sub, highlight, wide }) {
  return (
    <div
      className={`rounded-2xl p-4 flex flex-col gap-1 ${wide ? "col-span-2" : ""}`}
      style={{ background: C.surface, border:`1px solid ${highlight ? C.goldMid : C.border}` }}
    >
      <span className="text-[10px] uppercase tracking-widest" style={{ color: C.ink3, fontFamily:"'Fira Code',monospace" }}>
        {label}
      </span>
      <span className="text-2xl font-black leading-tight" style={{ color: highlight ? C.gold : C.ink, fontFamily:"'Cabinet Grotesk',sans-serif" }}>
        {value}
      </span>
      {sub && <span className="text-[10px]" style={{ color: C.ink3 }}>{sub}</span>}
    </div>
  );
}

export default function StatsGrid({ stats, totalMessages, participants }) {
  const cards = [
    { label:"Total Messages",   value: Number(totalMessages).toLocaleString(), highlight: true },
    { label:"Participants",     value: participants?.length ?? "—" },
    { label:"Days Active",      value: stats?.["Days Active"] ?? "—" },
    { label:"Avg / Day",        value: stats?.["Avg Messages/Day"] ?? "—", highlight: true },
    { label:"P50 Response",     value: stats?.["P50 Response Time"] ?? "—" },
    { label:"P90 Response",     value: stats?.["P90 Response Time"] ?? "—" },
    { label:"P99 Response",     value: stats?.["P99 Response Time"] ?? "—", highlight: true },
    { label:"Date Range",       value: stats?.["Date Range"] ?? "—", wide: true },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {cards.map(c => <MetricCard key={c.label} {...c} />)}
    </div>
  );
}
