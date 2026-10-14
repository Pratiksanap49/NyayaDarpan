// Input accepts label, id, error, hint, an optional leading icon, and native input props.
function Input({
  label,
  id,
  error,
  hint,
  icon,
  trailing,
  className = "",
  ...props
}) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <label className="grid gap-2 text-xs font-bold text-brand-navy" htmlFor={id}>
      {label && <span>{label}</span>}
      <span
        className={`flex min-h-[42px] items-center rounded-md border bg-white px-3 ${
          error
            ? "border-brand-error"
            : "border-brand-input focus-within:border-brand-blue focus-within:outline focus-within:outline-2 focus-within:outline-brand-blue/20"
        }`}
      >
        {icon}
        <input
          {...props}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          className={`min-w-0 flex-1 border-0 bg-transparent text-brand-navy outline-none placeholder:text-brand-placeholder ${className}`}
        />
        {trailing}
      </span>
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

export default Input;
