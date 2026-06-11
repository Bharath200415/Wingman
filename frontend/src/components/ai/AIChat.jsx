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
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 bg-[var(--sidebar-accent)] border border-[var(--sidebar-border)]">
        {[0,1,2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce bg-amber-500" style={{ animationDelay:`${i*150}ms` }} />
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
    <div className="flex flex-col h-full bg-[var(--sidebar)] text-[var(--sidebar-foreground)]" style={{ minHeight: 0 }}>

      {/* Header */}
      <div className="px-5 py-3 flex items-center gap-3 flex-shrink-0 border-b border-[var(--sidebar-border)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <title>sparkle</title>
              <g fill="none">
                <path d="M13 9.00531C13.5522 9.00531 13.9999 9.45308 14 10.0053V12.0053H16C16.5522 12.0053 16.9999 12.4531 17 13.0053C16.9998 13.5574 16.5521 14.0053 16 14.0053H14V16.0053C13.9998 16.5574 13.5521 17.0053 13 17.0053C12.4479 17.0053 12.0002 16.5574 12 16.0053V14.0053H10C9.44791 14.0053 9.00025 13.5574 9 13.0053C9.00007 12.4531 9.4478 12.0054 10 12.0053H12V10.0053C12.0001 9.45311 12.4478 9.00536 13 9.00531ZM6.07031 1.34125C6.4044 0.499912 7.59575 0.499853 7.92969 1.34125L9.25 4.66937C9.26453 4.70571 9.29373 4.73396 9.33008 4.74847L12.6592 6.07074C13.5005 6.40477 13.5005 7.59509 12.6592 7.92914L9.33008 9.2514C9.29374 9.2659 9.26454 9.29419 9.25 9.33051L7.92969 12.6586C7.59575 13.5 6.4044 13.5 6.07031 12.6586L4.74902 9.33051C4.73446 9.29418 4.70531 9.26588 4.66895 9.2514L1.34082 7.92914C0.49956 7.59509 0.49956 6.40479 1.34082 6.07074L4.66895 4.74847C4.70533 4.73399 4.73447 4.70572 4.74902 4.66937L6.07031 1.34125Z" fill="url(#1752500502803-7613136_sparkle_existing_0_mj429roqu)" data-glass="origin" mask="url(#1752500502803-7613136_sparkle_mask_90yh9c2fr)"></path>
                <path d="M13 9.00531C13.5522 9.00531 13.9999 9.45308 14 10.0053V12.0053H16C16.5522 12.0053 16.9999 12.4531 17 13.0053C16.9998 13.5574 16.5521 14.0053 16 14.0053H14V16.0053C13.9998 16.5574 13.5521 17.0053 13 17.0053C12.4479 17.0053 12.0002 16.5574 12 16.0053V14.0053H10C9.44791 14.0053 9.00025 13.5574 9 13.0053C9.00007 12.4531 9.4478 12.0054 10 12.0053H12V10.0053C12.0001 9.45311 12.4478 9.00536 13 9.00531ZM6.07031 1.34125C6.4044 0.499912 7.59575 0.499853 7.92969 1.34125L9.25 4.66937C9.26453 4.70571 9.29373 4.73396 9.33008 4.74847L12.6592 6.07074C13.5005 6.40477 13.5005 7.59509 12.6592 7.92914L9.33008 9.2514C9.29374 9.2659 9.26454 9.29419 9.25 9.33051L7.92969 12.6586C7.59575 13.5 6.4044 13.5 6.07031 12.6586L4.74902 9.33051C4.73446 9.29418 4.70531 9.26588 4.66895 9.2514L1.34082 7.92914C0.49956 7.59509 0.49956 6.40479 1.34082 6.07074L4.66895 4.74847C4.70533 4.73399 4.73447 4.70572 4.74902 4.66937L6.07031 1.34125Z" fill="url(#1752500502803-7613136_sparkle_existing_0_mj429roqu)" data-glass="clone" filter="url(#1752500502803-7613136_sparkle_filter_alhgtlde0)" clip-path="url(#1752500502803-7613136_sparkle_clipPath_92n6igug9)"></path>
                <path d="M16.6562 9.21226L14.3939 3.51196C13.893 2.24987 12.1067 2.24971 11.6056 3.51172L9.34194 9.21226C9.31834 9.27153 9.27153 9.31834 9.21226 9.34194L3.51085 11.6059C2.24896 12.107 2.24896 13.893 3.51085 14.3941L9.21226 16.6581C9.27153 16.6817 9.31834 16.7285 9.34194 16.7877L11.6055 22.4883C12.1067 23.7503 13.8929 23.7501 14.3939 22.488L16.6562 16.7877C16.6799 16.7283 16.7273 16.6816 16.7868 16.6581L22.4888 14.3941C23.7507 13.8931 23.7507 12.1069 22.4888 11.6059L16.7868 9.34194C16.7273 9.3184 16.6799 9.27173 16.6562 9.21226Z" fill="url(#1752500502803-7613136_sparkle_existing_1_itr2rlc6a)" data-glass="blur"></path>
                <path d="M11.6054 3.51174C12.1064 2.24985 13.8924 2.24997 14.3934 3.51174L16.6561 9.21194C16.6798 9.27141 16.7275 9.31828 16.787 9.34182L22.4882 11.6055C23.7501 12.1065 23.7501 13.8935 22.4882 14.3946L16.787 16.6582L16.745 16.6797C16.7052 16.7056 16.6739 16.7433 16.6561 16.7881L14.3934 22.4883L14.3427 22.6026C13.8 23.7118 12.1987 23.712 11.6561 22.6026L11.6054 22.4883L9.34168 16.7881C9.31809 16.7288 9.27106 16.6818 9.2118 16.6582L3.51063 14.3946C2.24874 13.8935 2.24874 12.1066 3.51063 11.6055L9.2118 9.34182C9.27106 9.31822 9.31809 9.2712 9.34168 9.21194L11.6054 3.51174ZM13.6972 3.78909C13.4468 3.15817 12.5534 3.15751 12.3026 3.78811L10.0389 9.48928C9.95156 9.70875 9.78837 9.88881 9.58094 9.99709L9.48914 10.0391L3.78797 12.3028C3.15702 12.5533 3.15703 13.4467 3.78797 13.6973L9.48914 15.961C9.70861 16.0483 9.88867 16.2115 9.99695 16.419L10.0389 16.5108L12.3026 22.2119C12.5534 22.8425 13.4458 22.8419 13.6962 22.211L15.9589 16.5108L16.0018 16.418C16.1117 16.2083 16.293 16.047 16.5097 15.961L22.2118 13.6973C22.8428 13.4468 22.8428 12.5533 22.2118 12.3028L16.5097 10.0391V10.0381C16.2931 9.95206 16.1116 9.79167 16.0018 9.58205L15.9589 9.48928L13.6972 3.78909Z" fill="url(#1752500502803-7613136_sparkle_existing_2_7lj7nb2b2)"></path>
                <defs>
                  <linearGradient id="1752500502803-7613136_sparkle_existing_0_mj429roqu" x1="8.855" y1=".71" x2="8.855" y2="13.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#575757"></stop>
                    <stop offset="1" stop-color="#151515"></stop>
                  </linearGradient>
                  <linearGradient id="1752500502803-7613136_sparkle_existing_1_itr2rlc6a" x1="13" y1="0" x2="13" y2="26" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#E3E3E5" stop-opacity=".6"></stop>
                    <stop offset="1" stop-color="#BBBBC0" stop-opacity=".6"></stop>
                  </linearGradient>
                  <linearGradient id="1752500502803-7613136_sparkle_existing_2_7lj7nb2b2" x1="12.999" y1="2.565" x2="12.999" y2="13.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#fff"></stop>
                    <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
                  </linearGradient>
                  <filter id="1752500502803-7613136_sparkle_filter_alhgtlde0" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
                  </filter>
                  <clipPath id="1752500502803-7613136_sparkle_clipPath_92n6igug9">
                    <path d="M16.6562 9.21226L14.3939 3.51196C13.893 2.24987 12.1067 2.24971 11.6056 3.51172L9.34194 9.21226C9.31834 9.27153 9.27153 9.31834 9.21226 9.34194L3.51085 11.6059C2.24896 12.107 2.24896 13.893 3.51085 14.3941L9.21226 16.6581C9.27153 16.6817 9.31834 16.7285 9.34194 16.7877L11.6055 22.4883C12.1067 23.7503 13.8929 23.7501 14.3939 22.488L16.6562 16.7877C16.6799 16.7283 16.7273 16.6816 16.7868 16.6581L22.4888 14.3941C23.7507 13.8931 23.7507 12.1069 22.4888 11.6059L16.7868 9.34194C16.7273 9.3184 16.6799 9.27173 16.6562 9.21226Z" fill="url(#1752500502803-7613136_sparkle_existing_1_itr2rlc6a)"></path>
                  </clipPath>
                  <mask id="1752500502803-7613136_sparkle_mask_90yh9c2fr">
                    <rect width="100%" height="100%" fill="#FFF"></rect>
                    <path d="M16.6562 9.21226L14.3939 3.51196C13.893 2.24987 12.1067 2.24971 11.6056 3.51172L9.34194 9.21226C9.31834 9.27153 9.27153 9.31834 9.21226 9.34194L3.51085 11.6059C2.24896 12.107 2.24896 13.893 3.51085 14.3941L9.21226 16.6581C9.27153 16.6817 9.31834 16.7285 9.34194 16.7877L11.6055 22.4883C12.1067 23.7503 13.8929 23.7501 14.3939 22.488L16.6562 16.7877C16.6799 16.7283 16.7273 16.6816 16.7868 16.6581L22.4888 14.3941C23.7507 13.8931 23.7507 12.1069 22.4888 11.6059L16.7868 9.34194C16.7273 9.3184 16.6799 9.27173 16.6562 9.21226Z" fill="#000"></path>
                  </mask>
                </defs>
              </g>
            </svg>
        <div>
          <p className="text-lg font-medium whitespace-nowrap" >
            <span className="text-black dark:text-white">Wingman AI</span>
          </p>
          <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono">● Powered by Gemini</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={openTokenModal}
            className="text-[10px] px-2.5 py-1 rounded-md transition-all bg-[var(--sidebar-accent)] text-[var(--sidebar-foreground)] border border-[var(--sidebar-border)] opacity-85 hover:opacity-100 font-mono"
          >
            Change API token
          </button>
          <div className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${apiKey ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400" : "bg-rose-500/10 text-rose-500"}`}>
            {apiKey ? "Token saved" : "Token required"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3.5" style={{ minHeight: 0 }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                m.role === "user" 
                  ? "rounded-2xl rounded-br-sm bg-amber-500/10 dark:bg-amber-500/10 text-neutral-900 dark:text-amber-100 border border-amber-500/20 dark:border-amber-500/20 shadow-sm" 
                  : "rounded-2xl rounded-tl-sm bg-[var(--sidebar-accent)] text-[var(--sidebar-foreground)] border border-[var(--sidebar-border)] shadow-sm"
              }`}
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
              className="text-[10px] px-3 py-1.5 rounded-xl transition-all border border-[var(--sidebar-border)] bg-[var(--sidebar-accent)] text-[var(--sidebar-foreground)] opacity-75 hover:opacity-100 hover:border-amber-500 dark:hover:border-amber-500 hover:text-amber-500 dark:hover:text-amber-400 font-mono">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 flex-shrink-0">
        <div className="flex gap-2 items-center rounded-2xl px-3 py-2 bg-[var(--sidebar-accent)] border border-[var(--sidebar-border)] focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask anything about your chat…"
            className="flex-1 bg-transparent text-sm outline-none text-[var(--sidebar-foreground)] placeholder-neutral-400 dark:placeholder-neutral-500"
            style={{ fontFamily:"'DM Sans',sans-serif" }}
          />
          <button
            onClick={() => send()}
            disabled={!canSend}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all disabled:opacity-30 flex-shrink-0 bg-gradient-to-br from-gold to-amber-500 text-neutral-950 hover:opacity-90"
          >
            ↑
          </button>
        </div>
      </div>

      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm bg-black/40">
          <div className="w-full max-w-md rounded-2xl p-5 bg-[var(--sidebar)] border border-[var(--sidebar-border)] shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-base font-medium text-neutral-800 dark:text-neutral-200" style={{ fontFamily:"'Cabinet Grotesk',sans-serif" }}>
                  Enter your Gemini API token
                </p>
                <p className="text-xs mt-1 text-[var(--sidebar-foreground)] opacity-60">
                  This token is stored in your browser and sent to the backend for AI chat requests.
                </p>
              </div>
              <button
                onClick={() => setShowTokenModal(false)}
                className="text-xs px-2.5 py-1 rounded-lg bg-[var(--sidebar-accent)] text-[var(--sidebar-foreground)] border border-[var(--sidebar-border)] hover:brightness-110 transition-all font-mono"
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
              className="w-full rounded-xl px-3 py-3 text-sm outline-none bg-[var(--sidebar-accent)] border border-[var(--sidebar-border)] text-[var(--sidebar-foreground)] placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowTokenModal(false)}
                className="px-3 py-2 rounded-xl text-sm bg-[var(--sidebar-accent)] text-[var(--sidebar-foreground)] border border-[var(--sidebar-border)] hover:brightness-110 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveToken}
                disabled={!tokenDraft.trim()}
                className="px-3 py-2 rounded-xl text-sm font-semibold disabled:opacity-40 bg-gradient-to-br from-gold to-amber-500 text-neutral-950 hover:opacity-90 transition-all"
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
