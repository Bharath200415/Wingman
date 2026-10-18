import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Database, HardDrive, KeyRound, Lock, Plus, UserX } from "lucide-react";
import {
  Logo,
  DashboardShot,
  ResponseVisual,
  HeatmapVisual,
  InitiatorVisual,
  DoubleTextVisual,
  StreakVisual,
  HabitsVisual,
  VolumeVisual,
  AIChatVisual,
  ExportPathVisual,
  FileVisual,
  ViewsVisual,
} from "./LandingVisuals.jsx";
import "./landing.css";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#ai", label: "AI analyst" },
  { href: "#how", label: "How it works" },
  { href: "#privacy", label: "Privacy" },
  { href: "#faq", label: "FAQ" },
];

const HIGHLIGHTS = [
  { value: "12", label: "Analyses on every chat" },
  { value: "5", label: "Focused dashboard views" },
  { value: "0", label: "Accounts or databases" },
  { value: "<60s", label: "From export to insight" },
];

const FEATURES = [
  {
    title: "Reply speed, measured honestly",
    body: "P50, P90 and P99 response times for each person: the typical reply, the slow one, and the rare disappearing act.",
    visual: <ResponseVisual />,
  },
  {
    title: "When you actually talk",
    body: "Hour-by-hour and day-by-day activity shows your shared rhythm: late-night spikes, quiet mornings, busy weekends.",
    visual: <HeatmapVisual />,
    span: "lg:col-span-2",
  },
  {
    title: "Who reaches out first",
    body: "Any message after six or more hours of silence starts a new conversation. See who usually sends it.",
    visual: <InitiatorVisual />,
  },
  {
    title: "Double texts",
    body: "Back-to-back messages sent before a reply, counted per person, with the longest unanswered run.",
    visual: <DoubleTextVisual />,
  },
  {
    title: "Streaks and silences",
    body: "Your longest run of messaging every day, and the longest stretches where nobody said a word.",
    visual: <StreakVisual />,
  },
  {
    title: "How each person writes",
    body: "Average message length and how often each person asks questions, a quiet signal of who carries the conversation.",
    visual: <HabitsVisual />,
    span: "lg:col-span-2",
  },
  {
    title: "Share of voice",
    body: "Total messages and each person's share, at a glance.",
    visual: <VolumeVisual />,
    span: "md:col-span-2 lg:col-span-1",
  },
];

const HOW = [
  {
    title: "Export the chat",
    body: "In WhatsApp, open any individual or group chat and export it without media. You get a single .txt file.",
    visual: <ExportPathVisual />,
  },
  {
    title: "Drop it into Wingman",
    body: "The parser figures out your date format on its own: day-first or month-first, 12- or 24-hour clock.",
    visual: <FileVisual />,
  },
  {
    title: "Explore and ask",
    body: "Move through Overview, Response, Activity and Patterns, then put your questions to the AI analyst.",
    visual: <ViewsVisual />,
  },
];

const PRIVACY = [
  {
    icon: UserX,
    title: "No account",
    body: "There's nothing to sign up for. Open Wingman, drop a file, read the results.",
  },
  {
    icon: Database,
    title: "Processed, not stored",
    body: "Your export is parsed to compute statistics and is never saved to a database.",
  },
  {
    icon: HardDrive,
    title: "History lives on your device",
    body: "Analyses are kept in your browser's local storage. Delete a chat from the sidebar and it's gone.",
  },
  {
    icon: KeyRound,
    title: "Your AI key, your browser",
    body: "Your Gemini key never leaves local storage except to answer your question, and the AI only sees aggregate stats.",
  },
];

const FAQ = [
  {
    q: "Which chats can I analyze?",
    a: "Any individual or group chat you can export from WhatsApp. Use Export chat → Without media so the .txt file has only the messages.",
  },
  {
    q: "Will it understand my date format?",
    a: "Yes. Wingman samples the start of your export to work out whether dates are day-first or month-first, and handles 12- and 24-hour clocks, slashes or hyphens, and AM/PM.",
  },
  {
    q: "What does the AI analyst see?",
    a: "Only the computed summary: participant names, message counts, response-time percentiles, peak hours and per-person averages. Your message text is never sent to Gemini.",
  },
  {
    q: "Do I need a Gemini API key?",
    a: "Only for the AI chat. Every chart and statistic works without one. You can get a free key from Google AI Studio and it is stored in your browser.",
  },
  {
    q: "How long does an analysis take?",
    a: "Usually 30 to 60 seconds, depending on how long the chat history is. Once done, it reopens instantly from your saved chats.",
  },
];

