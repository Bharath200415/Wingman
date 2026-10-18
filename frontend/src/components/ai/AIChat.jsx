import { useState, useRef, useEffect } from "react";
import { ArrowUp, KeyRound } from "lucide-react";

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

function SparkleIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
              
              <g fill="none">
                <path d="M13 9.00531C13.5522 9.00531 13.9999 9.45308 14 10.0053V12.0053H16C16.5522 12.0053 16.9999 12.4531 17 13.0053C16.9998 13.5574 16.5521 14.0053 16 14.0053H14V16.0053C13.9998 16.5574 13.5521 17.0053 13 17.0053C12.4479 17.0053 12.0002 16.5574 12 16.0053V14.0053H10C9.44791 14.0053 9.00025 13.5574 9 13.0053C9.00007 12.4531 9.4478 12.0054 10 12.0053H12V10.0053C12.0001 9.45311 12.4478 9.00536 13 9.00531ZM6.07031 1.34125C6.4044 0.499912 7.59575 0.499853 7.92969 1.34125L9.25 4.66937C9.26453 4.70571 9.29373 4.73396 9.33008 4.74847L12.6592 6.07074C13.5005 6.40477 13.5005 7.59509 12.6592 7.92914L9.33008 9.2514C9.29374 9.2659 9.26454 9.29419 9.25 9.33051L7.92969 12.6586C7.59575 13.5 6.4044 13.5 6.07031 12.6586L4.74902 9.33051C4.73446 9.29418 4.70531 9.26588 4.66895 9.2514L1.34082 7.92914C0.49956 7.59509 0.49956 6.40479 1.34082 6.07074L4.66895 4.74847C4.70533 4.73399 4.73447 4.70572 4.74902 4.66937L6.07031 1.34125Z" fill="url(#1752500502803-7613136_sparkle_existing_0_mj429roqu)" data-glass="origin" mask="url(#1752500502803-7613136_sparkle_mask_90yh9c2fr)"></path>
                <path d="M13 9.00531C13.5522 9.00531 13.9999 9.45308 14 10.0053V12.0053H16C16.5522 12.0053 16.9999 12.4531 17 13.0053C16.9998 13.5574 16.5521 14.0053 16 14.0053H14V16.0053C13.9998 16.5574 13.5521 17.0053 13 17.0053C12.4479 17.0053 12.0002 16.5574 12 16.0053V14.0053H10C9.44791 14.0053 9.00025 13.5574 9 13.0053C9.00007 12.4531 9.4478 12.0054 10 12.0053H12V10.0053C12.0001 9.45311 12.4478 9.00536 13 9.00531ZM6.07031 1.34125C6.4044 0.499912 7.59575 0.499853 7.92969 1.34125L9.25 4.66937C9.26453 4.70571 9.29373 4.73396 9.33008 4.74847L12.6592 6.07074C13.5005 6.40477 13.5005 7.59509 12.6592 7.92914L9.33008 9.2514C9.29374 9.2659 9.26454 9.29419 9.25 9.33051L7.92969 12.6586C7.59575 13.5 6.4044 13.5 6.07031 12.6586L4.74902 9.33051C4.73446 9.29418 4.70531 9.26588 4.66895 9.2514L1.34082 7.92914C0.49956 7.59509 0.49956 6.40479 1.34082 6.07074L4.66895 4.74847C4.70533 4.73399 4.73447 4.70572 4.74902 4.66937L6.07031 1.34125Z" fill="url(#1752500502803-7613136_sparkle_existing_0_mj429roqu)" data-glass="clone" filter="url(#1752500502803-7613136_sparkle_filter_alhgtlde0)" clipPath="url(#1752500502803-7613136_sparkle_clipPath_92n6igug9)"></path>
                <path d="M16.6562 9.21226L14.3939 3.51196C13.893 2.24987 12.1067 2.24971 11.6056 3.51172L9.34194 9.21226C9.31834 9.27153 9.27153 9.31834 9.21226 9.34194L3.51085 11.6059C2.24896 12.107 2.24896 13.893 3.51085 14.3941L9.21226 16.6581C9.27153 16.6817 9.31834 16.7285 9.34194 16.7877L11.6055 22.4883C12.1067 23.7503 13.8929 23.7501 14.3939 22.488L16.6562 16.7877C16.6799 16.7283 16.7273 16.6816 16.7868 16.6581L22.4888 14.3941C23.7507 13.8931 23.7507 12.1069 22.4888 11.6059L16.7868 9.34194C16.7273 9.3184 16.6799 9.27173 16.6562 9.21226Z" fill="url(#1752500502803-7613136_sparkle_existing_1_itr2rlc6a)" data-glass="blur"></path>
                <path d="M11.6054 3.51174C12.1064 2.24985 13.8924 2.24997 14.3934 3.51174L16.6561 9.21194C16.6798 9.27141 16.7275 9.31828 16.787 9.34182L22.4882 11.6055C23.7501 12.1065 23.7501 13.8935 22.4882 14.3946L16.787 16.6582L16.745 16.6797C16.7052 16.7056 16.6739 16.7433 16.6561 16.7881L14.3934 22.4883L14.3427 22.6026C13.8 23.7118 12.1987 23.712 11.6561 22.6026L11.6054 22.4883L9.34168 16.7881C9.31809 16.7288 9.27106 16.6818 9.2118 16.6582L3.51063 14.3946C2.24874 13.8935 2.24874 12.1066 3.51063 11.6055L9.2118 9.34182C9.27106 9.31822 9.31809 9.2712 9.34168 9.21194L11.6054 3.51174ZM13.6972 3.78909C13.4468 3.15817 12.5534 3.15751 12.3026 3.78811L10.0389 9.48928C9.95156 9.70875 9.78837 9.88881 9.58094 9.99709L9.48914 10.0391L3.78797 12.3028C3.15702 12.5533 3.15703 13.4467 3.78797 13.6973L9.48914 15.961C9.70861 16.0483 9.88867 16.2115 9.99695 16.419L10.0389 16.5108L12.3026 22.2119C12.5534 22.8425 13.4458 22.8419 13.6962 22.211L15.9589 16.5108L16.0018 16.418C16.1117 16.2083 16.293 16.047 16.5097 15.961L22.2118 13.6973C22.8428 13.4468 22.8428 12.5533 22.2118 12.3028L16.5097 10.0391V10.0381C16.2931 9.95206 16.1116 9.79167 16.0018 9.58205L15.9589 9.48928L13.6972 3.78909Z" fill="url(#1752500502803-7613136_sparkle_existing_2_7lj7nb2b2)"></path>
                <defs>
                  <linearGradient id="1752500502803-7613136_sparkle_existing_0_mj429roqu" x1="8.855" y1=".71" x2="8.855" y2="13.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#575757"></stop>
                    <stop offset="1" stopColor="#151515"></stop>
                  </linearGradient>
                  <linearGradient id="1752500502803-7613136_sparkle_existing_1_itr2rlc6a" x1="13" y1="0" x2="13" y2="26" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E3E3E5" stopOpacity=".6"></stop>
                    <stop offset="1" stopColor="#BBBBC0" stopOpacity=".6"></stop>
                  </linearGradient>
                  <linearGradient id="1752500502803-7613136_sparkle_existing_2_7lj7nb2b2" x1="12.999" y1="2.565" x2="12.999" y2="13.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fff"></stop>
                    <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
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
  );
}

