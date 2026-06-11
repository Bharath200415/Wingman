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
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5c842" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    label: "P50/P90/P99",
    sub: "Response latency"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10d9a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
    label: "Heatmaps",
    sub: "Activity patterns"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38b6ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    label: "AI Analyst",
    sub: "Ask anything"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    ),
    label: "Saved Chats",
    sub: "localStorage"
  },
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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#0d0f14] text-[#e8eaf5]">

      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: `linear-gradient(#1f2535 1px, transparent 1px), linear-gradient(90deg, #1f2535 1px, transparent 1px)`,
        backgroundSize: "48px 48px"
      }} />

      <div className="relative z-10 w-full max-w-md flex flex-col gap-8">

        {/* Brand */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3 justify-center">
            {/* Same square-chart-line icon as Sidebar, scaled up for the brand header */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#13161e] border border-[#1f2535] shadow-sm flex-shrink-0 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <title>square-chart-line</title>
                <g fill="none">
                  <path d="M3 8.4C3 6.15979 3 5.03968 3.43597 4.18404C3.81947 3.43139 4.43139 2.81947 5.18404 2.43597C6.03968 2 7.15979 2 9.4 2H14.6C16.8402 2 17.9603 2 18.816 2.43597C19.5686 2.81947 20.1805 3.43139 20.564 4.18404C21 5.03968 21 6.15979 21 8.4V11.6C21 13.8402 21 14.9603 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C17.9603 18 16.8402 18 14.6 18H9.4C7.15979 18 6.03968 18 5.18404 17.564C4.43139 17.1805 3.81947 16.5686 3.43597 15.816C3 14.9603 3 13.8402 3 11.6V8.4Z" fill="url(#upload_square-chart-line_existing_0)" data-glass="origin" mask="url(#upload_square-chart-line_mask)"></path>
                  <path d="M3 8.4C3 6.15979 3 5.03968 3.43597 4.18404C3.81947 3.43139 4.43139 2.81947 5.18404 2.43597C6.03968 2 7.15979 2 9.4 2H14.6C16.8402 2 17.9603 2 18.816 2.43597C19.5686 2.81947 20.1805 3.43139 20.564 4.18404C21 5.03968 21 6.15979 21 8.4V11.6C21 13.8402 21 14.9603 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C17.9603 18 16.8402 18 14.6 18H9.4C7.15979 18 6.03968 18 5.18404 17.564C4.43139 17.1805 3.81947 16.5686 3.43597 15.816C3 14.9603 3 13.8402 3 11.6V8.4Z" fill="url(#upload_square-chart-line_existing_0)" data-glass="clone" filter="url(#upload_square-chart-line_filter)" clip-path="url(#upload_square-chart-line_clipPath)"></path>
                  <path d="M9.7666 9.87523C9.48873 9.39536 8.87716 9.21774 8.3916 9.48558L3.55455 12.1452C2.59573 12.6724 2 13.6798 2 14.774V16.5998V16.6031C2 18.8398 2 18.9605 2.43555 19.8157C2.81896 20.5681 3.43117 21.1802 4.18359 21.5637C5.03924 21.9997 6.16018 22.0002 8.40039 22.0002H15.5996C17.8398 22.0002 18.9608 21.9997 19.8164 21.5637C20.5688 21.1802 21.181 20.5681 21.5645 19.8157C22 18.9605 22 17.8408 22 15.6031V15.5998V10.6428C21.9999 9.89353 21.2089 9.41219 20.5488 9.76683C18.0694 11.099 14.7916 12.9434 13.2812 13.7971C12.8177 14.0591 12.2304 13.9141 11.9473 13.4631C11.3884 12.5728 10.4754 11.0997 9.7666 9.87523Z" fill="url(#upload_square-chart-line_existing_1)" data-glass="blur"></path>
                  <path d="M15.5996 21.2502V22.0002H8.40039V21.2502H15.5996ZM21.25 15.6028V10.6428C21.2499 10.45 21.0543 10.3468 20.9033 10.428C18.4318 11.7559 15.1607 13.5968 13.6504 14.4504C12.8422 14.9072 11.8113 14.6562 11.3125 13.8616C10.7527 12.9697 9.83302 11.4877 9.11719 10.2512C9.03879 10.1159 8.87716 10.0762 8.75391 10.1418L8.75293 10.1428L3.91602 12.802C3.19701 13.1973 2.75013 13.9532 2.75 14.7737V15.6028C2.75 16.734 2.75039 17.5383 2.80176 18.1672C2.8524 18.7868 2.94873 19.1707 3.10352 19.4748C3.41499 20.0861 3.91297 20.5841 4.52441 20.8957C4.82888 21.0508 5.21342 21.1467 5.83398 21.1975C6.46353 21.249 7.26801 21.2502 8.40039 21.2502V22.0002L6.91699 21.9934C5.72503 21.9745 4.96098 21.9042 4.34766 21.6409L4.18359 21.5637C3.52521 21.2281 2.97417 20.7176 2.58984 20.091L2.43555 19.8157C2 18.9605 2 17.8404 2 15.6028V14.7737C2.00012 13.748 2.5235 12.7983 3.37891 12.2493L3.55469 12.1448L8.3916 9.48558C8.87716 9.21774 9.48873 9.39536 9.7666 9.87523C10.4754 11.0997 11.3884 12.5728 11.9473 13.4631C12.2128 13.8861 12.7457 14.0397 13.1934 13.841L13.2812 13.7971C14.4141 13.1568 16.5412 11.959 18.5801 10.8381L20.5488 9.76683C21.2089 9.41219 21.9999 9.89353 22 10.6428V15.6028C22 17.8404 22 18.9605 21.5645 19.8157L21.4102 20.091C21.0258 20.7176 20.4748 21.2281 19.8164 21.5637L19.6523 21.6409C18.816 22 17.6995 22.0002 15.5996 22.0002V21.2502C16.732 21.2502 17.5365 21.249 18.166 21.1975C18.7866 21.1467 19.1711 21.0508 19.4756 20.8957C20.087 20.5841 20.585 20.0861 20.8965 19.4748C21.0513 19.1707 21.1476 18.7868 21.1982 18.1672C21.2496 17.5383 21.25 16.734 21.25 15.6028Z" fill="url(#upload_square-chart-line_existing_2)"></path>
                  <defs>
                    <linearGradient id="upload_square-chart-line_existing_0" x1="12" y1="2" x2="12" y2="18" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#575757"></stop>
                      <stop offset="1" stop-color="#151515"></stop>
                    </linearGradient>
                    <linearGradient id="upload_square-chart-line_existing_1" x1="12" y1="9.361" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#E3E3E5" stop-opacity=".6"></stop>
                      <stop offset="1" stop-color="#BBBBC0" stop-opacity=".6"></stop>
                    </linearGradient>
                    <linearGradient id="upload_square-chart-line_existing_2" x1="12" y1="9.361" x2="12" y2="16.68" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#fff"></stop>
                      <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
                    </linearGradient>
                    <filter id="upload_square-chart-line_filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
                      <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
                    </filter>
                    <clipPath id="upload_square-chart-line_clipPath">
                      <path d="M9.7666 9.87523C9.48873 9.39536 8.87716 9.21774 8.3916 9.48558L3.55455 12.1452C2.59573 12.6724 2 13.6798 2 14.774V16.5998V16.6031C2 18.8398 2 18.9605 2.43555 19.8157C2.81896 20.5681 3.43117 21.1802 4.18359 21.5637C5.03924 21.9997 6.16018 22.0002 8.40039 22.0002H15.5996C17.8398 22.0002 18.9608 21.9997 19.8164 21.5637C20.5688 21.1802 21.181 20.5681 21.5645 19.8157C22 18.9605 22 17.8408 22 15.6031V15.5998V10.6428C21.9999 9.89353 21.2089 9.41219 20.5488 9.76683C18.0694 11.099 14.7916 12.9434 13.2812 13.7971C12.8177 14.0591 12.2304 13.9141 11.9473 13.4631C11.3884 12.5728 10.4754 11.0997 9.7666 9.87523Z" fill="url(#upload_square-chart-line_existing_1)"></path>
                    </clipPath>
                    <mask id="upload_square-chart-line_mask">
                      <rect width="100%" height="100%" fill="#FFF"></rect>
                      <path d="M9.7666 9.87523C9.48873 9.39536 8.87716 9.21774 8.3916 9.48558L3.55455 12.1452C2.59573 12.6724 2 13.6798 2 14.774V16.5998V16.6031C2 18.8398 2 18.9605 2.43555 19.8157C2.81896 20.5681 3.43117 21.1802 4.18359 21.5637C5.03924 21.9997 6.16018 22.0002 8.40039 22.0002H15.5996C17.8398 22.0002 18.9608 21.9997 19.8164 21.5637C20.5688 21.1802 21.181 20.5681 21.5645 19.8157C22 18.9605 22 17.8408 22 15.6031V15.5998V10.6428C21.9999 9.89353 21.2089 9.41219 20.5488 9.76683C18.0694 11.099 14.7916 12.9434 13.2812 13.7971C12.8177 14.0591 12.2304 13.9141 11.9473 13.4631C11.3884 12.5728 10.4754 11.0997 9.7666 9.87523Z" fill="#000"></path>
                    </mask>
                  </defs>
                </g>
              </svg>
            </div>
            <h1 className="text-4xl font-medium tracking-tight text-white" style={{ fontFamily: "'Lastik', serif" }}>
              Wingman
            </h1>
          </div>
          <p className="text-xs text-[#8b91b0] font-mono tracking-wider">
            12 brutal charts · 1 AI analyst · drop your export
          </p>
        </div>

        {/* Drop zone / loader */}
        {phase === "loading" ? (
          <div className="rounded-2xl p-8 flex flex-col items-center gap-5 bg-[#13161e] border border-[#1f2535] shadow-sm text-[#e8eaf5]">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border border-[#1f2535]" />
            </div>
            <p className="text-sm font-medium text-amber-500 font-mono">
              {STEPS[step]}
            </p>
            <div className="w-full h-1.5 rounded-full overflow-hidden bg-[#1a1e2a] border border-[#1f2535]">
              <div className="h-full rounded-full transition-all duration-700 bg-amber-500"
                style={{ width:`${((step+1)/STEPS.length)*100}%` }} />
            </div>
            <p className="text-[11px] text-[#8b91b0] font-mono">
              30–60s depending on chat size
            </p>
          </div>
        ) : (
          <div
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);analyze(e.dataTransfer.files[0]);}}
            onClick={()=>inputRef.current?.click()}
            className="rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-4 cursor-pointer transition-all duration-200 bg-[#13161e] text-[#e8eaf5] hover:bg-[#1a1e2a] shadow-sm"
            style={{
              borderColor: phase==="error" ? "rgba(239, 68, 68, 0.5)" : drag ? "#f5c842" : "#1f2535",
            }}>
            <input ref={inputRef} type="file" accept=".txt" className="hidden" onChange={e=>analyze(e.target.files[0])} />
            {phase === "error" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff4f72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f5c842" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-1 opacity-80">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            )}
            <p className="text-lg font-medium text-center" style={{ color: phase==="error" ? "rgb(239, 68, 68)" : undefined }}>
              {phase==="error" ? err : "Drop your WhatsApp chat export"}
            </p>
            <p className="text-[11px] text-center text-[#8b91b0] font-mono">
              {phase==="error" ? "Click to try again" : "WhatsApp → Chat → Export Chat → Without Media (.txt)"}
            </p>
            {phase !== "error" && (
              <div className="mt-1 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5c84215] text-[#f5c842] border border-[#f5c84240] hover:bg-[#f5c84230] shadow-sm">
                Choose File
              </div>
            )}
          </div>
        )}

        {/* Feature pills */}
        {phase !== "loading" && (
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map(f => (
              <div key={f.label} className="flex items-center gap-3 rounded-xl px-4 py-3 bg-[#13161e] border border-[#1f2535] shadow-sm hover:bg-[#1a1e2a] transition-all duration-200 text-[#e8eaf5]">
                <span className="flex items-center justify-center filter drop-shadow-sm">{f.icon}</span>
                <div>
                  <p className="text-xs font-semibold">{f.label}</p>
                  <p className="text-[10px] text-[#8b91b0] font-mono">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-[10px] text-[#555c7a] font-mono">
          Processing is server-side · your data is never stored on our servers
        </p>
      </div>
    </div>
  );
}
