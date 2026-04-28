import { C, Chip } from "../ui.jsx";

const NAV_LABELS = {
  overview: "Overview",
  response: "Response Times",
  activity: "Activity",
  patterns: "Patterns",
  ai:       "AI Analyst",
};

export default function TopBar({ activeNav, participants, totalMessages, onMenuToggle }) {
  return (
    <header
      className="flex items-center justify-between px-5 py-3 flex-shrink-0"
      style={{ borderBottom:`1px solid ${C.border}`, background: C.base }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: C.surface, border:`1px solid ${C.border}`, color: C.ink2 }}
        >
          ☰
        </button>
        <div>
          <p className="text-[10px] leading-none mb-0.5" style={{ color: C.ink3, fontFamily:"'Fira Code',monospace" }}>
            Dashboard / {NAV_LABELS[activeNav]}
          </p>
          <h2 className="text-lg font-black leading-tight" style={{ fontFamily:"'Cabinet Grotesk',sans-serif", color: C.ink }}>
            {NAV_LABELS[activeNav]}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        {participants?.slice(0,3).map(p => (
          <Chip key={p} gold>{p.length > 12 ? p.slice(0,10)+"…" : p}</Chip>
        ))}
        <Chip>{Number(totalMessages).toLocaleString()} msgs</Chip>
      </div>
    </header>
  );
}
