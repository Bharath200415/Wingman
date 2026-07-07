import { useRef, useState } from "react";

const STEPS = [
  "Parsing your chat export…",
  "Calculating response times…",
  "Building activity heatmaps…",
  "Profiling message patterns…",
  "Analyzing emoji behaviour…",
  "Wrapping up visualizations…",
];

const FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    label: "P50 / P90 / P99",
    sub: "Response latency",
    color: "#f5c842",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
    label: "Heatmaps",
    sub: "Activity patterns",
    color: "#10d9a0",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    label: "AI Analyst",
    sub: "Ask anything",
    color: "#38b6ff",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    ),
    label: "Local history",
    sub: "Saved in localStorage",
    color: "#a78bfa",
  },
];

export default function UploadPage({ onResult, apiUrl }) {
  const [phase, setPhase] = useState("idle");
  const [step, setStep] = useState(0);
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");
  const [spot, setSpot] = useState({ x: 50, y: 50 });
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

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const circumference = 2 * Math.PI * 26; // r=26
  const progress = (step + 1) / STEPS.length;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0c11] text-[#e8eaf5]">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#2a3050 1px, transparent 1px), linear-gradient(90deg, #2a3050 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black 30%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "#f5c842", opacity: 0.06, filter: "blur(160px)" }}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ---------------------------------------------------------------- */}
      <header className="animate-fade-in-down relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between border-b border-[#1a1e2a]/60">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black flex-shrink-0 text-neutral-950"
            style={{ fontFamily: "'Cabinet Grotesk',sans-serif" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
              <title>square-chart-line</title>
              <g fill="none">
                <path d="M3 8.4C3 6.15979 3 5.03968 3.43597 4.18404C3.81947 3.43139 4.43139 2.81947 5.18404 2.43597C6.03968 2 7.15979 2 9.4 2H14.6C16.8402 2 17.9603 2 18.816 2.43597C19.5686 2.81947 20.1805 3.43139 20.564 4.18404C21 5.03968 21 6.15979 21 8.4V11.6C21 13.8402 21 14.9603 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C17.9603 18 16.8402 18 14.6 18H9.4C7.15979 18 6.03968 18 5.18404 17.564C4.43139 17.1805 3.81947 16.5686 3.43597 15.816C3 14.9603 3 13.8402 3 11.6V8.4Z" fill="url(#landing_square-chart-line_existing_0)" data-glass="origin" mask="url(#landing_square-chart-line_mask)"></path>
                <path d="M3 8.4C3 6.15979 3 5.03968 3.43597 4.18404C3.81947 3.43139 4.43139 2.81947 5.18404 2.43597C6.03968 2 7.15979 2 9.4 2H14.6C16.8402 2 17.9603 2 18.816 2.43597C19.5686 2.81947 20.1805 3.43139 20.564 4.18404C21 5.03968 21 6.15979 21 8.4V11.6C21 13.8402 21 14.9603 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C17.9603 18 16.8402 18 14.6 18H9.4C7.15979 18 6.03968 18 5.18404 17.564C4.43139 17.1805 3.81947 16.5686 3.43597 15.816C3 14.9603 3 13.8402 3 11.6V8.4Z" fill="url(#landing_square-chart-line_existing_0)" data-glass="clone" filter="url(#landing_square-chart-line_filter)" clip-path="url(#landing_square-chart-line_clipPath)"></path>
                <path d="M9.7666 9.87523C9.48873 9.39536 8.87716 9.21774 8.3916 9.48558L3.55455 12.1452C2.59573 12.6724 2 13.6798 2 14.774V16.5998V16.6031C2 18.8398 2 18.9605 2.43555 19.8157C2.81896 20.5681 3.43117 21.1802 4.18359 21.5637C5.03924 21.9997 6.16018 22.0002 8.40039 22.0002H15.5996C17.8398 22.0002 18.9608 21.9997 19.8164 21.5637C20.5688 21.1802 21.181 20.5681 21.5645 19.8157C22 18.9605 22 17.8408 22 15.6031V15.5998V10.6428C21.9999 9.89353 21.2089 9.41219 20.5488 9.76683C18.0694 11.099 14.7916 12.9434 13.2812 13.7971C12.8177 14.0591 12.2304 13.9141 11.9473 13.4631C11.3884 12.5728 10.4754 11.0997 9.7666 9.87523Z" fill="url(#landing_square-chart-line_existing_1)" data-glass="blur"></path>
                <path d="M15.5996 21.2502V22.0002H8.40039V21.2502H15.5996ZM21.25 15.6028V10.6428C21.2499 10.45 21.0543 10.3468 20.9033 10.428C18.4318 11.7559 15.1607 13.5968 13.6504 14.4504C12.8422 14.9072 11.8113 14.6562 11.3125 13.8616C10.7527 12.9697 9.83302 11.4877 9.11719 10.2512C9.03879 10.1159 8.87324 10.0762 8.75391 10.1418L8.75293 10.1428L3.91602 12.802C3.19701 13.1973 2.75013 13.9532 2.75 14.7737V15.6028C2.75 16.734 2.75039 17.5383 2.80176 18.1672C2.8524 18.7868 2.94873 19.1707 3.10352 19.4748C3.41499 20.0861 3.91297 20.5841 4.52441 20.8957C4.82888 21.0508 5.21342 21.1467 5.83398 21.1975C6.46353 21.249 7.26801 21.2502 8.40039 21.2502V22.0002L6.91699 21.9934C5.72503 21.9745 4.96098 21.9042 4.34766 21.6409L4.18359 21.5637C3.52521 21.2281 2.97417 20.7176 2.58984 20.091L2.43555 19.8157C2 18.9605 2 17.8404 2 15.6028V14.7737C2.00012 13.748 2.5235 12.7983 3.37891 12.2493L3.55469 12.1448L8.3916 9.48558C8.87716 9.21774 9.48873 9.39536 9.7666 9.87523C10.4754 11.0997 11.3884 12.5728 11.9473 13.4631C12.2128 13.8861 12.7457 14.0397 13.1934 13.841L13.2812 13.7971C14.4141 13.1568 16.5412 11.959 18.5801 10.8381L20.5488 9.76683C21.2089 9.41219 21.9999 9.89353 22 10.6428V15.6028C22 17.8404 22 18.9605 21.5645 19.8157L21.4102 20.091C21.0258 20.7176 20.4748 21.2281 19.8164 21.5637L19.6523 21.6409C18.816 22 17.6995 22.0002 15.5996 22.0002V21.2502C16.732 21.2502 17.5365 21.249 18.166 21.1975C18.7866 21.1467 19.1711 21.0508 19.4756 20.8957C20.087 20.5841 20.585 20.0861 20.8965 19.4748C21.0513 19.1707 21.1476 18.7868 21.1982 18.1672C21.2496 17.5383 21.25 16.734 21.25 15.6028Z" fill="url(#landing_square-chart-line_existing_2)"></path>
                <defs>
                  <linearGradient id="landing_square-chart-line_existing_0" x1="12" y1="2" x2="12" y2="18" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#575757"></stop>
                    <stop offset="1" stop-color="#151515"></stop>
                  </linearGradient>
                  <linearGradient id="landing_square-chart-line_existing_1" x1="12" y1="9.361" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#E3E3E5" stop-opacity=".6"></stop>
                    <stop offset="1" stop-color="#BBBBC0" stop-opacity=".6"></stop>
                  </linearGradient>
                  <linearGradient id="landing_square-chart-line_existing_2" x1="12" y1="9.361" x2="12" y2="16.68" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#fff"></stop>
                    <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
                  </linearGradient>
                  <filter id="landing_square-chart-line_filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
                  </filter>
                  <clipPath id="landing_square-chart-line_clipPath">
                    <path d="M9.7666 9.87523C9.48873 9.39536 8.87716 9.21774 8.3916 9.48558L3.55455 12.1452C2.59573 12.6724 2 13.6798 2 14.774V16.5998V16.6031C2 18.8398 2 18.9605 2.43555 19.8157C2.81896 20.5681 3.43117 21.1802 4.18359 21.5637C5.03924 21.9997 6.16018 22.0002 8.40039 22.0002H15.5996C17.8398 22.0002 18.9608 21.9997 19.8164 21.5637C20.5688 21.1802 21.181 20.5681 21.5645 19.8157C22 18.9605 22 17.8408 22 15.6031V15.5998V10.6428C21.9999 9.89353 21.2089 9.41219 20.5488 9.76683C18.0694 11.099 14.7916 12.9434 13.2812 13.7971C12.8177 14.0591 12.2304 13.9141 11.9473 13.4631C11.3884 12.5728 10.4754 11.0997 9.7666 9.87523Z" fill="url(#landing_square-chart-line_existing_1)"></path>
                  </clipPath>
                  <mask id="landing_square-chart-line_mask">
                    <rect width="100%" height="100%" fill="#FFF"></rect>
                    <path d="M9.7666 9.87523C9.48873 9.39536 8.87716 9.21774 8.3916 9.48558L3.55455 12.1452C2.59573 12.6724 2 13.6798 2 14.774V16.5998V16.6031C2 18.8398 2 18.9605 2.43555 19.8157C2.81896 20.5681 3.43117 21.1802 4.18359 21.5637C5.03924 21.9997 6.16018 22.0002 8.40039 22.0002H15.5996C17.8398 22.0002 18.9608 21.9997 19.8164 21.5637C20.5688 21.1802 21.181 20.5681 21.5645 19.8157C22 18.9605 22 17.8408 22 15.6031V15.5998V10.6428C21.9999 9.89353 21.2089 9.41219 20.5488 9.76683C18.0694 11.099 14.7916 12.9434 13.2812 13.7971C12.8177 14.0591 12.2304 13.9141 11.9473 13.4631C11.3884 12.5728 10.4754 11.0997 9.7666 9.87523Z" fill="#000"></path>
                  </mask>
                </defs>
              </g>
            </svg>
          </div>
          <span
            className="text-[20px] font-medium tracking-tight text-white"
            style={{ fontFamily: "'Lastik', serif" }}
          >
            <span>Wingman</span>
          </span>
        </div>


        <div className="flex items-center gap-5">
          <span className="hidden sm:inline text-[11px] font-mono text-[#555c7a] tracking-wider uppercase">no signup required</span>
          <a
            href="#upload"
            className="px-5 py-2 rounded-full bg-white text-[#0a0c11] text-[13px] font-semibold hover:bg-[#e8eaf5] transition-all duration-200 shadow-sm"
          >
            Analyze chat
          </a>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                               */}
      {/* ---------------------------------------------------------------- */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-8 md:pt-20 pb-20 md:pb-24 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
        {/* ---------------- Left: value proposition ---------------- */}
        <div className="animate-fade-in-up md:col-span-7 flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8b91b0]">
              WhatsApp Chat Analyzer
            </span>

            <h1 className="text-[40px] sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.03] tracking-tight font-bold text-white">
              Your chats.
              <br />
              <span className="bg-gradient-to-r from-[#f5c842] to-[#ffbe1a] bg-clip-text text-transparent">
                Fully profiled.
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#10d9a0] to-[#00b584] bg-clip-text text-transparent">
                Entirely private.
              </span>
            </h1>

            <p className="text-[15px] sm:text-base text-[#8b91b0] max-w-md leading-relaxed">
              Export your WhatsApp history, drop it below, and get 12 interactive
              charts plus an AI analyst — parsed and analyzed without ever leaving
              your browser.
            </p>
          </div>

          {/* Trust line */}
          <div id="privacy" className="flex items-start gap-2.5 text-[12px] sm:text-[13px] text-[#8b91b0] leading-relaxed">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10d9a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
              <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
              <path
                d="M8.5 12.5l2.2 2.2L15.5 10"
                style={{
                  strokeDasharray: 12,
                  strokeDashoffset: 12,
                  animation: "wm-draw 0.6s 0.9s ease forwards",
                }}
              />
            </svg>
            <span>
              Processing happens locally — your messages are never stored on a server.
            </span>
          </div>

          {/* Feature row */}
          <div id="features" className="grid grid-cols-2 gap-x-6 gap-y-5 pt-5 border-t border-[#1a1e2a]/60">
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className="flex flex-col gap-2"
                style={{
                  animation: "wm-fadeInUpSmall 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
                  animationDelay: `${0.25 + i * 0.07}s`,
                }}
              >
                <span style={{ color: f.color }}>{f.icon}</span>
                <div>
                  <p className="text-[13px] font-medium text-[#e8eaf5]">{f.label}</p>
                  <p className="text-[11px] text-[#6b7290] font-mono mt-0.5">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- Right: uploader ---------------- */}
        <div id="upload" className="animate-scale-in md:col-span-5 relative">
          {phase === "loading" ? (
            <div
              key="loading"
              className="relative rounded-2xl p-10 flex flex-col items-center gap-6 bg-[#10131a] border border-dashed border-neutral-200"
              style={{ animation: "wm-fadeIn 0.35s ease-out both" }}
            >
              {/* Circular progress ring */}
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 60 60" className="w-16 h-16 -rotate-90">
                  <circle cx="30" cy="30" r="26" fill="none" stroke="#1f2535" strokeWidth="3" />
                  <circle
                    cx="30"
                    cy="30"
                    r="26"
                    fill="none"
                    stroke="#f5c842"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress)}
                    style={{ transition: "stroke-dashoffset 0.7s ease-out" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] font-mono text-[#f5c842]">
                    {Math.round(progress * 100)}%
                  </span>
                </div>
              </div>

              {/* Step text */}
              <div className="w-full text-center h-6 overflow-hidden relative">
                <p
                  key={step}
                  className="text-sm font-medium text-[#cfd4ec] font-mono text-center animate-step-text"
                >
                  {STEPS[step]}
                </p>
              </div>

              <p className="text-[11px] text-[#555c7a] font-mono">
                30–60s depending on chat size
              </p>
            </div>
          ) : (
            <div
              key="upload"
              onMouseMove={handleMouseMove}
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                analyze(e.dataTransfer.files[0]);
              }}
              onClick={() => inputRef.current?.click()}
              className="relative rounded-2xl p-10 flex flex-col items-center gap-5 cursor-pointer bg-[#10131a] border border-dashed transition-colors duration-300 overflow-hidden"
              style={{
                animation: "wm-fadeIn 0.35s ease-out both",
                borderColor:
                  phase === "error" ? "#ff4f7270" : drag ? "#f5c842" : "#d4d4d4",
              }}
            >
              {/* subtle spotlight glow following cursor */}
              <div
                className="absolute inset-0  pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle 240px at ${spot.x}% ${spot.y}%, #ffffff08, transparent 70%)`,
                }}
              />

              <input
                ref={inputRef}
                type="file"
                accept=".txt"
                className="hidden"
                onChange={(e) => analyze(e.target.files?.[0])}
              />

              {phase === "error" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff4f72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8b91b0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="relative z-10"
                  style={{ animation: "wm-pulse 2.6s ease-in-out infinite" }}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              )}

              <p
                className="relative z-10 text-base font-medium text-center"
                style={{ color: phase === "error" ? "#ff4f72" : "#e8eaf5" }}
              >
                {phase === "error" ? err : "Drop your WhatsApp chat export here"}
              </p>

              <p className="relative z-10 text-[11px] text-center text-[#6b7290] font-mono leading-relaxed">
                {phase === "error"
                  ? "Click to try again"
                  : "WhatsApp → Chat → Export Chat → Without Media (.txt)"}
              </p>

              {phase !== "error" && (
                <div className="relative z-10 mt-1 px-5 py-2.5 rounded-full text-[13px] font-medium transition-colors duration-200 bg-[#e8eaf5] text-[#0a0c11] hover:bg-white">
                  Choose file
                </div>
              )}
            </div>
          )}

          <p className="mt-4 text-center text-[11px] text-[#555c7a] font-mono">
            Processing is server-side · your data is never stored on our servers
          </p>
        </div>
      </main>

      {/* Keyframes for SVG/icon micro-animations */}
      <style>{`
        @keyframes wm-fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wm-fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wm-fadeInUpSmall {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wm-scaleIn {
          from { opacity: 0; transform: scale(0.97) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes wm-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes wm-pulse {
          0%, 100% { opacity: 0.6; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }
        @keyframes wm-draw {
          to { stroke-dashoffset: 0; }
        }
        .animate-fade-in-down {
          animation: wm-fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-up {
          animation: wm-fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }
        .animate-scale-in {
          animation: wm-scaleIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
        }
        .animate-step-text {
          animation: wm-fadeInUpSmall 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}