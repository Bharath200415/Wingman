import { useState } from "react";
import { C, Avatar } from "../ui.jsx";

const NAV_ITEMS = [
  { id: "overview",  label: "Overview",       icon: "◈" },
  { id: "response",  label: "Response Times", icon: "⏱" },
  { id: "activity",  label: "Activity",       icon: "⚡" },
  { id: "patterns",  label: "Patterns",       icon: "◎" },
  { id: "ai",        label: "AI Analyst",     icon: "✦" },
];

//Collapse toggle icon 
function CollapseIcon({ collapsed }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {collapsed ? (
        // expand — two lines pushing apart
        <>
          <rect x="2" y="3" width="5" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="2" y="7.25" width="12" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="2" y="11.5" width="12" height="1.5" rx="0.75" fill="currentColor"/>
          <path d="M9 5.5L12 3L9 0.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 2.5)"/>
        </>
      ) : (
        //collapse — panel icon
        <>
          <rect x="2" y="2" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
          <line x1="6" y1="2.7" x2="6" y2="13.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </>
      )}
    </svg>
  );
}

function NavItem({ item, active, onClick, collapsed }) {
  return (
    <button
      onClick={() => onClick(item.id)}
      title={collapsed ? item.label : undefined}
      className="relative flex items-center gap-3 rounded-xl text-sm font-medium w-full transition-all duration-200 group"
      style={{
        padding:    collapsed ? "10px 0" : "10px 12px",
        justifyContent: collapsed ? "center" : "flex-start",
        background: active ? C.surface2 : "transparent",
        color:      active ? C.gold : C.ink2,
        border:     `1px solid ${active ? C.border : "transparent"}`,
      }}
    >
      <span style={{ fontSize: 15, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>

      {!collapsed && <span className="truncate">{item.label}</span>}

      {!collapsed && item.id === "ai" && (
        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={{ background: `${C.green}20`, color: C.green, fontFamily: "'Fira Code',monospace" }}>
          AI
        </span>
      )}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <span
          className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium
                     opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{ background: C.surface3, color: C.ink, border: `1px solid ${C.border}`, boxShadow: "0 4px 12px #00000060" }}
        >
          {item.label}
          {item.id === "ai" && <span className="ml-1.5" style={{ color: C.green }}>AI</span>}
        </span>
      )}
    </button>
  );
}

function ChatItem({ chat, active, onClick, onDelete, onRename, collapsed }) {
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState(chat.name);
  const commit = () => { onRename(chat.id, name); setEditing(false); };
  const initial = chat.data?.participants?.[0] ?? "?";

  if (collapsed) {
    return (
      <button
        onClick={() => onClick(chat.id)}
        title={chat.name}
        className="relative flex items-center justify-center w-full rounded-xl py-1.5 transition-all group"
        style={{ background: active ? C.surface2 : "transparent", border: `1px solid ${active ? C.border : "transparent"}` }}
      >
        <Avatar name={initial} size={6} />
        <span
          className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium
                     opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{ background: C.surface3, color: C.ink, border: `1px solid ${C.border}`, boxShadow: "0 4px 12px #00000060" }}
        >
          {chat.name}
        </span>
      </button>
    );
  }

  return (
    <div
      onClick={() => !editing && onClick(chat.id)}
      className="group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
      style={{
        background: active ? C.surface2 : "transparent",
        border:     `1px solid ${active ? C.border : "transparent"}`,
      }}
    >
      <Avatar name={initial} size={6} />
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus value={name}
            onChange={e => setName(e.target.value)}
            onBlur={commit}
            onKeyDown={e => e.key === "Enter" && commit()}
            onClick={e => e.stopPropagation()}
            className="w-full bg-transparent text-xs outline-none"
            style={{ color: C.ink, borderBottom: `1px solid ${C.gold}` }}
          />
        ) : (
          <p className="text-xs font-medium truncate" style={{ color: active ? C.ink : C.ink2 }}>
            {chat.name}
          </p>
        )}
        <p className="text-[10px] truncate" style={{ color: C.ink3, fontFamily: "'Fira Code',monospace" }}>
          {chat.data?.participants?.slice(0, 2).join(", ")}
        </p>
      </div>
      <div className="hidden group-hover:flex gap-1 flex-shrink-0">
        <button onClick={e => { e.stopPropagation(); setEditing(true); }}
          className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
          style={{ color: C.ink3, background: C.surface3 }} title="Rename">✎</button>
        <button onClick={e => { e.stopPropagation(); onDelete(chat.id); }}
          className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
          style={{ color: C.rose, background: `${C.rose}15` }} title="Delete">✕</button>
      </div>
    </div>
  );
}

