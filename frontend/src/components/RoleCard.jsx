import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function RoleCard({ icon: Icon, role, description, items, featured }) {
  return (
    <Card
      className={
        featured
          ? "relative border-brand-200 bg-brand-600 text-white shadow-xl shadow-blue-600/20"
          : "h-full"
      }
    >
      {featured && (
        <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
          Event team
        </span>
      )}
      <CardContent>
        <span className={`grid size-12 place-items-center rounded-xl ${featured ? "bg-white/15" : "bg-brand-50 text-brand-600"}`}>
          <Icon className="size-6" />
        </span>
        <h3 className={`mt-5 text-xl font-bold ${featured ? "text-white" : "text-slate-950"}`}>{role}</h3>
        <p className={`mt-2 text-sm leading-6 ${featured ? "text-blue-100" : "text-slate-600"}`}>{description}</p>
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li key={item} className={`flex items-center gap-3 text-sm font-medium ${featured ? "text-white" : "text-slate-700"}`}>
              <span className={`grid size-5 place-items-center rounded-full ${featured ? "bg-white/15" : "bg-emerald-50 text-emerald-600"}`}>
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default RoleCard;
