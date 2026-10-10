import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export default function CashChart({ data }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#233148" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="day" interval={4} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}M`} />
          <Tooltip contentStyle={{ background: "#101a2b", border: "1px solid #334155", borderRadius: 12, color: "#e2e8f0" }} formatter={(value) => [`$${value}M`, "Projected cash"]} />
          <Area type="monotone" dataKey="baseline" stroke="#38bdf8" strokeWidth={2.5} fill="url(#cashGradient)" activeDot={{ r: 5, fill: "#38bdf8" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}