export default function LandingPage() {
  useReveal();

  useEffect(() => {
    const root = document.documentElement;
    root.style.scrollBehavior = "smooth";
    return () => { root.style.scrollBehavior = ""; };
  }, []);

  return (
    <div className="wm-landing min-h-screen overflow-x-clip">
      {/* ── Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(8,9,11,0.72)] backdrop-blur-xl">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 h-16 flex items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-[18px] font-medium tracking-[-0.02em]">Wingman</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-[14px]">
            {NAV.map(n => <a key={n.href} href={n.href} className="wm-link">{n.label}</a>)}
          </nav>
          <Link to="/upload" className="wm-btn wm-btn-primary">Analyze a chat</Link>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section id="top" className="relative">
        <div className="wm-dots absolute inset-0 pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 pt-20 md:pt-28 pb-16 md:pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          <div className="wm-intro lg:col-span-7 flex flex-col">
            <div style={{ "--i": 0 }} className="flex items-center gap-2 text-[13px]">
              <span className="relative flex w-1.5 h-1.5">
                <span className="wm-ping absolute inset-0 rounded-full bg-[#f5c842]" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-[#f5c842]" />
              </span>
              <span className="text-white/85">No signup needed</span>
              <span className="text-[var(--dim)]">/</span>
              <span className="wm-eyebrow">WhatsApp chat analytics</span>
            </div>
            <h1 style={{ "--i": 1 }} className="mt-6 text-[44px] sm:text-[60px] lg:text-[76px] leading-[1.02] tracking-[-0.045em] font-medium text-balance">
              Read between the lines of every chat
            </h1>
            <div style={{ "--i": 2 }} className="mt-10 flex flex-wrap gap-3">
              <Link to="/upload" className="wm-btn wm-btn-primary h-11 px-5">
                Analyze your chat <ArrowRight size={16} strokeWidth={1.8} />
              </Link>
              <a href="#features" className="wm-btn wm-btn-ghost h-11 px-5">See what's inside</a>
            </div>
            <div style={{ "--i": 3 }} className="mt-5 flex flex-wrap gap-2 text-[12px] text-[var(--muted)]">
              <span className="wm-chip"><Lock size={12} strokeWidth={2} /> Saved only in your browser</span>
              <span className="wm-chip"><Check size={12} strokeWidth={2} /> Individual &amp; group chats</span>
            </div>
          </div>

          <div className="wm-intro lg:col-span-5 flex flex-col justify-end gap-8">
            <p style={{ "--i": 2 }} className="text-[16px] leading-[1.6] text-[var(--muted)] max-w-[440px]">
              Wingman turns an exported WhatsApp chat into a clear picture of how you talk:
              who replies fast, who starts conversations, when you're most active and how
              long the silences last. Then you can ask an AI about any of it.
            </p>
            <div style={{ "--i": 3 }} className="wm-bracket relative border border-[var(--line)] p-5 sm:p-6">
              <div className="wm-eyebrow mb-5">What you get</div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  ["P50·P99", "Reply times"],
                  ["24×7", "Activity map"],
                  ["Gemini", "AI analyst"],
                ].map(([v, l]) => (
                  <div key={l} className="flex flex-col gap-1">
                    <span className="text-[17px] sm:text-[20px] font-medium tracking-[-0.02em] text-white/90">{v}</span>
                    <span className="text-[12px] text-[var(--dim)]">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Showcase */}
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 pb-24" data-reveal>
          <div className="relative overflow-hidden rounded-[18px] border border-[var(--line)]">
            <div className="wm-backdrop" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_70%,rgba(8,9,11,0.35),transparent)]" />
            <div className="relative px-[4%] sm:px-[7%] pt-[6%]">
              <div className="overflow-hidden rounded-t-xl border border-b-0 border-white/10 shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,0,0,0.4)]">
                <DashboardShot />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Highlights ──────────────────────────────────── */}
      <section className="border-y border-[var(--line)]">
        <div className="mx-auto max-w-[1200px] grid grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h, i) => (
            <div
              key={h.label}
              data-reveal
              style={{ transitionDelay: `${i * 60}ms` }}
              className={`px-5 md:px-8 py-10 flex flex-col gap-2 border-[var(--line)] ${i % 2 === 0 ? "border-r" : i < 3 ? "lg:border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""}`}
            >
              <span className="text-[36px] md:text-[44px] font-medium tracking-[-0.04em] leading-none">{h.value}</span>
              <span className="text-[13px] text-[var(--dim)]">{h.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <Section
        id="features"
        index="01"
        label="Features"
        title="Everything your chat history knows, laid out plainly"
        lead="Twelve analyses run on every export. Each one answers a question you've probably wondered about."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] rounded-2xl overflow-hidden" data-reveal>
          {FEATURES.map(f => (
            <article key={f.title} className={`wm-cell bg-[var(--bg)] p-6 md:p-8 flex flex-col gap-8 ${f.span ?? ""}`}>
              <div className="min-h-[170px] flex items-center">{f.visual}</div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[16px] font-medium tracking-[-0.01em]">{f.title}</h3>
                <p className="text-[14px] leading-[1.6] text-[var(--muted)] max-w-[460px]">{f.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ── AI analyst ──────────────────────────────────── */}
      <Section id="ai" index="02" label="AI analyst">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 flex flex-col gap-6" data-reveal>
            <h2 className="wm-h2">Ask your chat anything</h2>
            <p className="text-[16px] leading-[1.6] text-[var(--muted)]">
              Charts tell you what happened. The AI analyst tells you what it means. It reads the
              statistics Wingman computed and answers in plain language, with real numbers.
            </p>
            <ul className="flex flex-col gap-3.5 text-[14px] text-white/80">
              {[
                "Answers grounded in your actual stats, not guesses",
                "Suggested questions to get you started",
                "Bring your own Gemini key, stored in your browser",
                "Only aggregate numbers are shared, never message text",
              ].map(t => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-[3px] w-4 h-4 rounded-full bg-[#f5c842]/10 text-[#f5c842] grid place-items-center flex-shrink-0">
                    <Check size={10} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7" data-reveal>
            <AIChatVisual />
          </div>
        </div>
      </Section>

      {/* ── How it works ────────────────────────────────── */}
      <Section
        id="how"
        index="03"
        label="How it works"
        title="Three steps, about a minute"
        lead="No installs on your phone and no permissions to grant. Just an export you already know how to make."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] rounded-2xl overflow-hidden" data-reveal>
          {HOW.map((s, i) => (
            <div key={s.title} className="bg-[var(--bg)] p-6 md:p-8 flex flex-col gap-6">
              <span className="wm-mono text-[12px] text-[var(--dim)]">0{i + 1}</span>
              <div className="min-h-[64px] flex items-center">{s.visual}</div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[16px] font-medium">{s.title}</h3>
                <p className="text-[14px] leading-[1.6] text-[var(--muted)]">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Privacy ─────────────────────────────────────── */}
      <Section
        id="privacy"
        index="04"
        label="Privacy"
        title="Your conversations stay yours"
        lead="Chats are personal. Wingman is built so that your messages are read once, turned into numbers, and left alone."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--line)] border border-[var(--line)] rounded-2xl overflow-hidden" data-reveal>
          {PRIVACY.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="bg-[var(--bg)] p-6 md:p-7 flex flex-col gap-10">
              <span className="w-9 h-9 rounded-lg border border-[var(--line)] bg-white/[0.03] grid place-items-center text-white/80">
                <Icon size={16} strokeWidth={1.6} />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-[15px] font-medium">{title}</h3>
                <p className="text-[13.5px] leading-[1.6] text-[var(--muted)]">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <Section id="faq" index="05" label="FAQ" title="Questions, answered">
        <div className="border-t border-[var(--line)]">
          {FAQ.map(f => (
            <details key={f.q} className="wm-faq group border-b border-[var(--line)]" data-reveal>
              <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none">
                <span className="text-[16px] md:text-[17px] text-white/90">{f.q}</span>
                <Plus size={18} strokeWidth={1.6} className="wm-faq-icon text-[var(--muted)] flex-shrink-0" />
              </summary>
              <p className="pb-6 -mt-1 max-w-[720px] text-[15px] leading-[1.65] text-[var(--muted)]">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* ── Closing CTA ─────────────────────────────────── */}
      <section className="border-t border-[var(--line)] relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[360px] pointer-events-none bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(245,200,66,0.07),transparent)]" />
        <div className="relative mx-auto max-w-[760px] px-5 md:px-8 py-24 md:py-32 flex flex-col items-center text-center" data-reveal>
          <span className="wm-eyebrow">Start here</span>
          <h2 className="wm-h2 mt-4">Drop a chat. See the whole story.</h2>
          <p className="mt-4 text-[15px] text-[var(--muted)] max-w-[440px]">
            Export any WhatsApp chat as a .txt file without media and get your full breakdown in under a minute.
          </p>
          <Link to="/upload" className="wm-btn wm-btn-primary h-11 px-5 mt-9">
            Analyze your chat <ArrowRight size={16} strokeWidth={1.8} />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-[var(--line)]">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Logo size={22} />
              <span className="text-[16px] font-medium tracking-[-0.02em]">Wingman</span>
            </div>
            <p className="text-[13px] text-[var(--dim)]">A private, local-first lens on your WhatsApp chats.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
            {NAV.map(n => <a key={n.href} href={n.href} className="wm-link">{n.label}</a>)}
          </nav>
        </div>
      </footer>

    </div>
  );
}

function Section({ id, index, label, title, lead, children }) {
  return (
    <section id={id} className="border-t border-[var(--line)] scroll-mt-16">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-24 md:py-32">
        <div className="wm-eyebrow mb-10 flex items-center gap-3" data-reveal>
          <span className="text-white/70">{index}</span>
          <span className="h-px w-8 bg-[var(--line)]" />
          {label}
        </div>
        {title && (
          <div className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end" data-reveal>
            <h2 className="wm-h2 lg:col-span-7">{title}</h2>
            {lead && <p className="lg:col-span-5 text-[16px] leading-[1.6] text-[var(--muted)] max-w-[440px]">{lead}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

// Fades sections in the first time they scroll into view.
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.dataset.reveal = "in";
        io.unobserve(e.target);
      }),
      { rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
