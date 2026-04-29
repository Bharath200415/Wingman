import StatsGrid from "../StatsGrid.jsx";
import MessageVolumeChart from "../charts/MessageVolumeChart.jsx";
import DailyStreakChart from "../charts/DailyStreakChart.jsx";
import ResponsePercentilesChart from "../charts/ResponsePercentilesChart.jsx";
import ActivityHourChart from "../charts/ActivityHourChart.jsx";
import WeekdayChart from "../charts/WeekdayChart.jsx";
import InitiatorsChart from "../charts/InitiatorsChart.jsx";
import DoubleTextFrequency from "../charts/DoubleTextFrequency.jsx";
import MessageLengthChart from "../charts/MessageLengthChart.jsx";
import QuestionFreqChart from "../charts/QuestionFreqChart.jsx";
import ConversationGapsChart from "../charts/ConversationGapsChart.jsx";
import { C } from "../../ui.jsx";

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-4 w-0.5 rounded-full" style={{ background: C.gold }} />
      <span className="text-sm sm:text-lg tracking-tight font-semibold text-neutral-800 dark:text-neutral-50">
        {children}
      </span>
    </div>
  );
}

function getRawMessages(data) {
  return data?.raw_messages ?? data?.rawMessages ?? data?.messages ?? [];
}

function getSenderStats(data) {
  return data?.sender_stats ?? data?.senderStats ?? {};
}

function getDoubleTextData(rawMessages) {
  if (!rawMessages?.length) return { doubleText: [], streaks: [] };

  const sorted = [...rawMessages]
    .map((message) => ({ ...message, ts: new Date(message.timestamp).getTime() }))
    .filter((message) => !Number.isNaN(message.ts))
    .sort((a, b) => a.ts - b.ts);

  const doubleTextCounts = {};
  const longestStreaks = {};

  let currentSender = null;
  let currentStreak = 0;

  sorted.forEach((message) => {
    if (message.sender === currentSender) {
      currentStreak += 1;
      return;
    }

    if (currentSender && currentStreak > 1) {
      doubleTextCounts[currentSender] = (doubleTextCounts[currentSender] || 0) + 1;
      longestStreaks[currentSender] = Math.max(longestStreaks[currentSender] || 0, currentStreak);
    }

    currentSender = message.sender;
    currentStreak = 1;
  });

  if (currentSender && currentStreak > 1) {
    doubleTextCounts[currentSender] = (doubleTextCounts[currentSender] || 0) + 1;
    longestStreaks[currentSender] = Math.max(longestStreaks[currentSender] || 0, currentStreak);
  }

  const doubleText = Object.entries(doubleTextCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const streaks = Object.entries(longestStreaks)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return { doubleText, streaks };
}

export function OverviewSection({ data }) {
  const { stats, participants, total_messages } = data;
  const sender_stats = getSenderStats(data);
  const raw_messages = getRawMessages(data);
  return (
    <div>
      <StatsGrid stats={stats} totalMessages={total_messages} participants={participants} />
      <SectionTitle>Chat Volume</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <MessageVolumeChart senderStats={sender_stats} />
        <DailyStreakChart rawMessages={raw_messages} />
      </div>
    </div>
  );
}

export function ResponseSection({ data }) {
  const response_by_sender = data?.response_by_sender ?? data?.responseBySender ?? {};
  return (
    <div>
      <SectionTitle>Response Time Analysis</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ResponsePercentilesChart responseByPerson={response_by_sender} />
        {/* Explanation card */}
        <div className="rounded-2xl p-5 flex flex-col gap-4 bg-gradient-to-t from-neutral-100 to-neutral-50 border dark:border-neutral-800 shadow-sm dark:from-neutral-950 dark:to-neutral-900 ">
          <p className="text-md font-semibold text-neutral-950 dark:text-neutral-200 border-b pb-2 border-neutral-200 dark:border-neutral-600/60" >Reading Percentiles</p>
          <span className="mb-3"></span>
          {[
            { label:"P50", color: C.green,  desc:"Median : (Usually) half of replies come within this time." },
            { label:"P90", color: C.gold,   desc:"90% of replies are faster than this." },
            { label:"P99", color: C.rose,   desc:"The worst 1% : how long they can ghost." },
          ].map(r => (
            <div key={r.label} className="flex items-start gap-3 mb-2">
              <span className="text-xs font-black px-2 py-0.5 rounded-md mt-0.1" style={{ background:`${r.color}20`, color: r.color, fontFamily:"'Fira Code',monospace" }}>{r.label}</span>
              <p className="text-sm leading-relaxed" style={{ color: C.ink2 }}>{r.desc}</p>
            </div>
          ))}
          <p className="text-sm leading-relaxed mt-9 bottom-0" style={{ color: C.ink3 }}>
            A big gap between P50 and P99 means someone usually replies fast but occasionally disappears for hours.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ActivitySection({ data }) {
  const raw_messages = getRawMessages(data);
  const doubleTextData = getDoubleTextData(raw_messages);
  return (
    <div>
      <SectionTitle>When You Chat</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ActivityHourChart rawMessages={raw_messages} />
        <WeekdayChart rawMessages={raw_messages} />
      </div>
      <SectionTitle>Who Drives the Chat</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InitiatorsChart rawMessages={raw_messages} />
      </div>
      <SectionTitle>Double Texts</SectionTitle>
      <div className="grid grid-cols-1 gap-4 mt-6">
        <DoubleTextFrequency doubleTextData={doubleTextData} rawMessages={raw_messages} />
      </div>
    </div>
  );
}

export function PatternsSection({ data }) {
  const sender_stats = getSenderStats(data);
  const raw_messages = getRawMessages(data);
  return (
    <div>
      <SectionTitle>Message Patterns</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <MessageLengthChart senderStats={sender_stats} />
        <QuestionFreqChart senderStats={sender_stats} />
      </div>
      <SectionTitle>Silence & Gaps</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ConversationGapsChart rawMessages={raw_messages} />
      </div>
    </div>
  );
}
