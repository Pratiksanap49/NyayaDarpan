import Card from "../ui/Card.jsx";

// StatCard presents one dashboard metric with an optional supporting hint.
function StatCard({ label, value, hint, variant = "blue", className = "" }) {
  const variants = {
    blue: "border-[#d9eaff] bg-[#f3f9ff] text-[#087df0]",
    orange: "border-[#f4e5c9] bg-[#fffaf1] text-[#d88a00]",
    green: "border-[#d5eee4] bg-[#f2fbf7] text-[#078a70]",
  };

  return (
    <Card className={`rounded-lg shadow-[0_3px_12px_rgb(33_79_120_/_4%)] ${variants[variant] || variants.blue} p-3 ${className}`}>
      <p className="text-[0.62rem] font-bold uppercase tracking-wide text-brand-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-current">
        {value}
      </p>
      {hint ? <p className="mt-0.5 text-[0.55rem] text-brand-muted">{hint}</p> : null}
    </Card>
  );
}

export default StatCard;
