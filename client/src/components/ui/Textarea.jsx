// Textarea matches Input styling while supporting multiline form values.
function Textarea({
  label,
  id,
  error,
  hint,
  className = "",
  ...props
}) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <label className="grid gap-2 text-xs font-bold text-brand-navy" htmlFor={id}>
      {label && <span>{label}</span>}
      <textarea
        {...props}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={`min-h-28 w-full rounded-md border bg-white px-3 py-3 text-sm font-normal text-brand-navy outline-none placeholder:text-brand-placeholder ${
          error
            ? "border-brand-error"
            : "border-brand-input focus:border-brand-blue focus:outline focus:outline-2 focus:outline-brand-blue/20"
        } ${className}`}
      />
      {error && (
        <span id={`${id}-error`} className="font-normal text-brand-error">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={`${id}-hint`} className="font-normal text-brand-muted">
          {hint}
        </span>
      )}
    </label>
  );
}

export default Textarea;
