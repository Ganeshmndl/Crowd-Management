import { cn } from "@/lib/utils";

function SectionHeading({ eyebrow, title, description, align = "center", theme = "light" }) {
  return (
    <div
      className={cn(
        "mx-auto mb-12 max-w-2xl",
        align === "center" ? "text-center" : "mx-0 text-left",
      )}
    >
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
        {eyebrow}
      </p>
      <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${theme === "dark" ? "text-white" : "text-slate-950"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-7 sm:text-lg ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
