import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Card, CardHeader, ChartTooltip, C, CHART_COLORS } from "../../ui.jsx";

export default function ResponsePercentilesChart({ responseByPerson }) {
  if (!responseByPerson || !Object.keys(responseByPerson).length) return null;

  const people = Object.entries(responseByPerson);
  // backend keys are p50, p90, p99
  const pctData = [
    { pct: "P50", ...Object.fromEntries(people.map(([n, v]) => [n.slice(0, 12), v.p50 ?? v.p50_minutes ?? 0])) },
    { pct: "P90", ...Object.fromEntries(people.map(([n, v]) => [n.slice(0, 12), v.p90 ?? v.p90_minutes ?? 0])) },
    { pct: "P99", ...Object.fromEntries(people.map(([n, v]) => [n.slice(0, 12), v.p99 ?? v.p99_minutes ?? 0])) },
  ];

  const keys = people.map(([n]) => n.slice(0, 12));

  return (
    <Card>
      <CardHeader title="Response Time Percentiles" badge="minutes" />
      <div className="p-4">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={pctData} margin={{ top: 20, right: 16, left: -10, bottom: 4 }}>
            <XAxis
              dataKey="pct"
              tick={{ fill: C.ink2, fontSize: 12, fontWeight: 600, fontFamily: "'Fira Code',monospace" }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: C.ink3, fontSize: 9, fontFamily: "'Fira Code',monospace" }}
              axisLine={false} tickLine={false} unit="m"
            />
            <Tooltip content={<ChartTooltip unit=" min" />} cursor={{ fill: `${C.gold}08` }} />
            {keys.map((k, i) => (
              <Bar key={k} dataKey={k} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false}>
                <LabelList
                  dataKey={k} position="top"
                  style={{ fill: C.ink3, fontSize: 9, fontFamily: "'Fira Code',monospace" }}
                  formatter={v => v ? `${v}m` : ""}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-2 px-1">
          {keys.map((k, i) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
              <span className="text-[10px]" style={{ color: C.ink2 }}>{k}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
