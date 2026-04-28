import { C, Chip } from "../ui.jsx";
import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "../icons.jsx";

const NAV_LABELS = {
  overview: "Overview",
  response: "Response Times",
  activity: "Activity",
  patterns: "Patterns",
  ai:       "AI Analyst",
};
 


export default function TopBar({ activeNav, participants, totalMessages, onMenuToggle }) {
 const [darkMode,setDarkMode]=useState(
    localStorage.getItem("theme") !== "light"
  );

  useEffect(()=>{
    if(darkMode){
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme","dark");
    }else{
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme","light");
    }
  },[darkMode]);
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
          <p className="text-[10px] leading-none mb-0.5 dark:text-white dark:text-2xl" style={{ fontFamily:"'Fira Code',monospace" }}>
            Dashboard / {NAV_LABELS[activeNav]}
          </p>
          <h2 className="text-lg font-black leading-tight" style={{ fontFamily:"'Cabinet Grotesk',sans-serif" }}>
            {NAV_LABELS[activeNav]}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end">
      <button
      onClick={()=>setDarkMode(!darkMode)}
      className="
      cursor-pointer
      w-8 h-8
      rounded-md
      dark:border-neutral-800
      flex items-center justify-center
      "
      >
      {darkMode ? (
        <SunIcon className="w-4 h-4 text-neutral-500" />
      ) : (
        <MoonIcon className="w-4 h-4 text-neutral-500" />
      )}
      </button>
        {participants?.slice(0,3).map(p => (
          <Chip key={p} gold>{p.length > 12 ? p.slice(0,10)+"…" : p}</Chip>
        ))}
        <Chip>{Number(totalMessages).toLocaleString()} msgs</Chip>
      </div>
    </header>
  );
}
