interface StatCardProps {
  label: string;
  value: string | number;
  helper?: string;
  accent?: "primary" | "secondary" | "accent";
}

function StatCard({ label, value, helper, accent = "primary" }: StatCardProps) {
  const accentClasses: Record<typeof accent, string> = {
    primary: "from-primary/10 to-primary/5 border-primary/40",
    secondary: "from-secondary/10 to-secondary/5 border-secondary/40",
    accent: "from-accent/10 to-accent/5 border-accent/40",
  } as const;

  return (
    <div
      className={`flex flex-col gap-1 rounded-2xl border bg-gradient-to-br p-5 shadow-glow ${accentClasses[accent]}`}
    >
      <span className="text-xs font-medium uppercase tracking-widest text-white/70">
        {label}
      </span>
      <strong className="text-2xl font-semibold text-white">{value}</strong>
      {helper ? <span className="text-xs text-white/60">{helper}</span> : null}
    </div>
  );
}

export default StatCard;
