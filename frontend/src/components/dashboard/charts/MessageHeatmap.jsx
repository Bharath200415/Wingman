import { useMemo, useState } from "react";
import { Card, CardHeader } from "../../ui.jsx";

const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Emerald at increasing strength; alpha keeps it readable on light and dark cards.
const LEVELS = [null, "rgba(16,185,129,0.22)", "rgba(16,185,129,0.42)", "rgba(16,185,129,0.68)", "rgb(16,185,129)"];
const DAY_MS = 86400000;

function toKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fromKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(d, n) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

function startOfWeek(d) {
  return addDays(d, -((d.getDay() + 6) % 7)); // Monday
}

function countByDay(rawMessages) {
  const counts = new Map();
  rawMessages.forEach(m => {
    if (!m.timestamp) return;
    const key = m.timestamp.includes("T") ? m.timestamp.split("T")[0] : m.timestamp.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(key)) counts.set(key, (counts.get(key) || 0) + 1);
  });
  return counts;
}

export default function MessageHeatmap({ rawMessages }) {
  const counts = useMemo(() => countByDay(rawMessages ?? []), [rawMessages]);
  const [range, setRange] = useState("recent");
  const [hover, setHover] = useState(null);

  const keys = [...counts.keys()].sort();
  if (!keys.length) return null;

  const first = fromKey(keys[0]);
  const last = fromKey(keys[keys.length - 1]);
  const years = [...new Set(keys.map(k => Number(k.slice(0, 4))))].sort((a, b) => b - a);
  const spansMoreThanAYear = (last - first) / DAY_MS > 364;

  // Visible window: the 12 months up to the last message, or one calendar year.
  const from = range === "recent" ? addDays(last, -364) : new Date(range, 0, 1);
  const to = range === "recent" ? last : new Date(range, 11, 31);
  const gridStart = startOfWeek(from);
  const weeks = Math.ceil(((to - gridStart) / DAY_MS + 1) / 7);

  const cells = [];
  const inWindow = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const date = addDays(gridStart, w * 7 + d);
      const visible = date >= from && date <= to;
      // Days before the first or after the last message aren't "quiet", they're outside the chat.
      const inChat = date >= first && date <= last;
      const count = counts.get(toKey(date)) || 0;
      cells.push({ w, d, date, visible, inChat, count });
      if (visible && inChat) inWindow.push({ date, count });
    }
  }

  const active = inWindow.filter(c => c.count > 0);
  const sorted = active.map(c => c.count).sort((a, b) => a - b);
  const q = p => sorted[Math.floor((sorted.length - 1) * p)] ?? 0;
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];
  const level = n => (n === 0 ? 0 : n <= q1 ? 1 : n <= q2 ? 2 : n <= q3 ? 3 : 4);

  const total = active.reduce((s, c) => s + c.count, 0);
  const busiest = active.reduce((best, c) => (c.count > (best?.count ?? 0) ? c : best), null);

  // Label a month above the week that contains its 1st day.
  const monthLabels = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const date = addDays(gridStart, w * 7 + d);
      if (date.getDate() === 1 && date >= from && date <= to) monthLabels.push({ w, label: MONTHS[date.getMonth()] });
    }
  }

  const fmt = d => d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  const showTooltip = (e, cell) => {
    const r = e.currentTarget.getBoundingClientRect();
    setHover({
      x: r.left + r.width / 2,
      y: r.top,
      key: `${cell.w}-${cell.d}`,
      text: `${cell.count ? cell.count.toLocaleString() : "No"} message${cell.count === 1 ? "" : "s"}`,
      date: fmt(cell.date),
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader title="Message Frequency" badge="daily heatmap" />
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <Stat value={total.toLocaleString()} label={range === "recent" ? "messages in the last year" : `messages in ${range}`} />
            <Stat value={`${active.length}`} label={`active days of ${inWindow.length.toLocaleString()}`} />
            {busiest && <Stat value={busiest.count.toLocaleString()} label={`busiest day · ${busiest.date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`} />}
          </div>

          {spansMoreThanAYear && (
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-neutral-200/60 dark:bg-white/[0.04]">
              {["recent", ...years].map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`h-6 px-2.5 rounded-md text-[11px] transition-colors ${
                    range === r
                      ? "bg-white text-neutral-900 shadow-sm dark:bg-white/[0.1] dark:text-neutral-100 dark:shadow-none"
                      : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                  }`}
                >
                  {r === "recent" ? "Last 12 months" : r}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-x-auto -mx-1 px-1 pb-1">
          <div
            className="grid min-w-[680px]"
            style={{ gridTemplateColumns: `28px repeat(${weeks}, minmax(0, 1fr))`, gap: 3 }}
            onMouseLeave={() => setHover(null)}
          >
            {monthLabels.map(m => (
              <span
                key={`${m.w}-${m.label}`}
                className="text-[10px] text-neutral-400 dark:text-neutral-500 whitespace-nowrap pb-1"
                style={{ gridRow: 1, gridColumn: m.w + 2 }}
              >
                {m.label}
              </span>
            ))}
            {DAY_LABELS.map((label, d) => (
              <span
                key={d}
                className="text-[10px] text-neutral-400 dark:text-neutral-500 self-center leading-none"
                style={{ gridRow: d + 2, gridColumn: 1 }}
              >
                {label}
              </span>
            ))}
            {cells.map(cell => {
              const lvl = level(cell.count);
              const isHovered = hover?.key === `${cell.w}-${cell.d}`;
              return (
                <div
                  key={`${cell.w}-${cell.d}`}
                  onMouseEnter={cell.visible && cell.inChat ? (e) => showTooltip(e, cell) : () => setHover(null)}
                  className={`aspect-square rounded-[3px] ${
                    !cell.visible ? "" : !cell.inChat ? "bg-neutral-200/30 dark:bg-white/[0.018]" : lvl === 0 ? "bg-neutral-200/70 dark:bg-white/[0.045]" : ""
                  }`}
                  style={{
                    gridRow: cell.d + 2,
                    gridColumn: cell.w + 2,
                    background: cell.visible && lvl > 0 ? LEVELS[lvl] : undefined,
                    boxShadow: isHovered ? "0 0 0 1.5px rgba(16,185,129,0.9)" : undefined,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 text-[11px] text-neutral-400 dark:text-neutral-500">
          <span>Each square is one day</span>
          <div className="flex items-center gap-1.5">
            <span className="mr-1">Less</span>
            {LEVELS.map((c, i) => (
              <span
                key={i}
                className={`w-[11px] h-[11px] rounded-[3px] ${i === 0 ? "bg-neutral-200/70 dark:bg-white/[0.045]" : ""}`}
                style={c ? { background: c } : undefined}
              />
            ))}
            <span className="ml-1">More</span>
          </div>
        </div>
      </div>

      {hover && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full rounded-lg px-2.5 py-1.5 text-[11px] whitespace-nowrap bg-neutral-900 text-neutral-100 shadow-lg dark:bg-neutral-800 dark:border dark:border-white/10"
          style={{ left: hover.x, top: hover.y - 8 }}
        >
          <span className="font-medium">{hover.text}</span>
          <span className="text-neutral-400"> · {hover.date}</span>
        </div>
      )}
    </Card>
  );
}

function Stat({ value, label }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">{value}</span>
      <span className="text-[12px] text-neutral-500">{label}</span>
    </div>
  );
}
