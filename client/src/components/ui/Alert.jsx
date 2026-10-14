// Alert accepts an error, info, or success variant and renders its children.
function Alert({ variant = "info", children }) {
  const styles = {
    error: "border-brand-error-border bg-brand-error-bg text-brand-error",
    info: "border-blue-200 bg-blue-50 text-brand-info",
    success: "border-green-200 bg-green-50 text-brand-success",
  };

  return (
    <div
      className={`rounded-md border px-3 py-3 text-xs ${styles[variant]}`}
      role={variant === "error" ? "alert" : undefined}
    >
      {children}
    </div>
  );
}

export default Alert;
