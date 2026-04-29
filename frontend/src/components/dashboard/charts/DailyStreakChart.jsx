import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, ChartTooltip, C } from "../../ui.jsx";

export default function DailyStreakChart({ rawMessages }) {
  if (!rawMessages?.length) return null;

  const counts = {};
  rawMessages.forEach(m => {
    if (!m.timestamp) return;
    // Safe date extraction: take YYYY-MM-DD from ISO string
    const dateStr = m.timestamp.includes("T")
      ? m.timestamp.split("T")[0]
      : m.timestamp.slice(0, 10);
    if (dateStr) counts[dateStr] = (counts[dateStr] || 0) + 1;
  });

  const sorted = Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date: date.slice(5), count })); // show MM-DD

  const sampled = sorted.length > 90
    ? sorted.filter((_, i) => i % Math.ceil(sorted.length / 90) === 0)
    : sorted;

  return (
    <Card>
      <CardHeader  title="Daily Activity" badge="message streak" />
      <div className="p-4">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={sampled} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.gold} stopOpacity={0.25} />
                <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: C.ink3, fontSize: 9, fontFamily: "'Fira Code',monospace" }}
              axisLine={false} tickLine={false} interval="preserveStartEnd"
            />
            <YAxis tick={{ fill: C.ink3, fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip unit=" msgs" />} cursor={{ stroke: `${C.gold}40`, strokeWidth: 1 }} />
            <Area
              type="monotone" dataKey="count" name="Messages"
              stroke={C.gold} strokeWidth={2}
              fill="url(#goldGrad)" dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
