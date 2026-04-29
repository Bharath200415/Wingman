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
    <div className={`rounded-2xl py-1 bg-gradient-to-t from-neutral-100 px-2 to-neutral-50 border border-neutral-200 shadow-sm dark:from-neutral-950 dark:to-neutral-900 dark:border-neutral-800 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, badge, children }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b dark:border-neutral-600/60 border-neutral-200">
      <span className="text-md font-semibold text-neutral-950 dark:text-neutral-200">{title}</span>
      {badge && (
        <span className="text-[10px] px-2 py-1 rounded-md bg-neutral-200 text-neutral-600 dark:bg-gray-800 dark:text-white" style={{  fontFamily: "'Fira Code',monospace" }}>{badge}</span>
      )}
      {children}
    </div>
  );
}

export function Chip({ children, gold, className = "" }) {
  // If the caller provided an explicit text color (e.g. `text-white`),
  // avoid setting an inline `color` which would override that class.
  const hasTextClass = /(^|\s)text-[^\s]+/.test(className);
  const style = {
    background: gold ? C.goldDim : C.surface2,
    border: `1px solid ${gold ? C.goldMid : C.border}`,
    ...(hasTextClass ? {} : { color: gold ? C.gold : C.ink2 }),
  };

  return (
    <span className={`text-xs px-3 py-1 rounded-full ${className}`} style={style}>
      {children}
    </span>
  );
}

export function Avatar({ name, size = 28 }) {
  const s = `${size}px`;
  return (
    <div style={{ width: s, height: s, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.goldDim, color: C.gold, fontWeight: 700 }}>
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
