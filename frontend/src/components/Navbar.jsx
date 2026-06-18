import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartHandshake, LogOut, Menu, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

const links = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Events", href: "#events" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const getDashboardUrl = () => {
    if (user.role === "user") return "/user/dashboard";
    if (user.role === "committee") return "/committee/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return "/";
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all ${scrolled ? "border-slate-200 bg-white/95 shadow-sm" : "border-transparent bg-white/80"}`}
    >
      <nav
        className="mx-auto flex h-18 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex items-center gap-2.5"
          aria-label="CrowdCare home"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-brand-600 text-white shadow-lg shadow-blue-600/20">
            <HeartHandshake className="size-5" />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-950">
            Crowd<span className="text-brand-600">Care</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-brand-600"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <UserRound className="size-4 text-brand-600" />
                {user.name}
              </span>
              <Button onClick={() => navigate(getDashboardUrl())}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="size-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/register")}>Register</Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-slate-100 bg-white px-4 py-5 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => {
                      navigate(getDashboardUrl());
                      setOpen(false);
                    }}
                    className="col-span-2"
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="col-span-2"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                  >
                    <LogOut className="size-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate("/login");
                      setOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/register");
                      setOpen(false);
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
