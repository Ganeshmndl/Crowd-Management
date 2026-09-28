import { Link } from "react-router-dom";
import {
  CheckCircle2,
  HeartHandshake,
  LockKeyhole,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const trustItems = [
  [
    ShieldCheck,
    "Verified coordination",
    "Reports are reviewed by trusted event committees.",
  ],
  [
    UsersRound,
    "Community response",
    "Families and volunteers stay connected in real time.",
  ],
  [
    LockKeyhole,
    "Privacy by design",
    "Sensitive case details stay within authorized workflows.",
  ],
];

function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col">
          <div className="hero-grid absolute inset-0 opacity-50" />
          <div className="absolute -left-28 top-1/3 size-96 rounded-full bg-brand-600/20 blur-3xl" />
          <Link
            to="/"
            className="relative flex items-center gap-2.5"
            aria-label="Yatra Saarthi home"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-brand-600">
              <HeartHandshake className="size-5" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Yatra Saarthi
            </span>
          </Link>

          <div className="relative my-auto max-w-lg">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
              Community safety network
            </p>
            <h2 className="mt-5 text-4xl font-bold leading-tight tracking-[-0.04em]">
              One trusted account for safer public events.
            </h2>
            <p className="mt-5 leading-7 text-slate-400">
              Report concerns, receive verified updates, and coordinate with
              event safety teams through Yatra Saarthi.
            </p>
            <div className="mt-10 space-y-6">
              {trustItems.map(([Icon, itemTitle, itemDescription]) => (
                <div key={itemTitle} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-blue-300">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold">{itemTitle}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {itemDescription}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="relative flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="size-4 text-emerald-500" />
            Built for families, volunteers, and event teams
          </p>
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="flex h-20 items-center justify-between px-5 sm:px-8">
            <Link to="/" className="flex items-center gap-2.5 lg:hidden">
              <span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-white">
                <HeartHandshake className="size-4" />
              </span>
              <span className="font-extrabold tracking-tight">
                Yatra Saarthi
              </span>
            </Link>
            <Link
              to="/"
              className="ml-auto text-sm font-semibold text-slate-500 transition hover:text-brand-600"
            >
              Back to home
            </Link>
          </header>

          <div className="flex flex-1 items-center justify-center px-5 pb-16 pt-6 sm:px-8">
            <div className="w-full max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                {eyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 leading-7 text-slate-600">{description}</p>
              <div className="mt-8">{children}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;
