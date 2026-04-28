import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, C } from "../../ui.jsx";

function parseTs(ts) {
  if (!ts) return null;
  try { return new Date(ts).getTime(); } catch { return null; }
}

export default function ConversationGapsChart({ rawMessages }) {
  if (!rawMessages?.length) return null;

  const sorted = [...rawMessages].sort((a, b) => parseTs(a.timestamp) - parseTs(b.timestamp));

  const gaps = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = parseTs(sorted[i - 1].timestamp);
    const curr = parseTs(sorted[i].timestamp);
    if (!prev || !curr) continue;
    const hrs = (curr - prev) / 3_600_000;
    if (hrs > 3) {
      gaps.push({
        hrs: Math.round(hrs * 10) / 10,
        date: sorted[i].timestamp?.split("T")[0] ?? "",
      });
    }
  }

  const data = gaps
    .sort((a, b) => b.hrs - a.hrs)
    .slice(0, 8)
    .map(g => ({
      label: g.date,
      hours: g.hrs,
      display: g.hrs >= 24 ? `${(g.hrs / 24).toFixed(1)}d` : `${g.hrs}h`,
    }));

  if (!data.length) return null;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="rounded-xl px-3 py-2 text-xs" style={{ background: C.surface3, border: `1px solid ${C.border2}`, color: C.ink }}>
        <p style={{ color: C.ink2 }}>{d.label}</p>
        <p style={{ color: C.rose }}><strong>{d.display}</strong> ({d.hours}h)</p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader title="Longest Silence Gaps" badge="hall of shame" />
      <div className="p-4">
        <ResponsiveContainer width="100%" height={Math.max(160, data.length * 36)}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 48, top: 4, bottom: 4 }}>
            <XAxis
              type="number"
              tick={{ fill: C.ink3, fontSize: 10, fontFamily: "'Fira Code',monospace" }}
              axisLine={false} tickLine={false} unit="h"
            />
            <YAxis
              type="category" dataKey="label" width={80}
              tick={{ fill: C.ink2, fontSize: 10 }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: `${C.rose}08` }} />
            <Bar dataKey="hours" name="Hours" radius={[0, 6, 6, 0]} isAnimationActive={false}>
              {data.map((_, i) => {
                const alpha = Math.round((1 - i * 0.08) * 255).toString(16).padStart(2, "0");
                return <Cell key={i} fill={`${C.rose}${alpha}`} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
