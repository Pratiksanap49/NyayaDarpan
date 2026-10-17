import { APP_NAME } from "../../constants/app.js";

// Footer renders the brand, security statement, and non-functional support links.
function Footer() {
  const preventNavigation = (event) => event.preventDefault();

  return (
    <footer className="flex h-8 shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#e0eaf5] bg-white px-5 text-[0.45rem] text-brand-footer">
      <div className="grid gap-1">
        <strong className="text-[0.48rem] text-brand-navy">{APP_NAME} © 2026</strong>
        <span>Judicial Case Intelligence &amp; Support Platform</span>
      </div>
      <span className="hidden text-center sm:block">
        Secure • Transparent • Efficient • Supporting the Indian Judiciary
      </span>
      <div className="flex gap-3">
        {["Privacy", "Security", "Help"].map((label) => (
          <a
            key={label}
            href="#"
            onClick={preventNavigation}
            className="hover:text-accent"
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
