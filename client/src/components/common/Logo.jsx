import { APP_NAME_PARTS } from "../../constants/app.js";

// Logo accepts a size ("sm" | "md" | "lg") and an optional subtitle.
function Logo({ size = "md", subtitle = false }) {
  const sizes = {
    sm: {
      icon: "h-9 w-9",
      name: "text-xl",
      subtitle: "text-xs",
    },
    md: {
      icon: "h-11 w-11",
      name: "text-2xl",
      subtitle: "text-[0.62rem]",
    },
    lg: {
      icon: "h-[76px] w-[76px]",
      name: "text-[clamp(3rem,4.2vw,4.1rem)]",
      subtitle: "text-[1.1rem]",
    },
  };
  const selectedSize = sizes[size] || sizes.md;

  return (
    <div
      className={`${
        size === "sm"
          ? "flex items-center gap-2 text-left"
          : "flex flex-col items-center text-center"
      } ${
        size === "lg" ? "-mt-8 max-[520px]:-mt-4" : ""
      }`}
    >
      <svg
        aria-hidden="true"
        className={`${selectedSize.icon} ${
          size === "sm" ? "mb-0" : "mb-3"
        } shrink-0 stroke-brand-navy [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2.5]`}
        viewBox="0 0 72 72"
        fill="none"
      >
        <path d="M36 10v48M24 58h24M17 23h38M36 10v-3" />
        <path d="m17 23-10 18h20L17 23ZM55 23 45 41h20L55 23Z" />
        <path d="M10 41c3 3 11 3 14 0M48 41c3 3 11 3 14 0" />
      </svg>
      <div>
        <div
          className={`${selectedSize.name} m-0 font-extrabold leading-none tracking-[-0.08em]`}
        >
          <span>{APP_NAME_PARTS[0]}</span>
          <strong className="font-extrabold text-brand-blue">
            {APP_NAME_PARTS[1]}
          </strong>
        </div>
        {subtitle && size === "sm" ? (
          <p className={`${selectedSize.subtitle} mt-0.5 font-semibold leading-none text-brand-muted`}>
            AI-Powered Judicial Case Intelligence Platform
          </p>
        ) : null}
      </div>
      {subtitle && (
        <>
          {size !== "sm" ? (
            <p
              className={`${selectedSize.subtitle} my-5 font-semibold leading-[1.42] text-brand-navy`}
            >
              AI-Powered Judicial
              <br />
              Case Intelligence Platform
            </p>
          ) : null}
          {size === "lg" && (
            <span className="h-1.5 w-[152px] rounded-full bg-brand-blue shadow-[0_2px_8px_rgb(37_139_212_/_20%)]" />
          )}
        </>
      )}
    </div>
  );
}

export default Logo;
