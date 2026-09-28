import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function OperationsPreview() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_80px_-35px_rgba(15,23,42,.35)]">
      <div className="flex h-11 items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4">
        <span className="size-2.5 rounded-full bg-red-300" />
        <span className="size-2.5 rounded-full bg-amber-300" />
        <span className="size-2.5 rounded-full bg-emerald-300" />
        <span className="ml-3 text-[10px] font-semibold text-slate-400">
          Yatra Saarthi Operations
        </span>
      </div>
      <div className="grid min-h-[430px] grid-cols-[52px_1fr] sm:grid-cols-[68px_1fr]">
        <aside className="flex flex-col items-center gap-3 border-r border-slate-100 bg-slate-950 py-5">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-xs font-bold text-white">
            C
          </span>
          {[0, 1, 2, 3].map((item) => (
            <span
              key={item}
              className={`size-7 rounded-lg ${item === 0 ? "bg-white/15" : "bg-white/5"}`}
            />
          ))}
        </aside>
        <div className="min-w-0 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-600">
                Active event
              </p>
              <h2 className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                Chhath Festival Operations
              </h2>
              <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                <MapPin className="size-3" /> Ganga Sagar, Janakpur
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />{" "}
              Live
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["12", "Open cases", "text-amber-600"],
              ["48", "Volunteers", "text-brand-600"],
              ["3", "SOS alerts", "text-rose-600"],
            ].map(([value, label, color]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-100 bg-slate-50 p-2.5"
              >
                <strong className={`block text-lg ${color}`}>{value}</strong>
                <span className="text-[9px] font-medium text-slate-500">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-[1.4fr_.8fr]">
            <div className="relative min-h-48 overflow-hidden rounded-xl border border-slate-100 bg-[#eef3f7]">
              <div className="product-map-grid absolute inset-0" />
              <div className="map-line map-line-one" />
              <div className="map-line map-line-two" />
              <span className="absolute left-[28%] top-[35%] grid size-7 place-items-center rounded-full bg-brand-600 text-white shadow-lg ring-4 ring-blue-100">
                <Users className="size-3.5" />
              </span>
              <span className="absolute right-[22%] top-[21%] grid size-7 place-items-center rounded-full bg-rose-500 text-white shadow-lg ring-4 ring-rose-100">
                <AlertTriangle className="size-3.5" />
              </span>
              <span className="absolute bottom-[22%] right-[37%] grid size-7 place-items-center rounded-full bg-emerald-500 text-white shadow-lg ring-4 ring-emerald-100">
                <CheckCircle2 className="size-3.5" />
              </span>
              <div className="absolute bottom-2.5 left-2.5 rounded-lg bg-white/95 px-2.5 py-2 text-[9px] font-semibold text-slate-600 shadow-sm">
                8 safety zones monitored
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-700">
                Recent activity
              </p>
              {[
                ["Case #CC-142 verified", "2m", "bg-emerald-500"],
                ["Volunteer assigned", "4m", "bg-brand-500"],
                ["Family notified", "7m", "bg-violet-500"],
              ].map(([label, time, color]) => (
                <div
                  key={label}
                  className="rounded-lg border border-slate-100 p-2.5"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-1 size-1.5 shrink-0 rounded-full ${color}`}
                    />
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold leading-4 text-slate-700">
                        {label}
                      </p>
                      <p className="flex items-center gap-1 text-[8px] text-slate-400">
                        <Clock3 className="size-2.5" />
                        {time} ago
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5">
            <div>
              <p className="text-[9px] font-bold text-emerald-800">
                Reunification progress
              </p>
              <p className="text-[8px] text-emerald-600">
                9 of 12 active cases resolved
              </p>
            </div>
            <strong className="text-sm text-emerald-700">75%</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-white">
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-14 px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:grid-cols-[.92fr_1.08fr] lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Emergency coordination for public events
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[3.65rem]">
            Find missing loved ones faster during large public events
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Yatra Saarthi helps families, volunteers, and event committees
            coordinate missing-person reports, emergency requests, and
            reunification efforts through one trusted platform.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg">
              <Search className="size-4" />
              Report Missing Person
            </Button>
            <Button variant="outline" size="lg">
              View Active Events
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-slate-500">
            <CheckCircle2 className="size-4 text-emerald-500" />
            Verified workflows. No app download required.
          </p>
        </div>
        <div className="relative">
          <div className="absolute -inset-12 -z-10 bg-[radial-gradient(circle,rgba(37,99,235,.12),transparent_65%)]" />
          <OperationsPreview />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
