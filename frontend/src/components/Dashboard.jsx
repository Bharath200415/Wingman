import { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Nav items ──────────────────────────────────────────────
const NAV = [
  { id:"overview",   label:"Overview",       icon:"◈" },
  { id:"response",   label:"Response Times", icon:"⏱" },
  { id:"activity",   label:"Activity",       icon:"⚡" },
  { id:"patterns",   label:"Patterns",       icon:"◎" },
  { id:"ai",         label:"AI Analyst",     icon:"✦" },
];

const CHART_SECTIONS = {
  overview:  ["00_summary_stats","03_message_volume","11_daily_streak"],
  response:  ["01_response_time_percentiles","02_response_time_heatmap"],
  activity:  ["04_activity_patterns","05_conversation_initiators"],
  patterns:  ["06_double_text_frequency","07_message_length_analysis","08_emoji_analysis","09_question_frequency","10_conversation_gaps"],
};

const CHART_LABELS = {
  "00_summary_stats":             "Summary Overview",
  "01_response_time_percentiles": "Response Time Percentiles",
  "02_response_time_heatmap":     "Response Time Heatmap",
  "03_message_volume":            "Message Volume",
  "04_activity_patterns":         "Activity Patterns",
  "05_conversation_initiators":   "Conversation Starters",
  "06_double_text_frequency":     "Double Text Analysis",
  "07_message_length_analysis":   "Message Length",
  "08_emoji_analysis":            "Emoji Usage",
  "09_question_frequency":        "Question Frequency",
  "10_conversation_gaps":         "Conversation Gaps",
  "11_daily_streak":              "Daily Streak",
};

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ label, value, highlight, delay }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-1 animate-fade-up" style={{ background:"#13161e", border:"1px solid #1f2535", animationDelay:`${delay}ms`, animationFillMode:"both" }}>
      <span className="text-xs uppercase tracking-widest" style={{ color:"#555c7a", fontFamily:"'Fira Code',monospace" }}>{label}</span>
      <span className="text-xl font-bold leading-tight" style={{ color: highlight?"#f5c842":"#e8eaf5", fontFamily:"'Cabinet Grotesk',sans-serif" }}>{value}</span>
    </div>
  );
}

// ── Chart Card ─────────────────────────────────────────────
function ChartCard({ chart }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:"#13161e", border:"1px solid #1f2535" }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom:"1px solid #1f2535" }}>
        <span className="text-sm font-semibold" style={{ color:"#e8eaf5", fontFamily:"'Cabinet Grotesk',sans-serif" }}>{CHART_LABELS[chart.id] || chart.label}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ background:"#1a1e2a", color:"#555c7a", fontFamily:"'Fira Code',monospace" }}>{chart.id}</span>
      </div>
      <img src={`data:image/png;base64,${chart.image}`} alt={chart.label} className="w-full block" style={{ background:"#ffffff" }} loading="lazy" />
    </div>
  );
}

