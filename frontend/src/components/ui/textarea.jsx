import { cn } from "@/lib/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
