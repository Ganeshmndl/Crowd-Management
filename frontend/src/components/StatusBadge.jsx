const styles = {
  open: "bg-amber-50 text-amber-700 ring-amber-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  under_review: "bg-blue-50 text-blue-700 ring-blue-200",
  verified: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  matched: "bg-purple-50 text-purple-700 ring-purple-200",
  approved: "bg-purple-50 text-purple-700 ring-purple-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  active: "bg-red-50 text-red-700 ring-red-200",
  responding: "bg-blue-50 text-blue-700 ring-blue-200",
  resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  found: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  reunited: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ring-inset ${styles[status] || styles.closed}`}
    >
      {String(status).replace("_", " ")}
    </span>
  );
}

export default StatusBadge;