function AssistantAvatar() {
  return (
    <span className="mt-0.5 w-7 h-7 flex-shrink-0 rounded-lg grid place-items-center bg-white border border-neutral-200 dark:bg-white/[0.04] dark:border-white/[0.08]">
      <SparkleIcon size={15} />
    </span>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-start gap-3">
      <AssistantAvatar />
      <div className="h-7 flex items-center gap-1.5">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-pulse" style={{ animationDelay: `${i * 180}ms` }} />
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
      setMessages(prev => [...prev, { role: "assistant", text: `Error: ${e.message}`, error: true }]);
    }

    setLoading(false);
  };

  const showSuggested = messages.length <= 2;
  const canSend = !loading && input.trim().length > 0;

  return (
    <div className="flex flex-col h-full bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100" style={{ minHeight: 0 }}>

      {/* Header */}
      <div className="h-16 px-5 flex items-center gap-3 flex-shrink-0 border-b border-neutral-200 dark:border-white/[0.06]">
        <span className="w-9 h-9 rounded-xl grid place-items-center bg-white border border-neutral-200 shadow-sm dark:bg-white/[0.04] dark:border-white/[0.08] dark:shadow-none">
          <SparkleIcon size={18} />
        </span>
        <div className="leading-tight">
          <p className="text-[15px] font-medium tracking-[-0.01em]">Wingman AI</p>
          <p className="text-[12px] text-neutral-500">Powered by Gemini</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[12px] text-neutral-500 dark:text-neutral-400">
            <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? "bg-emerald-500" : "bg-amber-500"}`} />
            {apiKey ? "Key saved" : "Key required"}
          </span>
          <button
            onClick={openTokenModal}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[13px] text-neutral-700 bg-white border border-neutral-200 shadow-sm transition-[background-color,transform] duration-150 hover:bg-neutral-100 active:scale-[0.97] dark:text-neutral-200 dark:bg-white/[0.04] dark:border-white/[0.08] dark:shadow-none dark:hover:bg-white/[0.08]"
          >
            <KeyRound size={14} strokeWidth={1.7} />
            {apiKey ? "Change key" : "Add key"}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
        <div className="mx-auto w-full max-w-3xl px-5 py-8 flex flex-col gap-7">
          {messages.map((m, i) => (
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md text-[14px] leading-relaxed whitespace-pre-wrap bg-neutral-900 text-neutral-50 dark:bg-white/[0.08] dark:text-neutral-100">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-start gap-3">
                <AssistantAvatar />
                <p className={`pt-1 max-w-[88%] text-[14.5px] leading-[1.7] whitespace-pre-wrap ${m.error ? "text-rose-500 dark:text-rose-400" : "text-neutral-700 dark:text-neutral-300"}`}>
                  {m.text}
                </p>
              </div>
            )
          ))}
          {loading && <ThinkingDots />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="flex-shrink-0 px-5 pb-5">
        <div className="mx-auto w-full max-w-3xl flex flex-col gap-3">
          {showSuggested && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="h-8 px-3.5 rounded-full text-[13px] text-neutral-600 bg-white border border-neutral-200 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.97] dark:text-neutral-400 dark:bg-transparent dark:border-white/[0.08] dark:hover:bg-white/[0.05] dark:hover:text-neutral-100"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 rounded-2xl pl-4 pr-2 py-2 bg-white border border-neutral-200 shadow-sm transition-[border-color,box-shadow] duration-200 focus-within:border-neutral-300 focus-within:shadow-md dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-none dark:focus-within:border-white/[0.18]">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask anything about your chat…"
              className="flex-1 h-9 bg-transparent text-[14px] outline-none placeholder-neutral-400 dark:placeholder-neutral-500"
            />
            <button
              onClick={() => send()}
              disabled={!canSend}
              aria-label="Send"
              className="w-9 h-9 rounded-xl grid place-items-center flex-shrink-0 bg-neutral-900 text-white transition-[opacity,transform] duration-150 active:scale-[0.94] disabled:opacity-20 disabled:active:scale-100 dark:bg-neutral-100 dark:text-neutral-900"
            >
              <ArrowUp size={17} strokeWidth={2} />
            </button>
          </div>
          <p className="text-center text-[11.5px] text-neutral-400 dark:text-neutral-500">
            Only aggregate stats are shared with Gemini, never your messages. Answers can be wrong.
          </p>
        </div>
      </div>

      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="animate-fade-up w-full max-w-md rounded-2xl p-6 bg-white border border-neutral-200 shadow-2xl dark:bg-[#111113] dark:border-white/[0.08]">
            <span className="w-10 h-10 rounded-xl grid place-items-center bg-neutral-100 text-neutral-700 dark:bg-white/[0.05] dark:text-neutral-200">
              <KeyRound size={18} strokeWidth={1.7} />
            </span>
            <p className="mt-5 text-[17px] font-medium tracking-[-0.01em]">Add your Gemini API key</p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              It's stored in this browser and only sent with your questions. Get a free key from{" "}
              <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-neutral-900 underline underline-offset-2 decoration-neutral-300 dark:text-neutral-100 dark:decoration-neutral-600">
                Google AI Studio
              </a>.
            </p>

            <input
              autoFocus
              type="password"
              value={tokenDraft}
              onChange={(e) => setTokenDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveToken();
                if (e.key === "Escape") setShowTokenModal(false);
              }}
              placeholder="Paste your API key"
              className="mt-5 w-full h-11 rounded-xl px-3.5 text-[14px] outline-none bg-neutral-50 border border-neutral-200 placeholder-neutral-400 transition-colors focus:border-neutral-400 dark:bg-white/[0.03] dark:border-white/[0.08] dark:placeholder-neutral-500 dark:focus:border-white/[0.2]"
            />

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowTokenModal(false)}
                className="h-9 px-4 rounded-lg text-[13.5px] text-neutral-600 transition-[background-color,transform] duration-150 hover:bg-neutral-100 active:scale-[0.97] dark:text-neutral-300 dark:hover:bg-white/[0.06]"
              >
                Cancel
              </button>
              <button
                onClick={saveToken}
                disabled={!tokenDraft.trim()}
                className="h-9 px-4 rounded-lg text-[13.5px] font-medium bg-neutral-900 text-white transition-[opacity,transform] duration-150 active:scale-[0.97] disabled:opacity-30 dark:bg-neutral-100 dark:text-neutral-900"
              >
                Save key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
