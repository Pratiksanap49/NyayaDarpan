import { APP_NAME } from "../../constants/app.js";

// Footer renders the brand, security statement, and non-functional support links.
function Footer() {
  const preventNavigation = (event) => event.preventDefault();

  return (
    <footer className="flex shrink-0 flex-wrap items-end justify-between gap-4 border-t border-slate-100 bg-white px-6 py-4 text-[0.65rem] text-brand-footer md:px-8">
      <div className="grid gap-1">
        <strong className="text-brand-navy">{APP_NAME} © 2026</strong>
        <span>Judicial Case Intelligence &amp; Support Platform</span>
      </div>
      <span className="text-center">
        Secure • Transparent • Efficient • Supporting the Indian Judiciary
      </span>
      <div className="flex gap-4">
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
