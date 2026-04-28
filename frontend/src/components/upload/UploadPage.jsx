import { useRef, useState } from "react";
import { C } from "../ui.jsx";

const STEPS = [
  "Parsing your chat export…",
  "Calculating response times…",
  "Building activity heatmaps…",
  "Profiling message patterns…",
  "Analyzing emoji behaviour…",
  "Wrapping up visualizations…",
];

const FEATURES = [
  { icon: "⚡", label: "P50/P90/P99", sub: "Response latency" },
  { icon: "🔥", label: "Heatmaps",    sub: "Activity patterns" },
  { icon: "💬", label: "AI Analyst",  sub: "Ask anything" },
  { icon: "💾", label: "Saved Chats", sub: "localStorage" },
];

export default function UploadPage({ onResult, apiUrl }) {
  const [phase, setPhase] = useState("idle"); // idle | loading | error
  const [step, setStep]   = useState(0);
  const [drag, setDrag]   = useState(false);
  const [err, setErr]     = useState("");
  const inputRef          = useRef();

  const analyze = async (file) => {
    if (!file?.name.endsWith(".txt")) {
      setErr("Only WhatsApp .txt exports are supported.");
      setPhase("error"); return;
    }
    setPhase("loading"); setStep(0);
    const iv = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 1800);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${apiUrl}/analyze`, { method: "POST", body: form });
      clearInterval(iv);
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || "Analysis failed."); }
      onResult(await res.json());
    } catch (e) {
      clearInterval(iv);
      setErr(e.message); setPhase("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: C.base }}>

      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${C.border}28 1px,transparent 1px),linear-gradient(90deg,${C.border}28 1px,transparent 1px)`,
        backgroundSize: "48px 48px"
      }} />
      {/* Glows */}
      <div className="absolute rounded-full pointer-events-none" style={{ width:480, height:480, background:`radial-gradient(circle,${C.gold}12 0%,transparent 70%)`, top:-180, left:-80 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width:380, height:380, background:`radial-gradient(circle,${C.green}0d 0%,transparent 70%)`, bottom:-140, right:-60 }} />

      <div className="relative z-10 w-full max-w-md flex flex-col gap-8">

        {/* Brand */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base"
            style={{ background:`linear-gradient(135deg,${C.gold},#f59e0b)`, color: C.base, fontFamily:"'Cabinet Grotesk',sans-serif" }}>
            WM
          </div>
          <h1 className="text-5xl font-black tracking-tight" style={{ fontFamily:"'Cabinet Grotesk',sans-serif", color: C.ink }}>
            Wing<span style={{ color: C.gold }}>man</span>
          </h1>
          <p className="text-xs" style={{ color: C.ink3, fontFamily:"'Fira Code',monospace" }}>
            12 brutal charts · 1 AI analyst · drop your export
          </p>
        </div>

        {/* Drop zone / loader */}
        {phase === "loading" ? (
          <div className="rounded-2xl p-8 flex flex-col items-center gap-5"
            style={{ background: C.surface, border:`1px solid ${C.border}` }}>
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 animate-spin"
                style={{ borderColor:`${C.gold} transparent transparent transparent` }} />
              <div className="absolute inset-2 rounded-full border" style={{ borderColor: C.border }} />
            </div>
            <p className="text-sm font-medium" style={{ color: C.gold, fontFamily:"'Fira Code',monospace" }}>
              {STEPS[step]}
            </p>
            <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: C.border }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width:`${((step+1)/STEPS.length)*88}%`, background:`linear-gradient(90deg,${C.gold},${C.green})` }} />
            </div>
            <p className="text-[11px]" style={{ color: C.ink3, fontFamily:"'Fira Code',monospace" }}>
              10–30s depending on chat size
            </p>
          </div>
        ) : (
          <div
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);analyze(e.dataTransfer.files[0]);}}
            onClick={()=>inputRef.current?.click()}
            className="rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200"
            style={{
              background: drag ? `${C.gold}08` : C.surface,
              borderColor: phase==="error" ? C.rose : drag ? C.gold : C.border,
            }}>
            <input ref={inputRef} type="file" accept=".txt" className="hidden" onChange={e=>analyze(e.target.files[0])} />
            <span className="text-4xl">{phase==="error" ? "⚠️" : "📂"}</span>
            <p className="text-base font-semibold text-center" style={{ color: phase==="error" ? C.rose : C.ink }}>
              {phase==="error" ? err : "Drop your WhatsApp chat export"}
            </p>
            <p className="text-[11px] text-center" style={{ color: C.ink3, fontFamily:"'Fira Code',monospace" }}>
              {phase==="error" ? "Click to try again" : "WhatsApp → Chat → Export Chat → Without Media (.txt)"}
            </p>
            {phase !== "error" && (
              <div className="mt-1 px-5 py-2 rounded-xl text-sm font-semibold"
                style={{ background: C.goldDim, color: C.gold, border:`1px solid ${C.goldMid}` }}>
                Choose File
              </div>
            )}
          </div>
        )}

        {/* Feature pills */}
        {phase !== "loading" && (
          <div className="grid grid-cols-2 gap-2">
            {FEATURES.map(f => (
              <div key={f.label} className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: C.surface, border:`1px solid ${C.border}` }}>
                <span className="text-xl">{f.icon}</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: C.ink }}>{f.label}</p>
                  <p className="text-[10px]" style={{ color: C.ink3, fontFamily:"'Fira Code',monospace" }}>{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-[10px]" style={{ color: C.ink3, fontFamily:"'Fira Code',monospace" }}>
          Processing is server-side · your data is never stored on our servers
        </p>
      </div>
    </div>
  );
}
