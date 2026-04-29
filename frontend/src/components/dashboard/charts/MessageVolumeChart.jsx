import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, ChartTooltip, C, CHART_COLORS } from "../../ui.jsx";

export default function MessageVolumeChart({ senderStats }) {
  if (!senderStats || !Object.keys(senderStats).length) return null;

  const data = Object.entries(senderStats)
    .map(([name, s]) => ({
      name: name.length > 16 ? name.slice(0, 14) + "…" : name,
      messages: s.message_count ?? s.messages ?? 0,
      pct: s.pct_of_total ?? s.share_pct ?? 0,
    }))
    .sort((a, b) => b.messages - a.messages);

  return (
    <Card  >
      <CardHeader
      title="Message Volume" badge="who talks more" />
      <div>
        <ResponsiveContainer width="100%" height={Math.max(160, data.length * 52)}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 48, top: 4, bottom: 4 }}>
            <XAxis
              type="number"
              tick={{ fill: C.ink3, fontSize: 10, fontFamily: "'Fira Code',monospace" }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              type="category" dataKey="name" width={100}
              tick={{ fill: C.ink2, fontSize: 11 }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<ChartTooltip unit=" msgs" />} cursor={{ fill: `${C.gold}08` }} />
            <Bar dataKey="messages" name="Messages" radius={[0, 6, 6, 0]} isAnimationActive={false}>
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-3 px-1">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
              <span className="text-[10px]" style={{ color: C.ink2 }}>
                {d.name} <span style={{ color: C.ink3 }}>({d.pct}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
