import { APP_NAME } from "../../constants/app.js";

// Footer renders the brand, security statement, and non-functional support links.
// It sits outside the scrollable main area so it is always pinned at the bottom.
function Footer() {
  const preventNavigation = (event) => event.preventDefault();

  return (
    <footer className="flex w-full shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-[#e0eaf5] bg-white px-6 py-3 text-xs text-brand-footer">
      <div className="flex flex-col gap-0.5">
        <strong className="text-sm font-bold text-brand-navy">
          {APP_NAME} &copy; {new Date().getFullYear()}
        </strong>
        <span>Judicial Case Intelligence &amp; Support Platform</span>
      </div>
      <span className="hidden text-center sm:block">
        Secure &bull; Transparent &bull; Efficient &bull; Supporting the Indian Judiciary
      </span>
      <div className="flex gap-4">
        {["Privacy", "Security", "Help"].map((label) => (
          <a
            key={label}
            href="#"
            onClick={preventNavigation}
            className="hover:text-brand-blue transition-colors"
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
