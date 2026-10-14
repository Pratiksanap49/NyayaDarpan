// Select accepts label, id, options, placeholder, error, and native select props.
function Select({
  label,
  id,
  options,
  placeholder,
  error,
  className = "",
  ...props
}) {
  const descriptionId = error ? `${id}-error` : undefined;

  return (
    <label className="grid gap-2 text-xs font-bold text-brand-navy" htmlFor={id}>
      {label && <span>{label}</span>}
      <select
        {...props}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={`min-h-[42px] w-full rounded-md border bg-white px-3 text-sm font-normal text-brand-gray outline-none ${
          error
            ? "border-brand-error"
            : "border-brand-input focus:border-brand-blue focus:outline-2 focus:outline-brand-blue/20"
        } ${className}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${id}-error`} className="font-normal text-brand-error">
          {error}
        </span>
      )}
    </label>
  );
}

export default Select;
