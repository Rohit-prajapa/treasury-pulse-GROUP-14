import {
  Activity, BarChart3, Bot, CircleDollarSign, FileText, LayoutDashboard,
  Settings2, SlidersHorizontal, X,
} from "lucide-react";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Transactions", icon: CircleDollarSign },
  { label: "Forecast", icon: BarChart3 },
  { label: "Scenarios", icon: SlidersHorizontal },
  { label: "AI Assistant", icon: Bot },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings2 },
];

export default function Sidebar({ active, onNavigate, open, onClose }) {
  return (
    <>
      {open && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-black/60 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-[#0b1322] transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[76px] items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/15 p-2 text-sky-400"><Activity size={23} /></div>
            <div><p className="font-bold tracking-wide text-white">TREASURY</p><p className="text-xs tracking-[0.22em] text-sky-400">PULSE</p></div>
          </div>
          <button onClick={onClose} className="text-slate-400 lg:hidden" aria-label="Close menu"><X size={20} /></button>
        </div>
        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
          <nav className="space-y-1">
            {navigation.map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => { onNavigate(label); onClose(); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${active === label ? "border border-blue-500/20 bg-blue-500/10 font-medium text-sky-300" : "text-slate-400 hover:bg-slate-800/70 hover:text-white"}`}>
                <Icon size={18} />{label}
                {label === "Overview" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-400" />}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t border-slate-800 p-4">
          <div className="rounded-xl border border-slate-800 bg-[#101a2b] p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400"><span className="h-2 w-2 rounded-full bg-emerald-400" />Demo environment</div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Synthetic data · Local workspace</p>
          </div>
        </div>
      </aside>
    </>
  );
}