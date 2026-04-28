import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Card, CardHeader, ChartTooltip, C, CHART_COLORS } from "../../ui.jsx";

function parseTs(ts) {
  if (!ts) return null;
  try {
    if (ts.includes("T")) return new Date(ts).getTime();
    return new Date(ts).getTime();
  } catch { return null; }
}

export default function InitiatorsChart({ rawMessages }) {
  if (!rawMessages?.length) return null;

  const sorted = [...rawMessages].sort((a, b) => parseTs(a.timestamp) - parseTs(b.timestamp));

  const starts = {};
  sorted.forEach((m, i) => {
    if (i === 0) { starts[m.sender] = (starts[m.sender] || 0) + 1; return; }
    const prev = parseTs(sorted[i - 1].timestamp);
    const curr = parseTs(m.timestamp);
    if (prev && curr) {
      const gapHrs = (curr - prev) / 3_600_000;
      if (gapHrs > 6) starts[m.sender] = (starts[m.sender] || 0) + 1;
    }
  });

  const data = Object.entries(starts)
    .map(([name, count]) => ({
      name: name.length > 14 ? name.slice(0, 13) + "…" : name,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  if (!data.length) return null;

  return (
    <Card>
      <CardHeader title="Conversation Starters" badge="who initiates" />
      <div className="p-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 20, right: 16, left: -10, bottom: 4 }}>
            <XAxis dataKey="name" tick={{ fill: C.ink2, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.ink3, fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip unit=" convos" />} cursor={{ fill: `${C.gold}08` }} />
            <Bar dataKey="count" name="Conversations Started" radius={[6, 6, 0, 0]} maxBarSize={60} isAnimationActive={false}>
              <LabelList dataKey="count" position="top" style={{ fill: C.ink2, fontSize: 11, fontWeight: 600 }} />
              {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
