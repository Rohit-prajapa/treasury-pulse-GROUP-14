import { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowDownLeft, ArrowUpRight, Bell, CheckCircle2,
  Clock3, Menu, Search, ShieldCheck, SlidersHorizontal, Wallet, ChevronDown,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import CashChart from "./components/CashChart";
import { alerts, cashPositions, entities, forecastData } from "./data/mockData";

const money = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

function Panel({ title, subtitle, children, action }) {
  return <section className="rounded-2xl border border-slate-800 bg-[#101a2b] p-5">
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div><h2 className="font-semibold text-white">{title}</h2>{subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}</div>
      {action}
    </div>{children}
  </section>;
}

function Severity({ severity }) {
  const styles = {
    Warning: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    Critical: "border-orange-500/20 bg-orange-500/10 text-orange-400",
    Emergency: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  };
  return <span className={`inline-flex rounded-lg border px-2 py-1 text-[11px] font-medium ${styles[severity] ?? styles.Warning}`}>{severity}</span>;
}

export default function App() {
  const [active, setActive] = useState("Overview");
  const [entity, setEntity] = useState("all");
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [delay, setDelay] = useState(0);

  const positions = useMemo(() => cashPositions.filter((row) => entity === "all" || row.entity === entity), [entity]);
  const filtered = useMemo(() => positions.filter((row) => `${row.entity} ${row.currency}`.toLowerCase().includes(search.toLowerCase())), [positions, search]);
  const totalInflows = positions.reduce((sum, row) => sum + row.inflows, 0);
  const totalOutflows = positions.reduce((sum, row) => sum + row.outflows, 0);
  const totalGap = positions.reduce((sum, row) => sum + row.balance - row.threshold, 0);
  const entityLabel = entities.find((item) => item.id === entity)?.label ?? "All entities";
  const scenarioData = forecastData.map((point) => ({ ...point, scenario: Number((point.baseline - Math.min(delay * 0.025, 0.3)).toFixed(2)) }));

  const downloadCsv = () => {
    const rows = [
      ["Entity", "Currency", "Balance", "Inflows", "Outflows", "Threshold", "Gap"],
      ...filtered.map((row) => [row.entity, row.currency, row.balance, row.inflows, row.outflows, row.threshold, row.balance - row.threshold]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url; link.download = "treasury-pulse-positions.csv"; link.click();
    URL.revokeObjectURL(url);
  };

  return <div className="min-h-screen bg-[#080f1d] text-slate-200">
    <Sidebar active={active} onNavigate={setActive} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    <main className="min-h-screen lg:pl-64">
      <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between gap-4 border-b border-slate-800 bg-[#080f1d]/95 px-4 backdrop-blur-xl sm:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"><Menu size={21} /></button>
          <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{active}</p><p className="hidden text-xs text-slate-500 sm:block">Treasury Pulse / Liquidity Command Center</p></div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs text-emerald-400 md:flex"><span className="h-2 w-2 rounded-full bg-emerald-400" />Demo mode</span>
          <button aria-label="Alerts" onClick={() => setActive("Overview")} className="relative rounded-xl border border-slate-800 p-2.5 text-slate-400 hover:text-white"><Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-400" /></button>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-sm font-semibold text-sky-300">RP</div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-7">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1.5 text-xs text-sky-300"><Activity size={14} />Short-term liquidity manager</div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Good morning, Treasury</h1>
            <p className="mt-2 text-sm text-slate-400">Monitor liquidity, anticipate shortfalls and explore cash positions.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#101a2b] px-3 py-2.5">
              <ShieldCheck size={16} className="text-sky-400" />
              <select value={entity} onChange={(event) => setEntity(event.target.value)} className="max-w-[180px] bg-transparent text-sm text-slate-200 outline-none">
                {entities.map((item) => <option key={item.id} value={item.id} className="bg-[#101a2b]">{item.label}</option>)}
              </select><ChevronDown size={14} className="text-slate-500" />
            </label>
            <button onClick={downloadCsv} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500">Export CSV</button>
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs leading-5 text-amber-200/80">Demo data only — balances and forecasts are illustrative, not live financial information.</div>

        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          <StatCard title="Cash positions" value={`${positions.length} positions`} subtitle={`${entityLabel} · mixed currencies`} icon={Wallet} accent="blue" />
          <StatCard title="Total inflows" value={money(totalInflows)} subtitle="Across selected positions" icon={ArrowDownLeft} accent="green" />
          <StatCard title="Total outflows" value={money(totalOutflows)} subtitle="Across selected positions" icon={ArrowUpRight} accent="amber" />
          <StatCard title="Indicative liquidity gap" value={money(totalGap)} subtitle="Mixed-currency sum; not FX-adjusted" icon={Activity} accent={totalGap < 0 ? "red" : "green"} />
        </div>

        {(active === "Overview" || active === "Forecast") && <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
          <Panel title="30-day cash forecast" subtitle="Illustrative USD baseline · not model-generated" action={<span className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs text-slate-400">Next 30 days</span>}>
            <CashChart data={forecastData} />
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400"><span className="flex items-center gap-2"><span className="h-0.5 w-4 bg-sky-400" />Baseline forecast</span><span className="flex items-center gap-2"><span className="h-0.5 w-4 border-t border-dashed border-slate-500" />Confidence band pending</span></div>
          </Panel>
          <Panel title="Liquidity alerts" subtitle="Sample alerts · connect backend for live results" action={<span className="rounded-lg bg-rose-500/10 px-2 py-1 text-xs text-rose-400">{alerts.length} alerts</span>}>
            <div className="space-y-3">{alerts.map((alert, index) => <div key={`${alert.entity}-${index}`} className="rounded-xl border border-slate-800 bg-[#0b1322] p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-medium text-white">{alert.entity} · {alert.currency}</span><Severity severity={alert.severity} /></div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{alert.message}</p>
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500"><Clock3 size={12} />Sample time {alert.time}</p>
            </div>)}</div>
          </Panel>
        </div>}

        {active === "Scenarios" && <Panel title="What-if scenario simulator" subtitle="Illustrative demo scenario; connect the backend for real calculations">
          <div className="max-w-2xl space-y-5">
            <label className="block text-sm text-slate-300">Payment delay: <strong>{delay} days</strong><input type="range" min="0" max="5" value={delay} onChange={(event) => setDelay(Number(event.target.value))} className="mt-4 w-full accent-sky-400" /></label>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 p-4"><p className="text-sm text-slate-400">Baseline · Day 30</p><p className="mt-2 text-2xl font-semibold text-white">${forecastData[29].baseline}M</p></div>
              <div className="rounded-xl border border-slate-800 p-4"><p className="text-sm text-slate-400">Scenario · Day 30</p><p className="mt-2 text-2xl font-semibold text-sky-300">${scenarioData[29].scenario}M</p></div>
            </div>
            <CashChart data={scenarioData.map((point) => ({ ...point, baseline: point.scenario }))} />
            <p className="text-xs text-slate-500">Demo assumption: delay applies a fixed illustrative adjustment. Actual effects must use transaction due dates and settlement logic.</p>
          </div>
        </Panel>}

        {active === "Transactions" && <Panel title="Cash positions and transactions" subtitle={`${filtered.length} positions shown · ${entityLabel}`} action={<div className="flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2"><Search size={15} className="text-slate-500" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search entity or currency" className="w-40 bg-transparent text-xs outline-none placeholder:text-slate-500" /></div>}>
          <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs text-slate-500"><tr className="border-b border-slate-800">{["Entity", "Currency", "Balance", "Inflows", "Outflows", "Gap", "Status"].map((heading) => <th key={heading} className="px-3 py-3 font-medium">{heading}</th>)}</tr></thead>
            <tbody>{filtered.map((row, index) => {
              const gap = row.balance - row.threshold;
              const ratio = row.threshold > 0 ? gap / row.threshold : Infinity;
              const severity = gap < 0 ? "Emergency" : ratio <= 0.05 ? "Critical" : ratio <= 0.1 ? "Warning" : "Healthy";
              return <tr key={`${row.entity}-${row.currency}-${index}`} className="border-b border-slate-800/70">
                <td className="px-3 py-4 font-medium text-white">{row.entity}</td><td className="px-3 py-4">{row.currency}</td>
                <td className="px-3 py-4">{money(row.balance, row.currency)}</td><td className="px-3 py-4 text-emerald-400">{money(row.inflows, row.currency)}</td><td className="px-3 py-4 text-rose-400">{money(row.outflows, row.currency)}</td>
                <td className={`px-3 py-4 ${gap < 0 ? "text-rose-400" : "text-slate-300"}`}>{money(gap, row.currency)}</td>
                <td className="px-3 py-4">{severity === "Healthy" ? <span className="inline-flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 size={14} />Healthy</span> : <Severity severity={severity} />}</td>
              </tr>;
            })}</tbody>
          </table></div>
          {filtered.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No matching positions found.</p>}
        </Panel>}

        {active !== "Overview" && active !== "Forecast" && active !== "Scenarios" && active !== "Transactions" && <Panel title={active} subtitle="Treasury Pulse workspace">
          <div className="flex flex-col items-center py-12 text-center"><SlidersHorizontal size={30} className="text-sky-400" />
            <h2 className="mt-4 font-medium text-white">{active === "AI Assistant" ? "Treasury AI assistant" : active === "Reports" ? "Treasury reporting" : "Workspace settings"}</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{active === "AI Assistant" ? "Connect the chatbot API to answer questions using actual cash positions, forecasts and alerts." : active === "Reports" ? "Export the current demo positions as CSV. Scheduled PDF and SOD/EOD reports remain to be implemented." : "Role-based access, threshold configuration and backend integration are planned for the next stage."}</p>
            {active === "Reports" && <button onClick={downloadCsv} className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm text-white hover:bg-blue-500">Download CSV report</button>}
          </div>
        </Panel>}

        <footer className="flex flex-col justify-between gap-2 border-t border-slate-800 py-5 text-xs text-slate-500 sm:flex-row"><span>Treasury Pulse · Short-term Liquidity Manager</span><span className="flex items-center gap-1.5"><AlertTriangle size={13} />Synthetic data · Not for financial decisions</span></footer>
      </div>
    </main>
  </div>;
}