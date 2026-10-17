import Card from "../ui/Card.jsx";

// StatCard presents one dashboard metric with an optional supporting hint.
function StatCard({
  label,
  value,
  hint,
  variant = "blue",
  dashboard = false,
  icon,
  className = "",
}) {
  const variants = {
    blue: "border-[#d9eaff] bg-[#f3f9ff] text-[#087df0]",
    orange: "border-[#f4e5c9] bg-[#fffaf1] text-[#d88a00]",
    green: "border-[#d5eee4] bg-[#f2fbf7] text-[#078a70]",
    red: "border-[#f4d9dc] bg-[#fff7f7] text-[#e43e50]",
  };

  return (
    <Card
      className={`rounded-lg shadow-[0_3px_12px_rgb(33_79_120_/_4%)] ${
        variants[variant] || variants.blue
      } ${dashboard ? "flex min-h-28 items-start gap-4 p-5" : "p-3"} ${className}`}
    >
      {dashboard && icon ? (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/70 text-lg text-current">
          {icon}
        </span>
      ) : null}
      <div>
        <p
          className={
            dashboard
              ? "text-sm font-bold text-brand-navy"
              : "text-xs font-bold uppercase tracking-wide text-brand-muted"
          }
        >
          {label}
        </p>
        <p className="mt-1 text-3xl font-bold text-brand-navy">{value}</p>
        {hint ? (
          <p className="mt-1 text-xs text-brand-muted">{hint}</p>
        ) : null}
      </div>
    </Card>
  );
}

export default StatCard;
