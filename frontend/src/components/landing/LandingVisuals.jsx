import { useState } from "react";

// Small, data-free illustrations used on the landing page. They mirror the
// real dashboard modules so visitors can see what each analysis looks like.

const GOLD = "#f5c842";

// Drop a screenshot at frontend/public/landing/dashboard.png to replace the mock.
export const DASHBOARD_SCREENSHOT = "/landing/dashboard.png";

export function Logo({ size = 26 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none">
        <path d="M3 8.4C3 6.15979 3 5.03968 3.43597 4.18404C3.81947 3.43139 4.43139 2.81947 5.18404 2.43597C6.03968 2 7.15979 2 9.4 2H14.6C16.8402 2 17.9603 2 18.816 2.43597C19.5686 2.81947 20.1805 3.43139 20.564 4.18404C21 5.03968 21 6.15979 21 8.4V11.6C21 13.8402 21 14.9603 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C17.9603 18 16.8402 18 14.6 18H9.4C7.15979 18 6.03968 18 5.18404 17.564C4.43139 17.1805 3.81947 16.5686 3.43597 15.816C3 14.9603 3 13.8402 3 11.6V8.4Z" fill="url(#wm-logo-0)" mask="url(#wm-logo-mask)" />
        <path d="M3 8.4C3 6.15979 3 5.03968 3.43597 4.18404C3.81947 3.43139 4.43139 2.81947 5.18404 2.43597C6.03968 2 7.15979 2 9.4 2H14.6C16.8402 2 17.9603 2 18.816 2.43597C19.5686 2.81947 20.1805 3.43139 20.564 4.18404C21 5.03968 21 6.15979 21 8.4V11.6C21 13.8402 21 14.9603 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C17.9603 18 16.8402 18 14.6 18H9.4C7.15979 18 6.03968 18 5.18404 17.564C4.43139 17.1805 3.81947 16.5686 3.43597 15.816C3 14.9603 3 13.8402 3 11.6V8.4Z" fill="url(#wm-logo-0)" filter="url(#wm-logo-filter)" clipPath="url(#wm-logo-clip)" />
        <path d="M9.7666 9.87523C9.48873 9.39536 8.87716 9.21774 8.3916 9.48558L3.55455 12.1452C2.59573 12.6724 2 13.6798 2 14.774V16.5998V16.6031C2 18.8398 2 18.9605 2.43555 19.8157C2.81896 20.5681 3.43117 21.1802 4.18359 21.5637C5.03924 21.9997 6.16018 22.0002 8.40039 22.0002H15.5996C17.8398 22.0002 18.9608 21.9997 19.8164 21.5637C20.5688 21.1802 21.181 20.5681 21.5645 19.8157C22 18.9605 22 17.8408 22 15.6031V15.5998V10.6428C21.9999 9.89353 21.2089 9.41219 20.5488 9.76683C18.0694 11.099 14.7916 12.9434 13.2812 13.7971C12.8177 14.0591 12.2304 13.9141 11.9473 13.4631C11.3884 12.5728 10.4754 11.0997 9.7666 9.87523Z" fill="url(#wm-logo-1)" />
        <defs>
          <linearGradient id="wm-logo-0" x1="12" y1="2" x2="12" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#575757" />
            <stop offset="1" stopColor="#151515" />
          </linearGradient>
          <linearGradient id="wm-logo-1" x1="12" y1="9.361" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E3E3E5" stopOpacity=".75" />
            <stop offset="1" stopColor="#BBBBC0" stopOpacity=".6" />
          </linearGradient>
          <filter id="wm-logo-filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" in="SourceGraphic" edgeMode="none" />
          </filter>
          <clipPath id="wm-logo-clip">
            <path d="M9.7666 9.87523C9.48873 9.39536 8.87716 9.21774 8.3916 9.48558L3.55455 12.1452C2.59573 12.6724 2 13.6798 2 14.774V16.6031C2 18.8398 2 18.9605 2.43555 19.8157C2.81896 20.5681 3.43117 21.1802 4.18359 21.5637C5.03924 21.9997 6.16018 22.0002 8.40039 22.0002H15.5996C17.8398 22.0002 18.9608 21.9997 19.8164 21.5637C20.5688 21.1802 21.181 20.5681 21.5645 19.8157C22 18.9605 22 17.8408 22 15.6031V10.6428C21.9999 9.89353 21.2089 9.41219 20.5488 9.76683C18.0694 11.099 14.7916 12.9434 13.2812 13.7971C12.8177 14.0591 12.2304 13.9141 11.9473 13.4631C11.3884 12.5728 10.4754 11.0997 9.7666 9.87523Z" />
          </clipPath>
          <mask id="wm-logo-mask">
            <rect width="100%" height="100%" fill="#FFF" />
            <path d="M9.7666 9.87523C9.48873 9.39536 8.87716 9.21774 8.3916 9.48558L3.55455 12.1452C2.59573 12.6724 2 13.6798 2 14.774V16.6031C2 18.8398 2 18.9605 2.43555 19.8157C2.81896 20.5681 3.43117 21.1802 4.18359 21.5637C5.03924 21.9997 6.16018 22.0002 8.40039 22.0002H15.5996C17.8398 22.0002 18.9608 21.9997 19.8164 21.5637C20.5688 21.1802 21.181 20.5681 21.5645 19.8157C22 18.9605 22 17.8408 22 15.6031V10.6428C21.9999 9.89353 21.2089 9.41219 20.5488 9.76683C18.0694 11.099 14.7916 12.9434 13.2812 13.7971C12.8177 14.0591 12.2304 13.9141 11.9473 13.4631C11.3884 12.5728 10.4754 11.0997 9.7666 9.87523Z" fill="#000" />
          </mask>
        </defs>
      </g>
    </svg>
  );
}

