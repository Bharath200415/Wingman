// ── Design tokens ────────────────────────────────────────
export const C = {
  base:      "#0d0f14",
  surface:   "#13161e",
  surface2:  "#1a1e2a",
  surface3:  "#21263a",
  border:    "#1f2535",
  border2:   "#2a3050",
  gold:      "#f5c842",
  goldDim:   "#f5c84215",
  goldMid:   "#f5c84240",
  green:     "#10d9a0",
  greenDim:  "#10d9a015",
  rose:      "#ff4f72",
  sky:       "#38b6ff",
  ink:       "#e8eaf5",
  ink2:      "#8b91b0",
  ink3:      "#555c7a",
};

export const CHART_COLORS = [
  "#f5c842", "#10d9a0", "#38b6ff", "#ff4f72",
  "#a78bfa", "#fb923c", "#34d399", "#f472b6",
];

// ── Tiny reusable components ──────────────────────────────
export function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ background: C.surface, border: `1px solid ${C.border}`, ...style }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, badge }) {
  return (
    <div
      className="flex items-center justify-between px-5 py-3"
      style={{ borderBottom: `1px solid ${C.border}` }}
    >
      <span className="text-sm font-semibold dark:text-2xl" style={{ color: C.ink, fontFamily: "'Cabinet Grotesk',sans-serif" }}>
        {title}
      </span>
      {badge && (
        <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ background: C.surface2, color: C.ink3, fontFamily: "'Fira Code',monospace" }}>
          {badge}
        </span>
      )}
    </div>
  );
}

export function Chip({ children, gold }) {
  return (
    <span
      className="text-xs px-3 py-1 rounded-full"
      style={{
        background: gold ? C.goldDim : C.surface2,
        color: gold ? C.gold : C.ink2,
        border: `1px solid ${gold ? C.goldMid : C.border}`,
      }}
    >
      {children}
    </span>
  );
}

export function Avatar({ name, size = 7 }) {
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0`}
      style={{ background: C.goldDim, color: C.gold }}
    >
      {name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

// Tooltip for Recharts
export function ChartTooltip({ active, payload, label, unit = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: C.surface3, border: `1px solid ${C.border2}`, color: C.ink }}>
      {label && <p className="mb-1 font-semibold" style={{ color: C.ink2 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || C.gold }}>
          {p.name}: <strong>{p.value}{unit}</strong>
        </p>
      ))}
    </div>
  );
}
