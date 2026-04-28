import { useState, useRef, useEffect } from "react";
import { C } from "../ui.jsx";


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

  const send = async (forcedText) => {
    const text = forcedText ?? input.trim();
    if (!text || loading) return;
    if (!forcedText) setInput("");

    const userMsg = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: buildContext(data), question: text }),
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
        <div className="ml-auto text-[10px] px-2 py-1 rounded-lg" style={{ background:`${C.green}15`, color: C.green, border:`1px solid ${C.green}30`, fontFamily:"'Fira Code',monospace" }}>
          Backend Gemini
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
    </div>
  );
}
