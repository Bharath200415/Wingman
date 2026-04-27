import { useState, useRef, useCallback } from "react";
import Dashboard from "./components/Dashboard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STEPS = [
  "Parsing your chat export…",
  "Calculating response times…",
  "Building activity heatmaps…",
  "Profiling message patterns…",
  "Analyzing emoji behaviour…",
  "Wrapping up 12 charts…",
];

export default function App() {
  const [phase, setPhase] = useState("upload");
  const [result, setResult] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [step, setStep] = useState(0);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  const analyze = useCallback(async (file) => {
    if (!file?.name.endsWith(".txt")) {
      setErrMsg("Only WhatsApp .txt exports are supported.");
      setPhase("error");
      return;
    }
    setPhase("loading");
    setStep(0);
    const iv = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1800);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${API_URL}/analyze`, { method: "POST", body: form });
      clearInterval(iv);
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || "Analysis failed."); }
      setResult(await res.json());
      setPhase("done");
    } catch (e) {
      clearInterval(iv);
      setErrMsg(e.message);
      setPhase("error");
    }
  }, []);

  if (phase === "done" && result)
    return <Dashboard result={result} onReset={() => { setPhase("upload"); setResult(null); }} />;

  return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"linear-gradient(#1f253518 1px,transparent 1px),linear-gradient(90deg,#1f253518 1px,transparent 1px)", backgroundSize:"48px 48px" }} />
      <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background:"radial-gradient(circle,#f5c84215 0%,transparent 70%)", top:"-200px", left:"-100px" }} />
      <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background:"radial-gradient(circle,#10d9a010 0%,transparent 70%)", bottom:"-150px", right:"-100px" }} />

      <div className="relative z-10 w-full max-w-lg animate-fade-up">
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[15px] font-black" style={{ background:"linear-gradient(135deg,#f5c842,#f59e0b)", color:"#0d0f14", fontFamily:"'Cabinet Grotesk',sans-serif" }}>WA</div>
          <div className="text-center">
            <h1 className="text-5xl text-red-500 font-black tracking-tight leading-none mb-2" style={{ fontFamily:"'Cabinet Grotesk',sans-serif" }}>
              Wingman
            </h1>
            <p className="text-xs" style={{ color:"#8b91b0", fontFamily:"'Fira Code',monospace" }}>12 brutal charts. 1 AI analyst. Drop your export.</p>
          </div>
        </div>

        {phase === "loading" ? (
          <div className="rounded-2xl border p-8 flex flex-col items-center gap-5" style={{ background:"#13161e", borderColor:"#1f2535" }}>
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 animate-spin" style={{ borderColor:"#f5c842 transparent transparent transparent" }} />
              <div className="absolute inset-2 rounded-full border" style={{ borderColor:"#1f2535" }} />
            </div>
            <p className="text-sm font-medium" style={{ color:"#f5c842", fontFamily:"'Fira Code',monospace" }}>{STEPS[step]}</p>
            <div className="w-full rounded-full overflow-hidden h-1" style={{ background:"#1f2535" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width:`${((step+1)/STEPS.length)*88}%`, background:"linear-gradient(90deg,#f5c842,#10d9a0)" }} />
            </div>
            <p className="text-xs" style={{ color:"#555c7a", fontFamily:"'Fira Code',monospace" }}>This may take 10–30s depending on chat size</p>
          </div>
        ) : (
          <>
            <div
              onDragOver={(e)=>{e.preventDefault();setDrag(true);}}
              onDragLeave={()=>setDrag(false)}
              onDrop={(e)=>{e.preventDefault();setDrag(false);analyze(e.dataTransfer.files[0]);}}
              onClick={()=>inputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed p-12 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200"
              style={{ background:drag?"#f5c84208":"#13161e", borderColor:phase==="error"?"#ff4f72":drag?"#f5c842":"#1f2535" }}>
              <input ref={inputRef} type="file" accept=".txt" className="hidden" onChange={(e)=>analyze(e.target.files[0])} />
              <div className="text-4xl">{phase==="error"?"⚠️":"📂"}</div>
              <p className="text-base font-semibold" style={{ color:phase==="error"?"#ff4f72":"#e8eaf5" }}>
                {phase==="error"?errMsg:"Drop your WhatsApp chat export"}
              </p>
              <p className="text-xs text-center" style={{ color:"#555c7a", fontFamily:"'Fira Code',monospace" }}>
                {phase==="error"?"Click to try again":"WhatsApp → Chat → Export Chat → Without Media (.txt)"}
              </p>
              {phase!=="error"&&(
                <div className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold" style={{ background:"#f5c84215", color:"#f5c842", border:"1px solid #f5c84240" }}>Choose File</div>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {["⚡ P50/P90/P99","🔥 Heatmaps","💬 AI Analyst","📊 12 Charts"].map(f=>(
                <span key={f} className="px-3 py-1 rounded-full text-xs" style={{ background:"#1a1e2a", color:"#8b91b0", border:"1px solid #1f2535", fontFamily:"'Fira Code',monospace" }}>{f}</span>
              ))}
            </div>
            <p className="text-center text-xs mt-4" style={{ color:"#555c7a", fontFamily:"'Fira Code',monospace" }}>Processing is server-side. Your data is never stored.</p>
          </>
        )}
      </div>
    </div>
  );
}