// ── AI Chat Panel ──────────────────────────────────────────
function AIChat({ result }) {
  const [messages, setMessages] = useState([
    {
      role:"assistant",
      text:
      "Hey! I've analyzed your WhatsApp chat. Ask me anything — response patterns, ghosting, peak hours, anything."
    }
  ]);

  const [input,setInput] = useState("");
  const [loading,setLoading] = useState(false);

  const bottomRef = useRef();

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000";


  useEffect(()=>{
    bottomRef.current?.scrollIntoView({
      behavior:"smooth"
    });
  },[messages,loading]);


  const buildContext = () => {
    const {
      stats,
      participants,
      total_messages,
      sender_stats={},
      response_by_sender={},
      peak_hours={}
    } = result;

    return `
Participants:
${participants.join(", ")}

Total Messages:
${total_messages}

Summary Stats:
${JSON.stringify(stats,null,2)}

Per Person Stats:
${JSON.stringify(sender_stats,null,2)}

Response Times:
${JSON.stringify(response_by_sender,null,2)}

Peak Hours:
${JSON.stringify(peak_hours,null,2)}
`;
  };


  const send = async (forcedQuestion=null) => {

    const text = forcedQuestion || input.trim();

    if(!text || loading) return;

    if(!forcedQuestion){
      setInput("");
    }

    setMessages(prev=>[
      ...prev,
      {
        role:"user",
        text
      }
    ]);

    setLoading(true);

    try{

      const res = await fetch(
        `${API_URL}/chat`,
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({
            context: buildContext(),
            question: text
          })
        }
      );

      const data = await res.json();

      if(!res.ok){
        throw new Error(
          data?.detail ||
          "AI request failed."
        );
      }

      setMessages(prev=>[
        ...prev,
        {
          role:"assistant",
          text:data.reply
        }
      ]);

    }catch(e){

      setMessages(prev=>[
        ...prev,
        {
          role:"assistant",
          text:
          e?.message ||
          "Failed to reach AI backend."
        }
      ]);

    }

    setLoading(false);
  };


  const SUGGESTED = [
    "Who takes longer to reply?",
    "Who double texts more?",
    "What time is best to message?",
    "What was the longest gap?"
  ];


  return (
<div className="flex flex-col h-full" style={{minHeight:0}}>

{/* Header */}
<div
className="px-6 py-4 flex items-center gap-3"
style={{
 borderBottom:"1px solid #1f2535"
}}>
<div
className="w-9 h-9 rounded-xl flex items-center justify-center"
style={{
 background:
 "linear-gradient(135deg,#f5c842,#f59e0b)"
}}>
✦
</div>

<div>
<p
className="text-sm font-semibold"
style={{color:"#e8eaf5"}}>
AI Analyst
</p>

<p
className="text-xs"
style={{color:"#10d9a0"}}>
● online
</p>
</div>
</div>


{/* Messages */}
<div
className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
style={{minHeight:0}}
>

{messages.map((m,i)=>(
<div
key={i}
className={`flex ${
m.role==="user"
? "justify-end"
: "justify-start"
}`}
>

<div
className="max-w-[85%] px-4 py-3 text-sm leading-relaxed"
style={{
background:
m.role==="user"
? "linear-gradient(135deg,#f5c842,#f59e0b)"
:"#1a1e2a",

color:
m.role==="user"
? "#0d0f14"
:"#e8eaf5",

border:
m.role==="assistant"
?"1px solid #1f2535"
:"none"
}}
>
{m.text}
</div>

</div>
))}


{loading && (
<div className="flex justify-start">
<div
className="px-4 py-3"
style={{
background:"#1a1e2a",
border:"1px solid #1f2535"
}}>
Thinking...
</div>
</div>
)}

<div ref={bottomRef}/>
</div>



{/* Suggested prompts */}
{messages.length<=2 && (
<div className="px-4 pb-3 flex flex-wrap gap-2">
{SUGGESTED.map(q=>(
<button
key={q}
onClick={()=>send(q)}
className="text-xs px-3 py-1.5 rounded-xl"
style={{
background:"#1a1e2a",
color:"#8b91b0",
border:"1px solid #1f2535"
}}
>
{q}
</button>
))}
</div>
)}



{/* Input */}
<div className="px-4 pb-4">
<div
className="flex gap-2 rounded-2xl p-1.5"
style={{
background:"#1a1e2a",
border:"1px solid #1f2535"
}}
>

<input
value={input}
onChange={e=>setInput(e.target.value)}
onKeyDown={e=>e.key==="Enter" && send()}
placeholder="Ask anything about your chat..."
className="flex-1 bg-transparent outline-none px-3"
style={{
color:"#e8eaf5"
}}
/>

<button
onClick={send}
disabled={!input.trim() || loading}
className="w-9 h-9 rounded-xl"
style={{
background:
"linear-gradient(135deg,#f5c842,#f59e0b)"
}}
>
↑
</button>

</div>
</div>

</div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────
export default function Dashboard({ result, onReset }) {
  const [activeNav, setActiveNav] = useState("overview");
  const { stats, charts, participants, total_messages } = result;
  const chartMap = Object.fromEntries(charts.map(c=>[c.id,c]));

  const STAT_CARDS = [
    { label:"Total Messages",   value: Number(total_messages).toLocaleString(), highlight:true },
    { label:"Participants",     value: participants.length },
    { label:"Days Active",      value: stats["Days Active"] },
    { label:"Avg / Day",        value: stats["Avg Messages/Day"], highlight:true },
    { label:"P50 Response",     value: stats["P50 Response Time"] },
    { label:"P90 Response",     value: stats["P90 Response Time"] },
    { label:"P99 Response",     value: stats["P99 Response Time"], highlight:true },
    { label:"Date Range",       value: stats["Date Range"] },
  ];

  const sectionCharts = CHART_SECTIONS[activeNav] || [];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:"#0d0f14", fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 flex flex-col" style={{ background:"#0d0f14", borderRight:"1px solid #1f2535" }}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3" style={{ borderBottom:"1px solid #1f2535" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black" style={{ background:"linear-gradient(135deg,#f5c842,#f59e0b)", color:"#0d0f14", fontFamily:"'Cabinet Grotesk',sans-serif" }}>WM</div>
          <span className="text-lg font-black" style={{ fontFamily:"'Cabinet Grotesk',sans-serif", color:"#e8eaf5" }}>Wing<span style={{color:"#f5c842"}}>man</span></span>
        </div>

        {/* Participants */}
        <div className="px-4 py-3" style={{ borderBottom:"1px solid #1f2535" }}>
          <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color:"#555c7a", fontFamily:"'Fira Code',monospace" }}>Participants</p>
          {participants.slice(0,5).map(p=>(
            <div key={p} className="flex items-center gap-2 py-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background:"#f5c84220", color:"#f5c842" }}>{p[0]?.toUpperCase()}</div>
              <span className="text-xs truncate" style={{ color:"#8b91b0" }}>{p.length>18?p.slice(0,16)+"…":p}</span>
            </div>
          ))}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setActiveNav(n.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all w-full"
              style={{
                background: activeNav===n.id?"#1a1e2a":"transparent",
                color: activeNav===n.id?"#f5c842":"#8b91b0",
                border: activeNav===n.id?"1px solid #1f2535":"1px solid transparent",
              }}>
              <span style={{ fontSize:"14px" }}>{n.icon}</span>
              {n.label}
              {n.id==="ai" && <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full" style={{ background:"#10d9a020", color:"#10d9a0", fontFamily:"'Fira Code',monospace" }}>NEW</span>}
            </button>
          ))}
        </nav>

        {/* Reset */}
        <div className="px-4 pb-5">
          <button onClick={onReset} className="w-full py-2 rounded-xl text-xs transition-all hover:border-[#f5c84260]"
            style={{ border:"1px solid #1f2535", color:"#555c7a", fontFamily:"'Fira Code',monospace" }}>
            ← New Analysis
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom:"1px solid #1f2535" }}>
          <div>
            <p className="text-xs" style={{ color:"#555c7a", fontFamily:"'Fira Code',monospace" }}>Dashboard / {NAV.find(n=>n.id===activeNav)?.label}</p>
            <h2 className="text-xl font-black leading-tight" style={{ fontFamily:"'Cabinet Grotesk',sans-serif", color:"#e8eaf5" }}>{NAV.find(n=>n.id===activeNav)?.label}</h2>
          </div>
          <div className="flex items-center gap-2">
            {participants.slice(0,3).map(p=>(
              <span key={p} className="text-xs px-3 py-1 rounded-full" style={{ background:"#f5c84215", color:"#f5c842", border:"1px solid #f5c84230" }}>{p.length>12?p.slice(0,10)+"…":p}</span>
            ))}
            <span className="text-xs px-3 py-1 rounded-full" style={{ background:"#1a1e2a", color:"#8b91b0", border:"1px solid #1f2535" }}>{Number(total_messages).toLocaleString()} msgs</span>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-hidden flex">
          {activeNav === "ai" ? (
            <div className="flex-1 flex flex-col" style={{ minHeight:0 }}>
              <AIChat result={result} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Stats grid — overview only */}
              {activeNav==="overview" && (
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {STAT_CARDS.map((s,i)=>(
                    <StatCard key={s.label} {...s} delay={i*50} />
                  ))}
                </div>
              )}

              {/* Charts */}
              <div className="grid gap-4" style={{ gridTemplateColumns: sectionCharts.length===1?"1fr":"repeat(auto-fill,minmax(520px,1fr))" }}>
                {sectionCharts.map(id => chartMap[id] ? (
                  <ChartCard key={id} chart={chartMap[id]} />
                ) : null)}
              </div>

              {sectionCharts.length===0 && (
                <div className="flex items-center justify-center h-48 text-sm" style={{ color:"#555c7a" }}>No charts in this section.</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
