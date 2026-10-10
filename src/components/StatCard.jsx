export default function StatCard({ title, value, subtitle, icon: Icon, accent = "blue" }) {
  const accents = {
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
    red: "bg-rose-500/10 text-rose-400",
  };

  return (
    <article className="rounded-2xl border border-slate-800 bg-[#101a2b] p-5 transition hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">{value}</h3>
          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className={`rounded-xl p-3 ${accents[accent] ?? accents.blue}`}>
          {Icon ? <Icon size={21} /> : null}
        </div>
      </div>
    </article>
  );
}