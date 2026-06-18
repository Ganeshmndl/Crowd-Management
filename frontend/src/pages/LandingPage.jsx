import {
  ArrowRight,
  BellRing,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FileClock,
  LockKeyhole,
  Map,
  MapPin,
  Radio,
  Search,
  ShieldCheck,
  UserCheck,
  UserRoundCheck,
  Users,
  UsersRound,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SectionHeading from "@/components/SectionHeading";
import FeatureCard from "@/components/FeatureCard";
import EventCard from "@/components/EventCard";
import ProductPreview from "@/components/ProductPreview";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import portraitsImage from "@/assets/testimonial-portraits.jpg";

const events = [
  { name: "Chhath Festival", location: "Ganga Sagar, Janakpur", date: "Nov 05 - 08, 2026", crowd: "50K+", volunteers: "48", reports: "12", imagePosition: "0% center" },
  { name: "Janakpur Mela", location: "Janaki Mandir, Janakpur", date: "Nov 24, 2026", crowd: "35K+", volunteers: "32", reports: "8", imagePosition: "33.33% center" },
  { name: "Trade Fair", location: "Exhibition Ground", date: "Dec 12 - 18, 2026", crowd: "20K+", volunteers: "26", reports: "5", imagePosition: "66.66% center" },
  { name: "Cultural Festival", location: "Rangabhoomi Maidan", date: "Jan 15 - 17, 2027", crowd: "15K+", volunteers: "19", reports: "3", imagePosition: "100% center" },
];

const features = [
  { icon: Search, title: "Missing Person Reporting", description: "Create event-linked reports with identity details, photos, and last-seen information.", tone: "blue" },
  { icon: UserRoundCheck, title: "Found Person Reporting", description: "Connect a found individual with the correct event committee and matching reports.", tone: "emerald" },
  { icon: BellRing, title: "SOS Emergency Alerts", description: "Share urgent requests and location context with authorized on-ground responders.", tone: "rose" },
  { icon: ShieldCheck, title: "Committee Verification", description: "Protect report quality through review and approval by trusted event teams.", tone: "violet" },
  { icon: UsersRound, title: "Volunteer Coordination", description: "Assign tasks, receive field updates, and keep response teams working together.", tone: "amber" },
  { icon: Map, title: "Event-Based Tracking", description: "Keep cases, alerts, zones, and safety resources organized around each event.", tone: "cyan" },
];

const showcases = [
  { eyebrow: "Case management", title: "Every report, assignment, and update in one place", description: "Give committees a clear operating picture without losing critical details in calls and message groups.", bullets: ["Missing and found reports", "Status and priority tracking", "Assigned volunteer ownership"], type: "cases" },
  { eyebrow: "Live event map", title: "Understand what is happening across the venue", description: "Map safety points, active alerts, event zones, and available teams so coordinators can respond with context.", bullets: ["Live event zones", "Safety point visibility", "Volunteer and alert locations"], type: "map" },
  { eyebrow: "Emergency response", title: "Turn SOS requests into coordinated action", description: "Centralize incoming incidents, assign committee ownership, and keep a reliable response timeline.", bullets: ["Prioritized incident queue", "Committee coordination", "Response status history"], type: "emergency" },
  { eyebrow: "Mobile experience", title: "Critical actions stay simple on the move", description: "Attendees and volunteers can report, request help, and receive case updates from any modern phone.", bullets: ["Fast guided reporting", "One-tap SOS requests", "Real-time notifications"], type: "mobile" },
];

function TrustStrip() {
  const groups = ["Event Organizers", "Committees", "Volunteers", "Safety Teams"];
  return (
    <section className="border-y border-slate-200 bg-slate-50/70">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[.18em] text-slate-400">Trusted during community events</p>
        <div className="mt-7 grid grid-cols-2 gap-5 md:grid-cols-4">
          {groups.map((group, index) => {
            const Icon = [Users, ShieldCheck, UserCheck, Radio][index];
            return <div key={group} className="flex items-center justify-center gap-2.5 text-sm font-semibold text-slate-600"><Icon className="size-4 text-brand-600" />{group}</div>;
          })}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 border-t border-slate-200 pt-6">
          {["Verified Reports", "Committee Verification", "Secure Data Handling", "Real-Time Coordination"].map((item) => <span key={item} className="flex items-center gap-2 text-xs font-medium text-slate-500"><Check className="size-3.5 text-emerald-600" />{item}</span>)}
        </div>
      </div>
    </section>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-950">
      <Navbar />
      <main>
        <HeroSection />
        <TrustStrip />

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {[["48,000+", "Attendees Protected"], ["320+", "Cases Managed"], ["98%", "Successful Reunification Rate"], ["4 min", "Average Response Time"]].map(([value, label]) => (
              <div key={label} className="border-l-2 border-brand-600 pl-5">
                <strong className="block text-3xl font-extrabold tracking-[-.04em] text-slate-950 sm:text-4xl">{value}</strong>
                <span className="mt-2 block text-sm text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="scroll-mt-20 bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeading theme="dark" eyebrow="How CrowdCare works" title="From first report to safe reunification" description="One shared workflow keeps families informed and response teams aligned." />
            <div className="relative mt-16 grid gap-10 md:grid-cols-5 md:gap-4">
              <div className="absolute left-[8%] right-[8%] top-5 hidden h-px bg-gradient-to-r from-brand-600 via-blue-300 to-emerald-500 md:block" />
              {[
                [MapPin, "Select Event", "Connect with the right event team."],
                [ClipboardCheck, "Submit Report", "Share clear, useful case details."],
                [ShieldCheck, "Committee Verification", "Confirm and prioritize the report."],
                [UsersRound, "Volunteer Coordination", "Assign on-ground responders."],
                [CheckCircle2, "Safe Reunification", "Close the case with verification."],
              ].map(([Icon, title, text], index) => (
                <div key={title} className="relative">
                  <span className="relative z-10 grid size-10 place-items-center rounded-full border-4 border-slate-950 bg-brand-600 text-xs font-bold">{index + 1}</span>
                  <Icon className="mt-7 size-5 text-blue-300" />
                  <h3 className="mt-4 text-sm font-bold">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="events" className="scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading align="left" eyebrow="Active events" title="Choose the event where help is needed" description="Each event has its own verified committee, volunteer network, and live report channel." />
              <Button variant="outline" className="mb-12 shrink-0">View all events<ArrowRight className="size-4" /></Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{events.map((event) => <EventCard key={event.name} {...event} />)}</div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeading eyebrow="The platform" title="Built for the reality of event operations" description="A single operational layer for cases, maps, emergencies, and field communication." />
            <div className="mt-20 space-y-24">
              {showcases.map((item, index) => (
                <div key={item.title} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                  <div className={index % 2 ? "lg:order-2" : ""}>
                    <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-600">{item.eyebrow}</p>
                    <h3 className="mt-4 text-3xl font-bold tracking-[-.035em] text-slate-950">{item.title}</h3>
                    <p className="mt-5 leading-7 text-slate-600">{item.description}</p>
                    <ul className="mt-7 space-y-3">{item.bullets.map((bullet) => <li key={bullet} className="flex items-center gap-3 text-sm font-medium text-slate-700"><span className="grid size-5 place-items-center rounded-full bg-blue-100"><Check className="size-3 text-brand-700" /></span>{bullet}</li>)}</ul>
                  </div>
                  <div className={index % 2 ? "lg:order-1" : ""}><ProductPreview type={item.type} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeading eyebrow="Core capabilities" title="The essentials, without operational clutter" description="Purpose-built tools for reporting, verification, response, and coordination." />
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}</div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1200px] overflow-hidden rounded-3xl bg-brand-600 lg:grid-cols-[1fr_.85fr]">
            <div className="p-8 text-white sm:p-12 lg:p-16">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-blue-200">Volunteer network</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Powered by community volunteers</h2>
              <p className="mt-5 max-w-xl leading-7 text-blue-100">Give trusted volunteers clear assignments and a reliable channel back to event committees.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">{["Receive nearby alerts", "Help locate individuals", "Coordinate with committees", "Share verified updates"].map((item) => <p key={item} className="flex items-center gap-3 text-sm font-semibold"><span className="grid size-6 place-items-center rounded-full bg-white/15"><Check className="size-3.5" /></span>{item}</p>)}</div>
              <Button variant="white" className="mt-9">Join as a volunteer<ArrowRight className="size-4" /></Button>
            </div>
            <div className="relative min-h-80 bg-slate-950 p-8 sm:p-12">
              <div className="absolute inset-0 opacity-20 hero-grid" />
              <div className="relative space-y-3">
                <div className="ml-auto max-w-xs rounded-2xl bg-white p-4 shadow-xl"><p className="text-xs font-bold text-slate-900">New verified assignment</p><p className="mt-1 text-[11px] text-slate-500">Check Safety Point B for case CC-142.</p><div className="mt-4 flex items-center justify-between"><span className="text-[10px] font-bold text-brand-600">350m away</span><span className="rounded-lg bg-brand-600 px-3 py-1.5 text-[10px] font-bold text-white">Accept</span></div></div>
                <div className="max-w-xs rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur"><p className="text-xs font-bold">Field update received</p><p className="mt-1 text-[11px] text-slate-300">Volunteer Nisha has arrived at Zone B.</p></div>
                <div className="ml-auto max-w-xs rounded-2xl bg-emerald-500 p-4 text-white"><p className="flex items-center gap-2 text-xs font-bold"><CheckCircle2 className="size-4" />Person located safely</p><p className="mt-1 text-[11px] text-emerald-50">Committee verification in progress.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeading eyebrow="Community voices" title="Trusted by the people keeping events safe" />
            <div className="grid gap-5 lg:grid-cols-3">
              {[
                ["Nisha Jha", "Event Coordinator", "CrowdCare gave our committee one reliable view of every report and responder during the festival.", "0% center"],
                ["Amit Yadav", "Community Volunteer", "Assignments were clear, updates were immediate, and I always knew who to contact in the field.", "50% center"],
                ["Priya Shah", "Family Member", "The verified updates helped us stay calm. We knew the event team was actively handling our report.", "100% center"],
              ].map(([name, role, quote, position]) => (
                <blockquote key={name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 h-11 w-11 rounded-full bg-cover" style={{ backgroundImage: `url(${portraitsImage})`, backgroundPosition: position }} />
                  <p className="text-sm leading-7 text-slate-700">"{quote}"</p>
                  <footer className="mt-6 border-t border-slate-100 pt-4"><strong className="block text-sm text-slate-900">{name}</strong><span className="text-xs text-slate-500">{role}</span></footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-600">Security and trust</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-.035em] sm:text-4xl">Sensitive cases deserve serious safeguards</h2>
              <p className="mt-5 leading-7 text-slate-600">CrowdCare is designed around verified access, accountable actions, and event-specific information boundaries.</p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
              {[
                [LockKeyhole, "Role-Based Access", "Users see only the tools and cases appropriate to their role."],
                [ShieldCheck, "Committee Verification", "Authorized teams review reports before operational action."],
                [FileClock, "Audit Logs", "Important case actions remain traceable and accountable."],
                [Eye, "Privacy Controls", "Sensitive personal information is handled with intentional visibility."],
                [UserCheck, "Event Permissions", "Access stays scoped to assigned events and responsibilities."],
                [CheckCircle2, "Secure Handling", "Consistent workflows reduce unnecessary sharing and confusion."],
              ].map(([Icon, title, text]) => <div key={title} className="bg-white p-6"><Icon className="size-5 text-brand-600" /><h3 className="mt-4 text-sm font-bold">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></div>)}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1200px] rounded-3xl bg-slate-950 px-6 py-16 text-center text-white sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to improve event safety?</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">Join organizers, volunteers, and community leaders using CrowdCare to coordinate safer public events.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button size="lg">Register Your Event</Button><Button variant="outline" size="lg" className="border-slate-700 bg-transparent text-white hover:border-slate-500 hover:bg-slate-900 hover:text-white">Get Started</Button></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
