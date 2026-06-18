function FeatureCard({ icon: Icon, title, description, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    cyan: "bg-cyan-50 text-cyan-600",
  };

  return (
    <article className="group border-t border-slate-200 pt-6 transition duration-300 hover:border-brand-500">
        <span className={`mb-5 grid size-10 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="size-5" />
        </span>
        <h3 className="text-lg font-bold text-slate-950">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

export default FeatureCard;
