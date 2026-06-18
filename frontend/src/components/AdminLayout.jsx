import {
  BarChart3,
  CalendarDays,
  HeartHandshake,
  LogOut,
  MapPin,
  Menu,
  Settings,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

function AdminLayout({ activeTab, setActiveTab, title, description, children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const tabs = [
    ["overview", "Overview", BarChart3],
    ["users", "Users", UsersRound],
    ["committees", "Committees", ShieldCheck],
    ["events", "Events", CalendarDays],
    ["map-locations", "Map Locations", MapPin],
    ["analytics", "Analytics", Settings],
  ];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const tabButtons = (
    <>
      {tabs.map(([key, label, Icon]) => (
        <button
          key={key}
          onClick={() => {
            setActiveTab(key);
            setOpen(false);
          }}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
            activeTab === key
              ? "bg-slate-100 text-slate-950"
              : "text-slate-500 hover:text-slate-950"
          }`}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </>
  );

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <button onClick={() => setActiveTab("overview")} className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white">
              <HeartHandshake className="size-4" />
            </span>
            <span className="hidden font-extrabold tracking-tight sm:inline">
              CrowdCare Admin
            </span>
          </button>
          <nav className="ml-6 hidden items-center gap-1 lg:flex">{tabButtons}</nav>
          <div className="ml-auto hidden items-center gap-3 sm:flex">
            <span className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">
              {user.name}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
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
        {open && <nav className="grid gap-1 border-t border-slate-100 bg-white p-3 lg:hidden">{tabButtons}</nav>}
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-slate-500">Platform administration</p>
          <h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] text-slate-950">{title}</h1>
          {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

export default AdminLayout;
