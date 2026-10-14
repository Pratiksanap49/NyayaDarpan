// Card renders a white rounded container with an optional className for padding and layout.
function Card({ className = "", children, ...props }) {
  return (
    <div
      {...props}
      className={`rounded-2xl border border-brand-border bg-white shadow-[0_16px_38px_rgb(18_55_98_/_10%)] ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
