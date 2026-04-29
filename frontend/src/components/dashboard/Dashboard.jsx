import { useState } from "react";
import Sidebar from "../sidebar/Sidebar.jsx";
import TopBar from "./TopBar.jsx";
import { OverviewSection, ResponseSection, ActivitySection, PatternsSection } from "./sections/Sections.jsx";
import AIChat from "../ai/AIChat.jsx";
import { C } from "../ui.jsx";

export default function Dashboard({ chatData, chats, activeId, onSelectChat, onDeleteChat, onRenameChat, onNewAnalysis }) {
  const [activeNav,     setActiveNav]     = useState("overview");
  const [sidebarOpen,   setSidebarOpen]   = useState(false);

  const participants  = chatData?.participants  ?? [];
  const totalMessages = chatData?.total_messages ?? 0;

  const renderSection = () => {
    if (!chatData) return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="text-5xl">💬</div>
          <p className="text-sm" style={{ color: C.ink3, fontFamily:"'Fira Code',monospace" }}>
            Select a saved chat or upload a new one
          </p>
        </div>
      </div>
    );
    switch (activeNav) {
      case "overview":  return <OverviewSection  data={chatData} />;
      case "response":  return <ResponseSection  data={chatData} />;
      case "activity":  return <ActivitySection  data={chatData} />;
      case "patterns":  return <PatternsSection  data={chatData} />;
      case "ai":        return <AIChat data={chatData} />;
      default:          return null;
    }
  };

  return (
    <div className="flex h-screen overflow-auto bg-neutral-50 dark:bg-neutral-950">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: "#00000060" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:fixed inset-y-0 left-0 z-30 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <Sidebar
          chats={chats}
          activeChat={activeId}
          activeNav={activeNav}
          onSelectChat={(id) => { onSelectChat(id); setSidebarOpen(false); }}
          onSelectNav={(nav) => { setActiveNav(nav); setSidebarOpen(false); }}
          onNewAnalysis={onNewAnalysis}
          onDeleteChat={onDeleteChat}
          onRenameChat={onRenameChat}
          currentParticipants={participants}
        />
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-0 lg:ml-[220px]" style={{ minHeight: 0 }}>
        <TopBar
          activeNav={activeNav}
          participants={participants}
          totalMessages={totalMessages}
          onMenuToggle={() => setSidebarOpen(v => !v)}
        />

        {/* Content */}
        <div className={`flex-1 ${activeNav === "ai" ? "flex flex-col" : ""} min-h-0`} style={{ minHeight: 0 }}>
          {activeNav === "ai" ? (
            <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
              {chatData ? <AIChat data={chatData} /> : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm" style={{ color: C.ink3 }}>No chat loaded.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {renderSection()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
