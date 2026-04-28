import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Card, CardHeader, ChartTooltip, C, CHART_COLORS } from "../../ui.jsx";

function parseTs(ts) {
  if (!ts) return null;
  try {
    if (ts.includes("T")) return new Date(ts).getTime();
    return new Date(ts).getTime();
  } catch { return null; }
}

function buildDoubleTextData(rawMessages) {
  if (!rawMessages?.length) return { doubleText: [], streaks: [] };

  const sorted = [...rawMessages]
    .map((m) => ({ ...m, tsValue: parseTs(m.timestamp) }))
    .filter((m) => m.tsValue !== null)
    .sort((a, b) => a.tsValue - b.tsValue);

  const doubleTextCounts = {};
  const longestStreaks = {};

  let currentSender = sorted[0]?.sender ?? null;
  let currentStreak = 0;

  sorted.forEach((message, index) => {
    if (index === 0) {
      currentSender = message.sender;
      currentStreak = 1;
      return;
    }

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
    .map(([name, count]) => ({
      name: name.length > 14 ? name.slice(0, 13) + "…" : name,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const streaks = Object.entries(longestStreaks)
    .map(([name, count]) => ({
      name: name.length > 14 ? name.slice(0, 13) + "…" : name,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return { doubleText, streaks };
}

export default function DoubleTextFrequency({ rawMessages, doubleTextData }) {
  const derived = rawMessages?.length ? buildDoubleTextData(rawMessages) : { doubleText: [], streaks: [] };
  const doubleText = doubleTextData?.doubleText ?? derived.doubleText;
  const streaks = doubleTextData?.streaks ?? derived.streaks;

  if (!doubleText.length && !streaks.length) return null;

  return (
    <Card>
      <CardHeader title="Double Text Analysis" badge="who double texts" />
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: C.ink3, fontFamily: "'Fira Code',monospace" }}>
              Double text incidents
            </p>
            {doubleText.length ? (
              <ResponsiveContainer width="100%" height={Math.max(180, doubleText.length * 42)}>
                <BarChart data={doubleText} layout="vertical" margin={{ top: 6, right: 16, left: -10, bottom: 4 }}>
                  <XAxis type="number" tick={{ fill: C.ink3, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fill: C.ink2, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip unit=" incidents" />} cursor={{ fill: `${C.gold}08` }} />
                  <Bar dataKey="count" name="Double texts" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                    <LabelList dataKey="count" position="right" style={{ fill: C.ink2, fontSize: 11, fontWeight: 600 }} />
                    {doubleText.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs" style={{ color: C.ink3 }}>No consecutive message streaks found.</p>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: C.ink3, fontFamily: "'Fira Code',monospace" }}>
              Longest streaks
            </p>
            {streaks.length ? (
              <ResponsiveContainer width="100%" height={Math.max(180, streaks.length * 42)}>
                <BarChart data={streaks} layout="vertical" margin={{ top: 6, right: 16, left: -10, bottom: 4 }}>
                  <XAxis type="number" tick={{ fill: C.ink3, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fill: C.ink2, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip unit=" msgs" />} cursor={{ fill: `${C.gold}08` }} />
                  <Bar dataKey="count" name="Max streak" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                    <LabelList dataKey="count" position="right" style={{ fill: C.ink2, fontSize: 11, fontWeight: 600 }} />
                    {streaks.map((_, i) => <Cell key={i} fill={CHART_COLORS[(i + 1) % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs" style={{ color: C.ink3 }}>No streak data available.</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
