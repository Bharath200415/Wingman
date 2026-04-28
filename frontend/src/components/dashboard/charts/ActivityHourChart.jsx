import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, ChartTooltip, C } from "../../ui.jsx";

// Safely parse ISO or fallback timestamp strings
function parseHour(ts) {
  if (!ts) return null;
  // ISO: "2025-01-03T10:30:00" — split on T, take time part
  try {
    if (ts.includes("T")) {
      const hour = parseInt(ts.split("T")[1].split(":")[0], 10);
      return isNaN(hour) ? null : hour;
    }
    // Fallback to Date parsing
    const d = new Date(ts);
    if (!isNaN(d)) return d.getHours();
  } catch {}
  return null;
}

export default function ActivityHourChart({ rawMessages }) {
  if (!rawMessages?.length) return null;

  const hourCounts = Array(24).fill(0);
  rawMessages.forEach(m => {
    const h = parseHour(m.timestamp);
    if (h !== null) hourCounts[h]++;
  });

  const maxCount = Math.max(...hourCounts);

  const data = hourCounts.map((count, h) => ({
    label: h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`,
    count,
    isLateNight: h < 6,
    isPeak: count === maxCount && count > 0,
  }));

  return (
    <Card>
      <CardHeader title="Activity by Hour" badge="peak hours" />
      <div className="p-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
            <XAxis
              dataKey="label"
              tick={{ fill: C.ink3, fontSize: 9, fontFamily: "'Fira Code',monospace" }}
              axisLine={false} tickLine={false} interval={2}
            />
            <YAxis tick={{ fill: C.ink3, fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip unit=" msgs" />} cursor={{ fill: `${C.gold}08` }} />
            <Bar dataKey="count" name="Messages" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.isLateNight ? C.rose : d.isPeak ? C.gold : `${C.gold}55`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: C.gold }} />
            <span className="text-[10px]" style={{ color: C.ink3 }}>Peak hour</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: C.rose }} />
            <span className="text-[10px]" style={{ color: C.ink3 }}>Late night (12a–6a)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
