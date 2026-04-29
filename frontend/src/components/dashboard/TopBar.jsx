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
      className="flex shadow-sm
      dark:shadow-none shadow-neutral-200 first-letter:items-center justify-between px-5 py-3 bg-background/60 sticky top-0 z-20 h-16 shrink-0 gap-2 backdrop-blur-md md:h-14"
    >
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden h-10 rounded-xl flex items-center text-lg justify-center"
          style={{ color: C.ink2 }}
        >
          ☰
        </button>
        <div>
          <p className="text-neutral-900 text-md lg:text-lg  mb-0.5 dark:text-white flex ">
          <span className="hidden md:flex text-neutral-400 dark:text-neutral-200">Dashboard /</span>  {NAV_LABELS[activeNav]}
          </p>
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
        <div className="hidden sm:flex items-center gap-2">
          {participants?.slice(0,3).map(p => (
            <Chip key={p} gold>{p.length > 12 ? p.slice(0,10)+"…" : p}</Chip>
          ))}

        </div>
        <Chip className="text-white">{Number(totalMessages).toLocaleString()} msgs</Chip>
        
      </div>
    </header>
  );
} 
