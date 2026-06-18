function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${color}`}>
        <Icon className="size-6" />
      </span>
      <div>
        <p className="text-2xl font-extrabold tracking-tight text-slate-950">{value}</p>
        <p className="mt-0.5 text-sm font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
