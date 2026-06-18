import { cn } from "@/lib/utils";

function Label({ className, ...props }) {
  return (
    <label
      className={cn("mb-2 block text-sm font-semibold text-slate-700", className)}
      {...props}
    />
  );
}

export { Label };
