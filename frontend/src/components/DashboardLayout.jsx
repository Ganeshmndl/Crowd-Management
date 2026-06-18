import {
  CalendarDays,
  HeartHandshake,
  LogOut,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

function DashboardLayout({ title, description }) {
  const { logout, selectedEvent, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-600 text-white">
              <HeartHandshake className="size-5" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Crowd<span className="text-brand-600">Care</span>
            </span>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                {user.role} account
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                {description}
              </p>
            </div>
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <ShieldCheck className="size-7" />
            </span>
          </div>

          <div className="mt-9 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <UserRound className="size-5 text-brand-600" />
              <div>
                <p className="font-bold text-slate-950">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 rounded-2xl border border-blue-100 bg-brand-50 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
                Selected event
              </p>
              <p className="mt-1 font-bold text-slate-950">{selectedEvent.name}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="size-4" />
                {selectedEvent.venue}, {selectedEvent.district}
              </p>
            </div>
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <CalendarDays className="size-4 text-brand-600" />
              {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                new Date(selectedEvent.date),
              )}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DashboardLayout;
