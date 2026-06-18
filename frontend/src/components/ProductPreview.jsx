import {
  AlertTriangle,
  Bell,
  Check,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

function CasePreview() {
  return (
    <div className="product-window">
      <div className="product-toolbar"><span /><span /><span /><small>Case Management</small></div>
      <div className="p-5">
        <div className="flex items-center justify-between"><div><p className="product-kicker">Operations</p><h4 className="product-title">Active cases</h4></div><span className="product-chip">12 open</span></div>
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
          {[
            ["CC-142", "Missing", "Rohan Kumar", "Volunteer assigned", "amber"],
            ["CC-139", "Found", "Unidentified child", "Verifying", "blue"],
            ["CC-136", "Missing", "Maya Singh", "Family contacted", "emerald"],
          ].map(([id, type, name, status, tone]) => (
            <div key={id} className="grid grid-cols-[.55fr_.8fr_1.3fr] items-center gap-3 border-b border-slate-100 p-3 last:border-0 sm:grid-cols-[.5fr_.65fr_1fr_1fr]">
              <span className="text-[10px] font-bold text-slate-400">{id}</span><span className={`status-${tone}`}>{type}</span><strong className="text-[11px] text-slate-700">{name}</strong><span className="hidden text-[10px] text-slate-500 sm:block">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MapPreview() {
  return (
    <div className="product-window">
      <div className="product-toolbar"><span /><span /><span /><small>Live Event Map</small></div>
      <div className="relative h-[330px] overflow-hidden bg-[#edf2f6]">
        <div className="product-map-grid absolute inset-0" /><div className="map-line map-line-one" /><div className="map-line map-line-two" />
        <span className="map-marker left-[24%] top-[25%] bg-brand-600"><Users /></span>
        <span className="map-marker right-[18%] top-[34%] bg-rose-500"><AlertTriangle /></span>
        <span className="map-marker bottom-[22%] left-[47%] bg-emerald-500"><ShieldCheck /></span>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur">
          <div><p className="text-[10px] font-bold text-slate-800">Zone B alert</p><p className="text-[9px] text-slate-500">2 volunteers responding</p></div><span className="product-chip">View route</span>
        </div>
      </div>
    </div>
  );
}

function EmergencyPreview() {
  return (
    <div className="product-window">
      <div className="product-toolbar"><span /><span /><span /><small>Emergency Response</small></div>
      <div className="grid gap-3 p-5 sm:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-xl bg-slate-950 p-4 text-white"><Bell className="size-5 text-rose-400" /><strong className="mt-8 block text-3xl">03</strong><span className="text-[10px] text-slate-400">Active SOS alerts</span></div>
        <div className="space-y-2">
          {["Medical assistance requested", "Separated child reported", "Crowd density warning"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><span className={`grid size-7 place-items-center rounded-lg ${index === 0 ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"}`}><AlertTriangle className="size-3.5" /></span><div><p className="text-[10px] font-bold text-slate-700">{item}</p><p className="text-[9px] text-slate-400">Zone {String.fromCharCode(65 + index)} · just now</p></div></div>)}
        </div>
      </div>
    </div>
  );
}

function MobilePreview() {
  return (
    <div className="mx-auto w-[230px] rounded-[2.2rem] border-[7px] border-slate-900 bg-white p-3 shadow-2xl">
      <div className="mx-auto mb-4 h-4 w-20 rounded-full bg-slate-900" />
      <p className="text-[9px] font-bold text-brand-600">CROWDCARE</p><h4 className="mt-1 text-base font-bold text-slate-900">How can we help?</h4>
      <div className="mt-4 rounded-xl bg-brand-600 p-4 text-white"><Search className="size-5" /><p className="mt-5 text-xs font-bold">Report missing person</p><p className="mt-1 text-[9px] text-blue-100">Start a verified event report</p></div>
      <div className="mt-2 grid grid-cols-2 gap-2"><div className="rounded-xl bg-slate-50 p-3"><AlertTriangle className="size-4 text-rose-500" /><p className="mt-3 text-[9px] font-bold">Send SOS</p></div><div className="rounded-xl bg-slate-50 p-3"><UserCheck className="size-4 text-emerald-500" /><p className="mt-3 text-[9px] font-bold">Found person</p></div></div>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-100 p-2"><span className="grid size-6 place-items-center rounded-full bg-emerald-50"><Check className="size-3 text-emerald-600" /></span><div><p className="text-[8px] font-bold">Case update</p><p className="text-[7px] text-slate-400">Volunteer assigned</p></div></div>
    </div>
  );
}

const previews = { cases: CasePreview, map: MapPreview, emergency: EmergencyPreview, mobile: MobilePreview };

function ProductPreview({ type }) {
  const Preview = previews[type];
  return <Preview />;
}

export default ProductPreview;
