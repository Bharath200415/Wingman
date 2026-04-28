import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Card, CardHeader, ChartTooltip, C, CHART_COLORS } from "../../ui.jsx";

export default function QuestionFreqChart({ senderStats }) {
  if (!senderStats || !Object.keys(senderStats).length) return null;

  const data = Object.entries(senderStats)
    .map(([name, s]) => ({
      name: name.length > 14 ? name.slice(0, 13) + "…" : name,
      // backend key is questions_sent
      questions: s.questions_sent ?? 0,
      messageCount: s.message_count ?? s.messages ?? 0,
      rate: (s.message_count ?? s.messages ?? 0) > 0
        ? Math.round(((s.questions_sent ?? 0) / (s.message_count ?? s.messages ?? 0)) * 100)
        : 0,
    }))
    .sort((a, b) => b.questions - a.questions);

  const maxRate = Math.max(...data.map(d => d.rate), 1);

  return (
    <Card>
      <CardHeader title="Question Frequency" badge="who asks more" />
      <div className="p-4 flex flex-col gap-4">
        <ResponsiveContainer width="100%" height={Math.max(140, data.length * 48)}>
          <BarChart data={data} margin={{ top: 20, right: 16, left: -10, bottom: 4 }}>
            <XAxis dataKey="name" tick={{ fill: C.ink2, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.ink3, fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip unit=" questions" />} cursor={{ fill: `${C.gold}08` }} />
            <Bar dataKey="questions" name="Questions" radius={[6, 6, 0, 0]} maxBarSize={56} isAnimationActive={false}>
              <LabelList dataKey="questions" position="top" style={{ fill: C.ink2, fontSize: 11, fontWeight: 600 }} />
              {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Rate progress bars */}
        <div className="flex flex-col gap-2 pt-1" style={{ borderTop: `1px solid ${C.border}` }}>
          <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: C.ink3, fontFamily: "'Fira Code',monospace" }}>
            Question rate (% of messages)
          </p>
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-3">
              <span className="text-xs w-24 truncate" style={{ color: C.ink2 }}>{d.name}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: C.border }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(d.rate / maxRate) * 100}%`,
                    background: CHART_COLORS[i % CHART_COLORS.length],
                  }}
                />
              </div>
              <span className="text-[10px] w-8 text-right" style={{ color: C.ink3, fontFamily: "'Fira Code',monospace" }}>
                {d.rate}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
