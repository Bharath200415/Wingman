// ── Design tokens ────────────────────────────────────────
export const C = {
  base: "#0d0f14",
  surface: "#13161e",
  surface2: "#1a1e2a",
  surface3: "#21263a",
  border: "#1f2535",
  border2: "#2a3050",
  gold: "#f5c842",
  goldDim: "#f5c84215",
  goldMid: "#f5c84240",
  green: "#10d9a0",
  greenDim: "#10d9a015",
  rose: "#ff4f72",
  sky: "#38b6ff",
  ink: "#e8eaf5",
  ink2: "#8b91b0",
  ink3: "#555c7a",
};

export const CHART_COLORS = [
  "#f5c842", "#10d9a0", "#38b6ff", "#ff4f72",
  "#a78bfa", "#fb923c", "#34d399", "#f472b6",
];

// ── Tiny reusable components ──────────────────────────────
export function Card({ children, className = "", style = {} }) {
  return (
    <div className={`rounded-2xl py-1 bg-gradient-to-t from-neutral-100 px-2 to-neutral-50 border border-neutral-200 shadow-sm dark:from-neutral-950 dark:to-neutral-900 dark:border-neutral-800 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, badge, children }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b dark:border-neutral-600/60 border-neutral-200">
      <span className="text-md font-semibold text-neutral-950 dark:text-neutral-200">{title}</span>
      {badge && (
        <span className="text-[10px] px-2 py-1 rounded-md bg-neutral-200 text-neutral-600 dark:bg-gray-800 dark:text-white" style={{ fontFamily: "'Fira Code',monospace" }}>{badge}</span>
      )}
      {children}
    </div>
  );
}

export function Chip({ children, gold, className = "" }) {
  // If the caller provided an explicit text color (e.g. `text-white`),
  // avoid setting an inline `color` which would override that class.
  const hasTextClass = /(^|\s)text-[^\s]+/.test(className);
  const style = {
    background: gold ? C.goldDim : C.surface2,
    border: `1px solid ${gold ? C.goldMid : C.border}`,
    ...(hasTextClass ? {} : { color: gold ? C.gold : C.ink2 }),
  };

  return (
    <span className={`text-xs px-3 py-1 rounded-full ${className}`} style={style}>
      {children}
    </span>
  );
}
export function Avatar({ name, size = 30, single = false }) {
  const s = `${size}px`;
  const iconSize = single ? Math.round(size * 1.8) : Math.round(size * 0.8);
  return (
    <div
      className="flex items-center justify-center font-bold text-amber-600 bg-neutral-600/40 dark:text-amber-400 rounded-full overflow-hidden"
      style={{ width: "31px"
        , height: "31px" }}
    >
      {single ? (
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24">
          <title>user</title>
          <g fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M2 11C2 5.47723 6.47723 1 12 1C17.5228 1 22 5.47723 22 11C22 16.5228 17.5228 21 12 21C6.47723 21 2 16.5228 2 11Z" fill="url(#user_existing_0)" mask="url(#user_mask)"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M2 11C2 5.47723 6.47723 1 12 1C17.5228 1 22 5.47723 22 11C22 16.5228 17.5228 21 12 21C6.47723 21 2 16.5228 2 11Z" fill="url(#user_existing_0)" filter="url(#user_filter)" clipPath="url(#user_clipPath)"></path>
            <path d="M12.4414 14C16.3397 14.0001 19.4999 17.1603 19.5 21.0586C19.5 22.1307 18.6307 23 17.5586 23H6.44141C5.36932 23 4.5 22.1307 4.5 21.0586C4.50012 17.1603 7.6603 14.0001 11.5586 14H12.4414ZM12 5C13.933 5 15.5 6.567 15.5 8.5C15.5 10.433 13.933 12 12 12C10.067 12 8.5 10.433 8.5 8.5C8.5 6.567 10.067 5 12 5Z" fill="url(#user_existing_1)"></path>
            <path d="M17.5586 22.25V23H6.44141V22.25H17.5586ZM18.75 21.0586C18.7499 17.5745 15.9255 14.7501 12.4414 14.75H11.5586C8.07451 14.7501 5.25012 17.5745 5.25 21.0586C5.25 21.7165 5.78354 22.25 6.44141 22.25V23L6.24316 22.9902C5.26408 22.891 4.5 22.0638 4.5 21.0586C4.50012 17.1603 7.6603 14.0001 11.5586 14H12.4414L12.8047 14.0088C16.5342 14.198 19.4999 17.2821 19.5 21.0586C19.5 22.1307 18.6307 23 17.5586 23V22.25C18.2165 22.25 18.75 21.7165 18.75 21.0586Z" fill="url(#user_existing_2)"></path>
            <path d="M14.75 8.5C14.75 6.98122 13.5188 5.75 12 5.75C10.4812 5.75 9.25 6.98122 9.25 8.5C9.25 10.0188 10.4812 11.25 12 11.25V12C10.067 12 8.5 10.433 8.5 8.5C8.5 6.567 10.067 5 12 5C13.933 5 15.5 6.567 15.5 8.5C15.5 10.433 13.933 12 12 12V11.25C13.5188 11.25 14.75 10.0188 14.75 8.5Z" fill="url(#user_existing_3)"></path>
            <defs>
              <linearGradient id="user_existing_0" x1="12" y1="1" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#575757"></stop>
                <stop offset="1" stopColor="#151515"></stop>
              </linearGradient>
              <linearGradient id="user_existing_1" x1="12" y1="5" x2="12" y2="23" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E3E3E5" stopOpacity=".6"></stop>
                <stop offset="1" stopColor="#BBBBC0" stopOpacity=".6"></stop>
              </linearGradient>
              <linearGradient id="user_existing_2" x1="12" y1="14" x2="12" y2="19.212" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stop-opacity="0"></stop>
              </linearGradient>
              <linearGradient id="user_existing_3" x1="12" y1="5" x2="12" y2="9.054" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stop-opacity="0"></stop>
              </linearGradient>
              <filter id="user_filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
              </filter>
              <clipPath id="user_clipPath">
                <path d="M12.4414 14C16.3397 14.0001 19.4999 17.1603 19.5 21.0586C19.5 22.1307 18.6307 23 17.5586 23H6.44141C5.36932 23 4.5 22.1307 4.5 21.0586C4.50012 17.1603 7.6603 14.0001 11.5586 14H12.4414ZM12 5C13.933 5 15.5 6.567 15.5 8.5C15.5 10.433 13.933 12 12 12C10.067 12 8.5 10.433 8.5 8.5C8.5 6.567 10.067 5 12 5Z" fill="url(#user_existing_1)"></path>
              </clipPath>
              <mask id="user_mask">
                <rect width="100%" height="100%" fill="#FFF"></rect>
                <path d="M12.4414 14C16.3397 14.0001 19.4999 17.1603 19.5 21.0586C19.5 22.1307 18.6307 23 17.5586 23H6.44141C5.36932 23 4.5 22.1307 4.5 21.0586C4.50012 17.1603 7.6603 14.0001 11.5586 14H12.4414ZM12 5C13.933 5 15.5 6.567 15.5 8.5C15.5 10.433 13.933 12 12 12C10.067 12 8.5 10.433 8.5 8.5C8.5 6.567 10.067 5 12 5Z" fill="#000"></path>
              </mask>
            </defs>
          </g>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24">
          <title>users</title>
          <g fill="none">
            <path d="M15.9414 10C19.8397 10.0001 22.9999 13.1603 23 17.0586C23 18.1307 22.1307 19 21.0586 19H9.94141C8.86932 19 8 18.1307 8 17.0586C8.00012 13.1603 11.1603 10.0001 15.0586 10H15.9414ZM15.5 1C17.433 1 19 2.567 19 4.5C19 6.433 17.433 8 15.5 8C13.567 8 12 6.433 12 4.5C12 2.567 13.567 1 15.5 1Z" fill="url(#users_existing_0)" mask="url(#users_mask)"></path>
            <path d="M15.9414 10C19.8397 10.0001 22.9999 13.1603 23 17.0586C23 18.1307 22.1307 19 21.0586 19H9.94141C8.86932 19 8 18.1307 8 17.0586C8.00012 13.1603 11.1603 10.0001 15.0586 10H15.9414ZM15.5 1C17.433 1 19 2.567 19 4.5C19 6.433 17.433 8 15.5 8C13.567 8 12 6.433 12 4.5C12 2.567 13.567 1 15.5 1Z" fill="url(#users_existing_0)" filter="url(#users_filter)" clipPath="url(#users_clipPath)"></path>
            <path d="M10.3076 12C14.556 12 18 15.444 18 19.6924C18 20.9668 16.9668 22 15.6924 22H4.30762C3.03317 22 2.00004 20.9668 2 19.6924C2 15.444 5.44404 12 9.69238 12H10.3076ZM10 2C12.2091 2 14 3.79086 14 6C14 8.20914 12.2091 10 10 10C7.79086 10 6 8.20914 6 6C6 3.79086 7.79086 2 10 2Z" fill="url(#users_existing_1)" data-glass="blur"></path>
            <path d="M13.25 6C13.25 4.20507 11.7949 2.75 10 2.75C8.20507 2.75 6.75 4.20507 6.75 6C6.75 7.79493 8.20507 9.25 10 9.25V10C7.79086 10 6 8.20914 6 6C6 3.79086 7.79086 2 10 2C12.2091 2 14 3.79086 14 6C14 8.20914 12.2091 10 10 10V9.25C11.7949 9.25 13.25 7.79493 13.25 6Z" fill="url(#users_existing_2)"></path>
            <path d="M15.6924 21.25V22H4.30762V21.25H15.6924ZM17.25 19.6924C17.25 15.8583 14.1417 12.75 10.3076 12.75H9.69238C5.85825 12.75 2.75 15.8583 2.75 19.6924C2.75004 20.5526 3.44739 21.25 4.30762 21.25V22C3.11295 22 2.13009 21.0921 2.01172 19.9287L2 19.6924C2 15.5767 5.23229 12.2156 9.29688 12.0098L9.69238 12H10.3076C14.556 12 18 15.444 18 19.6924L17.9883 19.9287C17.8778 21.0145 17.0145 21.8778 15.9287 21.9883L15.6924 22V21.25C16.5526 21.25 17.25 20.5526 17.25 19.6924Z" fill="url(#users_existing_3)"></path>
            <defs>
              <linearGradient id="users_existing_0" x1="15.5" y1="1" x2="15.5" y2="19" gradientUnits="userSpaceOnUse">
                <stop stopColor="#575757"></stop>
                <stop offset="1" stopColor="#151515"></stop>
              </linearGradient>
              <linearGradient id="users_existing_1" x1="10" y1="2" x2="10" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E3E3E5" stopOpacity=".6"></stop>
                <stop offset="1" stopColor="#BBBBC0" stopOpacity=".6"></stop>
              </linearGradient>
              <linearGradient id="users_existing_2" x1="10" y1="2" x2="10" y2="6.633" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stop-opacity="0"></stop>
              </linearGradient>
              <linearGradient id="users_existing_3" x1="10" y1="12" x2="10" y2="17.791" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stop-opacity="0"></stop>
              </linearGradient>
              <filter id="users_filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
              </filter>
              <clipPath id="users_clipPath">
                <path d="M10.3076 12C14.556 12 18 15.444 18 19.6924C18 20.9668 16.9668 22 15.6924 22H4.30762C3.03317 22 2.00004 20.9668 2 19.6924C2 15.444 5.44404 12 9.69238 12H10.3076ZM10 2C12.2091 2 14 3.79086 14 6C14 8.20914 12.2091 10 10 10C7.79086 10 6 8.20914 6 6C6 3.79086 7.79086 2 10 2Z" fill="url(#users_existing_1)"></path>
              </clipPath>
              <mask id="users_mask">
                <rect width="100%" height="100%" fill="#FFF"></rect>
                <path d="M10.3076 12C14.556 12 18 15.444 18 19.6924C18 20.9668 16.9668 22 15.6924 22H4.30762C3.03317 22 2.00004 20.9668 2 19.6924C2 15.444 5.44404 12 9.69238 12H10.3076ZM10 2C12.2091 2 14 3.79086 14 6C14 8.20914 12.2091 10 10 10C7.79086 10 6 8.20914 6 6C6 3.79086 7.79086 2 10 2Z" fill="#000"></path>
              </mask>
            </defs>
          </g>
        </svg>
      )}
    </div>
  );
}

// Tooltip for Recharts
export function ChartTooltip({ active, payload, label, unit = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: C.surface3, border: `1px solid ${C.border2}`, color: C.ink }}>
      {label && <p className="mb-1 font-semibold" style={{ color: C.ink2 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || C.gold }}>
          {p.name}: <strong>{p.value}{unit}</strong>
        </p>
      ))}
    </div>
  );
}