// ── Hero showcase ─────────────────────────────────────────

export function DashboardShot() {
  const [status, setStatus] = useState("loading");
  return (
    <div className="relative">
      {status !== "loaded" && <DashboardMock />}
      {status !== "error" && (
        <img
          src={DASHBOARD_SCREENSHOT}
          alt="Wingman dashboard showing chat statistics and charts"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={status === "loaded" ? "block w-full h-auto" : "absolute inset-0 opacity-0"}
        />
      )}
    </div>
  );
}

function DashboardMock() {
  const bars = [38, 52, 44, 70, 62, 88, 74, 58, 66, 92, 80, 64];
  return (
    <div className="aspect-[16/9] w-full bg-[#0c0d10] flex text-[10px]">
      <div className="hidden sm:flex w-[18%] flex-col gap-2 border-r border-white/[0.06] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Logo size={16} />
          <span className="text-[12px] text-white/80">Wingman</span>
        </div>
        {["Overview", "Response", "Activity", "Patterns", "AI Chat"].map((t, i) => (
          <div key={t} className={`rounded-md px-2.5 py-1.5 text-[11px] ${i === 0 ? "bg-white/[0.06] text-white/85" : "text-white/40"}`}>{t}</div>
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-3 p-4 sm:p-5">
        <div className="h-3 w-32 rounded bg-white/[0.07]" />
        <div className="grid grid-cols-4 gap-2.5">
          {["Total messages", "Days active", "P50 response", "P99 response"].map((t, i) => (
            <div key={t} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 sm:p-3">
              <div className="wm-mono uppercase tracking-wider text-white/30 text-[8px] sm:text-[9px] truncate">{t}</div>
              <div className="mt-1.5 text-[13px] sm:text-[18px] text-white/85 font-medium">{["24,816", "412", "4m", "7h 20m"][i]}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2.5 min-h-0">
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 flex items-end gap-[6%]">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-[3px]" style={{ height: `${h}%`, background: i === 9 ? GOLD : "rgba(255,255,255,0.12)" }} />
            ))}
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 flex items-center">
            <HeatmapGrid rows={7} cols={24} gap={2} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Feature visuals ───────────────────────────────────────

function Legend() {
  return (
    <div className="flex items-center gap-4 text-[11px] text-[var(--dim)]">
      <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full" style={{ background: GOLD }} />You</span>
      <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-white/30" />Them</span>
    </div>
  );
}

export function ResponseVisual() {
  const rows = [
    { p: "P50", you: 16, them: 30, youL: "2m", themL: "6m" },
    { p: "P90", you: 42, them: 66, youL: "24m", themL: "1h 10m" },
    { p: "P99", you: 58, them: 100, youL: "3h", themL: "9h 40m" },
  ];
  return (
    <div className="w-full flex flex-col gap-4">
      {rows.map(r => (
        <div key={r.p} className="grid grid-cols-[34px_1fr] items-center gap-3">
          <span className="wm-mono text-[11px] text-[var(--muted)]">{r.p}</span>
          <div className="flex flex-col gap-1.5">
            <Bar width={r.you} color={GOLD} label={r.youL} />
            <Bar width={r.them} color="rgba(255,255,255,0.28)" label={r.themL} />
          </div>
        </div>
      ))}
      <Legend />
    </div>
  );
}

function Bar({ width, color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-[6px] rounded-full" style={{ width: `${width * 0.78}%`, background: color }} />
      <span className="wm-mono text-[10px] text-[var(--dim)] whitespace-nowrap">{label}</span>
    </div>
  );
}

function heat(d, h) {
  let v = h < 7 ? 0.04 : h < 12 ? 0.18 : h < 15 ? 0.42 : h < 19 ? 0.28 : h < 21 ? 0.55 : 0.9;
  if (d >= 5) v += h >= 9 && h < 13 ? 0.3 : 0.08;
  v += (((d * 31 + h * 17) % 7) / 7) * 0.24 - 0.1;
  return Math.max(0.03, Math.min(1, v));
}

function HeatmapGrid({ rows = 7, cols = 24, gap = 3 }) {
  return (
    <div className="w-full grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap }}>
      {Array.from({ length: rows * cols }, (_, i) => {
        const v = heat(Math.floor(i / cols), i % cols);
        return (
          <div
            key={i}
            className="aspect-square rounded-[2px]"
            style={{ background: v < 0.1 ? "rgba(255,255,255,0.04)" : `rgba(245, 200, 66, ${v * 0.9})` }}
          />
        );
      })}
    </div>
  );
}

export function HeatmapVisual() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-[18px_1fr] gap-2.5">
        <div className="grid grid-rows-7 wm-mono text-[10px] text-[var(--dim)] items-center">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <HeatmapGrid />
      </div>
      <div className="ml-[28px] mt-2 flex justify-between wm-mono text-[10px] text-[var(--dim)]">
        <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
      </div>
    </div>
  );
}

export function InitiatorVisual() {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[28px] font-medium tracking-tight">58%</div>
          <div className="text-[11px] text-[var(--dim)]">started by you</div>
        </div>
        <div className="text-right">
          <div className="text-[28px] font-medium tracking-tight text-white/45">42%</div>
          <div className="text-[11px] text-[var(--dim)]">started by them</div>
        </div>
      </div>
      <div className="flex h-2 gap-1">
        <div className="rounded-full" style={{ width: "58%", background: GOLD }} />
        <div className="rounded-full flex-1 bg-white/25" />
      </div>
      <div className="wm-mono text-[10px] text-[var(--dim)]">New thread = first message after 6h+ silence</div>
    </div>
  );
}

export function DoubleTextVisual() {
  return (
    <div className="w-full flex flex-col gap-1.5 items-end">
      {["hey", "are you around later?", "ok call me when you can"].map((t, i) => (
        <div
          key={t}
          className="rounded-[14px] rounded-br-[4px] px-3 py-1.5 text-[12px] text-[#1a1608]"
          style={{ background: GOLD, opacity: 1 - i * 0.18 }}
        >
          {t}
        </div>
      ))}
      <div className="mt-2 flex w-full items-center justify-between">
        <span className="wm-mono text-[10px] text-[var(--dim)]">no reply yet</span>
        <span className="wm-mono text-[10px] rounded-full px-2 py-0.5 bg-white/[0.06] text-[var(--muted)]">×3 in a row</span>
      </div>
    </div>
  );
}

export function StreakVisual() {
  const days = Array.from({ length: 42 }, (_, i) => !(i >= 23 && i <= 31) && (i * 7) % 11 !== 3);
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
        {days.map((on, i) => (
          <div
            key={i}
            className="aspect-square rounded-[3px]"
            style={{
              background: on ? (i < 20 ? GOLD : "rgba(255,255,255,0.28)") : "rgba(255,255,255,0.04)",
              outline: i >= 23 && i <= 31 ? "1px dashed rgba(255,255,255,0.12)" : "none",
              outlineOffset: -1,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[11px]">
        <span className="text-[var(--muted)]"><span className="text-white font-medium">46 days</span> longest streak</span>
        <span className="text-[var(--muted)]"><span className="text-white font-medium">9 days</span> longest silence</span>
      </div>
    </div>
  );
}

export function HabitsVisual() {
  const people = [
    { name: "You", len: 42, q: 18, color: GOLD },
    { name: "Them", len: 27, q: 9, color: "rgba(255,255,255,0.28)" },
  ];
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
      {[
        { key: "len", label: "Avg. message length", unit: " chars", max: 50 },
        { key: "q", label: "Messages with a question", unit: "%", max: 25 },
      ].map(m => (
        <div key={m.key} className="flex flex-col gap-3">
          <span className="wm-mono text-[10px] uppercase tracking-[0.12em] text-[var(--dim)]">{m.label}</span>
          {people.map(p => (
            <div key={p.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[12px]">
                <span className="text-[var(--muted)]">{p.name}</span>
                <span className="wm-mono text-white/80">{p[m.key]}{m.unit}</span>
              </div>
              <div className="h-[6px] rounded-full bg-white/[0.05]">
                <div className="h-full rounded-full" style={{ width: `${(p[m.key] / m.max) * 100}%`, background: p.color }} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function VolumeVisual() {
  const r = 34, c = 2 * Math.PI * r;
  return (
    <div className="w-full flex items-center gap-6">
      <svg viewBox="0 0 80 80" className="w-[92px] h-[92px] -rotate-90 flex-shrink-0">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="7" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={GOLD} strokeWidth="7" strokeDasharray={`${c * 0.54 - 3} ${c}`} strokeLinecap="round" />
      </svg>
      <div className="flex flex-col gap-2">
        <div className="text-[26px] font-medium tracking-tight leading-none">24,816</div>
        <div className="text-[11px] text-[var(--dim)]">messages in total</div>
        <div className="flex gap-3 text-[11px] text-[var(--muted)]">
          <span><span className="text-white">54%</span> you</span>
          <span><span className="text-white">46%</span> them</span>
        </div>
      </div>
    </div>
  );
}

// ── AI analyst ────────────────────────────────────────────

export function AIChatVisual() {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] overflow-hidden">
      <div className="flex items-center justify-between px-5 h-12 border-b border-[var(--line)]">
        <span className="text-[13px] text-white/85">AI Chat</span>
        <span className="wm-mono text-[10px] rounded-full px-2 py-0.5 bg-emerald-400/10 text-emerald-400">Key saved locally</span>
      </div>
      <div className="p-5 flex flex-col gap-4 text-[13px] leading-relaxed">
        <div className="self-end max-w-[80%] rounded-2xl rounded-br-[4px] bg-white/[0.07] px-4 py-2.5 text-white/90">
          Who ghosts more?
        </div>
        <div className="self-start max-w-[88%] flex gap-3">
          <div className="mt-0.5 flex-shrink-0"><Logo size={20} /></div>
          <div className="text-[var(--muted)]">
            <span className="text-white/90">Them, by a wide margin.</span> Their median reply is about 6 minutes, but their P99 is <span className="text-[#f5c842]">9h 40m</span>. They usually answer quickly, then disappear for most of a day now and then. Your slowest replies top out around 3 hours.
          </div>
        </div>
        <div className="self-end max-w-[80%] rounded-2xl rounded-br-[4px] bg-white/[0.07] px-4 py-2.5 text-white/90">
          Best time to message them?
        </div>
        <div className="self-start max-w-[88%] flex gap-3">
          <div className="mt-0.5 flex-shrink-0"><Logo size={20} /></div>
          <div className="text-[var(--muted)]">
            Between <span className="text-white/90">9 and 11 pm</span>. Nearly a third of your messages land in that window, and replies are fastest there too.
          </div>
        </div>
      </div>
      <div className="px-5 pb-5 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {["Who starts conversations more?", "Who sends longer messages?", "What was the longest gap?"].map(q => (
            <span key={q} className="text-[11px] rounded-full border border-[var(--line)] px-3 py-1 text-[var(--muted)]">{q}</span>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-black/30 px-4 h-11 text-[13px] text-[var(--dim)]">
          Ask anything about your chat…
          <span className="w-7 h-7 rounded-lg bg-white/90 text-black grid place-items-center text-[14px]">↑</span>
        </div>
      </div>
    </div>
  );
}

// ── How it works ──────────────────────────────────────────

export function ExportPathVisual() {
  return (
    <div className="flex flex-wrap items-center gap-1.5 wm-mono text-[11px]">
      {["Open chat", "⋮", "More", "Export chat", "Without media"].map((s, i, a) => (
        <span key={s} className="flex items-center gap-1.5">
          <span className={`rounded-md px-2 py-1 border ${i === a.length - 1 ? "border-[#f5c842]/40 text-[#f5c842] bg-[#f5c842]/[0.06]" : "border-[var(--line)] text-[var(--muted)]"}`}>{s}</span>
          {i < a.length - 1 && <span className="text-[var(--dim)]">→</span>}
        </span>
      ))}
    </div>
  );
}

export function FileVisual() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white/[0.02] px-3.5 py-3 max-w-[300px]">
      <div className="w-9 h-11 rounded-md border border-white/15 bg-white/[0.04] grid place-items-center wm-mono text-[9px] text-[var(--muted)]">TXT</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-white/85 truncate">WhatsApp Chat.txt</div>
        <div className="mt-1.5 h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-full w-[72%] rounded-full" style={{ background: GOLD }} />
        </div>
      </div>
    </div>
  );
}

export function ViewsVisual() {
  return (
    <div className="flex flex-wrap gap-1.5">
      {["Overview", "Response", "Activity", "Patterns", "AI Chat"].map((t, i) => (
        <span key={t} className={`text-[12px] rounded-md px-2.5 py-1 ${i === 0 ? "bg-white text-black" : "bg-white/[0.05] text-[var(--muted)]"}`}>{t}</span>
      ))}
    </div>
  );
}