export default function Sidebar({
  chats, activeChat, activeNav,
  collapsed, onToggleCollapsed,
  onSelectChat, onSelectNav,
  onNewAnalysis, onDeleteChat, onRenameChat,
  currentParticipants,
}) {
  return (
    <aside
      className="flex flex-col flex-shrink-0 h-screen transition-all duration-300 ease-in-out overflow-hidden"
      style={{
        width:       collapsed ? 64 : 220,
        background:  C.base,
        borderRight: `1px solid ${C.border}`,
      }}
    >
      {/* ── Header: Logo + collapse toggle ── */}
      <div
        className="flex items-center flex-shrink-0 px-3 py-3"
        style={{
          borderBottom:   `1px solid ${C.border}`,
          justifyContent: collapsed ? "center" : "space-between",
          minHeight:       56,
        }}
      >
        {/* Logo — hidden when collapsed */}
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[11px] flex-shrink-0"
              style={{ background: `linear-gradient(135deg,${C.gold},#f59e0b)`, color: C.base, fontFamily: "'Cabinet Grotesk',sans-serif" }}
            >
              WM
            </div>
            <span className="text-base font-black whitespace-nowrap overflow-hidden"
              style={{ fontFamily: "'Cabinet Grotesk',sans-serif", color: C.ink }}>
              Wing<span style={{ color: C.gold }}>man</span>
            </span>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapsed}
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:opacity-80"
          style={{ background: C.surface2, color: C.ink2, border: `1px solid ${C.border}` }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <CollapseIcon collapsed={collapsed} />
        </button>
      </div>

      {/* ── Participants ── */}
      {!collapsed && currentParticipants?.length > 0 && (
        <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${C.border}` }}>
          <p className="text-[9px] uppercase tracking-widest mb-2"
            style={{ color: C.ink3, fontFamily: "'Fira Code',monospace" }}>
            Participants
          </p>
          {currentParticipants.slice(0, 4).map(p => (
            <div key={p} className="flex items-center gap-2 py-0.5">
              <Avatar name={p} size={5} />
              <span className="text-[11px] truncate" style={{ color: C.ink2 }}>
                {p.length > 18 ? p.slice(0, 16) + "…" : p}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Collapsed: participant avatars stacked */}
      {collapsed && currentParticipants?.length > 0 && (
        <div className="flex flex-col items-center gap-1 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${C.border}` }}>
          {currentParticipants.slice(0, 3).map(p => (
            <div key={p} title={p}>
              <Avatar name={p} size={6} />
            </div>
          ))}
        </div>
      )}

      {/* ── Nav items ── */}
      {activeChat && (
        <nav className="flex flex-col gap-0.5 flex-shrink-0 px-2 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
          {NAV_ITEMS.map(n => (
            <NavItem key={n.id} item={n} active={activeNav === n.id} onClick={onSelectNav} collapsed={collapsed} />
          ))}
        </nav>
      )}

      {/* ── Saved chats ── */}
      <div className="flex-1 overflow-y-auto px-2 py-2 min-h-0">
        {!collapsed && (
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[9px] uppercase tracking-widest"
              style={{ color: C.ink3, fontFamily: "'Fira Code',monospace" }}>
              Saved Chats
            </p>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full"
              style={{ background: C.surface2, color: C.ink3, fontFamily: "'Fira Code',monospace" }}>
              {chats.length}
            </span>
          </div>
        )}

        {chats.length === 0 && !collapsed && (
          <p className="text-[10px] text-center py-6 px-2 leading-relaxed"
            style={{ color: C.ink3, fontFamily: "'Fira Code',monospace" }}>
            No saved chats yet.
          </p>
        )}

        <div className="flex flex-col gap-0.5">
          {chats.map(c => (
            <ChatItem
              key={c.id} chat={c}
              active={c.id === activeChat}
              collapsed={collapsed}
              onClick={onSelectChat}
              onDelete={onDeleteChat}
              onRename={onRenameChat}
            />
          ))}
        </div>
      </div>

      {/* ── New Analysis button ── */}
      <div
        className="flex-shrink-0 p-3"
        style={{ borderTop: `1px solid ${C.border}` }}
      >
        {collapsed ? (
          <button
            onClick={onNewAnalysis}
            title="New Analysis"
            className="w-full h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg,${C.gold},#f59e0b)`, color: C.base }}
          >
            <span className="text-base font-bold leading-none">+</span>
          </button>
        ) : (
          <button
            onClick={onNewAnalysis}
            className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg,${C.gold},#f59e0b)`, color: C.base, fontFamily: "'Cabinet Grotesk',sans-serif" }}
          >
            + New Analysis
          </button>
        )}
      </div>
    </aside>
  );
}

export { NAV_ITEMS };