import { useState } from "react";
import Input from "./Input.jsx";

function EyeIcon({ hidden }) {
  return hidden ? (
    <svg
      aria-hidden="true"
      className="h-4 w-4 stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="m4 4 16 16M10.6 10.7a2 2 0 0 0 2.7 2.7M6.2 6.3C4.7 7.4 3.6 4.7 9 4.7c4.5 0 7.5 1.8 9 6-.4 1.2-.9 2.1-1.5 2.9" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      className="h-4 w-4 stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M3 12s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

// PasswordInput extends Input with an accessible show/hide password toggle.
function PasswordInput({ icon, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      icon={icon}
      trailing={
        <button
          type="button"
          className="grid place-items-center border-0 bg-transparent p-0 text-brand-icon"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <EyeIcon hidden={visible} />
        </button>
      }
    />
  );
}

export default PasswordInput;
