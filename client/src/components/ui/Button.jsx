// Button accepts variant, size, fullWidth, loading, icons, and native button props.
function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  loadingText = "Loading...",
  leftIcon,
  rightIcon,
  type = "button",
  disabled,
  className = "",
  children,
  ...props
}) {
  const variants = {
    primary: "bg-brand-blue text-white hover:bg-brand-blue-dark",
    outline: "border border-brand-blue bg-transparent text-brand-blue hover:bg-brand-sky",
    danger: "bg-brand-error text-white hover:bg-red-800",
  };
  const sizes = {
    md: "min-h-10 px-4 text-sm",
    lg: "min-h-11 px-5 text-base",
  };

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-3 rounded-md font-bold transition disabled:cursor-not-allowed disabled:opacity-70 ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
          {loadingText}
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}

export default Button;
