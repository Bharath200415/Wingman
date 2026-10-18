import { C } from "../ui.jsx";
import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "../icons.jsx";

const NAV_LABELS = {
  overview: "Overview",
  response: "Response Times",
  activity: "Activity",
  patterns: "Patterns",
  ai: "AI Analyst",
};


export default function TopBar({ activeNav, participants, totalMessages, onMenuToggle }) {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = (e) => {
    if (!document.startViewTransition) {
      setDarkMode(!darkMode);
      return;
    }
    const x = e.clientX || window.innerWidth / 2;
    const y = e.clientY || window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setDarkMode(!darkMode);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 400,
          easing: "ease-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

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
            <span className="hidden md:flex text-neutral-400 dark:text-neutral-500 mr-1.5">Dashboard /</span>  {NAV_LABELS[activeNav]}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
          className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center transition-[background-color,transform] duration-150 hover:bg-neutral-100 active:scale-[0.94] dark:hover:bg-white/[0.06]"
        >
          {darkMode ? (
            <SunIcon className="w-4 h-4 text-neutral-500" />
          ) : (
            <MoonIcon className="w-4 h-4 text-neutral-500" />
          )}
        </button>
        <ChatBadge participants={participants ?? []} totalMessages={totalMessages} />

      </div>
    </header>
  );
}

function participantLabel(participants) {
  const first = participants.map(p => p.split(" ")[0]);
  if (participants.length === 2) return `${participants[0]} & ${participants[1]}`;
  if (participants.length > 2) return `${first[0]} + ${participants.length - 1} others`;
  return participants[0] ?? "";
}

function ChatBadge({ participants, totalMessages }) {
  const label = participantLabel(participants);
  return (
    <div className="flex items-center h-9 rounded-full border border-neutral-200 bg-white/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-none">
      {participants.length > 0 && (
        <div className="hidden sm:flex items-center gap-2.5 pl-1.5 pr-3.5 h-full" title={participants.join(", ")}>
          <div className="flex -space-x-1.5">
            {participants.slice(0, 3).map(p => (
              <span
                key={p}
                className="w-6 h-6 rounded-full grid place-items-center text-[10.5px] font-semibold uppercase ring-2 ring-white bg-gradient-to-b from-neutral-100 to-neutral-200 text-neutral-600 dark:ring-neutral-950 dark:from-neutral-700 dark:to-neutral-800 dark:text-neutral-200"
              >
                {p.trim()[0]}
              </span>
            ))}
          </div>
          <span className="text-[13px] text-neutral-700 dark:text-neutral-200 max-w-[220px] truncate">{label}</span>
        </div>
      )}
      <span className="hidden sm:block w-px h-4 bg-neutral-200 dark:bg-white/[0.1]" />
      <span className="flex items-baseline gap-1.5 px-3.5 text-[13px]">
        <span className="font-medium tabular-nums text-neutral-900 dark:text-neutral-50">{Number(totalMessages).toLocaleString()}</span>
        <span className="text-neutral-500">messages</span>
      </span>
    </div>
  );
}
