import {
  BellRing,
  ChevronDown,
  FileText,
  HeartHandshake,
  Home,
  LogOut,
  MapPin,
  Menu,
  Siren,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/NotificationBell";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  ["/user/dashboard", "Overview", Home],
  ["/user/reports", "My reports", FileText],
  ["/user/family", "Family", UsersRound],
  ["/user/sos", "SOS", Siren],
  ["/user/map", "Map", MapPin],
];

function UserModuleLayout({ title, description, actions, children }) {
  const { logout, selectedEvent, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/user/dashboard" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white">
              <HeartHandshake className="size-4" />
            </span>
            <span className="hidden font-extrabold tracking-tight sm:inline">
              Yatra Saarthi
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {navItems.map(([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-500 hover:text-slate-950",
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-3 sm:flex">
            <Link
              to="/select-event"
              className="flex max-w-56 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
            >
              <BellRing className="size-4 shrink-0 text-brand-600" />
              <span className="truncate">{selectedEvent.name}</span>
              <ChevronDown className="size-3.5 shrink-0" />
            </Link>
            <NotificationBell />
            <span className="grid size-9 place-items-center rounded-full bg-brand-50 text-brand-700">
              <UserRound className="size-4" />
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut className="size-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="ml-auto md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {menuOpen && (
          <nav className="border-t border-slate-100 bg-white p-3 md:hidden">
            {navItems.map(([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold",
                    isActive ? "bg-slate-100 text-slate-950" : "text-slate-600",
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </nav>
        )}
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Welcome back, {user.name.split(" ")[0]}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] text-slate-950">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm text-slate-500">{description}</p>
            )}
          </div>
          {actions}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

export default UserModuleLayout;
