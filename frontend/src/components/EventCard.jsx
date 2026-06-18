import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import eventImage from "@/assets/community-events.jpg";

function EventCard({ name, location, date, crowd, volunteers, reports, imagePosition }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
      <div className="relative h-48 overflow-hidden bg-slate-200">
        <div
          className="absolute inset-0 bg-cover transition duration-500 group-hover:scale-[1.03]"
          style={{ backgroundImage: `url(${eventImage})`, backgroundPosition: imagePosition }}
          role="img"
          aria-label={`${name} event`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-emerald-700 shadow-sm">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" /> Active
        </span>
        <p className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs font-medium text-white"><MapPin className="size-3.5" />{location}</p>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold tracking-tight text-slate-950">{name}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><CalendarDays className="size-4" />{date}</p>
        <div className="mt-5 grid grid-cols-3 border-y border-slate-100 py-4">
          <div><strong className="block text-sm text-slate-900">{crowd}</strong><span className="text-[10px] text-slate-500">Expected</span></div>
          <div className="border-x border-slate-100 px-3"><strong className="block text-sm text-slate-900">{volunteers}</strong><span className="text-[10px] text-slate-500">Volunteers</span></div>
          <div className="pl-3"><strong className="block text-sm text-slate-900">{reports}</strong><span className="text-[10px] text-slate-500">Reports</span></div>
        </div>
        <Button variant="ghost" className="mt-3 w-full justify-between px-0 text-brand-700 hover:bg-transparent">
          View Event <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Button>
      </div>
    </article>
  );
}

export default EventCard;
