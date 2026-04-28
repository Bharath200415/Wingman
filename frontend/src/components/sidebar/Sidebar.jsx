import { useState } from "react";
import { C, Avatar } from "../ui.jsx";

const NAV_ITEMS = [
  { id: "overview",  label: "Overview",       icon: "◈" },
  { id: "response",  label: "Response Times", icon: "⏱" },
  { id: "activity",  label: "Activity",       icon: "⚡" },
  { id: "patterns",  label: "Patterns",       icon: "◎" },
  { id: "ai",        label: "AI Analyst",     icon: "✦" },
];

function NavItem({ item, active, onClick }) {
  return (
    <button
      onClick={() => onClick(item.id)}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all"
      style={{
        background: active ? C.surface2 : "transparent",
        color:      active ? C.gold : C.ink2,
        border:     `1px solid ${active ? C.border : "transparent"}`,
      }}
    >
      <span style={{ fontSize: 13 }}>{item.icon}</span>
      <span>{item.label}</span>
      {item.id === "ai" && (
        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full"
          style={{ background: `${C.green}20`, color: C.green, fontFamily:"'Fira Code',monospace" }}>
          AI
        </span>
      )}
    </button>
  );
}

function ChatItem({ chat, active, onClick, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState(chat.name);

  const commit = () => { onRename(chat.id, name); setEditing(false); };

  return (
    <div
      onClick={() => !editing && onClick(chat.id)}
      className="group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
      style={{
        background: active ? C.surface2 : "transparent",
        border:     `1px solid ${active ? C.border : "transparent"}`,
      }}
    >
      <Avatar name={chat.data?.participants?.[0] ?? "?"} size={6} />
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={commit}
            onKeyDown={e => e.key === "Enter" && commit()}
            onClick={e => e.stopPropagation()}
            className="w-full bg-transparent text-xs outline-none"
            style={{ color: C.ink, borderBottom:`1px solid ${C.gold}` }}
          />
        ) : (
          <p className="text-xs font-medium truncate" style={{ color: active ? C.ink : C.ink2 }}>
            {chat.name}
          </p>
        )}
        <p className="text-[10px] truncate" style={{ color: C.ink3, fontFamily:"'Fira Code',monospace" }}>
          {chat.data?.participants?.slice(0,2).join(", ")}
        </p>
      </div>
      {/* Action buttons — show on hover */}
      <div className="hidden group-hover:flex gap-1 flex-shrink-0">
        <button
          onClick={e => { e.stopPropagation(); setEditing(true); }}
          className="w-5 h-5 rounded flex items-center justify-center text-[10px] transition-all"
          style={{ color: C.ink3, background: C.surface3 }}
          title="Rename"
        >✎</button>
        <button
          onClick={e => { e.stopPropagation(); onDelete(chat.id); }}
          className="w-5 h-5 rounded flex items-center justify-center text-[10px] transition-all"
          style={{ color: C.rose, background: `${C.rose}15` }}
          title="Delete"
        >✕</button>
      </div>
    </div>
  );
}

export default function Sidebar({
  chats, activeChat, activeNav,
  onSelectChat, onSelectNav,
  onNewAnalysis, onDeleteChat, onRenameChat,
  currentParticipants,
}) {
  return (
    <aside
      className="flex flex-col flex-shrink-0 h-screen"
      style={{ width: 220, background: C.base, borderRight:`1px solid ${C.border}` }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom:`1px solid ${C.border}` }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0"
          style={{ background:`linear-gradient(135deg,${C.gold},#f59e0b)`, color: C.base, fontFamily:"'Cabinet Grotesk',sans-serif" }}>
          WM
        </div>
        <span className="text-lg font-black" style={{ fontFamily:"'Cabinet Grotesk',sans-serif", color: C.ink }}>
          Wing<span style={{ color: C.gold }}>man</span>
        </span>
      </div>

      {/* Current participants (when a chat is open) */}
      {currentParticipants?.length > 0 && (
        <div className="px-4 py-3" style={{ borderBottom:`1px solid ${C.border}` }}>
          <p className="text-[9px] uppercase tracking-widest mb-2" style={{ color: C.ink3, fontFamily:"'Fira Code',monospace" }}>
            Participants
          </p>
          {currentParticipants.slice(0,4).map(p => (
            <div key={p} className="flex items-center gap-2 py-0.5">
              <Avatar name={p} size={5} />
              <span className="text-[11px] truncate" style={{ color: C.ink2 }}>
                {p.length > 18 ? p.slice(0,16)+"…" : p}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Nav */}
      {activeChat && (
        <nav className="px-3 pt-4 pb-2 flex flex-col gap-0.5">
          {NAV_ITEMS.map(n => (
            <NavItem key={n.id} item={n} active={activeNav === n.id} onClick={onSelectNav} />
          ))}
        </nav>
      )}

      {/* Divider */}
      <div className="mx-4 my-2" style={{ height:1, background: C.border }} />

      {/* Saved chats */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[9px] uppercase tracking-widest" style={{ color: C.ink3, fontFamily:"'Fira Code',monospace" }}>
            Saved Chats
          </p>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full"
            style={{ background: C.surface2, color: C.ink3, fontFamily:"'Fira Code',monospace" }}>
            {chats.length}
          </span>
        </div>

        {chats.length === 0 ? (
          <p className="text-[10px] text-center py-6 px-2" style={{ color: C.ink3, fontFamily:"'Fira Code',monospace" }}>
            No saved chats yet.{"\n"}Upload one to get started.
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {chats.map(c => (
              <ChatItem
                key={c.id}
                chat={c}
                active={c.id === activeChat}
                onClick={onSelectChat}
                onDelete={onDeleteChat}
                onRename={onRenameChat}
              />
            ))}
          </div>
        )}
      </div>

      {/* New analysis button */}
      <div className="px-4 py-4" style={{ borderTop:`1px solid ${C.border}` }}>
        <button
          onClick={onNewAnalysis}
          className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
          style={{ background:`linear-gradient(135deg,${C.gold},#f59e0b)`, color: C.base, fontFamily:"'Cabinet Grotesk',sans-serif" }}
        >
          + New Analysis
        </button>
      </div>
    </aside>
  );
}

export { NAV_ITEMS };
