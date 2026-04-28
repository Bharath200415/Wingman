import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, ChartTooltip, C } from "../../ui.jsx";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function parseDayIndex(ts) {
  if (!ts) return null;
  try {
    if (ts.includes("T")) {
      // "2025-01-03T..." — parse date part only to avoid timezone issues
      const [year, month, day] = ts.split("T")[0].split("-").map(Number);
      const d = new Date(year, month - 1, day).getDay(); // 0=Sun
      return d === 0 ? 6 : d - 1; // Mon=0 … Sun=6
    }
    const d = new Date(ts).getDay();
    return isNaN(d) ? null : (d === 0 ? 6 : d - 1);
  } catch { return null; }
}

export default function WeekdayChart({ rawMessages }) {
  if (!rawMessages?.length) return null;

  const dayCounts = Array(7).fill(0);
  rawMessages.forEach(m => {
    const idx = parseDayIndex(m.timestamp);
    if (idx !== null) dayCounts[idx]++;
  });

  const data = DAYS.map((day, i) => ({
    day,
    count: dayCounts[i],
    isWeekend: i >= 5,
  }));

  return (
    <Card>
      <CardHeader title="Activity by Weekday" badge="weekend vs weekday" />
      <div className="p-4">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
            <XAxis
              dataKey="day"
              tick={{ fill: C.ink2, fontSize: 11 }}
              axisLine={false} tickLine={false}
            />
            <YAxis tick={{ fill: C.ink3, fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip unit=" msgs" />} cursor={{ fill: `${C.gold}08` }} />
            <Bar dataKey="count" name="Messages" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.isWeekend ? C.green : `${C.gold}80`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: `${C.gold}80` }} />
            <span className="text-[10px]" style={{ color: C.ink3 }}>Weekday</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: C.green }} />
            <span className="text-[10px]" style={{ color: C.ink3 }}>Weekend</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
