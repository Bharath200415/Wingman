import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, ChartTooltip, C, CHART_COLORS } from "../../ui.jsx";

export default function MessageLengthChart({ senderStats }) {
  if (!senderStats || !Object.keys(senderStats).length) return null;

  const data = Object.entries(senderStats)
    .map(([name, s]) => ({
      name: name.length > 16 ? name.slice(0, 14) + "…" : name,
      // backend key is avg_msg_length
      avgLength: Math.round(s.avg_msg_length ?? s.avg_message_length ?? 0),
    }))
    .filter(d => d.avgLength > 0)
    .sort((a, b) => b.avgLength - a.avgLength);

  if (!data.length) return null;

  return (
    <Card>
      <CardHeader title="Avg Message Length" badge="chars per message" />
      <div className="p-4">
        <ResponsiveContainer width="100%" height={Math.max(160, data.length * 52)}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 48, top: 4, bottom: 4 }}>
            <XAxis
              type="number"
              tick={{ fill: C.ink3, fontSize: 10, fontFamily: "'Fira Code',monospace" }}
              axisLine={false} tickLine={false} unit=" ch"
            />
            <YAxis
              type="category" dataKey="name" width={100}
              tick={{ fill: C.ink2, fontSize: 11 }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<ChartTooltip unit=" chars" />} cursor={{ fill: `${C.gold}08` }} />
            <Bar dataKey="avgLength" name="Avg Length" radius={[0, 6, 6, 0]} isAnimationActive={false}>
              {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
