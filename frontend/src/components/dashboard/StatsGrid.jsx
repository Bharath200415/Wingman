function parseFlexibleDate(input) {
  if (!input) return null;
  const raw = String(input).trim();

  // YYYY-MM-DD
  const ymd = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (ymd) {
    return {
      day: Number(ymd[3]),
      month: Number(ymd[2]),
      year: Number(ymd[1]),
    };
  }

  return null;
}

function formatDateLabel(parts) {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  const day = String(parts.day).padStart(2, "0");
  const month = new Intl.DateTimeFormat("en-GB", {
    month: "short",
    timeZone: "UTC",
  }).format(date);
  return `${day} ${month} ${parts.year}`;
}

function formatDateRange(value) {
  if (!value) return "—";
  if (typeof value !== "string") return String(value);

  const parts = value
    .split(/\s+(?:to|–|—)\s+/i)
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length < 2) return value;

  const start = parseFlexibleDate(parts[0]);
  const end = parseFlexibleDate(parts[1]);
  if (!start || !end) return value;

  return `${formatDateLabel(start)} to ${formatDateLabel(end)}`;
}

function MetricCard({ label, value, sub, wide, compact = false }) {
  return (
    <div
      className={`rounded-xl p-4 h-[145px] flex flex-col py-6 gap-1 bg-gradient-to-t from-neutral-100 to-neutral-50 border border-neutral-200 shadow-sm dark:from-neutral-950 dark:to-neutral-900 dark:border-neutral-800 ${wide ? "col-span-1" : ""}`}
    >
      <span className="text-[11px] uppercase tracking-wide text-neutral-400">
        {label}
      </span>
      <span className={`${compact ? "text-sm md:text-xl" : "text-lg md:text-2xl"}  text-neutral-900 dark:text-neutral-100 font-bold leading-tight`}>
        {value}
      </span>
      {sub && <span className="text-[10px] text-neutral-600 dark:text-neutral-300">{sub}</span>}
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
    { label:"Date Range",       value: formatDateRange(stats?.["Date Range"]), wide: true, compact: true },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <MetricCard
          key={card.label}
          label={card.label}
          value={card.value}
          sub={card.sub}
          highlight={card.highlight}
          wide={card.wide}
          compact={card.compact}
        />
      ))}
    </div>

  );
}
