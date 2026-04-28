import { useState, useRef, useEffect } from "react";
import { C } from "../ui.jsx";

const TOKEN_STORAGE_KEY = "wingman_gemini_api_key";


const SUGGESTED = [
  "Who takes longer to reply?",
  "Who ghosts more?",
  "Best time to message?",
  "Who starts conversations more?",
  "Who sends longer messages?",
  "What was the longest gap?",
];

function buildContext(data) {
  const { stats, participants, total_messages, sender_stats = {}, response_by_sender = {}, peak_hours = {} } = data;
  return `You are Wingman — a sharp, witty WhatsApp chat analyst. You have analyzed the following chat data:

  Participants:
${participants.join(", ")}

Total Messages:
${total_messages}

Summary Stats:
${JSON.stringify(stats,null,2)}

Response Times:
${JSON.stringify(response_by_sender,null,2)}

Peak Hours:
${JSON.stringify(peak_hours,null,2)}


Per-Person Stats (message_count, pct_of_total, avg_msg_length, questions_sent):
${JSON.stringify(sender_stats, null, 2)}


Rules:
- Be direct and conversational, like a sharp friend giving real talk — not a corporate report.
- Use specific numbers from the data. Never make up stats.
- Keep answers to 2–4 sentences unless the question needs more.
- If someone has a huge gap between P50 and P99, that means they occasionally ghost — call it out.
- Be a little witty when appropriate but always accurate.`;
}

function ThinkingDots() {
  return (
    <div className="flex justify-start">
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1" style={{ background: C.surface2, border:`1px solid ${C.border}` }}>
        {[0,1,2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: C.gold, animationDelay:`${i*150}ms` }} />
        ))}
      </div>
    </div>
  );
}

export default function AIChat({ data }) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) || "");
  const [tokenDraft, setTokenDraft] = useState("");
  const [showTokenModal, setShowTokenModal] = useState(false);

  const [messages, setMessages] = useState([{
    role: "assistant",
    text: `Hey! I've analyzed the chat between ${data?.participants?.join(", ") || "everyone"}. Ask me anything — response times, who ghosts, peak hours, who carries the conversation.`
  }]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!apiKey) {
      setShowTokenModal(true);
      setTokenDraft("");
    }
  }, [apiKey]);

  const saveToken = () => {
    const nextKey = tokenDraft.trim();
    if (!nextKey) return;
    localStorage.setItem(TOKEN_STORAGE_KEY, nextKey);
    setApiKey(nextKey);
    setTokenDraft("");
    setShowTokenModal(false);
  };

  const openTokenModal = () => {
    setTokenDraft(apiKey);
    setShowTokenModal(true);
  };

  const send = async (forcedText) => {
    const text = forcedText ?? input.trim();
    if (!text || loading) return;
    if (!apiKey) {
      openTokenModal();
      return;
    }
    if (!forcedText) setInput("");

    const userMsg = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: buildContext(data), question: text, api_key: apiKey }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(
                    json?.detail ||
                    json?.error ||
                    json?.message ||
                    "Chat request failed."
                    );
      const reply = json.reply || json.result || "Couldn't get a response.";
      setMessages(prev => [...prev, { role: "assistant", text: reply }] );
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", text: `Error: ${e.message}` }]);
    }

    setLoading(false);
  };

  const showSuggested = messages.length <= 2;
  const canSend = !loading && input.trim().length > 0;

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>

      {/* Header */}
      <div className="px-5 py-3 flex items-center gap-3 flex-shrink-0" style={{ borderBottom:`1px solid ${C.border}` }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background:`linear-gradient(135deg,${C.gold},#f59e0b)`, color: C.base, fontSize: 16 }}>
          ✦
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: C.ink, fontFamily:"'Cabinet Grotesk',sans-serif" }}>Wingman AI</p>
          <p className="text-[10px]" style={{ color: C.green, fontFamily:"'Fira Code',monospace" }}>● Powered by Gemini</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={openTokenModal}
            className="text-[10px] px-2 py-1 rounded-lg transition-all"
            style={{ background:`${C.surface2}`, color: C.ink2, border:`1px solid ${C.border}`, fontFamily:"'Fira Code',monospace" }}
          >
            Change API token
          </button>
          <div className="text-[10px] px-2 py-1 rounded-lg" style={{ background:`${C.green}15`, color: C.green, border:`1px solid ${C.green}30`, fontFamily:"'Fira Code',monospace" }}>
            {apiKey ? "Token saved" : "Token required"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ minHeight: 0 }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "rounded-2xl rounded-br-sm" : "rounded-2xl rounded-tl-sm"}`}
              style={{
                background: m.role === "user" ? `linear-gradient(135deg,${C.gold},#f59e0b)` : C.surface2,
                color:      m.role === "user" ? C.base : C.ink,
                border:     m.role === "assistant" ? `1px solid ${C.border}` : "none",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && <ThinkingDots />}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {showSuggested && (
        <div className="px-4 pb-3 flex flex-wrap gap-2 flex-shrink-0">
          {SUGGESTED.map(q => (
            <button key={q} onClick={() => send(q)}
              className="text-[11px] px-3 py-1.5 rounded-xl transition-all hover:border-[#f5c842] hover:text-[#f5c842]"
              style={{ background: C.surface2, color: C.ink2, border:`1px solid ${C.border}`, fontFamily:"'Fira Code',monospace" }}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 flex-shrink-0">
        <div className="flex gap-2 items-center rounded-2xl px-3 py-2" style={{ background: C.surface2, border:`1px solid ${C.border}` }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask anything about your chat…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: C.ink, fontFamily:"'DM Sans',sans-serif" }}
          />
          <button
            onClick={() => send()}
            disabled={!canSend}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all disabled:opacity-30 flex-shrink-0"
            style={{ background:`linear-gradient(135deg,${C.gold},#f59e0b)`, color: C.base }}
          >
            ↑
          </button>
        </div>
      </div>

      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "#00000080" }}>
          <div className="w-full max-w-md rounded-2xl p-5" style={{ background: C.base, border: `1px solid ${C.border}` }}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-base font-semibold" style={{ color: C.ink, fontFamily:"'Cabinet Grotesk',sans-serif" }}>
                  Enter your Gemini API token
                </p>
                <p className="text-xs mt-1" style={{ color: C.ink3 }}>
                  This token is stored in your browser and sent to the backend for AI chat requests.
                </p>
              </div>
              <button
                onClick={() => setShowTokenModal(false)}
                className="text-xs px-2 py-1 rounded-lg"
                style={{ background: C.surface2, color: C.ink2, border: `1px solid ${C.border}` }}
              >
                Close
              </button>
            </div>

            <input
              autoFocus
              type="password"
              value={tokenDraft}
              onChange={(e) => setTokenDraft(e.target.value)}
              placeholder="Paste your Gemini API token here"
              className="w-full rounded-xl px-3 py-3 text-sm outline-none"
              style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.ink }}
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowTokenModal(false)}
                className="px-3 py-2 rounded-xl text-sm"
                style={{ background: C.surface2, color: C.ink2, border: `1px solid ${C.border}` }}
              >
                Cancel
              </button>
              <button
                onClick={saveToken}
                disabled={!tokenDraft.trim()}
                className="px-3 py-2 rounded-xl text-sm font-semibold disabled:opacity-40"
                style={{ background: `linear-gradient(135deg,${C.gold},#f59e0b)`, color: C.base }}
              >
                Save token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
