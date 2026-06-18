import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white text-slate-950 shadow-card",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-6", className)} {...props} />;
}

export { Card, CardContent };
