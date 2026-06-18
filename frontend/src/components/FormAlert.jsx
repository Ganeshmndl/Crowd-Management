import { AlertCircle, CheckCircle2 } from "lucide-react";

function FormAlert({ type = "error", children }) {
  const success = type === "success";
  const Icon = success ? CheckCircle2 : AlertCircle;

  return (
    <div
      role={success ? "status" : "alert"}
      className={`flex gap-3 rounded-xl border p-3.5 text-sm ${
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-rose-200 bg-rose-50 text-rose-800"
      }`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export default FormAlert;
