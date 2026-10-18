import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUp, Download, GripVertical, Lock } from "lucide-react";
import { Logo, ExportPathVisual } from "../landing/LandingVisuals.jsx";
import "../landing/landing.css";

const STEPS = [
  "Parsing your chat export…",
  "Calculating response times…",
  "Building activity heatmaps…",
  "Profiling message patterns…",
  "Analyzing emoji behaviour…",
  "Wrapping up visualizations…",
];

const SAMPLE = { url: "/sample/wingman-sample-chat.txt", name: "wingman-sample-chat.txt" };
const SAMPLE_DRAG_TYPE = "application/x-wingman-sample";

export default function UploadPage({ onResult, apiUrl, hasChats }) {
  const [phase, setPhase] = useState("idle");
  const [step, setStep] = useState(0);
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef(null);

  const analyze = async (file) => {
    if (!file?.name.endsWith(".txt")) {
      setErr("Only WhatsApp .txt exports are supported.");
      setPhase("error");
      return;
    }
    setPhase("loading");
    setStep(0);
    const iv = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1800);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${apiUrl}/analyze`, { method: "POST", body: form });
      clearInterval(iv);
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Analysis failed.");
      }
      onResult(await res.json());
    } catch (e) {
      clearInterval(iv);
      setErr(e.message);
      setPhase("error");
    }
  };

  // The sample card can't carry a real File when dragged, so fetch it on drop.
  const analyzeSample = async () => {
    try {
      const res = await fetch(SAMPLE.url);
      if (!res.ok) throw new Error();
      analyze(new File([await res.blob()], SAMPLE.name, { type: "text/plain" }));
    } catch {
      setErr("Couldn't load the sample chat.");
      setPhase("error");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.types.includes(SAMPLE_DRAG_TYPE)) analyzeSample();
    else analyze(e.dataTransfer.files[0]);
  };

  return (
    <div className="wm-landing min-h-screen flex flex-col relative overflow-x-clip">
      <div className="wm-dots absolute inset-0 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[520px] pointer-events-none bg-[radial-gradient(ellipse_45%_60%_at_50%_0%,rgba(245,200,66,0.08),transparent)]" />

      <header className="relative z-10 border-b border-[var(--line)]">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-[18px] font-medium tracking-[-0.02em]">Wingman</span>
          </Link>
          <Link to={hasChats ? "/dashboard" : "/"} className="wm-btn wm-btn-ghost">
            <ArrowLeft size={15} strokeWidth={1.8} />
            {hasChats ? "Dashboard" : "Back"}
          </Link>
        </div>
      </header>

      <main className="wm-intro relative z-10 flex-1 mx-auto w-full max-w-[680px] px-5 md:px-8 py-16 md:py-24 flex flex-col items-center text-center">
        <span style={{ "--i": 0 }} className="wm-eyebrow">New analysis</span>
        <h1 style={{ "--i": 1 }} className="wm-h2 mt-4">Upload your chat export</h1>
        <p style={{ "--i": 2 }} className="mt-4 text-[15px] leading-[1.6] text-[var(--muted)] max-w-[460px]">
          Drop the .txt file WhatsApp gives you. Wingman detects the date format on its own and builds your dashboard in under a minute.
        </p>

        <div style={{ "--i": 3 }} className="mt-12 w-full">
          {phase === "loading" ? (
            <div key="loading" className="wm-drop wm-bracket" style={{ animation: "wm-fade 300ms ease-out both" }}>
              <div className="w-full max-w-[320px] h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#f5c842]"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%`, transition: "width 700ms cubic-bezier(0.23, 1, 0.32, 1)" }}
                />
              </div>
              <div className="h-6 overflow-hidden">
                <p key={step} className="text-[15px] text-white/85" style={{ animation: "wm-step 400ms cubic-bezier(0.23, 1, 0.32, 1) both" }}>
                  {STEPS[step]}
                </p>
              </div>
              <p className="wm-mono text-[11px] text-[var(--dim)]">30–60s depending on chat size</p>
            </div>
          ) : (
            <div
              key="upload"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              data-drag={drag || undefined}
              data-error={phase === "error" || undefined}
              className="wm-drop wm-drop-idle wm-bracket cursor-pointer"
            >
              <input
                ref={inputRef}
                type="file"
                accept=".txt"
                className="hidden"
                onChange={(e) => analyze(e.target.files?.[0])}
              />
              <span className="w-12 h-12 rounded-xl border border-[var(--line)] bg-white/[0.03] grid place-items-center">
                {phase === "error" ? (
                  <span className="text-[#ff6b81] text-[18px] leading-none">!</span>
                ) : (
                  <ArrowUp size={20} strokeWidth={1.6} className="text-white/80" />
                )}
              </span>
              <div className="flex flex-col gap-1.5">
                <p className={`text-[17px] font-medium ${phase === "error" ? "text-[#ff6b81]" : "text-white/90"}`}>
                  {phase === "error" ? err : drag ? "Release to analyze" : "Drop your chat export here"}
                </p>
                <p className="text-[13px] text-[var(--dim)]">
                  {phase === "error" ? "Click to choose another file" : "or click to browse · .txt only"}
                </p>
              </div>
              {phase !== "error" && <span className="wm-btn wm-btn-primary pointer-events-none">Choose file</span>}
            </div>
          )}
        </div>

        {phase !== "loading" && (
          <div
            style={{ "--i": 4 }}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(SAMPLE_DRAG_TYPE, "1");
              e.dataTransfer.effectAllowed = "copy";
            }}
            className="wm-sample mt-5 w-full flex items-center gap-3 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.015] p-3 pr-3.5 text-left cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={16} strokeWidth={1.6} className="text-[var(--dim)] flex-shrink-0 hidden sm:block" />
            <div className="w-9 h-11 rounded-md border border-white/15 bg-white/[0.04] grid place-items-center wm-mono text-[9px] text-[var(--muted)] flex-shrink-0">TXT</div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] text-white/90">No export handy? Try a sample chat</p>
              <p className="mt-0.5 text-[12.5px] text-[var(--dim)]">
                A made-up chat between Bharath and Siya. Drag it into the box above, or click Try it.
              </p>
            </div>
            <a
              href={SAMPLE.url}
              download={SAMPLE.name}
              aria-label="Download sample chat"
              className="wm-btn wm-btn-ghost flex-shrink-0"
              style={{ width: 38, padding: 0 }}
            >
              <Download size={15} strokeWidth={1.8} />
            </a>
            <button onClick={analyzeSample} className="wm-btn wm-btn-primary flex-shrink-0">Try it</button>
          </div>
        )}

        <div style={{ "--i": 5 }} className="mt-12 w-full text-left border border-[var(--line)] rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <span className="wm-eyebrow">How to export from WhatsApp</span>
          <ExportPathVisual />
          <p className="text-[13.5px] leading-[1.6] text-[var(--muted)]">
            Choose <span className="text-white/85">Without media</span> so the file contains only messages. Works for individual and group chats.
          </p>
        </div>

        <p style={{ "--i": 6 }} className="mt-8 flex items-center gap-2 text-[12px] text-[var(--dim)]">
          <Lock size={12} strokeWidth={2} />
          Parsed on the Wingman server, never stored in a database. Results stay in your browser.
        </p>
      </main>
    </div>
  );
}
