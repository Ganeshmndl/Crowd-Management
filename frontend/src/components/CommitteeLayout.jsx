import {
  BellRing,
  FileSearch,
  GitCompareArrows,
  HeartHandshake,
  Home,
  LogOut,
  MapPin,
  Menu,
  ShieldCheck,
  Siren,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/NotificationBell";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  ["/committee/dashboard", "Overview", Home],
  ["/committee/reports", "Reports", FileSearch],
  ["/committee/match-center", "Match center", GitCompareArrows],
  ["/committee/matches", "Matched cases", ShieldCheck],
  ["/committee/sos", "SOS center", Siren],
  ["/committee/map", "Map", MapPin],
];

function CommitteeLayout({ title, description, actions, children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/committee/dashboard" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white">
              <HeartHandshake className="size-4" />
            </span>
            <span className="hidden font-extrabold tracking-tight sm:inline">
              CrowdCare
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
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
            <span className="flex max-w-56 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">
              <BellRing className="size-4 shrink-0 text-brand-600" />
              <span className="truncate">{user.name}</span>
            </span>
            <NotificationBell />
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
            className="ml-auto lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>

        {open && (
          <nav className="border-t border-slate-100 bg-white p-3 lg:hidden">
            {navItems.map(([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
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
              Committee operations
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

export default CommitteeLayout;
