import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  HeartHandshake,
  LoaderCircle,
  LogOut,
  MapPin,
  Search,
  UsersRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FormAlert from "@/components/FormAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { getDashboardPath } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  upcoming: "bg-blue-50 text-blue-700 ring-blue-200",
  completed: "bg-slate-100 text-slate-600 ring-slate-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

function EventSelectionPage() {
  const { logout, selectEvent, selectedEvent, token, user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await apiRequest("/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(data.events);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [token]);

  const filteredEvents = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) return events;

    return events.filter((event) =>
      [event.name, event.province, event.district, event.venue].some((value) =>
        value.toLowerCase().includes(searchTerm),
      ),
    );
  }, [events, query]);

  const handleSelect = async (eventId) => {
    setError("");
    setSelectingId(eventId);

    try {
      await selectEvent(eventId);
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (requestError) {
      setError(requestError.message);
      setSelectingId("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            Event access
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Select your event
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Choose the event you are attending or supporting. Your dashboard will
            use this selection until you choose another event.
          </p>
        </div>

        <div className="relative mt-8 max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-3.5 size-5 text-slate-400" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by event, venue, district, or province"
            className="h-12 bg-white pl-12 shadow-sm"
            aria-label="Search events"
          />
        </div>

        {error && (
          <div className="mt-6 max-w-2xl">
            <FormAlert>{error}</FormAlert>
          </div>
        )}

        {loading ? (
          <div className="grid min-h-72 place-items-center">
            <LoaderCircle className="size-8 animate-spin text-brand-600" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <CalendarDays className="mx-auto size-10 text-slate-300" />
            <h2 className="mt-4 font-bold text-slate-900">No events found</h2>
            <p className="mt-2 text-sm text-slate-500">
              {query ? "Try a different search term." : "An administrator has not added any events yet."}
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => {
              const unavailable = ["completed", "cancelled"].includes(event.status);
              const isSelected = selectedEvent?._id === event._id;

              return (
                <article
                  key={event._id}
                  className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ring-inset ${statusStyles[event.status]}`}
                    >
                      {event.status}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="size-4" />
                        Selected
                      </span>
                    )}
                  </div>

                  <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-950">
                    {event.name}
                  </h2>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" />
                      <span>
                        {event.venue}, {event.district}, {event.province}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-brand-600" />
                      {new Intl.DateTimeFormat("en", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(event.startDate || event.date))}
                    </p>
                    <p className="flex items-center gap-2">
                      <UsersRound className="size-4 text-brand-600" />
                      {new Intl.NumberFormat().format(event.capacity)} capacity
                    </p>
                  </div>

                  <Button
                    className="mt-6 w-full"
                    variant={isSelected ? "outline" : "default"}
                    disabled={unavailable || selectingId === event._id}
                    onClick={() => handleSelect(event._id)}
                  >
                    {selectingId === event._id && (
                      <LoaderCircle className="size-4 animate-spin" />
                    )}
                    {unavailable
                      ? "Unavailable"
                      : isSelected
                        ? "Continue with event"
                        : "Select event"}
                  </Button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default EventSelectionPage;
