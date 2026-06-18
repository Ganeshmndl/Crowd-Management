import { cn } from "@/lib/utils";

function Select({ className, ...props }) {
  return (
    <select
      className={cn(
        "flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-950 shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

export { Select };
