import Card from "../ui/Card.jsx";

// StatCard presents one dashboard metric with an optional supporting hint.
function StatCard({ label, value, hint }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-brand-muted">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold text-[var(--color-accent)]">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-brand-muted">{hint}</p> : null}
    </Card>
  );
}

export default StatCard;
