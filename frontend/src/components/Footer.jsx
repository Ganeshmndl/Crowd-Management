import { Facebook, HeartHandshake, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_.8fr_1fr_.8fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2.5 text-white">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-600">
              <HeartHandshake className="size-5" />
            </span>
            <span className="text-xl font-extrabold">CrowdCare</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Building safer, more connected communities through reliable event
            safety and missing person assistance.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-white">Quick Links</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#events" className="hover:text-white">Active Events</a>
            <a href="#about" className="hover:text-white">How It Works</a>
            <a href="#home" className="hover:text-white">Report a Person</a>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white">Contact</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p className="flex gap-3"><Mail className="size-4 shrink-0 text-brand-500" />help@crowdcare.org</p>
            <p className="flex gap-3"><Phone className="size-4 shrink-0 text-brand-500" />+977 980-000-0000</p>
            <p className="flex gap-3"><MapPin className="size-4 shrink-0 text-brand-500" />Janakpur, Nepal</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white">Follow Us</h3>
          <div className="mt-4 flex gap-3">
            {[Facebook, Instagram, Linkedin].map((Icon, index) => (
              <a key={index} href="#" aria-label="Social media" className="grid size-10 place-items-center rounded-lg bg-slate-900 transition hover:bg-brand-600 hover:text-white">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; 2026 CrowdCare. All rights reserved.</p>
          <p>Privacy Policy &nbsp; Terms of Service &nbsp; Accessibility</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
